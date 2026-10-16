import { useSyncExternalStore } from "react";
import siteEn from "../i18n/locales/en.json";
import siteTr from "../i18n/locales/tr.json";
import siteFr from "../i18n/locales/fr.json";
import { adminTranslations } from "./translations";

// The admin panel's own language (separate from the site's), chosen in the panel and remembered per browser.
// Arabic strings in the code are the keys; translations live in ./translations.ts, and site texts (survey
// questions, section names) fall back to the site's own locale files.
export type AdminLang = "ar" | "en" | "tr" | "fr";
export const adminLanguages: Record<AdminLang, string> = { ar: "العربية", en: "English", tr: "Türkçe", fr: "Français" };
const storageKey = "clinova.admin.lang";
const site: Record<Exclude<AdminLang, "ar">, Record<string, string>> = { en: siteEn, tr: siteTr, fr: siteFr };
const column = { en: 0, tr: 1, fr: 2 } as const;

function initial(): AdminLang {
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved === "ar" || saved === "en" || saved === "tr" || saved === "fr") return saved;
    } catch { /* Storage blocked or server render. */ }
    return "ar";
}

let current: AdminLang = typeof window === "undefined" ? "ar" : initial();
const listeners = new Set<() => void>();

export const getAdminLang = () => current;
export const isRtl = (lang: AdminLang = current) => lang === "ar";
/** Locale for numbers and dates in the current admin language. */
export const adminLocale = (lang: AdminLang = current) => ({ ar: "ar", en: "en-GB", tr: "tr-TR", fr: "fr-FR" })[lang];

export function setAdminLang(lang: AdminLang) {
    current = lang;
    try { localStorage.setItem(storageKey, lang); } catch { /* Optional. */ }
    listeners.forEach((listener) => listener());
}

/** Re-renders the component when the admin language changes. */
export function useAdminLang() {
    return useSyncExternalStore((listener) => { listeners.add(listener); return () => listeners.delete(listener); }, getAdminLang, () => "ar" as AdminLang);
}

/** Translates one Arabic string into the current admin language (unknown strings stay as they are). */
export function tr(text: string): string {
    if (current === "ar" || !text) return text;
    return adminTranslations[text]?.[column[current]] ?? site[current][text] ?? text;
}

/** Fills {name} placeholders after translating the template. */
export function fill(template: string, values: Record<string, string | number>) {
    return tr(template).replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/**
 * Wraps a constant object of Arabic texts so every string read from it is translated at the moment it is
 * read. The objects stay plain module constants, and switching language only needs a re-render.
 */
export function translated<T extends object>(texts: T): T {
    return new Proxy(texts, {
        get(target, key, receiver) {
            const value = Reflect.get(target, key, receiver);
            if (typeof value === "string") return tr(value);
            if (value && typeof value === "object") return translated(value);
            return value;
        },
    });
}
