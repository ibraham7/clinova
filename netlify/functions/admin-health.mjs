import leadSettings from "../../src/config/profile-leads.json" with { type: "json" };
import { checkWriteAccess, isAdmin, readContent, reply, storageReady } from "../lib/admin.mjs";
import { analyticsReady, selectRange } from "../lib/analytics.mjs";

// GET: checks every connection the site depends on, for the "connection status" card on the admin home page.
// Each check really calls the service (with a short timeout) and returns { id, ok, detail }.
const withTimeout = (promise, ms = 8_000) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

async function check(id, run, optional = false) {
    try {
        const detail = await withTimeout(run());
        return { id, ok: true, optional, detail: detail ?? null };
    } catch (error) {
        return { id, ok: false, optional, detail: String(error?.message ?? error).slice(0, 200) };
    }
}

export default async function handler(request) {
    if (!isAdmin(request)) return reply(401, { ok: false, error: "signed_out" });
    const checks = await Promise.all([
        check("password", async () => "ok"),
        check("github", async () => {
            if (!storageReady()) throw new Error("missing GITHUB_TOKEN");
            await readContent();
            try { await checkWriteAccess(); } catch (error) {
                throw new Error(/_40[34]$/.test(error.message) ? "GITHUB_TOKEN can read but not write: give it Contents: Read and write" : /_401$/.test(error.message) ? "GITHUB_TOKEN is invalid or expired" : error.message);
            }
            return `${process.env.GITHUB_REPO || "ibraham7/clinova"} (read + write)`;
        }),
        check("supabase", async () => {
            if (!analyticsReady()) throw new Error("missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
            const day = new Date().toISOString();
            // A one-day read of every table proves the URL, the key and the schema.
            const counts = await Promise.all(["events", "leads", "admin_log"].map((table) => selectRange(table, "id", new Date(Date.now() - 86_400_000).toISOString(), day, 1_000)));
            return `events today: ${counts[0].length}`;
        }),
        check("gemini", async () => {
            const key = process.env.GEMINI_API_KEY;
            if (!key) throw new Error("missing GEMINI_API_KEY");
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": key } });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data?.error?.message ?? `HTTP ${response.status}`);
            const flash = (data.models ?? []).filter((model) => /flash/.test(model.name)).length;
            return `${flash} Flash models`;
        }),
        check("sheets", async () => {
            if (!leadSettings.endpoint?.startsWith("https://")) throw new Error("no Apps Script endpoint in src/config/profile-leads.json");
            const response = await fetch(leadSettings.endpoint, { redirect: "follow" });
            const data = await response.json().catch(() => null);
            if (!response.ok || data?.ok !== true) throw new Error(`Apps Script answered HTTP ${response.status}`);
            return data.service ?? "ok";
        }),
        check("cloudinary", async () => {
            if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_UPLOAD_PRESET) throw new Error("not configured: videos can still be added from YouTube");
            return process.env.CLOUDINARY_CLOUD_NAME;
        }, true),
    ]);
    return reply(200, { ok: true, checks });
}
