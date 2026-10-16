import type { ReactNode } from "react";
import { AppBar, Box, Button, Container, Stack, Toolbar } from "@mui/material";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import clinovaLogo from "../../public/logo/logo.png";
import { bookingLinkProps } from "../config/contact";
import { useSiteTranslation } from "../i18n/useSiteTranslation";
import Footer from "../components/layout/Footer";
import LanguageSwitcher from "../components/layout/LanguageSwitcher";
import ThemeToggle from "../components/layout/ThemeToggle";
import ScrollProgress from "../components/motion/ScrollProgress";

const linkSx = {
    px: 1.5, py: 1, borderRadius: "999px", fontSize: "0.85rem", color: "var(--clinova-rgba-245-247-250-0_72)", textDecoration: "none",
    transition: "color 450ms ease, background-color 450ms ease",
    "&:hover": { color: "var(--clinova-color-f5f7fa)", backgroundColor: "var(--clinova-rgba-142-168-232-0_08)" },
};

/** Shell for blog pages: a compact header with links back to the site, and the shared footer. */
export default function BlogLayout({ children }: { children: ReactNode }) {
    const { t, i18n } = useSiteTranslation();
    const language = i18n.resolvedLanguage ?? "ar";
    return <Box sx={{ minHeight: "100vh", background: "radial-gradient(circle at 15% 0%, var(--clinova-rgba-142-168-232-0_1), transparent 30%), var(--clinova-color-0b111b)" }}>
        <ScrollProgress />
        <AppBar position="sticky" elevation={0} sx={{ background: "transparent", py: { xs: 1.25, md: 2 } }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{
                    minHeight: { xs: 60, md: 68 }, px: { xs: 1.5, md: 2.5 }, gap: 1, borderRadius: "999px",
                    border: "1px solid var(--clinova-rgba-142-168-232-0_22)",
                    background: "linear-gradient(115deg, var(--clinova-rgba-26-38-59-0_94), var(--clinova-rgba-11-17-27-0_94) 58%)",
                    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                }}>
                    <Box component="a" href={`/${language}`} sx={{ display: "flex", flexShrink: 0 }}>
                        <Box component="img" src={clinovaLogo} alt="Clinova Healthcare" sx={{ width: { xs: 104, md: 128 }, height: "auto", filter: "var(--clinova-logo-filter)" }} />
                    </Box>
                    <Box component="nav" aria-label={t("التنقل الرئيسي")} sx={{ flex: 1, display: { xs: "none", sm: "flex" }, justifyContent: "center", gap: 0.5 }}>
                        <Box component="a" href={`/${language}`} sx={linkSx}>{t("الرئيسية")}</Box>
                        <Box component="a" href={`/${language}/blog`} sx={linkSx}>{t("المدونة")}</Box>
                    </Box>
                    <Stack direction="row" sx={{ gap: 1, alignItems: "center", marginInlineStart: { xs: "auto", sm: 0 } }}>
                        <ThemeToggle compact />
                        <LanguageSwitcher compact />
                        <Button {...bookingLinkProps} className="clinova-shine" endIcon={<PhoneRoundedIcon />} sx={{
                            display: { xs: "none", md: "inline-flex" }, borderRadius: "999px", px: 2.25, minHeight: 42,
                            background: "linear-gradient(135deg, var(--clinova-color-b8c8ef), var(--clinova-color-8ea8e8) 55%, var(--clinova-color-7894d2))",
                            color: "var(--clinova-color-0b111b)", "& .MuiButton-endIcon": { margin: 0, marginInlineStart: "8px" },
                        }}>{t("احجز موعد")}</Button>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
        <Box component="main">{children}</Box>
        <Footer linkBase={`/${language}`} />
    </Box>;
}
