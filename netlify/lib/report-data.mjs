// Loads the analytics rows for a date range from Supabase and builds the report.
// Shared by the admin-reports function (the reports page) and the serena function (the assistant).
import { selectRange } from "./analytics.mjs";
import { buildReport, parseFilters, parseRange } from "./reports.mjs";

const eventColumns = "id,ts,visitor,type,path,lang,section,target,value,source,channel,utm_source,utm_medium,utm_campaign,device,browser,os,country,country_name,city";
const leadColumns = "id,ts,purpose,contact_type,contact,phone_country,lang,form_source,consent,answers,visitor,country,city";
const maxEvents = 150_000;

/** Returns the report, or null when the range is invalid. `params` is a URLSearchParams. */
export async function loadReport(params, origin) {
    const ranges = parseRange(params);
    if (!ranges) return null;
    const { range, previousRange } = ranges;
    const [events, previousEvents, leads, previousLeads, adminLog, articles] = await Promise.all([
        selectRange("events", eventColumns, range.from, range.to, maxEvents),
        selectRange("events", eventColumns, previousRange.from, previousRange.to, maxEvents),
        selectRange("leads", leadColumns, range.from, range.to),
        selectRange("leads", leadColumns, previousRange.from, previousRange.to),
        // The whole change history, so Serena can compare before and after any change.
        selectRange("admin_log", "id,ts,action,summary", "2020-01-01T00:00:00Z", range.to, 2_000),
        fetch(`${origin}/blog/articles.json`).then((response) => response.ok ? response.json() : []).catch(() => []),
    ]);
    return buildReport({
        range, previousRange, events, previousEvents, leads, previousLeads, adminLog, articles,
        filters: parseFilters(params), compact: params.get("compact") === "1", truncated: events.length >= maxEvents,
    });
}
