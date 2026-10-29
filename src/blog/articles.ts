import type { SiteLanguage } from "../i18n";
import { parseArticle, type ParsedArticle } from "./parse";

// Each article lives in content/<slug>/<lang>.md and shares its slug across languages.
const files = import.meta.glob("./content/*/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export type Article = { slug: string; translations: Partial<Record<SiteLanguage, ParsedArticle>> };

// An article whose date is still in the future is scheduled: it is left out of every page, the sitemap and llms.txt
// until a build runs on or after that day (the weekly rebuild in netlify/functions/publish-scheduled.mjs).
const publishUntil = typeof __PUBLISH_UNTIL__ !== "undefined" ? __PUBLISH_UNTIL__ : "9999-12-31";

const bySlug = new Map<string, Article>();
for (const [path, source] of Object.entries(files)) {
    const [, slug, lang] = /\.\/content\/([^/]+)\/([a-z]{2})\.md$/.exec(path) ?? [];
    if (!slug) continue;
    const parsed = parseArticle(source);
    if (parsed.date > publishUntil) continue;
    const article = bySlug.get(slug) ?? { slug, translations: {} };
    article.translations[lang as SiteLanguage] = parsed;
    bySlug.set(slug, article);
}

/** Newest first. */
export const articles: Article[] = [...bySlug.values()].sort((a, b) =>
    (b.translations.ar?.date ?? "").localeCompare(a.translations.ar?.date ?? ""));

export function findArticle(slug: string) {
    return bySlug.get(slug);
}

export function readingMinutes(article: ParsedArticle) {
    return Math.max(3, Math.round(article.words / 180));
}

export function formatDate(date: string, lang: string) {
    return new Intl.DateTimeFormat(lang === "ar" ? "ar" : lang, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(date));
}
