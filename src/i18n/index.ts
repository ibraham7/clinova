import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import en from "./locales/en.json";
import tr from "./locales/tr.json";
import fr from "./locales/fr.json";
import siteContent from "../content/site-content.json";

export const languages = [
    { code: "ar", name: "العربية" },
    { code: "en", name: "English" },
    { code: "tr", name: "Türkçe" },
    { code: "fr", name: "Français" },
] as const;
export type SiteLanguage = (typeof languages)[number]["code"];
const storageKey = "clinova.language";

export function isSiteLanguage(value: unknown): value is SiteLanguage {
    return languages.some((language) => language.code === value);
}

// The first path segment carries the language: /ar, /en/, /tr/blog/some-article.
export function languageFromPath(pathname: string): SiteLanguage | undefined {
    const code = /^\/([^/]+)(?:\/|$)/.exec(pathname)?.[1];
    return isSiteLanguage(code) ? code : undefined;
}

export function initialLanguage(pathname = typeof window !== "undefined" ? window.location.pathname : "/"): SiteLanguage {
    const linkedLanguage = languageFromPath(pathname);
    if (linkedLanguage) return linkedLanguage;
    try {
        const saved = localStorage.getItem(storageKey);
        if (isSiteLanguage(saved)) return saved;
    } catch {
        // Language switching remains available when browser storage is blocked.
    }
    return "ar";
}

export function changeSiteLanguage(language: SiteLanguage) {
    if (typeof window !== "undefined") {
        // Keep the visitor on the same page (home, blog or article) in the new language.
        const rest = languageFromPath(window.location.pathname) ? window.location.pathname.replace(/^\/[^/]+/, "").replace(/^\/$/, "") : "";
        const pathname = `/${language}${rest}`;
        if (window.location.pathname !== pathname) window.history.pushState(null, "", `${pathname}${window.location.search}${window.location.hash}`);
    }
    return i18n.changeLanguage(language);
}

export function syncDocumentLanguage(language: string) {
    const code = isSiteLanguage(language) ? language : "ar";
    if (typeof document !== "undefined") {
        document.documentElement.lang = code;
        document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
        document.documentElement.style.setProperty(
            "--clinova-font-family",
            code === "ar"
                ? '"IBM Plex Sans Arabic", "Plus Jakarta Sans", sans-serif'
                : '"Plus Jakarta Sans", "IBM Plex Sans Arabic", sans-serif',
        );
    }
    try {
        localStorage.setItem(storageKey, code);
    } catch {
        // Storage is an optional convenience, never a requirement.
    }
}

i18n.on("languageChanged", syncDocumentLanguage);
void i18n.use(initReactI18next).init({
    // Texts edited in /admin override the built-in translations.
    resources: {
        ar: { translation: { ...ar, ...siteContent.texts.ar } },
        en: { translation: { ...en, ...siteContent.texts.en } },
        tr: { translation: { ...tr, ...siteContent.texts.tr } },
        fr: { translation: { ...fr, ...siteContent.texts.fr } },
    },
    lng: initialLanguage(),
    fallbackLng: "ar",
    supportedLngs: languages.map((language) => language.code),
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    initAsync: false,
});
syncDocumentLanguage(i18n.language);

if (typeof window !== "undefined") {
    window.addEventListener("popstate", () => {
        void i18n.changeLanguage(initialLanguage());
    });
}

export default i18n;
