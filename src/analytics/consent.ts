// The visitor's choice about ad and session-recording tools (Meta Pixel, Google Ads tag, Microsoft Clarity).
// Nothing from these tools loads until the visitor accepts in the cookie banner; the site's own anonymous statistics
// (./track, no cookies) are not affected. The choice is kept in this browser only.
const storageKey = "clinova.consent";
const eventName = "clinova:consent";

export type Consent = "granted" | "denied";

export function savedConsent(): Consent | null {
    try {
        const value = localStorage.getItem(storageKey);
        return value === "granted" || value === "denied" ? value : null;
    } catch {
        return null;
    }
}

export function adConsentGiven() {
    return typeof window !== "undefined" && savedConsent() === "granted";
}

// Cookies the three tools set (Meta Pixel, Google Ads / Analytics, Microsoft Clarity). Prefixes end with "*".
const trackingCookies = ["_fbp", "_fbc", "_ga", "_ga_*", "_gcl_*", "_gac_*", "_gid", "_clck", "_clsk", "CLID", "SM", "MR", "ANONCHK", "MUID"];

/** Deletes the tracking cookies on this host and on every parent domain (clinova.novanoai.online, novanoai.online). */
export function clearTrackingCookies() {
    const names = document.cookie.split(";").map((part) => part.split("=")[0]?.trim() ?? "").filter(Boolean);
    const matches = (name: string) => trackingCookies.some((cookie) => (cookie.endsWith("*") ? name.startsWith(cookie.slice(0, -1)) : name === cookie));
    const parts = window.location.hostname.split(".");
    const domains = [undefined, ...parts.map((_, i) => parts.slice(i).join(".")).filter((domain) => domain.includes("."))];
    for (const name of names.filter(matches)) {
        for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
}

/** Tells the tools that are already running to stop collecting, before the page reloads without them. */
function stopTools() {
    try { window.clarity?.("stop"); } catch { /* Clarity not loaded. */ }
    try { window.fbq?.("consent", "revoke"); } catch { /* Pixel not loaded. */ }
}

/**
 * Stores the visitor's choice. Withdrawing a consent that was given earlier also deletes the tracking cookies and
 * reloads the page: the tools that already loaded keep running until then, so only a reload really stops them.
 */
export function setConsent(value: Consent) {
    const before = savedConsent();
    try { localStorage.setItem(storageKey, value); } catch { /* Storage blocked: the choice lasts for this page only. */ }
    if (value === "denied" && before === "granted") { stopTools(); clearTrackingCookies(); window.location.reload(); return; }
    window.dispatchEvent(new CustomEvent(eventName, { detail: value }));
}

/** Runs `start` now if the visitor already accepted, otherwise as soon as they do. */
export function whenConsented(start: () => void) {
    if (adConsentGiven()) { start(); return; }
    window.addEventListener(eventName, (event) => { if ((event as CustomEvent<Consent>).detail === "granted") start(); });
}
