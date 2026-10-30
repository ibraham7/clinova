// Microsoft Clarity (session recordings and heatmaps). Loads only after the visitor accepts cookies and only where the
// site's own statistics run (see visitorTrackingAllowed in ./allowed). The project ID is public by nature.
import { visitorTrackingAllowed } from "./allowed";
import { adConsentGiven } from "./consent";

const projectId = "ysn5yxaiay";
let active = false;

declare global { interface Window { clarity?: ((...args: unknown[]) => void) & { q?: unknown[] } } }

export function startClarity() {
    if (active || typeof window === "undefined" || !visitorTrackingAllowed() || !adConsentGiven()) return;
    active = true;
    // Clarity's standard loader: queue calls until the tag arrives.
    window.clarity = window.clarity || Object.assign(function (...args: unknown[]) { (window.clarity!.q = window.clarity!.q || []).push(args); }, {});
    // Clarity needs an explicit consent signal before it sets cookies for visitors in the EEA, UK and Switzerland.
    window.clarity("consentv2", { ad_Storage: "granted", analytics_Storage: "granted" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${projectId}`;
    document.head.appendChild(script);
}
