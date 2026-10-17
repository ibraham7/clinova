// Exercises the admin blog functions against an in-memory GitHub repository and a fake Gemini:
// listing, reading, publishing in one commit, covers, validation, deleting, and Serena's draft and translation.
import assert from "node:assert/strict";

process.env.ADMIN_PASSWORD = "correct horse battery";
process.env.GITHUB_TOKEN = "test-token";
process.env.GEMINI_API_KEY = "AIza-test";

const article = (title, extra = "") => `---\ntitle: ${title}\ndescription: وصف قصير للمقالة يظهر في نتائج البحث.\ndate: 2026-10-16\n${extra}---\n> خلاصة **مهمة** للمقالة.\n\n## قسم\n\nفقرة طويلة بما يكفي لتكون نص مقالة حقيقية فيها [رابط](/ar/blog/other).\n\nQ: سؤال؟\nA: جواب.\n`;
const files = new Map([
    ["src/blog/content/clinic-crm-system/ar.md", Buffer.from(article("نظام CRM"))],
    ["src/blog/content/clinic-crm-system/en.md", Buffer.from(article("CRM system"))],
    ["src/content/site-content.json", Buffer.from("{}")],
]);
let head = "c0";
const blobs = new Map();
const trees = new Map();
const commits = [];
const geminiPrompts = [];

globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    if (url.hostname === "generativelanguage.googleapis.com") {
        if (url.pathname.endsWith("/models")) return Response.json({ models: [{ name: "models/gemini-9.5-flash", supportedGenerationMethods: ["generateContent"] }] });
        const body = JSON.parse(init.body);
        geminiPrompts.push(body);
        const translate = /Translate the Arabic blog article/.test(body.systemInstruction.parts[0].text);
        const text = translate ? "```\n" + article("Translated title").replace("/ar/blog/other", "/en/blog/other") + "```" : article("مسودة من سيرينا");
        return Response.json({ candidates: [{ content: { role: "model", parts: [{ text }] }, finishReason: "STOP" }] });
    }
    if (url.pathname === "/blog/articles.json") return Response.json([{ slug: "clinic-crm-system", title: "نظام CRM", date: "2026-10-16" }]);
    assert.equal(init.headers?.Authorization, "Bearer test-token");
    const path = url.pathname.replace(/^\/repos\/[^/]+\/[^/]+\//, "");
    const method = init.method ?? "GET";
    if (path.startsWith("contents/")) {
        const file = files.get(decodeURIComponent(path.slice(9)));
        return file ? Response.json({ sha: "s", content: file.toString("base64") }) : new Response("{}", { status: 404 });
    }
    if (path.startsWith("git/trees/") && method === "GET") return Response.json({ tree: [...files.keys()].map((key) => ({ path: key, type: "blob" })) });
    if (path === "git/ref/heads/main") return Response.json({ object: { sha: head } });
    if (path.startsWith("git/commits/") && method === "GET") return Response.json({ tree: { sha: `t-${path.slice(12)}` } });
    if (path === "git/blobs") { const sha = `b${blobs.size}`; blobs.set(sha, Buffer.from(JSON.parse(init.body).content, "base64")); return Response.json({ sha }); }
    if (path === "git/trees") { const sha = `t${trees.size}`; trees.set(sha, JSON.parse(init.body)); return Response.json({ sha }); }
    if (path === "git/commits") { const body = JSON.parse(init.body); const sha = `c${commits.length + 1}`; commits.push({ sha, ...body }); return Response.json({ sha }); }
    if (path === "git/refs/heads/main" && method === "PATCH") {
        const commit = commits.find((item) => item.sha === JSON.parse(init.body).sha);
        if (commit.parents[0] !== head) return new Response("{}", { status: 422 });
        for (const entry of trees.get(commit.tree).tree) entry.sha === null ? files.delete(entry.path) : files.set(entry.path, blobs.get(entry.sha));
        head = commit.sha;
        return Response.json({});
    }
    throw new Error(`Unexpected ${method} ${url}`);
};

const { sessionCookie } = await import("../netlify/lib/admin.mjs");
const { default: articles } = await import("../netlify/functions/admin-articles.mjs");
const { default: writer } = await import("../netlify/functions/admin-article-ai.mjs");
const cookie = sessionCookie().split(";")[0];
const call = (handler, query = "", { method = "GET", body, signedIn = true } = {}) => handler(new Request(`https://clinova.test/.netlify/functions/x${query}`, {
    method, headers: { origin: "https://clinova.test", "content-type": "application/json", ...(signedIn ? { cookie } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}),
}));
const json = async (response) => ({ status: response.status, ...(await response.json()) });

assert.equal((await call(articles, "", { signedIn: false })).status, 401);
const listed = await json(await call(articles));
assert.deepEqual(listed.articles.map((item) => [item.slug, item.title, item.languages]), [["clinic-crm-system", "نظام CRM", ["ar", "en"]]]);
assert.deepEqual(Object.keys((await json(await call(articles, "?slug=clinic-crm-system"))).files).sort(), ["ar", "en"]);
assert.equal((await call(articles, "?slug=missing-one")).status, 404);

// Publishing a new article: all languages and the cover in one commit.
const png = Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), Buffer.from("cover")]);
const created = await json(await call(articles, "", { method: "PUT", body: { slug: "new-article", isNew: true, files: { ar: article("مقالة جديدة"), tr: article("Yeni makale") }, cover: png.toString("base64") } }));
assert.equal(created.status, 200);
assert.equal(commits.length, 1, "one commit for everything");
assert.match(created.cover, /^\/uploads\/blog\/new-article-[a-f0-9]{6}\.png$/);
assert.deepEqual(files.get(`public${created.cover}`), png);
assert.match(files.get("src/blog/content/new-article/ar.md").toString(), new RegExp(`cover: ${created.cover.replace(/[/.]/g, "\\$&")}`), "the cover is in every language's front matter");
assert.match(files.get("src/blog/content/new-article/tr.md").toString(), /^---\ntitle: Yeni makale\n/);
assert.equal((await json(await call(articles, "", { method: "PUT", body: { slug: "new-article", isNew: true, files: { ar: article("مكرر") } } }))).error, "article_slug_taken");

// Editing: a new cover replaces the old file, a dropped language is removed.
const edited = await json(await call(articles, "", { method: "PUT", body: { slug: "new-article", isNew: false, files: { ar: article("مقالة معدلة", "updated: 2026-10-17\n") }, cover: png.toString("base64") } }));
assert.equal(edited.status, 200);
assert.ok(!files.has(`public${created.cover}`), "the previous cover is deleted");
assert.ok(files.has(`public${edited.cover}`));
assert.ok(!files.has("src/blog/content/new-article/tr.md"), "a language left empty is removed");
await call(articles, "", { method: "PUT", body: { slug: "new-article", isNew: false, files: { ar: article("مقالة معدلة") }, removeCover: true } });
assert.ok(!files.has(`public${edited.cover}`));
assert.doesNotMatch(files.get("src/blog/content/new-article/ar.md").toString(), /cover:/);

// Validation.
const refuse = async (body) => (await json(await call(articles, "", { method: "PUT", body: { slug: "valid-slug", isNew: true, files: { ar: article("عنوان") }, ...body } }))).error;
assert.equal(await refuse({ slug: "Bad Slug" }), "article_bad_slug");
assert.equal(await refuse({ files: { en: article("No Arabic") } }), "article_missing_fields");
assert.equal(await refuse({ files: { ar: "no front matter" } }), "article_invalid");
assert.equal(await refuse({ files: { ar: article("عنوان").replace("/ar/blog/other", "javascript:alert(1)") } }), "article_bad_link");
assert.equal(await refuse({ files: { ar: article("عنوان", "script: x\n") } }), "article_invalid", "unknown front matter keys refused");
assert.equal(await refuse({ cover: Buffer.from("not an image").toString("base64") }), "unsupported_type");
assert.equal((await call(articles, "", { method: "PUT", body: { slug: "x-y-z", files: { ar: article("ع") } }, signedIn: false })).status, 401);

// Deleting removes every language and the cover.
assert.equal((await call(articles, "?slug=new-article", { method: "DELETE" })).status, 200);
assert.ok(![...files.keys()].some((key) => key.includes("new-article")));

// Serena: an Arabic draft that knows the existing articles, and a translation with fixed links and no code fences.
const draft = await json(await call(writer, "", { method: "POST", body: { action: "draft", topic: "تسويق عيادات التجميل" } }));
assert.equal(draft.status, 200);
assert.match(draft.markdown, /^---\ntitle: مسودة من سيرينا/);
assert.equal(draft.check, null);
assert.match(geminiPrompts[0].systemInstruction.parts[0].text, /\/ar\/blog\/clinic-crm-system/, "existing articles are offered as links");
const translated = await json(await call(writer, "", { method: "POST", body: { action: "translate", markdown: article("مقالة"), to: "en" } }));
assert.equal(translated.status, 200);
assert.match(translated.markdown, /^---\ntitle: Translated title/, "code fences are removed");
assert.match(geminiPrompts[1].systemInstruction.parts[0].text, /English/);
assert.equal((await call(writer, "", { method: "POST", body: { action: "translate", markdown: article("مقالة"), to: "de" } })).status, 400);
assert.equal((await json(await call(writer, "", { method: "POST", body: { action: "draft", topic: "" } }))).error, "article_topic_missing");

console.log("Admin blog: listing, reading, one-commit publishing, covers, validation, deleting and Serena's draft and translation passed (mock GitHub and Gemini)");
