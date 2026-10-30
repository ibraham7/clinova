// Google Ads tag (gtag.js): lets Google Ads measure visits that come from the ads and report/optimise the campaigns.
// The ID (AW-…) is public by nature: it appears in every page's source. VITE_GOOGLE_ADS_ID in Netlify replaces it and
// "off" turns the tag off. It runs only where the site's own statistics run (see visitorTrackingAllowed in ./allowed):
// never in /admin, the text editor, team browsers or for Global Privacy Control, and only after the visitor accepts cookies.
import { visitorTrackingAllowed } from "./allowed";
import { adConsentGiven } from "./consent";

declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } }

const tagId = (typeof __GOOGLE_ADS_ID__ !== "undefined" ? __GOOGLE_ADS_ID__ : "").trim();
let active = false;

export function startGoogleTag() {
    if (active || typeof window === "undefined" || !/^AW-\d{6,20}$/.test(tagId) || !visitorTrackingAllowed() || !adConsentGiven()) return;
    active = true;
    window.dataLayer = window.dataLayer || [];
    // Google's standard snippet pushes the `arguments` object itself, not an array.
    window.gtag = function () { window.dataLayer!.push(arguments); };
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
    document.head.appendChild(script);
    // The visitor has accepted (the tag never loads otherwise): tell Google so, for its consent-aware features.
    window.gtag("consent", "default", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", tagId);
}
