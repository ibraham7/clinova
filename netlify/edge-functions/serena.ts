// Serena, the Clinova assistant in the admin reports page. She reads the site's visitor analytics
// (through the admin-reports function, as the signed-in admin) and answers in a stream.
// An edge function because answers can take longer than a regular function is allowed to run.
import Anthropic from "@anthropic-ai/sdk";

declare const Netlify: { env: { get(name: string): string | undefined } };

export const config = { path: "/api/serena" };

const model = "claude-opus-5-5";
const maxTurns = 6;
const filterKeys = ["country", "device", "lang", "source", "channel", "path"] as const;

const systemPrompt = (today: string) => `You are Serena (سيرينا), the analytics assistant built into the admin panel of Clinova (clinova.novanoai.online).
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
- Small numbers are noise: with fewer than about 30 visitors or 5 leads in a group, say the result is not reliable yet.
- A change after a date is a correlation, not proof. When asked about an event (an article, an edit), compare equal periods before and after it, check whether traffic sources changed, and name other explanations.
- Give practical recommendations a small team can act on this week, most valuable first, each tied to the number that supports it, and say how to measure the result.
- Answer in the language of the user's message (usually Arabic). Be concise: short headings, bullets and the key numbers. No tables wider than 4 columns.
- Today is ${today}. Dates are YYYY-MM-DD in Istanbul time; a single report covers at most 400 days.`;

const tools: Anthropic.Beta.BetaTool[] = [{
    name: "get_report",
    description: "Returns the Clinova site analytics for a date range (inclusive days, Istanbul time) with optional filters, plus the previous period of the same length for comparison. Call it several times to compare periods (for example before and after an article was published) or segments (for example one country or one traffic source).",
    eager_input_streaming: true,
    input_schema: {
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

// ---- Session check (same signed cookie as netlify/lib/admin.mjs) -----------------------------

async function isAdmin(request: Request) {
    const password = Netlify.env.get("ADMIN_PASSWORD");
    if (!password || password.length < 10) return false;
    const token = (request.headers.get("cookie") ?? "").split(/;\s*/).find((part) => part.startsWith("clinova_admin="))?.slice("clinova_admin=".length);
    const [expires, signature] = (token ?? "").split(".");
    if (!expires || !signature || Number(expires) < Date.now()) return false;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(`${password}:${Netlify.env.get("ADMIN_SESSION_SECRET") ?? ""}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`clinova-admin:${expires}`)));
    const expected = Array.from(mac, (byte) => byte.toString(16).padStart(2, "0")).join("");
    if (expected.length !== signature.length) return false;
    let difference = 0;
    for (let index = 0; index < expected.length; index++) difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
    return difference === 0;
}

const day = /^\d{4}-\d{2}-\d{2}$/;
type ReportInput = { from: string; to: string } & Partial<Record<(typeof filterKeys)[number], string>>;
function validInput(input: unknown): input is ReportInput {
    if (!input || typeof input !== "object") return false;
    const value = input as Record<string, unknown>;
    if (typeof value.from !== "string" || typeof value.to !== "string" || !day.test(value.from) || !day.test(value.to)) return false;
    return filterKeys.every((key) => value[key] === undefined || (typeof value[key] === "string" && (value[key] as string).length <= 80));
}

async function getReport(request: Request, input: ReportInput) {
    const params = new URLSearchParams({ from: input.from, to: input.to, compact: "1" });
    for (const key of filterKeys) if (input[key]) params.set(key, input[key]!);
    const response = await fetch(`${new URL(request.url).origin}/.netlify/functions/admin-reports?${params}`, { headers: { cookie: request.headers.get("cookie") ?? "" } });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) return { error: data?.error ?? `status_${response.status}` };
    return data.report;
}

type ChatMessage = { role: "user" | "assistant"; content: string };
function validMessages(value: unknown): value is ChatMessage[] {
    if (!Array.isArray(value) || !value.length || value.length > 30) return false;
    return value.every((message, index) => message && (message.role === (index % 2 === 0 ? "user" : "assistant"))
        && typeof message.content === "string" && message.content.trim() && message.content.length <= 8000) && value.at(-1).role === "user";
}

export default async function handler(request: Request) {
    const json = (status: number, error: string) => Response.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store" } });
    if (request.method !== "POST") return json(405, "method_not_allowed");
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return json(403, "invalid_origin");
    if (!(await isAdmin(request))) return json(401, "signed_out");
    const apiKey = Netlify.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) return json(503, "serena_not_configured");
    let body: { messages?: unknown; view?: unknown };
    try { body = await request.json(); } catch { return json(400, "invalid_request"); }
    if (!validMessages(body.messages)) return json(400, "invalid_request");

    // The report the admin is looking at goes first, so most questions need no extra call.
    const view = validInput(body.view) ? body.view : null;
    const messages: Anthropic.Beta.BetaMessageParam[] = body.messages.map((message) => ({ role: message.role, content: message.content }));
    if (view) {
        const report = await getReport(request, view);
        messages[0] = { role: "user", content: [
            { type: "text", text: `<current_view filters='${JSON.stringify(view)}'>\n${JSON.stringify(report)}\n</current_view>\nThis is the report on the admin's screen right now.` },
            { type: "text", text: body.messages[0].content },
        ] };
    }

    const client = new Anthropic({ apiKey });
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: object) => controller.enqueue(encoder.encode(`${JSON.stringify(data)}\n`));
            try {
                for (let turn = 0; turn < maxTurns; turn++) {
                    const response = client.beta.messages.stream({
                        model,
                        max_tokens: 16000,
                        thinking: { type: "adaptive" },
                        output_config: { effort: "medium" },
                        // If a safety classifier declines, the API retries on the recommended fallback model.
                        betas: ["server-side-fallback-2026-07-01"],
                        fallbacks: "default",
                        cache_control: { type: "ephemeral" },
                        system: systemPrompt(new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10)),
                        tools,
                        messages,
                    });
                    response.on("text", (text) => send({ type: "text", text }));
                    const message = await response.finalMessage();
                    if (message.stop_reason === "refusal") { send({ type: "error", error: "refusal" }); break; }
                    const calls = message.content.filter((block): block is Anthropic.Beta.BetaToolUseBlock => block.type === "tool_use");
                    if (message.stop_reason !== "tool_use" || !calls.length) {
                        if (message.stop_reason === "max_tokens") send({ type: "error", error: "too_long" });
                        break;
                    }
                    messages.push({ role: "assistant", content: message.content });
                    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
                    for (const call of calls) {
                        if (!validInput(call.input)) {
                            results.push({ type: "tool_result", tool_use_id: call.id, is_error: true, content: "Invalid input: from and to must be YYYY-MM-DD; filters are short strings." });
                            continue;
                        }
                        send({ type: "status", input: call.input });
                        const report = await getReport(request, call.input);
                        results.push({ type: "tool_result", tool_use_id: call.id, is_error: "error" in report, content: JSON.stringify(report) });
                    }
                    messages.push({ role: "user", content: results });
                    if (turn === maxTurns - 1) send({ type: "error", error: "too_many_steps" });
                }
                send({ type: "done" });
            } catch (error) {
                send({ type: "error", error: error instanceof Anthropic.RateLimitError ? "rate_limited" : error instanceof Anthropic.AuthenticationError ? "bad_key" : "failed" });
            } finally {
                controller.close();
            }
        },
    });
    return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
