import { analyticsReady } from "../lib/analytics.mjs";
import { isAdmin, reply } from "../lib/admin.mjs";
import { loadReport } from "../lib/report-data.mjs";

// GET ?from=YYYY-MM-DD&to=YYYY-MM-DD&country=TR&device=mobile&lang=ar&source=Google&channel=search&path=/ar/blog&compact=1
export default async function handler(request) {
    if (!isAdmin(request)) return reply(401, { ok: false, error: "signed_out" });
    if (request.method !== "GET") return reply(405, { ok: false, error: "method_not_allowed" });
    if (!analyticsReady()) return reply(503, { ok: false, error: "analytics_not_configured" });
    const url = new URL(request.url);
    try {
        const report = await loadReport(url.searchParams, url.origin);
        if (!report) return reply(400, { ok: false, error: "invalid_range" });
        return reply(200, { ok: true, report });
    } catch {
        return reply(502, { ok: false, error: "analytics_failed" });
    }
}
