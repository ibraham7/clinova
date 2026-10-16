// Tests the Serena function with mocked Gemini and Supabase APIs: session check, model choice,
// request shape, the get_report tool loop and the answer lines. Run with `npm run check:serena`.
import assert from "node:assert/strict";

process.env.ADMIN_PASSWORD = "test-password-123";
process.env.GEMINI_API_KEY = "AIza-test";
process.env.SUPABASE_URL = "https://mock.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

const today = new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10);
const geminiRequests = [];
let modelLists = 0;
let supabaseReads = 0;
const reply = (parts, finishReason = "STOP") => Response.json({ candidates: [{ content: { role: "model", parts }, finishReason }] });

globalThis.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === "string" ? input : input.url);
    if (url.hostname === "generativelanguage.googleapis.com") {
        assert.equal(new Headers(init.headers).get("x-goog-api-key"), "AIza-test");
        if (url.pathname.endsWith("/models")) {
            modelLists += 1;
            return Response.json({ models: [
                { name: "models/gemini-2.0-flash", supportedGenerationMethods: ["generateContent"] },
                { name: "models/gemini-9.5-flash", supportedGenerationMethods: ["generateContent"] },
                { name: "models/gemini-9.5-flash-lite", supportedGenerationMethods: ["generateContent"] },
                { name: "models/gemini-9.9-flash-preview", supportedGenerationMethods: ["generateContent"] },
                { name: "models/gemini-9.5-pro", supportedGenerationMethods: ["generateContent"] },
                { name: "models/text-embedding-4", supportedGenerationMethods: ["embedContent"] },
            ] });
        }
        const body = JSON.parse(init.body);
        // Like gemini-3.8-flash in production: the "minimal" thinking level is refused.
        if (body.generationConfig.thinkingConfig?.thinkingLevel === "minimal") {
            return Response.json({ error: { code: 400, message: "Thinking level MINIMAL is not supported for this model. Please retry with other thinking level." } }, { status: 400 });
        }
        geminiRequests.push({ url, body });
        if (geminiRequests.length === 1) return reply([{ text: "سأقارن الفترتين. " }, { functionCall: { name: "get_report", args: { from: "2026-10-01", to: "2026-10-15", country: "TR" } }, thoughtSignature: "sig-1" }]);
        return reply([{ text: "الزوار من تركيا زادوا." }]);
    }
    if (url.hostname === "mock.supabase.co") {
        supabaseReads += 1;
        assert.match(url.pathname, /\/rest\/v1\/clinova_/);
        return Response.json([]);
    }
    if (url.pathname === "/blog/articles.json") return Response.json([]);
    throw new Error(`Unexpected fetch ${url}`);
};

const { sessionCookie } = await import("../netlify/lib/admin.mjs");
const { default: serena, config } = await import("../netlify/functions/serena.mjs");
assert.equal(config.path, "/api/serena");
const cookie = sessionCookie().split(";")[0];

const ask = (body, headers = { cookie }) => serena(new Request("https://clinova.test/api/serena", { method: "POST", headers: { "content-type": "application/json", origin: "https://clinova.test", ...headers }, body: JSON.stringify(body) }));
const question = { messages: [{ role: "user", content: "ماذا تغيّر في تركيا؟" }], view: { from: today, to: today } };

assert.equal((await ask(question, {})).status, 401, "signed-out admins are refused");
assert.equal((await ask(question, { cookie: cookie.replace(/.$/, "0") })).status, 401, "a forged cookie is refused");
assert.equal((await ask(question, { cookie, origin: "https://evil.test" })).status, 403, "other sites are refused");
assert.equal((await ask({ messages: [{ role: "assistant", content: "x" }] })).status, 400, "the conversation must end with a question");

const response = await ask(question);
assert.equal(response.status, 200);
const chunks = (await response.text()).trim().split("\n").map((line) => JSON.parse(line));
if (process.env.DEBUG) console.log(chunks);
assert.equal(chunks.filter((chunk) => chunk.type === "text").map((chunk) => chunk.text).join(""), "سأقارن الفترتين. الزوار من تركيا زادوا.");
assert.deepEqual(chunks.find((chunk) => chunk.type === "status").input, { from: "2026-10-01", to: "2026-10-15", country: "TR" });
assert.equal(chunks.at(-1).type, "done");
assert.ok(supabaseReads >= 10, "the on-screen report and the tool report are both read from Supabase");

const [first, second] = geminiRequests;
assert.match(first.url.pathname, /\/models\/gemini-9\.5-flash:generateContent$/, "newest stable flash model");
assert.deepEqual(first.body.generationConfig.thinkingConfig, { thinkingLevel: "low" }, "a refused thinking level falls back to the next one");
assert.deepEqual(second.body.generationConfig.thinkingConfig, { thinkingLevel: "low" }, "the refusal is remembered");
assert.equal(first.body.tools[0].functionDeclarations[0].name, "get_report");
assert.match(first.body.systemInstruction.parts[0].text, /Serena/);
assert.match(first.body.systemInstruction.parts[0].text, /Always answer in Arabic/, "Arabic by default");
assert.match(first.body.contents[0].parts[0].text, /<current_view[\s\S]*"visitors":0/);
assert.equal(first.body.contents[0].parts[1].text, "ماذا تغيّر في تركيا؟");
assert.equal(second.body.contents.length, 3);
assert.equal(second.body.contents[1].parts.find((part) => part.functionCall).thoughtSignature, "sig-1", "the model turn goes back unchanged");
assert.equal(second.body.contents[2].parts[0].functionResponse.name, "get_report");
assert.equal(second.body.contents[2].parts[0].functionResponse.response.result.filters.country, "TR");
assert.equal(modelLists, 1, "the model list is fetched once and cached");

// A busy model ("high demand", HTTP 503) hands over to the next model in the chain.
const before = globalThis.fetch;
const tried = [];
globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    if (url.hostname !== "generativelanguage.googleapis.com" || url.pathname.endsWith("/models")) return before(input, init);
    tried.push(url.pathname.split("/").pop());
    if (url.pathname.includes("gemini-9.5-flash:")) return Response.json({ error: { code: 503, message: "This model is currently experiencing high demand." } }, { status: 503 });
    return Response.json({ candidates: [{ content: { role: "model", parts: [{ text: "جواب من موديل بديل" }] }, finishReason: "STOP" }] });
};
const busy = (await (await ask({ messages: [{ role: "user", content: "مرحبا" }] })).text()).trim().split("\n").map((line) => JSON.parse(line));
assert.equal(busy[0].text, "جواب من موديل بديل");
assert.deepEqual(tried, ["gemini-9.5-flash:generateContent", "gemini-9.5-flash-lite:generateContent"]);
tried.length = 0;
await ask({ messages: [{ role: "user", content: "مرحبا" }] });
assert.deepEqual(tried, ["gemini-9.5-flash-lite:generateContent"], "the busy model is skipped for a while");
globalThis.fetch = before;

// Google errors reach the admin with Google's own message.
const working = globalThis.fetch;
globalThis.fetch = async (input, init) => new URL(String(input)).hostname === "generativelanguage.googleapis.com"
    ? Response.json({ error: { code: 400, message: "API key not valid. Please pass a valid API key." } }, { status: 400 })
    : working(input, init);
const bad = (await (await ask(question)).text()).trim().split("\n").map((line) => JSON.parse(line));
assert.equal(bad[0].error, "bad_key");
assert.match(bad[0].detail, /API key not valid/);

// The panel language decides Serena's language.
const turkish = [];
const plain = globalThis.fetch;
globalThis.fetch = async (input, init) => {
    if (String(input).includes(":generateContent")) turkish.push(JSON.parse(init.body).systemInstruction.parts[0].text);
    return plain(input, init);
};
await ask({ messages: [{ role: "user", content: "merhaba" }], lang: "tr" });
assert.match(turkish[0], /Always answer in Turkish/);
globalThis.fetch = plain;

delete process.env.GEMINI_API_KEY;
assert.equal((await ask(question)).status, 503, "a missing API key is reported");

console.log("Serena: session check, model choice, request shape, report tool loop, answers and errors passed (mock Gemini and Supabase)");
