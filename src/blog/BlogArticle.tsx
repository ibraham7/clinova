import { Box, Button, Container, Stack, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { SiteLanguage } from "../i18n";
import { useSiteTranslation } from "../i18n/useSiteTranslation";
import { bookingLinkProps } from "../config/contact";
import { articles, findArticle, formatDate, readingMinutes } from "./articles";
import BlogLayout from "./BlogLayout";
import BlogIndex, { ArticleCard } from "./BlogIndex";
import InlineText from "./InlineText";

const bodySx = { fontSize: { xs: "1rem", md: "1.06rem" }, lineHeight: 2.05, color: "var(--clinova-rgba-245-247-250-0_72)" };

export default function BlogArticle({ slug }: { slug: string }) {
    const { t, i18n } = useSiteTranslation();
    const lang = (i18n.resolvedLanguage ?? "ar") as SiteLanguage;
    const article = findArticle(slug)?.translations[lang];
    if (!article) return <BlogIndex />;
    const headings = article.blocks.filter((block) => block.type === "h2");
    const related = articles.filter((item) => item.slug !== slug && item.translations[lang]).slice(0, 3);

    return <BlogLayout>
        <Container maxWidth="md" component="article" sx={{ py: { xs: 5, md: 8 } }}>
            <Box component="nav" aria-label={t("مسار التنقل")} sx={{ mb: 3, fontSize: "0.8rem", color: "text.secondary", "& a": { color: "inherit", textDecoration: "none", "&:hover": { color: "primary.light" } } }}>
                <a href={`/${lang}`}>Clinova</a> <span aria-hidden="true">/</span> <a href={`/${lang}/blog`}>{t("المدونة")}</a>
            </Box>
            <Box component="header" className="clinova-blog-intro">
                <Typography component="h1" sx={{ fontSize: { xs: "1.9rem", md: "2.8rem" }, fontWeight: 700, lineHeight: 1.45, color: "var(--clinova-color-f5f7fa)" }}>{article.title}</Typography>
                <Typography sx={{ mt: 2, fontSize: "0.82rem", color: "text.secondary" }}>
                    {t("فريق Clinova")} · <time dateTime={article.updated ?? article.date}>{formatDate(article.updated ?? article.date, lang)}</time> · {t("{{count}} دقائق قراءة", { count: readingMinutes(article) })}
                </Typography>
            </Box>

            {article.summary && <Box component="aside" className="clinova-blog-summary" sx={{ mt: 4, p: { xs: 2.5, md: 3 }, borderRadius: "20px", border: "1px solid var(--clinova-rgba-142-168-232-0_22)", background: "linear-gradient(135deg, var(--clinova-rgba-142-168-232-0_12), var(--clinova-rgba-142-168-232-0_03))" }}>
                <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 1, color: "primary.light" }}>
                    <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700 }}>{t("الخلاصة")}</Typography>
                </Stack>
                <Typography sx={{ ...bodySx, color: "var(--clinova-color-f5f7fa)" }}><InlineText text={article.summary} /></Typography>
            </Box>}

            {headings.length > 2 && <Box component="nav" aria-label={t("محتوى المقال")} sx={{ mt: 4, p: 2.5, borderRadius: "16px", border: "1px solid var(--clinova-rgba-142-168-232-0_12)" }}>
                <Typography sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600, color: "text.secondary" }}>{t("محتوى المقال")}</Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", "& a": { color: "primary.light", textDecoration: "none", lineHeight: 2, "&:hover": { textDecoration: "underline" } } }}>
                    {headings.map((heading) => <li key={heading.id}><a href={`#${heading.id}`}>{heading.text}</a></li>)}
                </Box>
            </Box>}

            <Box sx={{ mt: 5 }}>
                {article.blocks.map((block, index) => {
                    if (block.type === "h2") return <Typography key={index} component="h2" id={block.id} sx={{ mt: 6, mb: 2, scrollMarginTop: 110, fontSize: { xs: "1.4rem", md: "1.75rem" }, fontWeight: 700, lineHeight: 1.5, color: "var(--clinova-color-f5f7fa)" }}>{block.text}</Typography>;
                    if (block.type === "p") return <Typography key={index} sx={{ ...bodySx, mb: 2.5 }}><InlineText text={block.text} /></Typography>;
                    return <Box key={index} component={block.type} sx={{ ...bodySx, mt: 0, mb: 3, paddingInlineStart: 3, "& li": { mb: 1, "&::marker": { color: "var(--clinova-color-8ea8e8)" } } }}>
                        {block.items.map((item, itemIndex) => <li key={itemIndex}><InlineText text={item} /></li>)}
                    </Box>;
                })}
            </Box>

            {article.faq.length > 0 && <Box component="section" aria-labelledby="article-faq" sx={{ mt: 7 }}>
                <Typography component="h2" id="article-faq" sx={{ mb: 2.5, fontSize: { xs: "1.4rem", md: "1.75rem" }, fontWeight: 700, color: "var(--clinova-color-f5f7fa)" }}>{t("الأسئلة الشائعة")}</Typography>
                {article.faq.map((item, index) => <Box component="details" key={index} open={index === 0} sx={{
                    mb: 1.5, borderRadius: "16px", border: "1px solid var(--clinova-rgba-142-168-232-0_14)", backgroundColor: "var(--clinova-rgba-142-168-232-0_03)",
                    "& summary": { listStyle: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, p: 2.25, fontWeight: 600, color: "var(--clinova-color-f5f7fa)" },
                    "& summary::-webkit-details-marker": { display: "none" },
                    "& .faq-icon": { transition: "rotate 450ms cubic-bezier(0.22, 1, 0.36, 1)" },
                    "&[open] .faq-icon": { rotate: "45deg" },
                }}>
                    <summary><InlineText text={item.q} /><AddRoundedIcon className="faq-icon" sx={{ color: "primary.main", flexShrink: 0 }} /></summary>
                    <Typography sx={{ ...bodySx, px: 2.25, pb: 2.25, mt: -0.5 }}><InlineText text={item.a} /></Typography>
                </Box>)}
            </Box>}

            <Box component="aside" sx={{ mt: 7, p: { xs: 3, md: 4 }, borderRadius: "26px", textAlign: "center", border: "1px solid var(--clinova-rgba-142-168-232-0_22)", background: "radial-gradient(circle at 50% 0%, var(--clinova-rgba-142-168-232-0_16), transparent 60%), var(--clinova-rgba-142-168-232-0_04)" }}>
                <Typography sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" }, fontWeight: 700, color: "var(--clinova-color-f5f7fa)" }}>{t("هل تريد تطبيق هذا في عيادتك؟")}</Typography>
                <Typography sx={{ mt: 1.5, mb: 3, fontSize: "0.92rem", lineHeight: 1.9, color: "text.secondary" }}>{t("تحدث مع فريق Clinova وسنقترح عليك خطوات عملية تناسب عيادتك.")}</Typography>
                <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: 1.5, justifyContent: "center" }}>
                    <Button {...bookingLinkProps} variant="contained" className="clinova-shine" startIcon={<WhatsAppIcon />} sx={{ borderRadius: "999px", px: 3, py: 1.2 }}>{t("تحدث معنا على WhatsApp")}</Button>
                    <Button href={`/${lang}#services`} variant="outlined" sx={{ borderRadius: "999px", px: 3, py: 1.2 }}>{t("اكتشف خدمات Clinova")}</Button>
                </Stack>
            </Box>
        </Container>

        {related.length > 0 && <Container maxWidth="lg" component="section" aria-labelledby="related-articles" sx={{ pb: { xs: 8, md: 12 } }}>
            <Typography component="h2" id="related-articles" sx={{ mb: 3, fontSize: { xs: "1.3rem", md: "1.6rem" }, fontWeight: 700, color: "var(--clinova-color-f5f7fa)" }}>{t("مقالات ذات صلة")}</Typography>
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
                {related.map((item) => <ArticleCard key={item.slug} slug={item.slug} lang={lang} />)}
            </Box>
        </Container>}
    </BlogLayout>;
}
