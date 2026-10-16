// Serena, the Clinova assistant on the admin reports page. She reads the site's visitor analytics and answers
// with Google Gemini (REST API, function calling: https://ai.google.dev/api/generate-content).
// A regular function rather than an edge function: building reports needs more CPU than edge functions allow.
import { analyticsReady } from "../lib/analytics.mjs";
import { isAdmin, sameOrigin } from "../lib/admin.mjs";
import { loadReport } from "../lib/report-data.mjs";

export const config = { path: "/api/serena" };

const gemini = "https://generativelanguage.googleapis.com/v1beta";
const maxTurns = 4;
// Netlify stops a function after 30 s; stop earlier with a clear message.
const budgetMs = 27_000;
const filterKeys = ["country", "device", "lang", "source", "channel", "path"];

const systemPrompt = (today) => `You are Serena (سيرينا), the analytics assistant built into the admin panel of Clinova (clinova.novanoai.online).
Clinova is a growth partner for medical clinics (dentistry, dermatology and aesthetics, plastic surgery, hair transplant): patient acquisition, a clinic CRM, 24/7 WhatsApp response by AI plus a human team, booking, treatment coordination, reactivating past patients and reputation. The site is in Arabic, English, Turkish and French and serves clinics in Turkey and the Arab world. Its goal is to turn visitors into leads: the company profile download form (email or phone) and the survey popup that offers 7 free trial days.

Your job: study the site's data and tell the team what is happening and what to do next to grow the project. Typical questions: where visitors stop, what they click, which countries and sources bring visitors and leads, whether the survey works, and what changed after a date (for example after publishing a blog article or editing the site).

Data: call get_report for any date range and filters. Each report has the period and the previous period of the same length, so compare them. Fields:
- summary/previous: visitors (unique per day), pageViews, avgSeconds (visible time on site per visitor), avgScroll (deepest scroll %), engagedRate (% who stayed 10s+ or clicked), leads, surveyLeads, profileLeads, conversionRate (% of visitors who left contact details).
- daily: visitors, pageViews and leads per day (Istanbul time).
- sections: home page sections by id (home=hero, about, reach, services, contact-system=patient journey, specialties, case-studies, reviews, client-videos, partners, faq, contact-cta) with visitors who saw them for 1s+, reach %, avgSeconds, and exits (visitors whose last seen section it was, i.e. where they stopped).
- clicks: what was clicked (whatsapp, phone_call, nav:<section>, link:<path>, out:<host>, file:<pdf>, button:<label>) and in which section.
- sources and channels (search, ai, social, direct, referral, campaign, email), countries, cities, devices, browsers, os, languages, campaigns (UTM), hours (Istanbul hour of day), scroll (share reaching 25/50/75/100%).
- survey: shown, steps reached, dismissed, completed, answer counts and free-text wishes.
- articles: blog articles with their publish date and views in the period. changes: the admin change log (texts, videos, logos) with dates.
- leadSummary (no contact details) and journeys (the last visitors: source, country, device, pages, sections seen in order, clicks, exit section, whether they became a lead).

Rules:
- Use only numbers from the reports. Never invent or estimate data you do not have. If something is not measured (age, gender, names, revenue, bookings), say so plainly.
- Always give concrete suggestions right away, even when there is little or no data yet. Never answer only "there is not enough data". With little data, say so in one short line, then give the most valuable actions anyway: the best practices for a clinic-marketing site like this one (calls to action, WhatsApp button, survey offer, blog topics, SEO, ads, trust signals), tied to whatever numbers exist. Mark which points come from the data and which are general advice.
- A change after a date is a correlation, not proof. When asked about an event (an article, an edit), compare equal periods before and after it, check whether traffic sources changed, and name other explanations.
- Give practical recommendations a small team can act on this week, most valuable first, each tied to the number that supports it, and say how to measure the result.
- Answer in the language of the user's message (usually Arabic). Be brief: at most about 200 words unless the admin asks for detail, short headings, bullets and the key numbers. No tables.
- Today is ${today}. Dates are YYYY-MM-DD in Istanbul time; a single report covers at most 400 days.`;

const tools = [{
    name: "get_report",
    description: "Returns the Clinova site analytics for a date range (inclusive days, Istanbul time) with optional filters, plus the previous period of the same length for comparison. Call it several times to compare periods (for example before and after an article was published) or segments (for example one country or one traffic source).",
    parameters: {
        type: "object",
        properties: {
            from: { type: "string", description: "First day, YYYY-MM-DD" },
            to: { type: "string", description: "Last day, YYYY-MM-DD" },
            country: { type: "string", description: "ISO country code, for example TR or SA" },
            device: { type: "string", enum: ["mobile", "tablet", "desktop"] },
            lang: { type: "string", enum: ["ar", "en", "tr", "fr"] },
            source: { type: "string", description: "Traffic source as named in reports, for example Google, ChatGPT, Instagram, Direct" },
            channel: { type: "string", enum: ["search", "ai", "social", "direct", "referral", "campaign", "email"] },
            path: { type: "string", description: "Only visitors who opened a page starting with this path, for example /ar/blog/dental-clinic-marketing" },
        },
        required: ["from", "to"],
    },
}];

class GeminiError extends Error {
    constructor(message, status) { super(message); this.status = status; }
}

async function call(path, apiKey, init = {}, timeout = 20_000) {
    const response = await fetch(`${gemini}/${path}`, {
        ...init,
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        signal: AbortSignal.timeout(timeout),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new GeminiError(data?.error?.message ?? `gemini_${response.status}`, response.status);
    return data;
}

// The models to try, in order: GEMINI_MODEL if set, then the newest stable Flash, the newest Flash-Lite and
// the previous generation of each. When one is busy (Google answers "high demand") or slow, the next one answers.
let cachedModels = null;
// A model that was busy or slow is skipped for 10 minutes.
const skipUntil = new Map();
async function chooseModels(apiKey) {
    if (cachedModels) return cachedModels;
    const data = await call("models?pageSize=200", apiKey, {}, 8_000);
    const names = (data.models ?? [])
        .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
        .map((model) => model.name.replace(/^models\//, ""))
        .filter((name) => /^gemini-[\d.]+-flash/.test(name) && !/image|tts|audio|live|exp|preview|thinking/.test(name));
    const version = (name) => Number(name.match(/^gemini-([\d.]+)/)?.[1] ?? 0);
    const byVersion = (list) => [...list].sort((a, b) => version(b) - version(a) || a.length - b.length);
    const full = byVersion(names.filter((name) => !name.includes("lite")));
    const lite = byVersion(names.filter((name) => name.includes("lite")));
    const chain = [process.env.GEMINI_MODEL, full[0], lite[0], full.find((name) => version(name) < version(full[0] ?? "")), lite.find((name) => version(name) < version(lite[0] ?? ""))];
    cachedModels = [...new Set(chain.filter(Boolean))].slice(0, 4);
    if (!cachedModels.length) throw new GeminiError("No Gemini Flash model is available for this key.", 404);
    return cachedModels;
}
const transient = (error) => error?.name === "TimeoutError" || error?.name === "AbortError" || (error instanceof GeminiError && [429, 500, 502, 503, 504].includes(error.status));

// Short, fast answers: the lowest thinking level each model accepts. Models differ ("minimal" is not
// accepted everywhere), so a level a model rejects is remembered and the next one is tried.
const thinkingLevels = ["minimal", "low", null];
const rejectedLevels = new Map();
function thinkingFor(model) {
    const version = Number(model.match(/^gemini-([\d.]+)/)?.[1] ?? 0);
    if (version >= 3) {
        const level = thinkingLevels[rejectedLevels.get(model) ?? 0];
        return level ? { thinkingConfig: { thinkingLevel: level } } : {};
    }
    if (version >= 2.5 && !rejectedLevels.has(model)) return { thinkingConfig: { thinkingBudget: 0 } };
    return {};
}
/** True when Gemini refused the thinking setting; the next call then uses the next level (or none). */
function rejectThinking(model, error) {
    if (!(error instanceof GeminiError) || error.status !== 400 || !/thinking/i.test(error.message)) return false;
    const next = (rejectedLevels.get(model) ?? 0) + 1;
    if (next >= thinkingLevels.length) return false;
    rejectedLevels.set(model, next);
    return true;
}

const day = /^\d{4}-\d{2}-\d{2}$/;
function validInput(input) {
    if (!input || typeof input !== "object" || typeof input.from !== "string" || typeof input.to !== "string" || !day.test(input.from) || !day.test(input.to)) return false;
    return filterKeys.every((key) => input[key] === undefined || (typeof input[key] === "string" && input[key].length <= 80));
}

async function report(input, origin) {
    const params = new URLSearchParams({ from: input.from, to: input.to, compact: "1" });
    for (const key of filterKeys) if (input[key]) params.set(key, input[key]);
    return (await loadReport(params, origin)) ?? { error: "invalid_range" };
}

function validMessages(value) {
    if (!Array.isArray(value) || !value.length || value.length > 30) return false;
    return value.every((message, index) => message && message.role === (index % 2 === 0 ? "user" : "assistant")
        && typeof message.content === "string" && message.content.trim() && message.content.length <= 8000) && value.at(-1).role === "user";
}

// The browser reads one JSON object per line: { type: "text" | "status" | "error" | "done", ... }.
const lines = (chunks, status = 200) => new Response(chunks.map((chunk) => JSON.stringify(chunk)).join("\n") + "\n", {
    status, headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
});
const failure = (status, error) => Response.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store" } });

export default async function handler(request) {
    if (request.method !== "POST") return failure(405, "method_not_allowed");
    if (!sameOrigin(request)) return failure(403, "invalid_origin");
    if (!isAdmin(request)) return failure(401, "signed_out");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return failure(503, "serena_not_configured");
    if (!analyticsReady()) return failure(503, "analytics_not_configured");
    let body;
    try { body = await request.json(); } catch { return failure(400, "invalid_request"); }
    if (!validMessages(body?.messages)) return failure(400, "invalid_request");

    const started = Date.now();
    const origin = new URL(request.url).origin;
    const out = [];
    // Which step was running, for the error detail shown to the admin.
    let step = "start";
    let modelName = "";
    try {
        // The model choice and the report on screen are fetched together.
        const view = validInput(body.view) ? body.view : null;
        step = "model list + report";
        const [models, viewReport] = await Promise.all([chooseModels(apiKey), view ? report(view, origin) : null]);
        let model = null;
        const contents = body.messages.map((message) => ({ role: message.role === "user" ? "user" : "model", parts: [{ text: message.content }] }));
        // The report the admin is looking at goes first, so most questions need no extra call.
        if (view) contents[0] = { role: "user", parts: [
            { text: `<current_view filters='${JSON.stringify(view)}'>\n${JSON.stringify(viewReport)}\n</current_view>\nThis is the report on the admin's screen right now.` },
            { text: body.messages[0].content },
        ] };
        const system = systemPrompt(new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10));
        for (let turn = 0; ; turn++) {
            const remaining = budgetMs - (Date.now() - started);
            if (remaining < 3_000 || turn === maxTurns) { out.push({ type: "error", error: "too_many_steps" }); break; }
            step = `answer ${turn + 1}`;
            const send = (name, timeout) => call(`models/${encodeURIComponent(name)}:generateContent`, apiKey, {
                method: "POST",
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: system }] },
                    contents,
                    tools: [{ functionDeclarations: tools }],
                    generationConfig: { maxOutputTokens: 1800, ...thinkingFor(name) },
                }),
            }, Math.round(timeout));
            const request = async (name, timeout) => {
                const start = Date.now();
                for (;;) {
                    try {
                        return await send(name, Math.max(1_000, timeout - (Date.now() - start)));
                    } catch (error) {
                        if (!rejectThinking(name, error)) throw error;
                    }
                }
            };
            let data;
            // The model that answered before goes first (its thought signatures are in the conversation).
            const available = models.filter((name) => (skipUntil.get(name) ?? 0) < Date.now());
            const order = [...new Set([model, ...(available.length ? available : models)].filter(Boolean))];
            for (let index = 0; index < order.length; index++) {
                const name = order[index];
                const left = budgetMs - (Date.now() - started) - 300;
                const last = index === order.length - 1;
                if (left < 2_000) throw Object.assign(new Error("No time left for another model."), { name: "TimeoutError" });
                modelName = name;
                try {
                    // Every model but the last gets about half the remaining time, so another one can still answer.
                    data = await request(name, last ? left : Math.min(left / 2, 14_000));
                    model = name;
                    break;
                } catch (error) {
                    if (last || !transient(error)) throw error;
                    skipUntil.set(name, Date.now() + 10 * 60_000);
                    step = `answer ${turn + 1} after ${name}: ${String(error?.message ?? "").slice(0, 60)}`;
                }
            }
            const candidate = data.candidates?.[0];
            const parts = candidate?.content?.parts ?? [];
            if (!candidate || data.promptFeedback?.blockReason || ["SAFETY", "PROHIBITED_CONTENT"].includes(candidate.finishReason)) { out.push({ type: "error", error: "refusal" }); break; }
            const text = parts.filter((part) => part.text && !part.thought).map((part) => part.text).join("");
            if (text) out.push({ type: "text", text });
            const calls = parts.filter((part) => part.functionCall);
            if (!calls.length) {
                if (candidate.finishReason === "MAX_TOKENS") out.push({ type: "error", error: "too_long" });
                break;
            }
            // The model's turn goes back unchanged: its parts carry thought signatures.
            contents.push({ role: "model", parts });
            const responses = [];
            for (const part of calls) {
                const { name, args = {} } = part.functionCall;
                if (name !== "get_report" || !validInput(args)) {
                    responses.push({ functionResponse: { name, response: { error: "Invalid input: from and to must be YYYY-MM-DD; filters are short strings." } } });
                    continue;
                }
                out.push({ type: "status", input: args });
                step = "report";
                responses.push({ functionResponse: { name, response: { result: await report(args, origin) } } });
            }
            contents.push({ role: "user", parts: responses });
        }
        out.push({ type: "done" });
    } catch (error) {
        const status = error instanceof GeminiError ? error.status : 0;
        const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
        // Google's own message (it never contains the key) tells the admin what went wrong.
        out.push({ type: "error", error: status === 429 ? "rate_limited" : [400, 401, 403].includes(status) ? "bad_key" : timedOut ? "timeout" : "failed", detail: `${String(error?.message ?? "").slice(0, 240)} [${step}, ${((Date.now() - started) / 1000).toFixed(1)} s${modelName ? `, ${modelName}` : ""}]` });
    }
    return lines(out);
}
