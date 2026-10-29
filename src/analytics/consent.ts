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

export function setConsent(value: Consent) {
    try { localStorage.setItem(storageKey, value); } catch { /* Storage blocked: the choice lasts for this page only. */ }
    window.dispatchEvent(new CustomEvent(eventName, { detail: value }));
}

/** Runs `start` now if the visitor already accepted, otherwise as soon as they do. */
export function whenConsented(start: () => void) {
    if (adConsentGiven()) { start(); return; }
    window.addEventListener(eventName, (event) => { if ((event as CustomEvent<Consent>).detail === "granted") start(); });
}
