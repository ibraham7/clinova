import { analyticsReady, classifySource, clip, geo, isBot, parseAgent, tryInsert, visitorId } from "../lib/analytics.mjs";

// Receives batches of anonymous page events from src/analytics/track.ts (sent with navigator.sendBeacon).
// Body: { page, path, lang, referrer, utm: { source, medium, campaign }, screen, events: [{ type, section, target, value }] }
// section: ms a section was on screen; scroll: deepest scroll percent; page_end: visible ms on the page and the last section seen.
const types = new Set(["page_view", "section", "scroll", "page_end", "click", "survey"]);
const ok = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

export default async function handler(request, context) {
    if (request.method !== "POST") return new Response(null, { status: 405 });
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
    const userAgent = request.headers.get("user-agent") ?? "";
    // Bots and unconfigured storage get a silent success, so the page never retries.
    if (isBot(userAgent) || !analyticsReady()) return ok();
    let body;
    try {
        const text = await request.text();
        if (text.length > 16_000) return new Response(null, { status: 413 });
        body = JSON.parse(text);
    } catch { return new Response(null, { status: 400 }); }
    if (!/^[a-z0-9]{8,32}$/.test(body?.page ?? "") || !Array.isArray(body.events) || !body.events.length || body.events.length > 60) return new Response(null, { status: 400 });
    const path = clip(body.path, 200);
    if (!path?.startsWith("/") || path.startsWith("/admin")) return ok();

    let referrer = null;
    try { if (body.referrer) referrer = new URL(body.referrer).hostname.slice(0, 120); } catch { /* Not a URL. */ }
    if (referrer === new URL(request.url).hostname) referrer = null;
    const utm = { utm_source: clip(body.utm?.source, 60), utm_medium: clip(body.utm?.medium, 60), utm_campaign: clip(body.utm?.campaign, 80) };
    const shared = {
        visitor: visitorId(request, context), page: body.page, path, lang: ["ar", "en", "tr", "fr"].includes(body.lang) ? body.lang : null,
        referrer, ...classifySource(referrer, utm), ...utm, ...parseAgent(userAgent),
        screen: Number.isInteger(body.screen) && body.screen > 0 && body.screen < 10_000 ? body.screen : null, ...geo(context),
    };
    const rows = body.events.filter((event) => types.has(event?.type)).map((event) => ({
        ...shared, type: event.type, section: clip(event.section, 60), target: clip(event.target, 120),
        value: Number.isFinite(event.value) ? Math.max(0, Math.min(Math.round(event.value), 86_400_000)) : null,
    }));
    await tryInsert("events", rows);
    return ok();
}
