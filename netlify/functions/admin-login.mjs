import { clearedCookie, passwordMatches, readJson, reply, sameOrigin, sessionCookie } from "../lib/admin.mjs";

// POST { password } signs the admin in with an HttpOnly session cookie; DELETE signs out.
export default async function handler(request) {
    if (!sameOrigin(request)) return reply(403, { ok: false, error: "invalid_origin" });
    if (request.method === "DELETE") return reply(200, { ok: true }, { "Set-Cookie": clearedCookie });
    if (request.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });
    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 10) return reply(503, { ok: false, error: "not_configured" });
    let body;
    try { body = await readJson(request, 2048); } catch { return reply(400, { ok: false, error: "invalid_request" }); }
    if (!passwordMatches(body?.password)) {
        // Slow down password guessing.
        await new Promise((resolve) => setTimeout(resolve, 1200));
        return reply(401, { ok: false, error: "wrong_password" });
    }
    return reply(200, { ok: true }, { "Set-Cookie": sessionCookie() });
}
