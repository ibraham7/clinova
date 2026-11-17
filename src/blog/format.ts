import type { ParsedArticle } from "./parse";

export function readingMinutes(article: ParsedArticle) {
    return Math.max(3, Math.round(article.words / 180));
}

export function formatDate(date: string, lang: string) {
    return new Intl.DateTimeFormat(lang === "ar" ? "ar" : lang, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(date));
}
