import { tryInsert } from "../lib/analytics.mjs";
import { imageType, isAdmin, readJson, readRepoFile, reply, sameOrigin, storageError, storageReady, writeFile } from "../lib/admin.mjs";

// The site's own logo (header, footer, hero, blog, admin, search results) is public/logo/logo.png, imported at
// build time. POST { data } (a base64 PNG, converted in the browser) replaces it; POST { restore: true } puts back
// the logo the site had before the first replacement, kept once as logo-original.png.
const logoPath = "public/logo/logo.png";
const originalPath = "public/logo/logo-original.png";
const maxBytes = 1_500_000;

export default async function handler(request) {
    if (!isAdmin(request)) return reply(401, { ok: false, error: "signed_out" });
    if (request.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });
    if (!sameOrigin(request)) return reply(403, { ok: false, error: "invalid_origin" });
    if (!storageReady()) return reply(503, { ok: false, error: "storage_not_configured" });
    let body;
    try { body = await readJson(request, Math.ceil(maxBytes * 1.4) + 4096); } catch { return reply(413, { ok: false, error: "too_large" }); }
    try {
        const current = await readRepoFile(logoPath);
        let buffer;
        if (body?.restore === true) {
            const original = await readRepoFile(originalPath);
            if (!original) return reply(404, { ok: false, error: "no_original_logo" });
            buffer = original.buffer;
        } else {
            if (typeof body?.data !== "string") return reply(400, { ok: false, error: "invalid_request" });
            buffer = Buffer.from(body.data, "base64");
            if (!buffer.length || buffer.length > maxBytes) return reply(413, { ok: false, error: "too_large" });
            if (imageType(buffer) !== "png") return reply(415, { ok: false, error: "unsupported_type" });
            // The first replacement keeps the logo the site started with, so it can always be restored.
            if (current && !(await readRepoFile(originalPath))) await writeFile(originalPath, current.buffer, "Keep the original site logo before replacing it from the admin panel");
        }
        const result = await writeFile(logoPath, buffer, body.restore ? "Restore the original site logo from the admin panel" : "Replace the site logo from the admin panel", current?.sha);
        if (result.conflict) return reply(409, { ok: false, error: "conflict" });
        await tryInsert("admin_log", [{ action: "site_logo", summary: body.restore ? "استرجاع شعار الموقع الأصلي" : "تغيير شعار الموقع", details: {} }]);
        return reply(200, { ok: true });
    } catch (error) {
        return reply(502, { ok: false, error: storageError(error) });
    }
}
