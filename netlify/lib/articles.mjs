// Blog article files (front matter + the small Markdown of src/blog/parse.ts), shared by the admin functions.
export const languages = ["ar", "en", "tr", "fr"];
export const metaKeys = ["title", "seoTitle", "description", "date", "updated", "cover"];
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const folder = (slug) => `src/blog/content/${slug}`;

export function splitArticle(source) {
    const match = /^---\n([\s\S]*?)\n---\n/.exec(source);
    if (!match) return null;
    const meta = {};
    for (const line of match[1].split("\n")) {
        const at = line.indexOf(":");
        if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
    }
    return { meta, body: source.slice(match[0].length) };
}

export const joinArticle = (meta, body) => `---\n${metaKeys.filter((key) => meta[key]).map((key) => `${key}: ${meta[key]}`).join("\n")}\n---\n${body.replace(/^\n+/, "")}`;

/** The reason an article file is refused, or null. */
export function articleError(source) {
    if (typeof source !== "string" || source.length > 80_000) return "article_too_long";
    const parts = splitArticle(source.replace(/\r\n/g, "\n"));
    if (!parts) return "article_invalid";
    const { meta, body } = parts;
    if (Object.keys(meta).some((key) => !metaKeys.includes(key))) return "article_invalid";
    if (!meta.title || meta.title.length > 200 || !meta.description || meta.description.length > 400) return "article_missing_fields";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? "") || (meta.updated && !/^\d{4}-\d{2}-\d{2}$/.test(meta.updated))) return "article_invalid";
    if (meta.cover && !/^\/uploads\/blog\/[a-z0-9-]+\.(png|jpg|webp)$/.test(meta.cover)) return "article_invalid";
    if (body.trim().length < 50) return "article_missing_fields";
    // Links may only point to the site, an anchor, the web, mail or phone (see src/blog/InlineText.tsx).
    for (const [, href] of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) if (!/^(\/|#|https?:\/\/|mailto:|tel:)/i.test(href)) return "article_bad_link";
    return null;
}

