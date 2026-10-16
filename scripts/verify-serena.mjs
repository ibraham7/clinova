// Tests the Serena edge function with a mocked Gemini API and reports function: session check,
// model choice, request shape, the get_report tool loop and the streamed answer.
// Run with `npm run check:serena` (Node strips the TypeScript types).
import assert from "node:assert/strict";
import crypto from "node:crypto";

const env = { ADMIN_PASSWORD: "test-password-123", GEMINI_API_KEY: "AIza-test" };
globalThis.Netlify = { env: { get: (name) => env[name] } };

const expires = Date.now() + 3600_000;
const cookie = `clinova_admin=${expires}.${crypto.createHmac("sha256", `${env.ADMIN_PASSWORD}:`).update(`clinova-admin:${expires}`).digest("hex")}`;

const geminiRequests = [];
const reportRequests = [];
let modelLists = 0;
// Gemini streams server-sent events, each one a partial response.
const sse = (chunks) => new Response(chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\r\n\r\n`).join(""), { headers: { "content-type": "text/event-stream" } });
const parts = (list, finishReason) => ({ candidates: [{ content: { role: "model", parts: list }, ...(finishReason ? { finishReason } : {}) }] });

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
        geminiRequests.push({ url, body: JSON.parse(init.body) });
        if (geminiRequests.length === 1) return sse([
            parts([{ text: "سأقارن " }]),
            parts([{ text: "الفترتين. " }, { functionCall: { name: "get_report", args: { from: "2026-10-01", to: "2026-10-15", country: "TR" } }, thoughtSignature: "sig-1" }], "STOP"),
        ]);
        return sse([parts([{ text: "الزوار من تركيا " }]), parts([{ text: "زادوا." }], "STOP")]);
    }
    if (url.pathname === "/.netlify/functions/admin-reports") {
        reportRequests.push({ params: url.searchParams, cookie: new Headers(init.headers).get("cookie") });
        return Response.json({ ok: true, report: { summary: { visitors: 42 }, filters: Object.fromEntries(url.searchParams) } });
    }
    throw new Error(`Unexpected fetch ${url}`);
};

const { default: serena, config } = await import("../netlify/edge-functions/serena.ts");
assert.equal(config.path, "/api/serena");

const ask = (body, headers = { cookie }) => serena(new Request("https://clinova.test/api/serena", { method: "POST", headers: { "content-type": "application/json", origin: "https://clinova.test", ...headers }, body: JSON.stringify(body) }));
const question = { messages: [{ role: "user", content: "ماذا تغيّر في تركيا؟" }], view: { from: "2026-09-16", to: "2026-10-15" } };

assert.equal((await ask(question, {})).status, 401, "signed-out admins are refused");
assert.equal((await ask(question, { cookie: cookie.replace(/.$/, "0") })).status, 401, "a forged cookie is refused");
assert.equal((await ask({ messages: [{ role: "assistant", content: "x" }] })).status, 400, "the conversation must end with a question");

const response = await ask(question);
assert.equal(response.status, 200);
const chunks = (await response.text()).trim().split("\n").map((line) => JSON.parse(line));
assert.deepEqual(chunks.filter((chunk) => chunk.type === "text").map((chunk) => chunk.text).join(""), "سأقارن الفترتين. الزوار من تركيا زادوا.");
assert.deepEqual(chunks.find((chunk) => chunk.type === "status").input, { from: "2026-10-01", to: "2026-10-15", country: "TR" });
assert.equal(chunks.at(-1).type, "done");

// The current view is fetched first, then the tool call, both as the signed-in admin.
assert.equal(reportRequests.length, 2);
assert.equal(reportRequests[0].params.get("from"), "2026-09-16");
assert.equal(reportRequests[0].params.get("compact"), "1");
assert.equal(reportRequests[1].params.get("country"), "TR");
assert.ok(reportRequests.every((request) => request.cookie === cookie));

const [first, second] = geminiRequests;
assert.match(first.url.pathname, /\/models\/gemini-9\.5-flash:streamGenerateContent$/, "newest stable flash model");
assert.equal(first.url.searchParams.get("alt"), "sse");
assert.equal(first.body.tools[0].functionDeclarations[0].name, "get_report");
assert.match(first.body.systemInstruction.parts[0].text, /Serena/);
assert.match(first.body.contents[0].parts[0].text, /<current_view[\s\S]*"visitors":42/);
assert.equal(first.body.contents[0].parts[1].text, "ماذا تغيّر في تركيا؟");
assert.equal(second.body.contents.length, 3);
assert.equal(second.body.contents[1].role, "model");
assert.equal(second.body.contents[1].parts.find((part) => part.functionCall).thoughtSignature, "sig-1", "the model turn goes back unchanged");
assert.deepEqual(second.body.contents[2].parts[0].functionResponse.name, "get_report");
assert.equal(second.body.contents[2].parts[0].functionResponse.response.result.summary.visitors, 42);
assert.equal(modelLists, 1, "the model list is fetched once and cached");

delete env.GEMINI_API_KEY;
assert.equal((await ask(question)).status, 503, "a missing API key is reported");

console.log("Serena: session check, model choice, request shape, report tool loop and streamed answer passed (mock Gemini API)");
