import type { SiteLanguage } from "../i18n";
import { parseArticle, type ParsedArticle } from "./parse";

// Each article lives in content/<slug>/<lang>.md and shares its slug across languages.
const files = import.meta.glob("./content/*/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export type Article = { slug: string; translations: Partial<Record<SiteLanguage, ParsedArticle>> };

const bySlug = new Map<string, Article>();
for (const [path, source] of Object.entries(files)) {
    const [, slug, lang] = /\.\/content\/([^/]+)\/([a-z]{2})\.md$/.exec(path) ?? [];
    if (!slug) continue;
    const article = bySlug.get(slug) ?? { slug, translations: {} };
    article.translations[lang as SiteLanguage] = parseArticle(source);
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
