import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./theme/tokens.css";
import "./motion.css";
import { ColorModeProvider } from "./theme/ColorMode";
import "./i18n";
import Root from "./Root";
import { parseRoute } from "./routes";
import { startTracking } from "./analytics/track";

// Pages arrive prerendered for search engines; the browser then renders the live app in their place.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColorModeProvider><Root route={parseRoute(window.location.pathname)} /></ColorModeProvider>
  </StrictMode>,
);

// Anonymous visit statistics for the admin reports page (skipped in /admin and ?edit).
startTracking();
