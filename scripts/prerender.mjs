// Turns the built single-page app into real HTML pages, one per language and article,
// so Google, Bing and AI assistants (which do not run JavaScript) can read every page.
// Also writes sitemap.xml, robots.txt and llms.txt. Runs after `vite build` and the SSR build.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const server = await import(pathToFileURL(path.join(root, "dist-ssr/entry-server.js")).href);
const { render, articles, routeLanguages, siteUrl, homeMeta, blogMeta, services, contactEmail, contactPhone, areaServed, socialProfiles, plainText } = server;

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const languages = ["ar", "en", "tr", "fr"];
const today = new Date().toISOString().slice(0, 10);

const pages = [{ path: "/", lastmod: today }];
for (const lang of languages) {
    pages.push({ path: `/${lang}`, lastmod: today, route: { kind: "home" } });
    pages.push({ path: `/${lang}/blog`, lastmod: today, route: { kind: "blog" } });
    pages.push({ path: `/${lang}/privacy`, lastmod: today, route: { kind: "privacy" } });
    for (const article of articles) {
        const translation = article.translations[lang];
        if (translation) pages.push({ path: `/${lang}/blog/${article.slug}`, lastmod: translation.updated ?? translation.date, route: { kind: "article", slug: article.slug } });
    }
}

let arabicHome = "";
for (const page of pages) {
    const { html, head, lang, dir } = await render(page.path);
    if (page.path === "/ar") arabicHome = html;
    const document = template
        .replace(/<html[^>]*>/, `<html lang="${lang}" dir="${dir}">`)
        .replace(/<title>[\s\S]*?<\/title>/, head)
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    if (!document.includes('<div id="root"><')) throw new Error(`Prerender failed for ${page.path}`);
    const file = page.path === "/" ? path.join(dist, "index.html") : path.join(dist, page.path, "index.html");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, document);
}

// /admin is a private app: an empty shell that search engines must not index.
fs.mkdirSync(path.join(dist, "admin"), { recursive: true });
fs.writeFileSync(path.join(dist, "admin/index.html"), template
    .replace(/<title>[\s\S]*?<\/title>/, '<title>Clinova Admin</title>\n    <meta name="robots" content="noindex, nofollow" />')
    .replace(/<script type="text\/javascript">[\s\S]*?clarity[\s\S]*?<\/script>/, ""));

// Publish dates for the admin reports page and Serena (before and after each article).
fs.mkdirSync(path.join(dist, "blog"), { recursive: true });
fs.writeFileSync(path.join(dist, "blog/articles.json"), JSON.stringify(articles.map((article) => {
    const translation = article.translations.ar ?? Object.values(article.translations)[0];
    return { slug: article.slug, title: translation.title, date: translation.date, updated: translation.updated ?? null, languages: Object.keys(article.translations) };
})));

// What the site says, for Serena: the Arabic home page as text (admin text edits included) and every article in full.
// All of it is public already; the file only saves Serena from parsing HTML.
const htmlText = (html) => html.replace(/<(script|style)[\s\S]*?<\/\1>/g, " ").replace(/<\/(h[1-6]|p|li|div|section|article|header|footer|button|a)>|<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .split("\n").map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean).filter((line, index, all) => line !== all[index - 1]).join("\n");
fs.mkdirSync(path.join(dist, "serena"), { recursive: true });
fs.writeFileSync(path.join(dist, "serena/knowledge.json"), JSON.stringify({
    home: htmlText(arabicHome),
    survey: JSON.parse(fs.readFileSync(path.join(root, "src/config/survey.json"), "utf8")),
    articles: articles.map((article) => {
        const translation = article.translations.ar ?? Object.values(article.translations)[0];
        const blocks = translation.blocks.map((block) => block.type === "h2" ? `## ${block.text}` : "text" in block ? block.text : block.items.map((item) => `- ${item}`).join("\n"));
        const faq = translation.faq.map((item) => `س: ${item.q}\nج: ${item.a}`);
        return {
            slug: article.slug, title: translation.title, description: translation.description, date: translation.date, url: `${siteUrl}/ar/blog/${article.slug}`,
            text: plainText([translation.summary, ...blocks, ...faq].filter(Boolean).join("\n\n")),
        };
    }),
}));

// sitemap.xml with hreflang alternates for every language version.
const urlFor = (route, lang) => route.kind === "home" ? `${siteUrl}/${lang}` : route.kind === "blog" ? `${siteUrl}/${lang}/blog` : `${siteUrl}/${lang}/blog/${route.slug}`;
const entries = pages.filter((page) => page.route).map((page) => {
    const lang = page.path.split("/")[1];
    const available = routeLanguages({ ...page.route, lang });
    const links = [...available.map((code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${urlFor(page.route, code)}" />`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(page.route, available.includes("ar") ? "ar" : available[0])}" />`];
    return `  <url>\n    <loc>${siteUrl}${page.path}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n${links.join("\n")}\n  </url>`;
});
fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`);

// robots.txt: every search engine and AI assistant may read the public site.
const aiAgents = ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot", "PerplexityBot", "Perplexity-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "Google-Extended", "Applebot", "Applebot-Extended", "DuckAssistBot", "YandexBot"];
fs.writeFileSync(path.join(dist, "robots.txt"), [
    "# Clinova welcomes search engines and AI assistants.",
    "User-agent: *",
    "Allow: /",
    "Disallow: /.netlify/",
    "Disallow: /admin",
    "",
    ...aiAgents.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", "Disallow: /.netlify/", "Disallow: /admin", ""]),
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
].join("\n"));

// llms.txt: a plain summary for AI assistants (https://llmstxt.org).
const articleLines = (lang) => articles.filter((article) => article.translations[lang]).map((article) => {
    const translation = article.translations[lang];
    return `- [${translation.title}](${siteUrl}/${lang}/blog/${article.slug}): ${plainText(translation.description)}`;
});
fs.writeFileSync(path.join(dist, "llms.txt"), [
    "# Clinova",
    "",
    `> ${homeMeta.en.description}`,
    "",
    "Clinova is a growth partner for medical clinics (dentistry, dermatology and aesthetics, plastic surgery, hair transplant and other selected specialties). It combines patient acquisition, a clinic CRM, 24/7 WhatsApp response by AI plus a human team, patient qualification and booking, treatment coordination, reactivation of past patients, and reputation building.",
    "",
    `- Website: ${siteUrl} (Arabic, English, Turkish, French)`,
    `- Countries served: ${areaServed.join(", ")}`,
    `- Contact: ${contactEmail}, WhatsApp ${contactPhone}`,
    `- Profiles: ${socialProfiles.join(", ")}`,
    "",
    "## Services",
    "",
    ...services.en.map((service) => `- **${service.name}**: ${service.description}`),
    "",
    "## Pages",
    "",
    ...languages.map((lang) => `- [${homeMeta[lang].title}](${siteUrl}/${lang}): ${homeMeta[lang].description}`),
    ...languages.map((lang) => `- [${blogMeta[lang].title}](${siteUrl}/${lang}/blog)`),
    "",
    "## Articles (English)",
    "",
    ...articleLines("en"),
    "",
    "## المقالات (العربية)",
    "",
    ...articleLines("ar"),
    "",
    "## Optional",
    "",
    ...articleLines("tr"),
    ...articleLines("fr"),
    "",
].join("\n"));

fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`Prerendered ${pages.length} pages, sitemap.xml (${entries.length} URLs), robots.txt and llms.txt`);
