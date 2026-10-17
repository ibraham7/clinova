import { Box, Container, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { SiteLanguage } from "../i18n";
import { useSiteTranslation } from "../i18n/useSiteTranslation";
import { blogMeta } from "../seo/meta";
import { articles, formatDate, readingMinutes } from "./articles";
import BlogLayout from "./BlogLayout";

export function ArticleCard({ slug, lang }: { slug: string; lang: SiteLanguage }) {
    const { t, isRtl } = useSiteTranslation();
    const article = articles.find((item) => item.slug === slug)?.translations[lang];
    if (!article) return null;
    const Arrow = isRtl ? ArrowBackRoundedIcon : ArrowForwardRoundedIcon;
    return <Box component="article" sx={{
        position: "relative", display: "flex", flexDirection: "column", gap: 1.5, p: 3, borderRadius: "24px",
        border: "1px solid var(--clinova-rgba-142-168-232-0_14)",
        background: "linear-gradient(160deg, var(--clinova-rgba-142-168-232-0_08), var(--clinova-rgba-142-168-232-0_025) 60%)",
        transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), border-color 500ms ease, box-shadow 600ms ease",
        "&:hover": { transform: "translateY(-6px)", borderColor: "var(--clinova-rgba-142-168-232-0_35)", boxShadow: "0 18px 40px var(--clinova-rgba-0-0-0-0_28)" },
        "&:hover .clinova-card-arrow": { translate: isRtl ? "-4px 0" : "4px 0" },
    }}>
        {article.cover && <Box component="img" src={article.cover} alt="" loading="lazy" sx={{ mx: -3, mt: -3, mb: 0.5, width: "calc(100% + 48px)", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: "24px 24px 0 0", display: "block" }} />}
        <Typography sx={{ fontSize: "0.72rem", color: "primary.main" }}>{formatDate(article.date, lang)} · {t("{{count}} دقائق قراءة", { count: readingMinutes(article) })}</Typography>
        <Typography component="h2" sx={{ fontSize: "1.15rem", fontWeight: 600, lineHeight: 1.6, color: "var(--clinova-color-f5f7fa)" }}>
            {/* The whole card is clickable through this link's stretched overlay. */}
            <Box component="a" href={`/${lang}/blog/${slug}`} sx={{ color: "inherit", textDecoration: "none", "&::after": { content: '""', position: "absolute", inset: 0, borderRadius: "24px" } }}>{article.title}</Box>
        </Typography>
        <Typography sx={{ flex: 1, fontSize: "0.88rem", lineHeight: 1.9, color: "text.secondary" }}>{article.description}</Typography>
        <Stack direction="row" sx={{ alignItems: "center", gap: 0.75, color: "primary.light", fontSize: "0.85rem" }}>
            {t("اقرأ المقال")}<Arrow className="clinova-card-arrow" sx={{ fontSize: 18, transition: "translate 500ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
        </Stack>
    </Box>;
}

export default function BlogIndex() {
    const { i18n } = useSiteTranslation();
    const lang = (i18n.resolvedLanguage ?? "ar") as SiteLanguage;
    const meta = blogMeta[lang];
    const posts = articles.filter((article) => article.translations[lang]);
    return <BlogLayout>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
            <Box component="header" className="clinova-blog-intro" sx={{ maxWidth: 760, mb: { xs: 5, md: 8 } }}>
                <Typography component="h1" sx={{ fontSize: { xs: "2.2rem", md: "3.6rem" }, fontWeight: 600, lineHeight: 1.3, color: "var(--clinova-color-f5f7fa)" }}>{meta.heading}</Typography>
                <Typography sx={{ mt: 2.5, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 2, color: "text.secondary" }}>{meta.intro}</Typography>
            </Box>
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" } }}>
                {posts.map((post, index) => <Box key={post.slug} className="clinova-blog-card" style={{ animationDelay: `${120 + index * 80}ms` }} sx={{ display: "flex", "& > article": { flex: 1 } }}>
                    <ArticleCard slug={post.slug} lang={lang} />
                </Box>)}
            </Box>
        </Container>
    </BlogLayout>;
}
