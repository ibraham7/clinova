import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import type { CountryCode } from "libphonenumber-js/max";
import settings from "./profile-leads.json";

export const profileDocument = "/documents/clinova-profile.pdf";
export const profileFilename = "Clinova-Company-Profile.pdf";
export const profileLeadsEnabled = settings.endpoint.startsWith("https://");
export function normalizeDigits(value: string) {
    return value.replace(/[٠-٩۰-۹]/g, digit => String(digit.charCodeAt(0) - (digit <= "٩" ? 0x660 : 0x6f0)));
}
export function detectContactType(value: string): "email" | "phone" | "unknown" {
    const input = normalizeDigits(value.trim());
    if (input.includes("@") || /[a-z]/i.test(input)) return "email";
    return /^[+\d\s().-]+$/.test(input) && (input.match(/\d/g) ?? []).length >= 5 ? "phone" : "unknown";
}
export function parseContact(value: string, country: CountryCode) {
    const input = normalizeDigits(value.trim());
    if (detectContactType(input) === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || input.length > 254) return null;
        // Preserve the local part, which can be case-sensitive.
        const email = value.trim();
        const at = email.lastIndexOf("@");
        return { type: "email" as const, value: email.slice(0, at) + email.slice(at).toLowerCase() };
    }
    if (detectContactType(input) !== "phone") return null;
    const international = input.startsWith("00") ? "+" + input.slice(2) : input;
    const phone = parsePhoneNumberFromString(international, { defaultCountry: country, extract: false });
    return phone?.isValid() ? { type: "phone" as const, value: String(phone.number), country: phone.country } : null;
}
export type ProfileLead = {
    contact: NonNullable<ReturnType<typeof parseContact>>;
    language: string;
    source: "hero" | "contact_cta";
    marketingConsent: boolean;
    requestId: string;
};
export async function submitProfileLead(lead: ProfileLead, endpoint = settings.endpoint) {
    if (!endpoint.startsWith("https://")) throw new Error("Profile lead endpoint is not configured");
    const url = new URL(endpoint);
    const googleAppsScript = url.hostname === "script.google.com" && /^\/macros\/s\/[^/]+\/exec$/.test(url.pathname);
    const response = await fetch(endpoint, {
        method: "POST", credentials: "omit", signal: AbortSignal.timeout(15000),
        // text/plain allows a simple POST to Apps Script without an unsupported preflight.
        headers: { "Content-Type": googleAppsScript ? "text/plain;charset=UTF-8" : "application/json" },
        body: JSON.stringify({ ...lead, purpose: "company_profile_download" }),
    });
    if (!response.ok) throw new Error("Profile lead could not be saved");
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) throw new Error("CRM did not confirm saving the lead");
}
