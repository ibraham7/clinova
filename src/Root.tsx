import { lazy, Suspense, useEffect, useMemo } from "react";
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
import PrivacyPage from "./legal/PrivacyPage";
import ConsentBanner from "./legal/ConsentBanner";

// The admin panel and the on-page text editor load only for /admin and ?edit, keeping the public site light.
const AdminApp = lazy(() => import("./admin/AdminApp"));
const EditMode = lazy(() => import("./admin/EditMode"));

/** Picks the page for the current URL; shared by the browser and the prerender step. */
export default function Root({ route }: { route: Route }) {
    const { direction, i18n } = useSiteTranslation();
    const { mode } = useColorMode();
    const lang = (i18n.resolvedLanguage ?? "ar") as SiteLanguage;
    const admin = route.kind === "admin";
    const theme = useMemo(() => createTheme(mode === "light" && !admin ? lightTheme : darkTheme, { direction: admin ? "rtl" : direction }), [direction, mode, admin]);
    const editing = typeof window !== "undefined" && !admin && new URLSearchParams(window.location.search).has("edit");
    useEffect(() => {
        if (route.kind === "admin") return;
        try { applyHead(buildHead(route, lang)); } catch { /* An article missing in this language keeps the previous head. */ }
    }, [route, lang]);
    return <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {route.kind === "admin" ? <Suspense fallback={null}><AdminApp /></Suspense>
            : route.kind === "home" ? <App />
            : route.kind === "blog" ? <BlogIndex />
            : route.kind === "privacy" ? <PrivacyPage />
            : <BlogArticle slug={route.slug} />}
        {editing && <Suspense fallback={null}><EditMode /></Suspense>}
        {!admin && !editing && <ConsentBanner />}
    </ThemeProvider>;
}
