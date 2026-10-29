import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useSiteTranslation } from "../i18n/useSiteTranslation";
import { savedConsent, setConsent } from "../analytics/consent";

const openEvent = "clinova:consent-open";

/** Shows the banner again so the visitor can change their choice (footer and privacy page link). */
export function openConsentSettings() {
    window.dispatchEvent(new Event(openEvent));
}

/** Asks once before any ad or session-recording tool loads. Rendered only in the browser, never in prerendered pages. */
export default function ConsentBanner() {
    const { t, i18n } = useSiteTranslation();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (!savedConsent()) setOpen(true);
        const show = () => setOpen(true);
        window.addEventListener(openEvent, show);
        return () => window.removeEventListener(openEvent, show);
    }, []);
    if (!open) return null;
    const choose = (value: "granted" | "denied") => { setConsent(value); setOpen(false); };
    const lang = i18n.resolvedLanguage ?? "ar";
    return <Box role="dialog" aria-live="polite" aria-label={t("إعدادات الكوكيز")} sx={{
        position: "fixed", insetInline: { xs: 12, md: "auto" }, insetInlineStart: { md: 24 }, bottom: { xs: 12, md: 24 }, zIndex: 1400,
        maxWidth: { md: 440 }, p: 2.5, borderRadius: "20px", border: "1px solid var(--clinova-rgba-142-168-232-0_22)",
        background: "linear-gradient(135deg, var(--clinova-rgba-26-38-59-0_94), var(--clinova-rgba-11-17-27-0_94))",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "0 18px 40px var(--clinova-rgba-0-0-0-0_28)",
    }}>
        <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.9, color: "var(--clinova-rgba-245-247-250-0_72)" }}>
            {t("نستخدم كوكيز لأدوات الإعلانات والتحليل (Meta وGoogle وMicrosoft Clarity) فقط إذا وافقت. إحصاءاتنا الخاصة لا تستخدم كوكيز.")}{" "}
            <Box component="a" href={`/${lang}/privacy`} sx={{ color: "primary.light" }}>{t("سياسة الخصوصية")}</Box>
        </Typography>
        <Stack direction="row" sx={{ mt: 2, gap: 1, justifyContent: "flex-end" }}>
            <Button variant="outlined" size="small" onClick={() => choose("denied")}>{t("رفض")}</Button>
            <Button variant="contained" size="small" onClick={() => choose("granted")}>{t("قبول")}</Button>
        </Stack>
    </Box>;
}
