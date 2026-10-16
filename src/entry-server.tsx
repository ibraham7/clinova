import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import i18n from "./i18n";
import type { SiteLanguage } from "./i18n";
import { ColorModeProvider } from "./theme/ColorMode";
import Root from "./Root";
import { parseRoute } from "./routes";
import { buildHead, headTags } from "./seo/head";

export { articles } from "./blog/articles";
export { routeLanguages } from "./seo/head";
export { blogMeta, homeMeta } from "./seo/meta";
export { services } from "./seo/services";
export { siteUrl, contactEmail, contactPhone, areaServed, socialProfiles } from "./seo/site";
export { plainText } from "./blog/parse";

/** Renders one URL to static HTML for search engines and AI crawlers (see scripts/prerender.mjs). */
export async function render(pathname: string, fallbackLanguage: SiteLanguage = "ar") {
    const route = parseRoute(pathname);
    const lang = (route.kind !== "admin" && route.lang) || fallbackLanguage;
    await i18n.changeLanguage(lang);
    // Collect each page's styles once into <head> instead of inline next to every element.
    const cache = createCache({ key: "css" });
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
    const html = renderToString(<StrictMode><CacheProvider value={cache}><ColorModeProvider initialMode="dark"><Root route={route} /></ColorModeProvider></CacheProvider></StrictMode>);
    const styles = constructStyleTagsFromChunks(extractCriticalToChunks(html));
    const head = buildHead(route, lang);
    return { html, head: `${headTags(head)}\n    ${styles}`, lang: head.lang, dir: head.dir };
}
