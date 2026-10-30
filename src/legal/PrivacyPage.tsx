import { Box, Container, Typography } from "@mui/material";
import type { SiteLanguage } from "../i18n";
import { useSiteTranslation } from "../i18n/useSiteTranslation";
import BlogLayout from "../blog/BlogLayout";
import InlineText from "../blog/InlineText";
import { formatDate } from "../blog/articles";
import { contactEmail, contactPhone } from "../seo/site";
import { openConsentSettings } from "./ConsentBanner";
import { privacy, privacyUpdated } from "./privacy";

const bodySx = { fontSize: { xs: "1rem", md: "1.04rem" }, lineHeight: 2, color: "var(--clinova-rgba-245-247-250-0_72)" };

export default function PrivacyPage() {
    const { t, i18n } = useSiteTranslation();
    const lang = (i18n.resolvedLanguage ?? "ar") as SiteLanguage;
    const text = privacy[lang];
    return <BlogLayout>
        <Container maxWidth="md" component="article" sx={{ py: { xs: 5, md: 8 } }}>
            <Typography component="h1" sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, fontWeight: 700, color: "var(--clinova-color-f5f7fa)" }}>{text.title}</Typography>
            <Typography sx={{ mt: 1.5, fontSize: "0.82rem", color: "text.secondary" }}>{text.updated}: <time dateTime={privacyUpdated}>{formatDate(privacyUpdated, lang)}</time></Typography>
            {text.sections.map((section) => <Box component="section" key={section.heading} sx={{ mt: 4 }}>
                <Typography component="h2" sx={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--clinova-color-f5f7fa)", mb: 1.5 }}>{section.heading}</Typography>
                {section.paragraphs.map((paragraph) => <Typography key={paragraph.slice(0, 40)} sx={{ ...bodySx, mb: 1.5 }}><InlineText text={paragraph} /></Typography>)}
            </Box>)}
            <Box component="section" sx={{ mt: 4, p: 2.5, borderRadius: "16px", border: "1px solid var(--clinova-rgba-142-168-232-0_22)" }}>
                <Typography sx={bodySx}>
                    {t("تواصل")}: <a href={`mailto:${contactEmail}`} style={{ color: "inherit" }}>{contactEmail}</a> · <a href={`tel:${contactPhone}`} dir="ltr" style={{ color: "inherit" }}>{contactPhone}</a>
                </Typography>
                <Box component="button" type="button" onClick={openConsentSettings} sx={{ mt: 1.5, p: 0, border: 0, background: "none", color: "primary.light", font: "inherit", cursor: "pointer", textDecoration: "underline" }}>{t("إعدادات الكوكيز")}</Box>
            </Box>
        </Container>
    </BlogLayout>;
}
