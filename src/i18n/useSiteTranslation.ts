import { useTranslation } from "react-i18next";

export function useSiteTranslation() {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.resolvedLanguage === "ar";
    return {
        t: (text: string, values: Record<string, string | number> = {}) => t(text, { defaultValue: text, ...values }),
        direction: isRtl ? "rtl" as const : "ltr" as const,
        isRtl,
        i18n,
    };
}
