import { isAdmin, readJson, reply, sameOrigin } from "../lib/admin.mjs";
import { articleError, splitArticle } from "../lib/articles.mjs";
import { GeminiError, generateText } from "../lib/gemini.mjs";

// Serena as the blog writer in the admin panel (Google Gemini):
//   POST { action: "draft", topic, notes? }        → { markdown } an Arabic article in the blog's Markdown
//   POST { action: "translate", markdown, to }     → { markdown } the same article in English, Turkish or French
// The admin reviews and edits everything before it is published (admin-articles).
const languageNames = { ar: "Arabic", en: "English", tr: "Turkish", fr: "French" };

const format = (lang) => `Output ONLY the article in this exact format, nothing before or after it, no code fences:
---
title: <the article title, at most 90 characters>
description: <one or two sentences for search results, at most 160 characters>
---
> <the key takeaway in one or two sentences; **bold** the main term>

## <section heading>

<paragraphs, "- " bullet lists or "1. " numbered lists>

(4 to 6 "##" sections in total, the last one about how Clinova helps, ending with a link to [talk to our team](/${lang}#contact-cta))

Q: <a question clinic owners ask>
A: <a short answer>
(3 question and answer pairs)

Rules for the Markdown: only the elements above, **bold** and [links](/path). No other headings, HTML, images, tables, emojis or code. Every line of front matter on one line.`;

const clinova = "Clinova (clinova.novanoai.online) is a growth partner for medical clinics (dentistry, dermatology and aesthetics, plastic surgery, hair transplant) in Turkey and the Arab world: patient acquisition (Google, Meta, SEO), a clinic CRM, 24/7 WhatsApp replies by AI plus a human team, booking, treatment coordination, reactivating past patients and reputation. The blog is read by clinic owners and managers.";

function clean(text) {
    const trimmed = text.trim().replace(/^```[a-z]*\n/i, "").replace(/\n```$/, "").trim();
    const start = trimmed.indexOf("---");
    return start > 0 ? trimmed.slice(start) : trimmed;
}

async function existingArticles(origin) {
    try {
        const response = await fetch(`${origin}/blog/articles.json`);
        return response.ok ? await response.json() : [];
    } catch { return []; }
}

export default async function handler(request) {
    if (!isAdmin(request)) return reply(401, { ok: false, error: "signed_out" });
    if (request.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });
    if (!sameOrigin(request)) return reply(403, { ok: false, error: "invalid_origin" });
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return reply(503, { ok: false, error: "serena_not_configured" });
    let body;
    try { body = await readJson(request, 200_000); } catch { return reply(413, { ok: false, error: "too_large" }); }
    const origin = new URL(request.url).origin;
    try {
        let system, prompt, lang;
        if (body?.action === "draft") {
            const topic = typeof body.topic === "string" ? body.topic.trim().slice(0, 500) : "";
            if (topic.length < 3) return reply(400, { ok: false, error: "article_topic_missing" });
            const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 3000) : "";
            const others = (await existingArticles(origin)).map((article) => `- ${article.title}: /ar/blog/${article.slug}`).join("\n");
            lang = "ar";
            system = `You are Serena, Clinova's content writer. ${clinova}
Write a practical, original blog article in Modern Standard Arabic for clinic owners: concrete steps, examples and numbers they can use, a confident and warm tone, no exaggerated promises, no invented statistics or studies. 600 to 900 words. Where it fits naturally, link 1 to 3 of these existing articles (never more than once each, never invent other links):
${others || "(none yet)"}
${format("ar")}`;
            prompt = `Topic: ${topic}${notes ? `\nNotes from the team: ${notes}` : ""}`;
        } else if (body?.action === "translate") {
            lang = body.to;
            if (!["en", "tr", "fr"].includes(lang) || typeof body.markdown !== "string" || articleError(body.markdown)) return reply(400, { ok: false, error: "article_invalid" });
            system = `You are Serena, Clinova's content writer and translator. ${clinova}
Translate the Arabic blog article the user sends into ${languageNames[lang]} for clinic owners in that market: natural, fluent marketing language, not word for word. Keep every element and its order exactly (front matter keys, the "> " takeaway, "##" headings, lists, **bold**, Q:/A: pairs). Keep brand and product names (Clinova, WhatsApp, Google, Meta, CRM). In links, keep the target but change the language part of site paths from /ar/ to /${lang}/ (for example /ar/blog/x → /${lang}/blog/x and /ar#contact-cta → /${lang}#contact-cta). Keep the front matter keys in English and only translate their values; drop any "cover", "date" or "updated" lines.
${format(lang)}`;
            prompt = body.markdown;
        } else return reply(400, { ok: false, error: "invalid_request" });

        const result = await generateText(apiKey, { system, prompt, maxOutputTokens: 4000, budgetMs: 25_000 });
        const markdown = clean(result.text);
        const parts = splitArticle(markdown);
        // A rough draft still comes back so the admin can fix it, with a note when the format needs a look.
        return reply(200, { ok: true, markdown, lang, check: parts ? null : "format", truncated: result.truncated });
    } catch (error) {
        const status = error instanceof GeminiError ? error.status : 0;
        const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError" || status === 504;
        return reply(502, { ok: false, error: status === 429 ? "rate_limited" : [400, 401, 403].includes(status) ? "bad_key" : timedOut ? "timeout" : "failed", detail: String(error?.message ?? "").slice(0, 200) });
    }
}
