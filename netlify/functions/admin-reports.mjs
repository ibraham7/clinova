import { analyticsReady, selectRange } from "../lib/analytics.mjs";
import { isAdmin, reply } from "../lib/admin.mjs";
import { buildReport, parseFilters, parseRange } from "../lib/reports.mjs";

const eventColumns = "id,ts,visitor,type,path,lang,section,target,value,source,channel,utm_source,utm_medium,utm_campaign,device,browser,os,country,country_name,city";
const leadColumns = "id,ts,purpose,contact_type,contact,phone_country,lang,form_source,consent,answers,visitor,country,city";
const maxEvents = 150_000;

// GET ?from=YYYY-MM-DD&to=YYYY-MM-DD&country=TR&device=mobile&lang=ar&source=Google&channel=search&path=/ar/blog&compact=1
export default async function handler(request) {
    if (!isAdmin(request)) return reply(401, { ok: false, error: "signed_out" });
    if (request.method !== "GET") return reply(405, { ok: false, error: "method_not_allowed" });
    if (!analyticsReady()) return reply(503, { ok: false, error: "analytics_not_configured" });
    const url = new URL(request.url);
    const ranges = parseRange(url.searchParams);
    if (!ranges) return reply(400, { ok: false, error: "invalid_range" });
    try {
        const { range, previousRange } = ranges;
        const [events, previousEvents, leads, previousLeads, adminLog, articles] = await Promise.all([
            selectRange("events", eventColumns, range.from, range.to, maxEvents),
            selectRange("events", eventColumns, previousRange.from, previousRange.to, maxEvents),
            selectRange("leads", leadColumns, range.from, range.to),
            selectRange("leads", leadColumns, previousRange.from, previousRange.to),
            // The whole change history, so Serena can compare before and after any change.
            selectRange("admin_log", "id,ts,action,summary", "2020-01-01T00:00:00Z", range.to, 2_000),
            fetch(`${url.origin}/blog/articles.json`).then((response) => response.ok ? response.json() : []).catch(() => []),
        ]);
        const report = buildReport({
            range, previousRange, events, previousEvents, leads, previousLeads, adminLog, articles,
            filters: parseFilters(url.searchParams), compact: url.searchParams.get("compact") === "1", truncated: events.length >= maxEvents,
        });
        return reply(200, { ok: true, report });
    } catch {
        return reply(502, { ok: false, error: "analytics_failed" });
    }
}
