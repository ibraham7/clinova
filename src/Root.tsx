import { useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSiteTranslation } from "./i18n/useSiteTranslation";
import { useColorMode } from "./theme/ColorMode";
import { darkTheme, lightTheme } from "./theme";
import type { SiteLanguage } from "./i18n";
import type { Route } from "./routes";
import { applyHead, buildHead } from "./seo/head";
import App from "./App";
import BlogIndex from "./blog/BlogIndex";
import BlogArticle from "./blog/BlogArticle";

/** Picks the page for the current URL; shared by the browser and the prerender step. */
export default function Root({ route }: { route: Route }) {
    const { direction, i18n } = useSiteTranslation();
    const { mode } = useColorMode();
    const lang = (i18n.resolvedLanguage ?? "ar") as SiteLanguage;
    const theme = useMemo(() => createTheme(mode === "light" ? lightTheme : darkTheme, { direction }), [direction, mode]);
    useEffect(() => {
        try { applyHead(buildHead(route, lang)); } catch { /* An article missing in this language keeps the previous head. */ }
    }, [route, lang]);
    return <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {route.kind === "home" ? <App /> : route.kind === "blog" ? <BlogIndex /> : <BlogArticle slug={route.slug} />}
    </ThemeProvider>;
}
