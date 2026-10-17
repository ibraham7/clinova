// Tests the visitor analytics: event collection, lead copies, the admin change log and the report numbers.
// Supabase and GitHub are replaced by an in-memory mock; run with `npm run check:reports`.
import assert from "node:assert/strict";

process.env.ADMIN_PASSWORD = "test-password-123";
process.env.SUPABASE_URL = "https://mock.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
process.env.GITHUB_TOKEN = "token";

const tables = { events: [], leads: [], admin_log: [] };
let githubContent = { texts: { ar: {}, en: {}, tr: {}, fr: {} }, videos: [], logos: [] };
globalThis.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === "string" ? input : input.url);
    if (url.hostname === "mock.supabase.co") {
        assert.equal(init.headers?.Authorization, "Bearer service-key");
        assert.match(url.pathname, /\/rest\/v1\/clinova_/, "tables use the clinova_ prefix");
        const table = url.pathname.split("/").pop().replace(/^clinova_/, "");
        if (init.method === "POST") {
            for (const row of JSON.parse(init.body)) {
                if (table === "leads" && tables.leads.some((lead) => lead.request_id === row.request_id)) continue;
                tables[table].push({ id: tables[table].length + 1, ts: row.ts ?? new Date().toISOString(), ...row });
            }
            return new Response(null, { status: 201 });
        }
        const [, from] = url.search.match(/ts=gte\.([^&]+)/);
        const [, to] = url.search.match(/ts=lt\.([^&]+)/);
        const rows = tables[table].filter((row) => row.ts >= decodeURIComponent(from) && row.ts < decodeURIComponent(to));
        const [start, end] = init.headers.Range.split("-").map(Number);
        return Response.json(rows.slice(start, end + 1));
    }
    if (url.hostname === "api.github.com") {
        if (init.method === "PUT") { githubContent = JSON.parse(Buffer.from(JSON.parse(init.body).content, "base64").toString()); return Response.json({ content: { sha: "b".repeat(40) } }); }
        return Response.json({ sha: "a".repeat(40), content: Buffer.from(JSON.stringify(githubContent)).toString("base64") });
    }
    if (url.pathname === "/blog/articles.json") return Response.json([{ slug: "dental-clinic-marketing", title: "تسويق عيادات الأسنان", date: "2026-10-16" }]);
    if (url.hostname === "script.google.com") return Response.json({ ok: true });
    throw new Error(`Unexpected fetch ${url}`);
};

const { classifySource, describeChanges, visitorId } = await import("../netlify/lib/analytics.mjs");
const { buildReport, parseRange, tidy } = await import("../netlify/lib/reports.mjs");
const { sessionCookie } = await import("../netlify/lib/admin.mjs");
const collect = (await import("../netlify/functions/collect.mjs")).default;
const profileLead = (await import("../netlify/functions/profile-lead.mjs")).default;
const adminContent = (await import("../netlify/functions/admin-content.mjs")).default;
const adminReports = (await import("../netlify/functions/admin-reports.mjs")).default;

// ---- Sources -------------------------------------------------------------------------------
assert.deepEqual(classifySource(null), { source: "Direct", channel: "direct" });
assert.deepEqual(classifySource("www.google.com.tr"), { source: "Google", channel: "search" });
assert.deepEqual(classifySource("gemini.google.com"), { source: "Gemini", channel: "ai" });
assert.deepEqual(classifySource("chatgpt.com"), { source: "ChatGPT", channel: "ai" });
assert.deepEqual(classifySource("l.instagram.com"), { source: "Instagram", channel: "social" });
assert.deepEqual(classifySource("someblog.net"), { source: "someblog.net", channel: "referral" });
assert.deepEqual(classifySource(null, { utm_source: "google", utm_medium: "cpc" }), { source: "Google", channel: "campaign" });
assert.deepEqual(classifySource("facebook.com", { utm_source: "newsletter" }), { source: "newsletter", channel: "campaign" });

// ---- Collection ----------------------------------------------------------------------------
const browser = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const visit = (events, extra = {}) => new Request("https://clinova.test/.netlify/functions/collect", {
    method: "POST", headers: { "user-agent": browser, origin: "https://clinova.test", "content-type": "application/json" },
    body: JSON.stringify({ page: "abcdef0123456789", path: "/ar", lang: "ar", referrer: "https://www.google.com/", screen: 390, events, ...extra }),
});
const context = { ip: "203.0.113.9", geo: { country: { code: "SA", name: "Saudi Arabia" }, city: "Riyadh", subdivision: { name: "Riyadh" }, timezone: "Asia/Riyadh" } };
assert.equal((await collect(visit([{ type: "page_view" }, { type: "section", section: "services", value: 4200 }, { type: "click", target: "whatsapp", section: "contact-cta" }, { type: "bogus" }]), context)).status, 204);
assert.equal(tables.events.length, 3, "unknown event types are dropped");
const [first] = tables.events;
assert.equal(first.country, "SA");
assert.equal(first.city, "Riyadh");
assert.equal(first.device, "mobile");
assert.equal(first.browser, "Safari");
assert.equal(first.os, "iOS");
assert.equal(first.source, "Google");
assert.equal(first.referrer, "www.google.com");
assert.equal(first.visitor, visitorId(new Request("https://x", { headers: { "user-agent": browser } }), context));
assert.ok(!JSON.stringify(tables.events).includes("203.0.113.9"), "the IP address is never stored");
// Bots, the admin panel and other sites are ignored.
await collect(new Request("https://clinova.test/.netlify/functions/collect", { method: "POST", headers: { "user-agent": "Googlebot/2.1" }, body: "{}" }), context);
await collect(visit([{ type: "page_view" }], { path: "/admin" }), context);
assert.equal(tables.events.length, 3);
assert.equal((await collect(new Request("https://clinova.test/.netlify/functions/collect", { method: "POST", headers: { "user-agent": browser, origin: "https://evil.test" }, body: "{}" }), context)).status, 403);
assert.equal((await collect(visit([{ type: "page_view" }], { page: "../x" }), context)).status, 400);

// ---- Lead copies ---------------------------------------------------------------------------
const lead = {
    purpose: "trial_survey", requestId: "11111111-2222-4333-8444-555555555555", language: "ar", marketingConsent: true,
    contact: { type: "email", value: "clinic@example.com" },
    answers: { specialty: "طب الأسنان", patients: "أقل من 50 مريضًا", workflow: "نظام حجز أو CRM", need: "مرضى جدد أكثر", wish: "حجوزات أكثر" },
};
const leadRequest = () => new Request("https://clinova.test/.netlify/functions/profile-lead", { method: "POST", headers: { "user-agent": browser, "content-type": "application/json" }, body: JSON.stringify(lead) });
assert.equal((await profileLead(leadRequest(), context)).status, 200);
assert.equal((await profileLead(leadRequest(), context)).status, 200);
assert.equal(tables.leads.length, 1, "a retried lead is saved once");
assert.equal(tables.leads[0].visitor, first.visitor, "the lead is linked to its visit");
assert.equal(tables.leads[0].form_source, "survey");

// ---- Admin change log ----------------------------------------------------------------------
const changes = describeChanges(
    { texts: { ar: { a: "1" }, en: {}, tr: {}, fr: {} }, videos: [{ id: "v1", name: "عيادة أ" }], logos: [] },
    { texts: { ar: { a: "2", b: "x" }, en: {}, tr: {}, fr: {} }, videos: [{ id: "v1", name: "عيادة أ" }, { id: "v2", name: "عيادة ب" }], logos: [] },
);
assert.deepEqual(changes.map((change) => change.action), ["texts", "videos"]);
assert.match(changes[0].summary, /تعديل 2 نص/);
assert.match(changes[1].summary, /إضافة فيديو: عيادة ب/);
const admin = { cookie: sessionCookie().split(";")[0] };
assert.match(sessionCookie(), /Path=\/;/, "the session reaches /api/serena");
const save = await adminContent(new Request("https://clinova.test/.netlify/functions/admin-content", {
    method: "PUT", headers: { ...admin, origin: "https://clinova.test" },
    body: JSON.stringify({ sha: "a".repeat(40), content: { texts: { ar: { "من نحن": "عنّا" }, en: {}, tr: {}, fr: {} }, videos: [], logos: [] } }),
}));
assert.equal(save.status, 200);
assert.equal(tables.admin_log.length, 1);
assert.equal(tables.admin_log[0].action, "texts");

// ---- Report numbers ------------------------------------------------------------------------
const at = (day, hour) => new Date(Date.UTC(2026, 9, day, hour)).toISOString();
const event = (visitor, ts, type, extra = {}) => ({ visitor, ts, type, path: "/ar", lang: "ar", source: "Google", channel: "search", country: "TR", country_name: "Türkiye", city: "Istanbul", device: "mobile", browser: "Chrome", os: "Android", ...extra });
const events = [
    event("v1", at(10, 9), "page_view"),
    event("v1", at(10, 9), "section", { section: "home", value: 5000 }),
    event("v1", at(10, 9), "section", { section: "services", value: 12000 }),
    event("v1", at(10, 9), "click", { target: "whatsapp", section: "contact-cta" }),
    event("v1", at(10, 9), "scroll", { value: 80 }),
    event("v1", at(10, 9), "page_end", { value: 30000, section: "services" }),
    event("v2", at(11, 22), "page_view", { source: "ChatGPT", channel: "ai", country: "SA", device: "desktop" }),
    event("v2", at(11, 22), "section", { section: "home", value: 900 }),
    event("v2", at(11, 22), "page_end", { value: 4000, section: "home" }),
    event("v2", at(11, 22), "survey", { target: "shown" }),
    event("v2", at(11, 22), "survey", { target: "step", value: 1 }),
    event("v2", at(11, 22), "survey", { target: "dismissed", value: 1 }),
];
const leads = [{ ts: at(10, 10), purpose: "trial_survey", contact_type: "email", contact: "a@b.co", lang: "ar", form_source: "survey", consent: true, answers: { specialty: "طب الأسنان", wish: "أكثر" }, visitor: "v1", country: "TR" }];
const ranges = parseRange(new URLSearchParams("from=2026-10-10&to=2026-10-12"));
assert.equal(ranges.range.from, "2026-10-09T21:00:00.000Z", "days start at Istanbul midnight");
assert.equal(ranges.previousRange.from, "2026-10-06T21:00:00.000Z");
assert.equal(parseRange(new URLSearchParams("from=2020-01-01&to=2026-01-01")), null, "at most 400 days");

const report = buildReport({ ...ranges, events, leads, previousEvents: [event("v0", at(8, 9), "page_view")], adminLog: [{ ts: at(11, 8), action: "texts", summary: "تعديل" }], articles: [{ slug: "x", title: "x", date: "2026-10-11" }] });
assert.equal(report.summary.visitors, 2);
assert.equal(report.previous.visitors, 1);
assert.equal(report.summary.leads, 1);
assert.equal(report.summary.conversionRate, 50);
assert.equal(report.summary.avgSeconds, 17);
assert.equal(report.summary.engagedRate, 50);
assert.deepEqual(report.daily.map((day) => [day.date, day.visitors, day.leads]), [["2026-10-10", 1, 1], ["2026-10-11", 0, 0], ["2026-10-12", 1, 0]], "22:00 UTC is the next day in Istanbul");
assert.deepEqual(report.sections.find((section) => section.id === "services"), { id: "services", exits: 1, visitors: 1, reach: 50, avgSeconds: 12 });
assert.equal(report.sections.find((section) => section.id === "home").visitors, 1, "under one second does not count as seen");
assert.equal(report.sections.find((section) => section.id === "home").exits, 1);
assert.equal(report.sources.find((row) => row.source === "Google").leads, 1);
assert.equal(report.sources.find((row) => row.source === "Google").leadsPer100, 100, "leads per 100 visitors of a source");
assert.equal(report.clicks[0].target, "whatsapp");
assert.deepEqual(report.survey, { shown: 1, dismissed: 1, completed: 0, completionRate: 0, steps: [{ step: 0, visitors: 0 }, { step: 1, visitors: 1 }], answers: { specialty: { "طب الأسنان": 1 } }, wishes: ["أكثر"] });
assert.equal(report.leads[0].contact, "a@b.co");
assert.equal(report.leads[0].source, "Google");
assert.equal(report.hours[12].visitors, 1, "09:00 UTC is 12:00 in Istanbul");

const filtered = buildReport({ ...ranges, events, leads, filters: { channel: "ai" } });
assert.equal(filtered.summary.visitors, 1);
assert.equal(filtered.summary.leads, 0, "leads follow the visitor filter");
const forSerena = buildReport({ ...ranges, events, leads, compact: true });
assert.ok(!JSON.stringify(forSerena).includes("a@b.co"), "Serena never sees contact details");
assert.equal(forSerena.journeys.length, 2);
assert.deepEqual(forSerena.journeys[0].sections, ["home", "services"]);
assert.equal(forSerena.journeys[0].lead, true);

// ---- Reports function ----------------------------------------------------------------------
assert.equal((await adminReports(new Request("https://clinova.test/.netlify/functions/admin-reports"))).status, 401);
const today = new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10);
const response = await adminReports(new Request(`https://clinova.test/.netlify/functions/admin-reports?from=${today}&to=${today}&country=SA`, { headers: admin }));
assert.equal(response.status, 200);
const live = (await response.json()).report;
assert.equal(live.summary.visitors, 1);
assert.equal(live.summary.leads, 1);
assert.equal(live.clicks[0].target, "whatsapp");
assert.equal(live.articles[0].slug, "dental-clinic-marketing");
assert.equal(live.changes.length, 1);
assert.equal((await adminReports(new Request("https://clinova.test/.netlify/functions/admin-reports?from=2020-01-01&to=2026-01-01", { headers: admin }))).status, 400);

// ---- Connection status ---------------------------------------------------------------------
const adminHealth = (await import("../netlify/functions/admin-health.mjs")).default;
assert.equal((await adminHealth(new Request("https://clinova.test/.netlify/functions/admin-health"))).status, 401);
const health = Object.fromEntries((await (await adminHealth(new Request("https://clinova.test/.netlify/functions/admin-health", { headers: admin }))).json()).checks.map((item) => [item.id, item]));
assert.equal(health.password.ok, true);
assert.equal(health.github.ok, true, "GitHub answers with the content file");
assert.equal(health.supabase.ok, true, "all three tables can be read");
assert.equal(health.gemini.ok, false);
assert.match(health.gemini.detail, /GEMINI_API_KEY/);
assert.equal(health.sheets.ok, true, "the Apps Script health check answers");
assert.equal(health.cloudinary.ok, false);
assert.equal(health.cloudinary.optional, true, "video upload is optional");

// A token that can read but not write shows up in the status card, and saving explains why.
const withWrite = globalThis.fetch;
globalThis.fetch = async (input, init = {}) => String(input).endsWith("/git/blobs") || (String(input).includes("api.github.com") && init.method === "PUT")
    ? Response.json({ message: "Resource not accessible by personal access token" }, { status: 403 })
    : withWrite(input, init);
const readOnly = Object.fromEntries((await (await adminHealth(new Request("https://clinova.test/.netlify/functions/admin-health", { headers: admin }))).json()).checks.map((item) => [item.id, item]));
assert.equal(readOnly.github.ok, false);
assert.match(readOnly.github.detail, /can read but not write/);
const { storageError } = await import("../netlify/lib/admin.mjs");
assert.equal(storageError(new Error("github_write_403")), "github_no_write");
assert.equal(storageError(new Error("github_write_401")), "github_token_invalid");
assert.equal(storageError(new Error("timeout")), "storage_failed");
globalThis.fetch = withWrite;

// A forgotten tab (hours on one section) counts as 30 minutes, and "/ar/" is "/ar".
assert.equal(tidy({ type: "section", value: 3_941_000, path: "/ar/" }).value, 1_800_000);
assert.equal(tidy({ type: "page_end", value: 3_941_000, path: "/ar/" }).path, "/ar");
assert.equal(tidy({ type: "scroll", value: 100, path: "/" }).path, "/", "the root keeps its slash");

// Demo mode: made-up data, the same on every call, without touching the database.
const realFetch = globalThis.fetch;
globalThis.fetch = (input, init) => { assert.notEqual(new URL(String(input.url ?? input)).hostname, "mock.supabase.co", "demo mode never reads the database"); return realFetch(input, init); };
const monthAgo = new Date(Date.now() + 3 * 3600_000 - 29 * 86_400_000).toISOString().slice(0, 10);
const demoUrl = `https://clinova.test/.netlify/functions/admin-reports?from=${monthAgo}&to=${today}&demo=1`;
const demo = (await (await adminReports(new Request(demoUrl, { headers: admin }))).json()).report;
assert.equal(demo.demo, true);
assert.ok(demo.summary.visitors > 300 && demo.summary.leads > 10, "a month of demo data has visitors and leads");
const instagram = demo.campaigns.find((row) => row.campaign === "insta_oct");
assert.ok(instagram && instagram.quickExitRate > 50 && instagram.leadsPer100 < 3, "the demo Instagram campaign brings quick exits and few leads");
assert.ok(demo.changes.some((change) => change.action === "texts"), "and a text edit");
assert.deepEqual((await (await adminReports(new Request(demoUrl, { headers: admin }))).json()).report.summary, demo.summary, "demo data is the same on every call");
globalThis.fetch = realFetch;

console.log("Analytics collection, lead copies, change log, report numbers, filters, demo data and the reports function passed (mock Supabase)");
