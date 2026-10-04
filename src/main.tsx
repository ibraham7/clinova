import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSiteTranslation } from "./i18n/useSiteTranslation";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import "./theme/tokens.css";
import { ColorModeProvider, useColorMode } from "./theme/ColorMode";
import "./i18n";

import App from "./App";
import { darkTheme, lightTheme } from "./theme";

function LocalizedApp() {
  const { direction } = useSiteTranslation();
  const { mode } = useColorMode();
  const theme = useMemo(() => createTheme(mode === "light" ? lightTheme : darkTheme, { direction }), [direction, mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColorModeProvider><LocalizedApp /></ColorModeProvider>
  </StrictMode>,
);
