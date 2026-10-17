// Turns raw events, leads and the admin change log into the numbers shown on the admin reports page
// (and read by Serena). Pure functions: no network, easy to test with scripts/verify-reports.mjs.

// Days and hours are counted in Istanbul time (UTC+3 all year), where the team works.
const offsetMs = 3 * 3600 * 1000;
export const localDate = (ts) => new Date(Date.parse(ts) + offsetMs).toISOString().slice(0, 10);
const localHour = (ts) => new Date(Date.parse(ts) + offsetMs).getUTCHours();

const top = (map, limit, sortKey = "visitors") => [...map.values()].sort((a, b) => b[sortKey] - a[sortKey]).slice(0, limit);
const round = (value, digits = 1) => Math.round(value * 10 ** digits) / 10 ** digits;
const share = (part, whole) => whole ? round((part / whole) * 100) : 0;

function bump(map, key, init, visitor, extra) {
    if (key === null || key === undefined || key === "") return;
    let row = map.get(key);
    if (!row) { row = { ...init, visitors: 0, count: 0, _seen: new Set() }; map.set(key, row); }
    row.count += 1;
    if (!row._seen.has(visitor)) { row._seen.add(visitor); row.visitors += 1; }
    if (extra) extra(row);
}
const clean = (rows) => rows.map(({ _seen, ...row }) => row);

/** One profile per visitor, taken from the first page view: where they came from and what they used. */
// Rows saved before the caps existed: section and page times over 30 minutes count as 30 (a forgotten tab), and "/ar/" is "/ar".
const maxTimeMs = 30 * 60_000;
export function tidy(event) {
    const value = (event.type === "section" || event.type === "page_end") && event.value > maxTimeMs ? maxTimeMs : event.value;
    const path = typeof event.path === "string" ? event.path.replace(/(.)\/+$/, "$1") : event.path;
    return value === event.value && path === event.path ? event : { ...event, value, path };
}

export function visitorProfiles(events) {
    const profiles = new Map();
    for (const event of events) {
        let profile = profiles.get(event.visitor);
        if (!profile) {
            profile = { visitor: event.visitor, first: event.ts, last: event.ts, pages: 0, ms: 0, scroll: 0, clicks: 0, sections: [], clicked: [], paths: [], exit: null };
            profiles.set(event.visitor, profile);
        }
        profile.last = event.ts;
        if (event.type === "page_view") {
            profile.pages += 1;
            if (!profile.source) Object.assign(profile, {
                source: event.source ?? "Direct", channel: event.channel ?? "direct", country: event.country, country_name: event.country_name, city: event.city,
                device: event.device, browser: event.browser, os: event.os, lang: event.lang, landing: event.path, campaign: event.utm_campaign,
            });
            if (profile.paths.at(-1) !== event.path) profile.paths.push(event.path);
        } else if (event.type === "page_end") {
            profile.ms += event.value ?? 0;
            if (event.section) profile.exit = event.section;
        } else if (event.type === "scroll") {
            profile.scroll = Math.max(profile.scroll, event.value ?? 0);
        } else if (event.type === "section" && (event.value ?? 0) >= 1000 && !profile.sections.includes(event.section)) {
            profile.sections.push(event.section);
        } else if (event.type === "click") {
            profile.clicks += 1;
            if (profile.clicked.length < 15) profile.clicked.push(event.target);
        }
    }
    // A visitor seen only through late events (page view outside the range) still needs a source.
    for (const profile of profiles.values()) {
        profile.source ??= "Direct";
        profile.channel ??= "direct";
    }
    return profiles;
}

const filterKeys = ["country", "device", "lang", "source", "channel", "path"];
export function matches(profile, filters) {
    return filterKeys.every((key) => {
        const wanted = filters[key];
        if (!wanted) return true;
        if (key === "path") return profile.paths.some((path) => path.startsWith(wanted));
        return profile[key] === wanted;
    });
}

function kpis(events, leads, filters) {
    const profiles = visitorProfiles(events);
    const kept = new Set([...profiles.values()].filter((profile) => matches(profile, filters)).map((profile) => profile.visitor));
    const mine = events.filter((event) => kept.has(event.visitor));
    const myLeads = leads.filter((lead) => leadMatches(lead, kept, filters));
    const visitors = kept.size;
    const list = [...profiles.values()].filter((profile) => kept.has(profile.visitor));
    const engaged = list.filter((profile) => profile.ms >= 10_000 || profile.clicks > 0).length;
    return {
        profiles, kept, events: mine, leads: myLeads,
        summary: {
            visitors,
            pageViews: mine.filter((event) => event.type === "page_view").length,
            avgSeconds: visitors ? round(list.reduce((sum, profile) => sum + profile.ms, 0) / visitors / 1000) : 0,
            avgScroll: visitors ? round(list.reduce((sum, profile) => sum + profile.scroll, 0) / visitors) : 0,
            engagedRate: share(engaged, visitors),
            leads: myLeads.length,
            surveyLeads: myLeads.filter((lead) => lead.purpose === "trial_survey").length,
            profileLeads: myLeads.filter((lead) => lead.purpose === "company_profile_download").length,
            conversionRate: share(myLeads.length, visitors),
        },
    };
}

// Leads carry the same daily visitor id; leads from before analytics existed match on country only.
function leadMatches(lead, kept, filters) {
    if (lead.visitor && kept.has(lead.visitor)) return true;
    const visitorFilters = filterKeys.filter((key) => key !== "country" && filters[key]);
    if (visitorFilters.length) return false;
    return !filters.country || lead.country === filters.country;
}

/**
 * @param {object} input
 * @param {{from: string, to: string}} input.range ISO times, `to` exclusive
 * @param {object} input.filters country, device, lang, source, channel, path
 * @param {boolean} input.compact for Serena: no contact details and no raw event list
 */
export function buildReport({ range, previousRange, events: rawEvents, previousEvents: rawPrevious = [], leads, previousLeads = [], adminLog = [], articles = [], filters = {}, compact = false, truncated = false }) {
    const events = rawEvents.map(tidy);
    const previousEvents = rawPrevious.map(tidy);
    const now = kpis(events, leads, filters);
    const before = kpis(previousEvents, previousLeads, filters);
    const { profiles, kept } = now;
    const visible = [...profiles.values()].filter((profile) => kept.has(profile.visitor));

    // Day by day.
    const days = new Map();
    for (let day = Date.parse(`${localDate(range.from)}T00:00:00Z`); day < Date.parse(range.to) + offsetMs; day += 86_400_000) {
        const date = new Date(day).toISOString().slice(0, 10);
        days.set(date, { date, visitors: 0, pageViews: 0, leads: 0, _seen: new Set() });
    }
    for (const event of now.events) {
        const row = days.get(localDate(event.ts));
        if (!row) continue;
        if (event.type === "page_view") row.pageViews += 1;
        if (!row._seen.has(event.visitor)) { row._seen.add(event.visitor); row.visitors += 1; }
    }
    for (const lead of now.leads) { const row = days.get(localDate(lead.ts)); if (row) row.leads += 1; }

    // Sections: how many visitors saw each one for at least a second, how long they stayed, and where they left.
    const sections = new Map();
    for (const event of now.events) {
        if (event.type === "section" && event.section && (event.value ?? 0) >= 1000) {
            bump(sections, event.section, { id: event.section, totalMs: 0, exits: 0 }, event.visitor, (row) => { row.totalMs += event.value; });
        }
    }
    for (const profile of visible) {
        if (profile.exit) {
            if (!sections.has(profile.exit)) sections.set(profile.exit, { id: profile.exit, totalMs: 0, exits: 0, visitors: 0, count: 0, _seen: new Set() });
            sections.get(profile.exit).exits += 1;
        }
    }
    const sectionRows = clean(top(sections, 30)).map(({ totalMs, count: _count, ...row }) => ({ ...row, reach: share(row.visitors, kept.size), avgSeconds: row.visitors ? round(totalMs / row.visitors / 1000) : 0 }));

    const by = (field, limit, label) => {
        const map = new Map();
        for (const profile of visible) bump(map, profile[field] ?? "unknown", { [label ?? field]: profile[field] ?? "unknown" }, profile.visitor);
        return clean(top(map, limit)).map(({ count: _count, ...row }) => ({ ...row, share: share(row.visitors, kept.size) }));
    };
    const leadVisitors = new Set(now.leads.map((lead) => lead.visitor).filter(Boolean));
    // Quality per group: leads, visible time and quick exits (under 10 s with no click).
    const quality = (profile) => (row) => {
        if (leadVisitors.has(profile.visitor)) row.leads += 1;
        row.totalMs += profile.ms;
        if (profile.ms < 10_000 && !profile.clicks) row.quick += 1;
    };
    const rates = ({ totalMs, quick, ...row }) => ({ ...row, leadsPer100: share(row.leads, row.visitors), avgSeconds: row.visitors ? round(totalMs / row.visitors / 1000) : 0, quickExitRate: share(quick, row.visitors) });
    const sources = new Map();
    for (const profile of visible) bump(sources, profile.source, { source: profile.source, channel: profile.channel, leads: 0, totalMs: 0, quick: 0 }, profile.visitor, quality(profile));

    const countries = new Map();
    for (const profile of visible) bump(countries, profile.country ?? "??", { code: profile.country ?? "??", name: profile.country_name ?? "unknown", leads: 0 }, profile.visitor, (row) => { if (leadVisitors.has(profile.visitor)) row.leads += 1; });
    const cities = new Map();
    for (const profile of visible) if (profile.city) bump(cities, `${profile.city}|${profile.country}`, { city: profile.city, country: profile.country }, profile.visitor);

    const pages = new Map();
    const clicks = new Map();
    const campaigns = new Map();
    const hours = Array.from({ length: 24 }, (_, hour) => ({ hour, visitors: 0, _seen: new Set() }));
    for (const event of now.events) {
        if (event.type === "page_view") {
            bump(pages, event.path, { path: event.path }, event.visitor);
            if (event.utm_campaign) bump(campaigns, event.utm_campaign, { campaign: event.utm_campaign, source: event.utm_source, medium: event.utm_medium }, event.visitor);
            const slot = hours[localHour(event.ts)];
            if (!slot._seen.has(event.visitor)) { slot._seen.add(event.visitor); slot.visitors += 1; }
        }
        if (event.type === "click" && event.target) bump(clicks, event.target, { target: event.target, section: event.section }, event.visitor);
    }
    for (const row of campaigns.values()) Object.assign(row, { leads: 0, totalMs: 0, quick: 0 });
    for (const profile of visible) if (profile.campaign && campaigns.has(profile.campaign)) quality(profile)(campaigns.get(profile.campaign));

    const scroll = [25, 50, 75, 100].map((depth) => ({ depth, visitors: visible.filter((profile) => profile.scroll >= depth).length }))
        .map((row) => ({ ...row, share: share(row.visitors, kept.size) }));

    // Survey funnel from page events, answers from saved leads.
    const surveyBy = (target) => new Set(now.events.filter((event) => event.type === "survey" && event.target === target).map((event) => event.visitor)).size;
    const stepReach = [];
    for (const event of now.events) if (event.type === "survey" && event.target === "step") (stepReach[event.value] ??= new Set()).add(event.visitor);
    const answers = {};
    const wishes = [];
    for (const lead of now.leads) {
        if (lead.purpose !== "trial_survey" || !lead.answers) continue;
        for (const [question, answer] of Object.entries(lead.answers)) {
            if (question === "wish") { if (answer) wishes.push(String(answer).slice(0, 500)); continue; }
            answers[question] ??= {};
            answers[question][answer] = (answers[question][answer] ?? 0) + 1;
        }
    }

    const articleRows = articles.map((article) => ({
        ...article,
        views: now.events.filter((event) => event.type === "page_view" && event.path?.includes(`/blog/${article.slug}`)).length,
        visitors: new Set(now.events.filter((event) => event.type === "page_view" && event.path?.includes(`/blog/${article.slug}`)).map((event) => event.visitor)).size,
    }));

    const profileOf = (visitor) => profiles.get(visitor);
    const report = {
        range, previousRange, filters, truncated, generatedAt: new Date().toISOString(),
        summary: now.summary, previous: before.summary,
        daily: [...days.values()].map(({ _seen, ...row }) => row),
        sections: sectionRows,
        pages: clean(top(pages, 25)).map(({ count, ...row }) => ({ ...row, views: count })),
        countries: clean(top(countries, 30)).map(({ count: _count, ...row }) => ({ ...row, share: share(row.visitors, kept.size) })),
        cities: clean(top(cities, 20)).map(({ count: _count, ...row }) => row),
        sources: clean(top(sources, 25)).map(({ count: _count, ...row }) => ({ ...rates(row), share: share(row.visitors, kept.size) })),
        channels: by("channel", 10),
        devices: by("device", 5),
        browsers: by("browser", 8),
        os: by("os", 8),
        languages: by("lang", 6),
        campaigns: clean(top(campaigns, 20)).map(({ count: _count, ...row }) => rates(row)),
        hours: hours.map(({ _seen, ...row }) => row),
        clicks: clean(top(clicks, 30, "count")),
        scroll,
        survey: {
            shown: surveyBy("shown"), dismissed: surveyBy("dismissed"), completed: surveyBy("completed"),
            completionRate: share(surveyBy("completed"), surveyBy("shown")),
            steps: Array.from(stepReach, (set, step) => ({ step, visitors: set?.size ?? 0 })),
            answers, wishes: wishes.slice(-50),
        },
        articles: articleRows,
        changes: adminLog.map(({ ts, action, summary }) => ({ ts, date: localDate(ts), action, summary })),
    };
    if (compact) {
        report.leadSummary = now.leads.map((lead) => ({ date: localDate(lead.ts), purpose: lead.purpose, type: lead.contact_type, lang: lead.lang, country: lead.country, form: lead.form_source, source: profileOf(lead.visitor)?.source ?? "unknown" }));
        report.journeys = visible.slice(-30).map((profile) => ({
            date: localDate(profile.first), source: profile.source, country: profile.country, device: profile.device, lang: profile.lang, seconds: round(profile.ms / 1000, 0),
            scroll: profile.scroll, pages: profile.paths, sections: profile.sections, clicks: profile.clicked, exit: profile.exit, lead: leadVisitors.has(profile.visitor),
        }));
    } else {
        report.leads = now.leads.slice().reverse().map((lead) => ({
            ts: lead.ts, purpose: lead.purpose, contactType: lead.contact_type, contact: lead.contact, phoneCountry: lead.phone_country, lang: lead.lang,
            form: lead.form_source, consent: lead.consent, answers: lead.answers, country: lead.country, city: lead.city, source: profileOf(lead.visitor)?.source ?? null,
        }));
        report.recent = now.events.slice(-150).reverse().map((event) => ({
            ts: event.ts, type: event.type, path: event.path, section: event.section, target: event.target, value: event.value,
            country: event.country, city: event.city, device: event.device, source: event.source,
        }));
    }
    return report;
}

/** Parses ?from=YYYY-MM-DD&to=YYYY-MM-DD (inclusive local days) into ISO ranges, defaulting to the last 30 days. */
export function parseRange(params, today = localDate(new Date().toISOString())) {
    const valid = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") && !Number.isNaN(Date.parse(value));
    const toDay = valid(params.get("to")) ? params.get("to") : today;
    const fromDay = valid(params.get("from")) ? params.get("from") : new Date(Date.parse(toDay) - 29 * 86_400_000).toISOString().slice(0, 10);
    const start = Date.parse(`${fromDay}T00:00:00Z`) - offsetMs;
    const end = Date.parse(`${toDay}T00:00:00Z`) + 86_400_000 - offsetMs;
    if (end <= start || end - start > 400 * 86_400_000) return null;
    const length = end - start;
    return {
        range: { from: new Date(start).toISOString(), to: new Date(end).toISOString(), fromDay, toDay },
        previousRange: { from: new Date(start - length).toISOString(), to: new Date(start).toISOString() },
    };
}

export function parseFilters(params) {
    const filters = {};
    for (const key of filterKeys) {
        const value = params.get(key);
        if (value && value.length <= 80) filters[key] = value;
    }
    return filters;
}
