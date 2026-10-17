import crypto from "node:crypto";
import { tryInsert } from "../lib/analytics.mjs";
import { commitFiles, imageType, isAdmin, readJson, readRepoFile, reply, sameOrigin, storageError, storageReady } from "../lib/admin.mjs";
import { articleError, folder, joinArticle, languages, slugPattern, splitArticle } from "../lib/articles.mjs";

const maxCover = 1_500_000;

// Blog articles from the admin panel. Each article is src/blog/content/<slug>/<lang>.md (front matter + the small
// Markdown of src/blog/parse.ts); its optional cover image is public/uploads/blog/<slug>-<id>.<ext>.
//   GET                → { articles: [{ slug, title, date, languages }] } straight from the repository
//   GET ?slug=x        → { files: { ar, en?, tr?, fr? } } the Markdown of one article
//   PUT { slug, isNew, files, cover?: base64 image, removeCover? } → saves everything in one commit
//   DELETE ?slug=x     → removes the article and its cover
async function listArticles() {
    const repo = process.env.GITHUB_REPO || "ibraham7/clinova";
    const branch = process.env.GITHUB_BRANCH || "main";
    const response = await fetch(`https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`, {
        cache: "no-store", headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "clinova-admin" },
    });
    if (!response.ok) throw new Error(`github_read_${response.status}`);
    const bySlug = new Map();
    for (const item of (await response.json()).tree ?? []) {
        const match = /^src\/blog\/content\/([^/]+)\/([a-z]{2})\.md$/.exec(item.path);
        if (match) bySlug.set(match[1], [...(bySlug.get(match[1]) ?? []), match[2]]);
    }
    return Promise.all([...bySlug].map(async ([slug, langs]) => {
        const file = await readRepoFile(`${folder(slug)}/${langs.includes("ar") ? "ar" : langs[0]}.md`);
        const meta = splitArticle(file?.buffer.toString("utf8") ?? "")?.meta ?? {};
        return { slug, title: meta.title ?? slug, date: meta.date ?? "", updated: meta.updated ?? null, cover: meta.cover ?? null, languages: languages.filter((lang) => langs.includes(lang)) };
    })).then((list) => list.sort((a, b) => b.date.localeCompare(a.date)));
}

async function readArticle(slug) {
    const files = {};
    await Promise.all(languages.map(async (lang) => {
        const file = await readRepoFile(`${folder(slug)}/${lang}.md`);
        if (file) files[lang] = file.buffer.toString("utf8");
    }));
    return files;
}

export default async function handler(request) {
    if (!isAdmin(request)) return reply(401, { ok: false, error: "signed_out" });
    if (!storageReady()) return reply(503, { ok: false, error: "storage_not_configured" });
    const url = new URL(request.url);
    try {
        if (request.method === "GET") {
            const slug = url.searchParams.get("slug");
            if (!slug) return reply(200, { ok: true, articles: await listArticles() });
            if (!slugPattern.test(slug)) return reply(400, { ok: false, error: "invalid_request" });
            const files = await readArticle(slug);
            return Object.keys(files).length ? reply(200, { ok: true, files }) : reply(404, { ok: false, error: "not_found" });
        }
        if (!sameOrigin(request)) return reply(403, { ok: false, error: "invalid_origin" });

        if (request.method === "DELETE") {
            const slug = url.searchParams.get("slug") ?? "";
            if (!slugPattern.test(slug)) return reply(400, { ok: false, error: "invalid_request" });
            const files = await readArticle(slug);
            if (!Object.keys(files).length) return reply(404, { ok: false, error: "not_found" });
            const cover = splitArticle(files.ar ?? Object.values(files)[0])?.meta.cover;
            const changes = [...Object.keys(files).map((lang) => ({ path: `${folder(slug)}/${lang}.md`, remove: true })), ...(cover ? [{ path: `public${cover}`, remove: true }] : [])];
            const result = await commitFiles(changes, `Delete blog article ${slug} from the admin panel`);
            if (result.conflict) return reply(409, { ok: false, error: "conflict" });
            await tryInsert("admin_log", [{ action: "article", summary: `حذف مقالة: ${slug}`, details: { slug } }]);
            return reply(200, { ok: true });
        }

        if (request.method !== "PUT") return reply(405, { ok: false, error: "method_not_allowed" });
        let body;
        try { body = await readJson(request, 3_000_000); } catch { return reply(413, { ok: false, error: "too_large" }); }
        const slug = body?.slug;
        if (typeof slug !== "string" || slug.length < 3 || slug.length > 80 || !slugPattern.test(slug)) return reply(400, { ok: false, error: "article_bad_slug" });
        const files = body.files && typeof body.files === "object" ? body.files : {};
        if (Object.keys(files).some((lang) => !languages.includes(lang)) || typeof files.ar !== "string") return reply(400, { ok: false, error: "article_missing_fields" });
        for (const lang of Object.keys(files)) {
            const error = articleError(files[lang]);
            if (error) return reply(400, { ok: false, error, lang });
        }

        const existing = await readArticle(slug);
        if (body.isNew && Object.keys(existing).length) return reply(409, { ok: false, error: "article_slug_taken" });
        const oldCover = splitArticle(existing.ar ?? Object.values(existing)[0] ?? "")?.meta.cover;
        let cover = oldCover;
        const changes = [];
        if (typeof body.cover === "string") {
            const buffer = Buffer.from(body.cover, "base64");
            if (!buffer.length || buffer.length > maxCover) return reply(413, { ok: false, error: "too_large" });
            const type = imageType(buffer);
            if (!type) return reply(415, { ok: false, error: "unsupported_type" });
            // A new name for every new cover, so browsers and share previews never show the old one.
            cover = `/uploads/blog/${slug}-${crypto.randomBytes(3).toString("hex")}.${type}`;
            changes.push({ path: `public${cover}`, buffer });
        } else if (body.removeCover === true) cover = undefined;
        if (oldCover && oldCover !== cover) changes.push({ path: `public${oldCover}`, remove: true });

        for (const lang of languages) {
            const path = `${folder(slug)}/${lang}.md`;
            if (typeof files[lang] === "string") {
                const { meta, body: text } = splitArticle(files[lang].replace(/\r\n/g, "\n"));
                changes.push({ path, buffer: Buffer.from(joinArticle({ ...meta, cover }, text), "utf8") });
            } else if (existing[lang]) changes.push({ path, remove: true });
        }
        const result = await commitFiles(changes, `${body.isNew ? "Add" : "Update"} blog article ${slug} from the admin panel`);
        if (result.conflict) return reply(409, { ok: false, error: "conflict" });
        const title = splitArticle(files.ar)?.meta.title ?? slug;
        await tryInsert("admin_log", [{ action: "article", summary: `${body.isNew ? "نشر مقالة" : "تعديل مقالة"}: ${title.slice(0, 120)}`, details: { slug, languages: Object.keys(files) } }]);
        return reply(200, { ok: true, cover: cover ?? null });
    } catch (error) {
        return reply(502, { ok: false, error: storageError(error) });
    }
}
