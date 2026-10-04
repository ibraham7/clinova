import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSiteTranslation } from "./i18n/useSiteTranslation";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import "./i18n";

import App from "./App";
import { darkTheme } from "./theme";

function LocalizedApp() {
  const { direction } = useSiteTranslation();
  const theme = useMemo(() => createTheme(darkTheme, { direction }), [direction]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocalizedApp />
  </StrictMode>,
);
