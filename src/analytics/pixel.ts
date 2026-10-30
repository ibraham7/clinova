// Meta (Facebook / Instagram) Pixel for ad campaigns: measures page views, contacts and leads so Meta can
// optimise and report the ads. The pixel ID comes from the Netlify environment variable VITE_META_PIXEL_ID
// (read at build time); without it nothing loads. It runs only where the site's own statistics run (see
// visitorTrackingAllowed in ./allowed): never in /admin, the text editor, team browsers or for Global Privacy Control,
// and only after the visitor accepts cookies (./consent).
import { visitorTrackingAllowed } from "./allowed";
import { adConsentGiven } from "./consent";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: unknown };
declare global { interface Window { fbq?: Fbq; _fbq?: Fbq } }

const pixelId = (typeof __META_PIXEL_ID__ !== "undefined" ? __META_PIXEL_ID__ : "").trim();
let active = false;

export function startPixel() {
    if (active || typeof window === "undefined" || !/^\d{6,20}$/.test(pixelId) || !visitorTrackingAllowed() || !adConsentGiven()) return;
    active = true;
    // Meta's standard loader: queue calls until fbevents.js arrives.
    const fbq = function (...args: unknown[]) { if (fbq.callMethod) fbq.callMethod(...args); else fbq.queue.push(args); } as Fbq;
    fbq.push = fbq; fbq.loaded = true; fbq.version = "2.0"; fbq.queue = [];
    window.fbq = window._fbq = fbq;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    fbq("init", pixelId);
    fbq("track", "PageView");
}

/** A standard Meta event (Lead, Contact…); does nothing when the pixel is off. */
export function pixelEvent(name: "Lead" | "Contact" | "ViewContent", params?: Record<string, string | number>) {
    if (active) window.fbq?.("track", name, params ?? {});
}
