// Anonymous visitor analytics for the admin reports page. No cookies and no browser storage:
// the server recognises a visit by a hash of IP + browser that changes daily and never stores the IP.
// Collected: page views, how long each section was on screen, scroll depth, clicks on links and
// buttons (their label, never anything typed), and survey progress. Never runs in /admin or ?edit.

type TrackEvent = { type: "page_view" | "section" | "scroll" | "page_end" | "click" | "survey"; section?: string; target?: string; value?: number };

const endpoint = "/.netlify/functions/collect";
const queue: TrackEvent[] = [];
let page = "";
let started = false;
let visibleSince = 0;
let visibleMs = 0;
let maxScroll = 0;
let reportedScroll = 0;
let lastSection: string | undefined;
// True while the tab is hidden: section and page time stop counting.
let paused = false;
const sectionVisibleSince = new Map<string, number>();
const sectionMs = new Map<string, number>();

const enabled = () => typeof window !== "undefined" && started;

function context() {
    const params = new URLSearchParams(window.location.search);
    return {
        page, path: window.location.pathname, lang: document.documentElement.lang, screen: window.screen?.width,
        referrer: document.referrer || undefined,
        utm: { source: params.get("utm_source") ?? undefined, medium: params.get("utm_medium") ?? undefined, campaign: params.get("utm_campaign") ?? undefined },
    };
}

function flush(final = false) {
    if (!queue.length) return;
    const body = JSON.stringify({ ...context(), events: queue.splice(0, 60) });
    try {
        const sent = navigator.sendBeacon?.(endpoint, new Blob([body], { type: "application/json" }));
        if (!sent) void fetch(endpoint, { method: "POST", body, keepalive: true, credentials: "omit", headers: { "Content-Type": "application/json" } }).catch(() => undefined);
    } catch { /* Analytics never disturbs the visitor. */ }
    if (queue.length && !final) flush();
}

/** Records one event; used by components (the survey popup) and by the listeners below. */
export function track(event: TrackEvent) {
    if (!enabled()) return;
    queue.push(event);
    if (queue.length >= 40) flush();
}

function closeSections(now: number) {
    if (paused) return;
    for (const [id, since] of sectionVisibleSince) {
        sectionMs.set(id, (sectionMs.get(id) ?? 0) + now - since);
        sectionVisibleSince.set(id, now);
    }
}

// On leaving (or hiding) the page: section times, deepest scroll and total visible time.
function report() {
    const now = performance.now();
    closeSections(now);
    if (visibleSince) { visibleMs += now - visibleSince; visibleSince = 0; }
    for (const [section, ms] of sectionMs) if (ms >= 1000) queue.push({ type: "section", section, value: ms });
    sectionMs.clear();
    if (maxScroll > reportedScroll) { queue.push({ type: "scroll", value: maxScroll }); reportedScroll = maxScroll; }
    if (visibleMs >= 500) queue.push({ type: "page_end", section: lastSection, value: visibleMs });
    visibleMs = 0;
    flush(true);
}

function label(element: Element) {
    const anchor = element.closest("a");
    const href = anchor?.getAttribute("href") ?? "";
    if (/wa\.me|whatsapp/i.test(href)) return "whatsapp";
    if (href.startsWith("tel:")) return "phone_call";
    if (href.startsWith("mailto:")) return "email_link";
    if (href.startsWith("#")) return `nav:${href.slice(1)}`;
    const tagged = element.closest("[data-track]")?.getAttribute("data-track");
    if (tagged) return tagged;
    if (anchor && href) {
        try {
            const url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) return `out:${url.hostname}`;
            if (/\.pdf$/i.test(url.pathname)) return `file:${url.pathname.split("/").pop()}`;
            return `link:${url.pathname}`;
        } catch { return "link"; }
    }
    const text = (element.closest("button,[role=button],[role=radio],[role=tab]")?.getAttribute("aria-label") ?? element.closest("button,[role=button],[role=tab]")?.textContent ?? "").trim().replace(/\s+/g, " ");
    return text ? `button:${text.slice(0, 60)}` : null;
}

export function startTracking() {
    if (started || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    // Not the admin, not the text editor, not automated browsers, and not visitors who opt out with Global Privacy Control.
    if (window.location.pathname.startsWith("/admin") || params.has("edit") || navigator.webdriver || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    started = true;
    page = Array.from(crypto.getRandomValues(new Uint8Array(8)), (byte) => byte.toString(16).padStart(2, "0")).join("");
    visibleSince = document.visibilityState === "visible" ? performance.now() : 0;
    track({ type: "page_view" });
    flush();

    const observer = new IntersectionObserver((entries) => {
        const now = performance.now();
        for (const entry of entries) {
            const id = (entry.target as HTMLElement).id;
            if (entry.isIntersecting) {
                if (!sectionVisibleSince.has(id) && document.visibilityState === "visible") sectionVisibleSince.set(id, now);
                lastSection = id;
            } else if (sectionVisibleSince.has(id)) {
                if (!paused) sectionMs.set(id, (sectionMs.get(id) ?? 0) + now - sectionVisibleSince.get(id)!);
                sectionVisibleSince.delete(id);
            }
        }
    }, { threshold: 0.35 });
    const observed = new WeakSet<Element>();
    const observeSections = () => document.querySelectorAll("section[id], article[id], main[id]").forEach((element) => {
        if (!observed.has(element)) { observed.add(element); observer.observe(element); }
    });
    observeSections();
    // Sections that appear later (client videos, lazy parts) are picked up too.
    new MutationObserver(observeSections).observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", () => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        if (height > 0) maxScroll = Math.max(maxScroll, Math.min(100, Math.round((window.scrollY / height) * 100)));
    }, { passive: true });

    document.addEventListener("click", (event) => {
        const element = event.target instanceof Element ? event.target : null;
        if (!element || element.closest("input, textarea, select, [data-clarity-mask]:not(button)")) return;
        const target = label(element);
        if (target) track({ type: "click", target, section: element.closest("section[id]")?.id ?? lastSection });
    }, { capture: true });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") { report(); paused = true; }
        else {
            paused = false;
            const now = performance.now();
            visibleSince = now;
            // Sections still on screen start counting again.
            for (const id of sectionVisibleSince.keys()) sectionVisibleSince.set(id, now);
        }
    });
    window.addEventListener("pagehide", report);
    window.setInterval(() => flush(), 15_000);
}
