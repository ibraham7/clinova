import { describeChanges, tryInsert } from "../lib/analytics.mjs";
import { contentPath, isAdmin, mergeContent, readContent, readJson, reply, sameOrigin, storageError, storageReady, validateContent, writeFile } from "../lib/admin.mjs";

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
        // With `base` (the content as this page loaded it), only this admin's changes are applied to the latest
        // file, retrying if another save lands in between. Without it, a stale sha is a conflict.
        const merging = body.base && typeof body.base === "object";
        for (let attempt = 0; attempt < 3; attempt++) {
            const before = await readContent().catch(() => null);
            if (merging && !before) throw new Error("github_read_failed");
            const content = merging ? mergeContent(before.content, body.base, body.content) : body.content;
            const invalid = merging && validateContent(content);
            if (invalid) return reply(400, { ok: false, error: invalid });
            const file = Buffer.from(`${JSON.stringify(content, null, 2)}\n`, "utf8");
            const result = await writeFile(contentPath, file, "Update site content from the admin panel", merging ? before.sha : body.sha);
            if (result.conflict) {
                if (!merging) return reply(409, { ok: false, error: "conflict" });
                await new Promise((resolve) => setTimeout(resolve, 800));
                continue;
            }
            // The reports page and Serena compare visits before and after each change.
            if (before) await tryInsert("admin_log", describeChanges(before.content, content));
            return reply(200, { ok: true, sha: result.sha, content });
        }
        return reply(409, { ok: false, error: "conflict" });
    } catch (error) {
        return reply(502, { ok: false, error: storageError(error) });
    }
}
