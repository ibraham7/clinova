import ar from "../i18n/locales/ar.json";
import en from "../i18n/locales/en.json";
import tr from "../i18n/locales/tr.json";
import fr from "../i18n/locales/fr.json";
import { languages, type SiteLanguage } from "../i18n";
import { articles, findArticle } from "../blog/articles";
import { plainText } from "../blog/parse";
import { faqs } from "../config/faq";
import type { Route } from "../routes";
import { routePath } from "../routes";
import { blogMeta, homeMeta } from "./meta";
import { services } from "./services";
import { localized, siteContent, videoPoster, youtubeId } from "../content/siteContent";
import { areaServed, bingSiteVerification, contactEmail, contactPhone, googleSiteVerification, siteName, siteUrl, socialProfiles } from "./site";

const dictionaries: Record<SiteLanguage, Record<string, string>> = { ar, en, tr, fr };
const ogLocales: Record<SiteLanguage, string> = { ar: "ar_AR", en: "en_US", tr: "tr_TR", fr: "fr_FR" };
const blogLabels: Record<SiteLanguage, string> = { ar: "المدونة", en: "Blog", tr: "Blog", fr: "Blog" };

export type PageHead = {
    lang: SiteLanguage;
    dir: "rtl" | "ltr";
    title: string;
    description: string;
    canonical: string;
    alternates: { hreflang: string; href: string }[];
    ogType: "website" | "article";
    ogImage: string;
    ogLocale: string;
    ogLocaleAlternates: string[];
    jsonLd: object[];
    verification: { name: string; content: string }[];
    article?: { published: string; modified: string };
};

const organizationId = `${siteUrl}/#organization`;

function translate(lang: SiteLanguage, key: string) {
    return dictionaries[lang][key] ?? key;
}

function organization(lang: SiteLanguage) {
    return {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        alternateName: "Clinova Healthcare",
        url: siteUrl,
        logo: `${siteUrl}/logo/logo.png`,
        description: homeMeta[lang].description,
        email: contactEmail,
        telephone: contactPhone,
        sameAs: socialProfiles,
        areaServed: areaServed.map((name) => ({ "@type": "Country", name })),
        knowsAbout: ["Medical marketing", "Dental clinic marketing", "Healthcare CRM", "Patient acquisition", "WhatsApp automation", "Online reputation management"],
        contactPoint: {
            "@type": "ContactPoint",
            telephone: contactPhone,
            contactType: "sales",
            availableLanguage: ["Arabic", "English", "Turkish", "French"],
        },
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: lang === "ar" ? "خدمات Clinova" : `${siteName} services`,
            itemListElement: services[lang].map((service) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: service.name, description: service.description, provider: { "@id": organizationId } },
            })),
        },
    };
}

function breadcrumbs(items: { name: string; url: string }[]) {
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.url })),
    };
}

function faqPage(items: { q: string; a: string }[], url: string, lang: SiteLanguage) {
    return {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: lang,
        mainEntity: items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
    };
}

/** Languages a route exists in (articles may not be translated into every language). */
export function routeLanguages(route: Route): SiteLanguage[] {
    const all = languages.map((language) => language.code) as SiteLanguage[];
    if (route.kind !== "article") return all;
    const article = findArticle(route.slug);
    return all.filter((lang) => article?.translations[lang]);
}

export function buildHead(route: Route, lang: SiteLanguage): PageHead {
    const path = routePath(route, lang);
    const canonical = `${siteUrl}${path}`;
    const available = routeLanguages(route);
    const alternates = [
        ...available.map((code) => ({ hreflang: code, href: `${siteUrl}${routePath(route, code)}` })),
        { hreflang: "x-default", href: `${siteUrl}${routePath(route, available.includes("ar") ? "ar" : available[0])}` },
    ];
    const base = {
        lang,
        dir: lang === "ar" ? "rtl" as const : "ltr" as const,
        canonical,
        alternates,
        ogImage: `${siteUrl}/og/clinova-${lang}.png`,
        ogLocale: ogLocales[lang],
        ogLocaleAlternates: available.filter((code) => code !== lang).map((code) => ogLocales[code]),
        verification: [
            ...(googleSiteVerification ? [{ name: "google-site-verification", content: googleSiteVerification }] : []),
            ...(bingSiteVerification ? [{ name: "msvalidate.01", content: bingSiteVerification }] : []),
        ],
    };
    const website = { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: siteName, inLanguage: available, publisher: { "@id": organizationId } };

    if (route.kind === "article") {
        const article = findArticle(route.slug)?.translations[lang];
        if (!article) throw new Error(`Missing article ${route.slug} in ${lang}`);
        const blogUrl = `${siteUrl}/${lang}/blog`;
        return {
            ...base,
            // Search results show roughly 60 characters; add the brand only when it still fits.
            title: (() => { const title = article.seoTitle ?? article.title; return title.length <= 48 ? `${title} | ${siteName}` : title; })(),
            description: article.description,
            ogType: "article",
            article: { published: article.date, modified: article.updated ?? article.date },
            jsonLd: [
                {
                    "@type": "BlogPosting",
                    "@id": `${canonical}#article`,
                    headline: article.title,
                    description: article.description,
                    abstract: plainText(article.summary),
                    inLanguage: lang,
                    datePublished: article.date,
                    dateModified: article.updated ?? article.date,
                    wordCount: article.words,
                    image: base.ogImage,
                    url: canonical,
                    mainEntityOfPage: canonical,
                    author: { "@id": organizationId },
                    publisher: { "@id": organizationId },
                    isPartOf: { "@type": "Blog", "@id": `${blogUrl}#blog`, url: blogUrl, name: blogMeta[lang].title },
                },
                breadcrumbs([
                    { name: siteName, url: `${siteUrl}/${lang}` },
                    { name: blogLabels[lang], url: blogUrl },
                    { name: article.title, url: canonical },
                ]),
                ...(article.faq.length ? [faqPage(article.faq.map((item) => ({ q: plainText(item.q), a: plainText(item.a) })), canonical, lang)] : []),
                organization(lang),
            ],
        };
    }

    if (route.kind === "blog") {
        const posts = articles.filter((article) => article.translations[lang]);
        return {
            ...base,
            title: blogMeta[lang].title,
            description: blogMeta[lang].description,
            ogType: "website",
            jsonLd: [
                {
                    "@type": "Blog",
                    "@id": `${canonical}#blog`,
                    url: canonical,
                    name: blogMeta[lang].title,
                    description: blogMeta[lang].description,
                    inLanguage: lang,
                    publisher: { "@id": organizationId },
                    blogPost: posts.map((post) => ({
                        "@type": "BlogPosting",
                        headline: post.translations[lang]!.title,
                        url: `${siteUrl}/${lang}/blog/${post.slug}`,
                        datePublished: post.translations[lang]!.date,
                    })),
                },
                breadcrumbs([{ name: siteName, url: `${siteUrl}/${lang}` }, { name: blogLabels[lang], url: canonical }]),
                organization(lang),
            ],
        };
    }

    return {
        ...base,
        title: homeMeta[lang].title,
        description: homeMeta[lang].description,
        ogType: "website",
        jsonLd: [
            organization(lang),
            website,
            faqPage(faqs.map((item) => ({ q: translate(lang, item.question), a: translate(lang, item.answer) })), canonical, lang),
            ...siteContent.videos.map((video) => {
                const id = youtubeId(video.url);
                return {
                    "@type": "VideoObject",
                    name: `${video.name} | ${siteName}`,
                    description: localized(video.quote, lang) || localized(video.details, lang) || video.name,
                    thumbnailUrl: videoPoster(video),
                    uploadDate: video.addedAt,
                    ...(id ? { embedUrl: `https://www.youtube.com/embed/${id}` } : { contentUrl: video.url }),
                    publisher: { "@id": organizationId },
                };
            }),
        ],
    };
}

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Static <head> tags for prerendered pages. */
export function headTags(head: PageHead) {
    const meta = (attr: "name" | "property", key: string, content: string) => `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
    const graph = JSON.stringify({ "@context": "https://schema.org", "@graph": head.jsonLd }).replace(/</g, "\\u003c");
    return [
        `<title>${escapeHtml(head.title)}</title>`,
        meta("name", "description", head.description),
        `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
        `<link rel="canonical" href="${head.canonical}" />`,
        ...head.alternates.map((alternate) => `<link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />`),
        meta("property", "og:type", head.ogType),
        meta("property", "og:site_name", siteName),
        meta("property", "og:title", head.title),
        meta("property", "og:description", head.description),
        meta("property", "og:url", head.canonical),
        meta("property", "og:image", head.ogImage),
        meta("property", "og:image:width", "1200"),
        meta("property", "og:image:height", "630"),
        meta("property", "og:locale", head.ogLocale),
        ...head.ogLocaleAlternates.map((locale) => meta("property", "og:locale:alternate", locale)),
        ...(head.article ? [meta("property", "article:published_time", head.article.published), meta("property", "article:modified_time", head.article.modified)] : []),
        meta("name", "twitter:card", "summary_large_image"),
        meta("name", "twitter:title", head.title),
        meta("name", "twitter:description", head.description),
        meta("name", "twitter:image", head.ogImage),
        ...head.verification.map((item) => meta("name", item.name, item.content)),
        `<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly summary" />`,
        `<script type="application/ld+json">${graph}</script>`,
    ].join("\n    ");
}

/** Keeps the live document's title, description and canonical in step after a language switch. */
export function applyHead(head: PageHead) {
    document.title = head.title;
    const set = (selector: string, attr: string, value: string) => document.head.querySelector(selector)?.setAttribute(attr, value);
    set('meta[name="description"]', "content", head.description);
    set('link[rel="canonical"]', "href", head.canonical);
    set('meta[property="og:title"]', "content", head.title);
    set('meta[property="og:description"]', "content", head.description);
    set('meta[property="og:url"]', "content", head.canonical);
}
