import { describeChanges, tryInsert } from "../lib/analytics.mjs";
import { contentPath, isAdmin, readContent, readJson, reply, sameOrigin, storageError, storageReady, validateContent, writeFile } from "../lib/admin.mjs";

// GET returns the latest saved content; PUT { content, sha } validates and commits it to GitHub.
export default async function handler(request) {
    if (!isAdmin(request)) return reply(401, { ok: false, error: "signed_out" });
    if (!storageReady()) return reply(503, { ok: false, error: "storage_not_configured" });
    try {
        if (request.method === "GET") return reply(200, { ok: true, ...(await readContent()) });
        if (request.method !== "PUT") return reply(405, { ok: false, error: "method_not_allowed" });
        if (!sameOrigin(request)) return reply(403, { ok: false, error: "invalid_origin" });
        let body;
        try { body = await readJson(request, 1_000_000); } catch { return reply(400, { ok: false, error: "invalid_request" }); }
        const error = validateContent(body?.content);
        if (error) return reply(400, { ok: false, error });
        if (typeof body.sha !== "string" || !/^[a-f0-9]{40}$/.test(body.sha)) return reply(400, { ok: false, error: "missing_sha" });
        const before = await readContent().catch(() => null);
        const file = Buffer.from(`${JSON.stringify(body.content, null, 2)}\n`, "utf8");
        const result = await writeFile(contentPath, file, "Update site content from the admin panel", body.sha);
        // Someone else saved first: the admin must reload before saving again.
        if (result.conflict) return reply(409, { ok: false, error: "conflict" });
        // The reports page and Serena compare visits before and after each change.
        if (before) await tryInsert("admin_log", describeChanges(before.content, body.content));
        return reply(200, { ok: true, sha: result.sha });
    } catch (error) {
        return reply(502, { ok: false, error: storageError(error) });
    }
}
