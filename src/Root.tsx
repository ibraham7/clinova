import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSiteTranslation } from "./i18n/useSiteTranslation";
import { useColorMode } from "./theme/ColorMode";
import { darkTheme, lightTheme } from "./theme";
import type { SiteLanguage } from "./i18n";
import type { Route } from "./routes";
import App from "./App";
import ConsentBanner from "./legal/ConsentBanner";

// The admin panel and the on-page text editor load only for /admin and ?edit, keeping the public site light.
// The blog, the privacy page and the page-head code (which knows every article) are separate files, loaded only for the pages that
// need them: the home page never downloads the articles. While prerendering they are imported directly.
const BlogIndex = import.meta.env.SSR ? (await import("./blog/BlogIndex")).default : lazy(() => import("./blog/BlogIndex"));
const BlogArticle = import.meta.env.SSR ? (await import("./blog/BlogArticle")).default : lazy(() => import("./blog/BlogArticle"));
const PrivacyPage = import.meta.env.SSR ? (await import("./legal/PrivacyPage")).default : lazy(() => import("./legal/PrivacyPage"));
const LegalPage = import.meta.env.SSR ? (await import("./legal/LegalPage")).default : lazy(() => import("./legal/LegalPage"));
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
    const firstHead = useRef(true);
    useEffect(() => {
        if (route.kind === "admin") return;
        // A prerendered page already carries the right head: only a later change of language needs it rebuilt.
        const first = firstHead.current;
        firstHead.current = false;
        if (first && document.querySelector('link[rel="canonical"]')) return;
        let current = true;
        void import("./seo/head").then(({ applyHead, buildHead }) => {
            if (!current) return;
            try { applyHead(buildHead(route, lang)); } catch { /* An article missing in this language keeps the previous head. */ }
        });
        return () => { current = false; };
    }, [route, lang]);
    return <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {route.kind === "admin" ? <Suspense fallback={null}><AdminApp /></Suspense>
            : route.kind === "home" ? <App />
            : <Suspense fallback={null}>{route.kind === "blog" ? <BlogIndex />
                : route.kind === "privacy" ? <PrivacyPage />
                : route.kind === "legal" ? <LegalPage slug={route.slug} />
                : <BlogArticle slug={route.slug} />}</Suspense>}
        {editing && <Suspense fallback={null}><EditMode /></Suspense>}
        {!admin && !editing && <ConsentBanner />}
    </ThemeProvider>;
}
