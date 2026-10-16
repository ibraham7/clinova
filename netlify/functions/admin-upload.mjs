import crypto from "node:crypto";
import { tryInsert } from "../lib/analytics.mjs";
import { imageType, isAdmin, readJson, reply, sameOrigin, storageReady, writeFile } from "../lib/admin.mjs";

const maxBytes = 1_000_000;

// POST { name, data } (base64 PNG, JPEG or WebP up to 1 MB) commits a client logo to public/uploads/logos.
export default async function handler(request) {
    if (!isAdmin(request)) return reply(401, { ok: false, error: "signed_out" });
    if (request.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });
    if (!sameOrigin(request)) return reply(403, { ok: false, error: "invalid_origin" });
    if (!storageReady()) return reply(503, { ok: false, error: "storage_not_configured" });
    let body;
    try { body = await readJson(request, Math.ceil(maxBytes * 1.4) + 4096); } catch { return reply(413, { ok: false, error: "too_large" }); }
    if (typeof body?.data !== "string" || typeof body.name !== "string") return reply(400, { ok: false, error: "invalid_request" });
    const buffer = Buffer.from(body.data, "base64");
    if (!buffer.length || buffer.length > maxBytes) return reply(413, { ok: false, error: "too_large" });
    const type = imageType(buffer);
    if (!type) return reply(415, { ok: false, error: "unsupported_type" });
    const slug = body.name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "logo";
    const file = `${slug}-${crypto.randomBytes(3).toString("hex")}.${type}`;
    try {
        const result = await writeFile(`public/uploads/logos/${file}`, buffer, `Add client logo ${file} from the admin panel`);
        if (result.conflict) return reply(409, { ok: false, error: "conflict" });
        await tryInsert("admin_log", [{ action: "logo_upload", summary: `رفع شعار: ${body.name.slice(0, 80)}`, details: { file } }]);
        return reply(200, { ok: true, src: `/uploads/logos/${file}` });
    } catch {
        return reply(502, { ok: false, error: "storage_failed" });
    }
}
