// Loads the analytics rows for a date range from Supabase and builds the report.
// Shared by the admin-reports function (the reports page) and the serena function (the assistant).
import { firstRowTime, selectRange } from "./analytics.mjs";
import { buildReport, parseFilters, parseRange } from "./reports.mjs";
import { demoInputs } from "./demo-data.mjs";

const eventColumns = "id,ts,visitor,type,path,lang,section,target,value,source,channel,utm_source,utm_medium,utm_campaign,device,browser,os,country,country_name,city";
const leadColumns = "id,ts,purpose,contact_type,contact,phone_country,lang,form_source,consent,answers,visitor,country,city";
const maxEvents = 150_000;

const loadArticles = (origin) => fetch(`${origin}/blog/articles.json`).then((response) => response.ok ? response.json() : []).catch(() => []);

/** Returns the report, or null when the range is invalid. `params` is a URLSearchParams; demo=1 uses made-up data (lib/demo-data.mjs). */
export async function loadReport(params, origin) {
    const ranges = parseRange(params);
    if (!ranges) return null;
    const { range, previousRange } = ranges;
    const options = { filters: parseFilters(params), compact: params.get("compact") === "1" };
    if (params.get("demo") === "1") {
        const { trackingSince, ...demo } = demoInputs(range, previousRange, await loadArticles(origin));
        return { ...buildReport({ range, previousRange, ...demo, ...options }), trackingSince, demo: true };
    }
    const [events, previousEvents, leads, previousLeads, adminLog, articles, firstEvent] = await Promise.all([
        selectRange("events", eventColumns, range.from, range.to, maxEvents),
        selectRange("events", eventColumns, previousRange.from, previousRange.to, maxEvents),
        selectRange("leads", leadColumns, range.from, range.to),
        selectRange("leads", leadColumns, previousRange.from, previousRange.to),
        // The whole change history, so Serena can compare before and after any change.
        selectRange("admin_log", "id,ts,action,summary", "2020-01-01T00:00:00Z", range.to, 2_000),
        loadArticles(origin),
        firstRowTime("events").catch(() => null),
    ]);
    const report = buildReport({
        range, previousRange, events, previousEvents, leads, previousLeads, adminLog, articles,
        ...options, truncated: events.length >= maxEvents,
    });
    // When visitor tracking started: days before it have no data, which is not the same as no visitors.
    return { ...report, trackingSince: firstEvent };
}
