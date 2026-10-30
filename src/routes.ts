import { isSiteLanguage, type SiteLanguage } from "./i18n";

export type Route =
    | { kind: "admin" }
    | { kind: "home"; lang?: SiteLanguage }
    | { kind: "blog"; lang: SiteLanguage }
    | { kind: "privacy"; lang: SiteLanguage }
    | { kind: "article"; lang: SiteLanguage; slug: string };

// Pages: / (home), /ar (home), /ar/blog (article list), /ar/blog/some-article (one article), /ar/privacy.
export function parseRoute(pathname: string): Route {
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] === "admin") return { kind: "admin" };
    const lang = isSiteLanguage(parts[0]) ? parts[0] : undefined;
    if (lang && parts[1] === "privacy") return { kind: "privacy", lang };
    if (lang && parts[1] === "blog") return parts[2] ? { kind: "article", lang, slug: parts[2] } : { kind: "blog", lang };
    return { kind: "home", lang };
}

export function routePath(route: Route, lang: SiteLanguage) {
    if (route.kind === "blog") return `/${lang}/blog`;
    if (route.kind === "privacy") return `/${lang}/privacy`;
    if (route.kind === "article") return `/${lang}/blog/${route.slug}`;
    return `/${lang}`;
}
