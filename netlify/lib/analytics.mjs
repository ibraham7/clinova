// Visitor analytics storage (Supabase) shared by the collect, profile-lead, admin and reports functions.
// No cookies and no stored IP: a visitor is a keyed hash of IP + browser that changes every day.
import crypto from "node:crypto";

export const analyticsReady = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

function supabase(path, init = {}) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    return fetch(`${process.env.SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/${path}`, {
        ...init,
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init.headers },
    });
}

export async function insertRows(table, rows) {
    if (!analyticsReady() || !rows.length) return false;
    const conflict = table === "leads" ? "?on_conflict=request_id" : "";
    const response = await supabase(table + conflict, { method: "POST", headers: { Prefer: "return=minimal,resolution=ignore-duplicates" }, body: JSON.stringify(rows) });
    if (!response.ok) throw new Error(`supabase_insert_${response.status}`);
    return true;
}

/** Best effort: analytics must never break the request that triggered it. */
export async function tryInsert(table, rows) {
    try { return await insertRows(table, rows); } catch { return false; }
}

/** Reads every row of a table between two ISO times, newest last, in pages. */
export async function selectRange(table, columns, from, to, max = 200_000) {
    if (!analyticsReady()) return [];
    const rows = [];
    const query = `${table}?select=${columns}&ts=gte.${encodeURIComponent(from)}&ts=lt.${encodeURIComponent(to)}&order=ts.asc,id.asc`;
    for (let offset = 0; offset < max; offset += 10_000) {
        const response = await supabase(query, { headers: { Range: `${offset}-${offset + 9_999}`, "Range-Unit": "items" } });
        if (!response.ok && response.status !== 416) throw new Error(`supabase_read_${response.status}`);
        const page = response.status === 416 ? [] : await response.json();
        rows.push(...page);
        if (page.length < 10_000) break;
    }
    return rows;
}

// ---- Visitor -------------------------------------------------------------------------------

export function clientIp(request, context) {
    return context?.ip || request.headers.get("x-nf-client-connection-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
}

/** Same id for the same browser on the same day, impossible to turn back into an IP. */
export function visitorId(request, context, day = new Date().toISOString().slice(0, 10)) {
    const salt = process.env.ANALYTICS_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "clinova";
    return crypto.createHmac("sha256", `${salt}:${day}`).update(`${clientIp(request, context)}|${request.headers.get("user-agent") ?? ""}`).digest("hex").slice(0, 20);
}

export function geo(context) {
    const g = context?.geo ?? {};
    return {
        country: /^[A-Z]{2}$/.test(g.country?.code ?? "") ? g.country.code : null,
        country_name: clip(g.country?.name, 60),
        region: clip(g.subdivision?.name, 60),
        city: clip(g.city, 60),
        timezone: clip(g.timezone, 60),
    };
}

export const clip = (value, max) => typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

const botPattern = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|facebookexternalhit|whatsapp|telegram|curl|wget|python|axios|node-fetch|go-http/i;
export const isBot = (userAgent) => !userAgent || botPattern.test(userAgent);

export function parseAgent(userAgent = "") {
    const device = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(userAgent) ? "tablet" : /Mobi|iPhone|Android/i.test(userAgent) ? "mobile" : "desktop";
    const browser = /Edg\//.test(userAgent) ? "Edge" : /OPR\/|Opera/.test(userAgent) ? "Opera" : /SamsungBrowser/.test(userAgent) ? "Samsung Internet"
        : /Firefox\//.test(userAgent) ? "Firefox" : /Chrome\/|CriOS/.test(userAgent) ? "Chrome" : /Safari\//.test(userAgent) ? "Safari" : "Other";
    const os = /Windows/.test(userAgent) ? "Windows" : /iPhone|iPad|iPod/.test(userAgent) ? "iOS" : /Android/.test(userAgent) ? "Android"
        : /Mac OS X|Macintosh/.test(userAgent) ? "macOS" : /Linux/.test(userAgent) ? "Linux" : "Other";
    return { device, browser, os };
}

// ---- Traffic source ------------------------------------------------------------------------

const sources = [
    [/(^|\.)gemini\.google\.com$/, "Gemini", "ai"],
    [/(^|\.)google\./, "Google", "search"], [/(^|\.)bing\.com$/, "Bing", "search"], [/(^|\.)yandex\./, "Yandex", "search"],
    [/(^|\.)duckduckgo\.com$/, "DuckDuckGo", "search"], [/(^|\.)yahoo\./, "Yahoo", "search"], [/(^|\.)ecosia\.org$/, "Ecosia", "search"],
    [/(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com)$/, "ChatGPT", "ai"], [/(^|\.)perplexity\.ai$/, "Perplexity", "ai"],
    [/(^|\.)claude\.ai$/, "Claude", "ai"], [/(^|\.)copilot\.microsoft\.com$/, "Copilot", "ai"],
    [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "Facebook", "social"], [/(^|\.)instagram\.com$/, "Instagram", "social"],
    [/(^|\.)linkedin\.com$|^lnkd\.in$/, "LinkedIn", "social"], [/(^|\.)(x\.com|twitter\.com|t\.co)$/, "X", "social"],
    [/(^|\.)(youtube\.com|youtu\.be)$/, "YouTube", "social"], [/(^|\.)tiktok\.com$/, "TikTok", "social"],
    [/(^|\.)(whatsapp\.com|wa\.me)$/, "WhatsApp", "social"], [/(^|\.)(t\.me|telegram\.org)$/, "Telegram", "social"],
    [/(^|\.)snapchat\.com$/, "Snapchat", "social"], [/(^|\.)reddit\.com$/, "Reddit", "social"],
    [/mail\.|outlook\.|gmail\./, "Email", "email"],
];

/** The first matching host wins, so Gemini (under google.com) is listed before Google. */
export function classifySource(referrerHost, utm = {}) {
    if (utm.utm_source) {
        const known = classifySource(utm.utm_source.toLowerCase().includes(".") ? utm.utm_source.toLowerCase() : `${utm.utm_source.toLowerCase()}.com`);
        const paid = /cpc|ppc|paid|ads?$/i.test(utm.utm_medium ?? "");
        return { source: known.channel === "referral" ? utm.utm_source.slice(0, 40) : known.source, channel: paid ? "campaign" : known.channel === "referral" ? "campaign" : known.channel };
    }
    if (!referrerHost) return { source: "Direct", channel: "direct" };
    const host = referrerHost.toLowerCase().replace(/^www\./, "");
    for (const [pattern, source, channel] of sources) if (pattern.test(host)) return { source, channel };
    return { source: host.slice(0, 60), channel: "referral" };
}

// ---- Admin change log ----------------------------------------------------------------------

/** One line per kind of change between two saved versions of site-content.json. */
export function describeChanges(before, after) {
    const entries = [];
    const changedTexts = [];
    for (const lang of ["ar", "en", "tr", "fr"]) {
        const a = before?.texts?.[lang] ?? {};
        const b = after?.texts?.[lang] ?? {};
        for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) if (a[key] !== b[key]) changedTexts.push({ lang, key: key.slice(0, 120), to: (b[key] ?? "").slice(0, 300) });
    }
    if (changedTexts.length) entries.push({ action: "texts", summary: `تعديل ${changedTexts.length} نص: ${[...new Set(changedTexts.map((change) => change.key.slice(0, 40)))].slice(0, 3).join(" | ")}`, details: { changes: changedTexts.slice(0, 50) } });
    for (const kind of ["videos", "logos"]) {
        const a = new Map((before?.[kind] ?? []).map((item) => [item.id, item]));
        const b = new Map((after?.[kind] ?? []).map((item) => [item.id, item]));
        const added = [...b.keys()].filter((id) => !a.has(id)).map((id) => b.get(id).name);
        const removed = [...a.keys()].filter((id) => !b.has(id)).map((id) => a.get(id).name);
        const edited = [...b.keys()].filter((id) => a.has(id) && JSON.stringify(a.get(id)) !== JSON.stringify(b.get(id))).map((id) => b.get(id).name);
        const moved = !added.length && !removed.length && !edited.length && [...a.keys()].join() !== [...b.keys()].join();
        const label = kind === "videos" ? "فيديو" : "شعار";
        const parts = [added.length && `إضافة ${label}: ${added.join("، ")}`, removed.length && `حذف ${label}: ${removed.join("، ")}`, edited.length && `تعديل ${label}: ${edited.join("، ")}`, moved && `إعادة ترتيب ${kind === "videos" ? "الفيديوهات" : "الشعارات"}`].filter(Boolean);
        if (parts.length) entries.push({ action: kind, summary: parts.join(" — ").slice(0, 500), details: { added, removed, edited } });
    }
    return entries;
}
