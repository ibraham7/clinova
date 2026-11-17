import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./theme/tokens.css";
import "./motion.css";
import "./interactive.css";
import { ColorModeProvider } from "./theme/ColorMode";
import "./i18n";
import Root from "./Root";
import { parseRoute } from "./routes";
import { startTracking } from "./analytics/track";
import { startPixel } from "./analytics/pixel";
import { startGoogleTag } from "./analytics/gtag";
import { startClarity } from "./analytics/clarity";
import { whenConsented } from "./analytics/consent";
import { capturePrerendered } from "./components/motion/Deferred";

// When the page was already revealed (no opening animation: phones, repeat visits), the prerendered hero has finished its entrance
// by the time React replaces it; the live copy must not play it a second time.
if (document.documentElement.classList.contains("is-ready")) document.documentElement.classList.add("is-live");

// Pages arrive prerendered; the sections below the first screen keep showing their prerendered HTML until their own code has loaded.
capturePrerendered({
  story: "section#story", reach: "section#reach", "contact-system": "section#contact-system", services: "section#services",
  specialties: "section#specialties", "case-studies": "section#case-studies", partners: "section#partners", videos: "section#client-videos",
  reviews: "section#reviews", faq: "section#faq", "contact-cta": "section#contact-cta", footer: "footer",
});

// Pages arrive prerendered for search engines; the browser then renders the live app in their place.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColorModeProvider><Root route={parseRoute(window.location.pathname)} /></ColorModeProvider>
  </StrictMode>,
);

// Lets the opening animation in index.html finish once the app is on screen.
requestAnimationFrame(() => (window as unknown as { __clinovaMounted?: () => void }).__clinovaMounted?.());

// Anonymous visit statistics for the admin reports page (skipped in /admin and ?edit).
startTracking();
// The Meta ad pixel, the Google Ads tag and Microsoft Clarity: same exclusions as the statistics, and only once the
// visitor accepts cookies in the banner (right away for a visitor who accepted before).
whenConsented(() => { startPixel(); startGoogleTag(); startClarity(); });
