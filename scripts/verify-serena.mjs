// Tests the Serena edge function with a mocked Claude API and reports function: session check,
// request shape (model, fallbacks, tools), the get_report tool loop and the streamed answer.
// Run with `npm run check:serena` (Node strips the TypeScript types).
import assert from "node:assert/strict";
import crypto from "node:crypto";

const env = { ADMIN_PASSWORD: "test-password-123", ANTHROPIC_API_KEY: "sk-test" };
globalThis.Netlify = { env: { get: (name) => env[name] } };

const expires = Date.now() + 3600_000;
const cookie = `clinova_admin=${expires}.${crypto.createHmac("sha256", `${env.ADMIN_PASSWORD}:`).update(`clinova-admin:${expires}`).digest("hex")}`;

const claudeRequests = [];
const reportRequests = [];
const sse = (events) => new Response(events.map(([type, data]) => `event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`).join(""), { headers: { "content-type": "text/event-stream" } });
const message = { id: "msg_1", type: "message", role: "assistant", model: "claude-opus-5-5", content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 0 } };

globalThis.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === "string" ? input : input.url);
    if (url.hostname === "api.anthropic.com") {
        const headers = new Headers(init.headers);
        const body = JSON.parse(init.body);
        claudeRequests.push({ headers, body });
        if (claudeRequests.length === 1) return sse([
            ["message_start", { message }],
            ["content_block_start", { index: 0, content_block: { type: "text", text: "" } }],
            ["content_block_delta", { index: 0, delta: { type: "text_delta", text: "سأقارن الفترتين. " } }],
            ["content_block_stop", { index: 0 }],
            ["content_block_start", { index: 1, content_block: { type: "tool_use", id: "toolu_1", name: "get_report", input: {} } }],
            ["content_block_delta", { index: 1, delta: { type: "input_json_delta", partial_json: '{"from":"2026-10-01","to":"2026-10-15","country":"TR"}' } }],
            ["content_block_stop", { index: 1 }],
            ["message_delta", { delta: { stop_reason: "tool_use", stop_sequence: null }, usage: { output_tokens: 20 } }],
            ["message_stop", {}],
        ]);
        return sse([
            ["message_start", { message: { ...message, id: "msg_2" } }],
            ["content_block_start", { index: 0, content_block: { type: "text", text: "" } }],
            ["content_block_delta", { index: 0, delta: { type: "text_delta", text: "الزوار من تركيا زادوا." } }],
            ["content_block_stop", { index: 0 }],
            ["message_delta", { delta: { stop_reason: "end_turn", stop_sequence: null }, usage: { output_tokens: 8 } }],
            ["message_stop", {}],
        ]);
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

const [first, second] = claudeRequests;
assert.equal(first.headers.get("x-api-key"), "sk-test");
assert.match(first.headers.get("anthropic-beta"), /server-side-fallback-2026-07-01/);
assert.equal(first.body.model, "claude-opus-5-5");
assert.equal(first.body.fallbacks, "default");
assert.deepEqual(first.body.thinking, { type: "adaptive" });
assert.equal(first.body.output_config.effort, "medium");
assert.equal(first.body.stream, true);
assert.equal(first.body.tools[0].name, "get_report");
assert.match(first.body.messages[0].content[0].text, /<current_view[\s\S]*"visitors":42/);
assert.equal(first.body.messages[0].content[1].text, "ماذا تغيّر في تركيا؟");
assert.equal(second.body.messages.length, 3);
assert.equal(second.body.messages[1].role, "assistant");
assert.equal(second.body.messages[2].content[0].type, "tool_result");
assert.equal(second.body.messages[2].content[0].tool_use_id, "toolu_1");

delete env.ANTHROPIC_API_KEY;
assert.equal((await ask(question)).status, 503, "a missing API key is reported");

console.log("Serena: session check, request shape, report tool loop and streamed answer passed (mock Claude API)");
