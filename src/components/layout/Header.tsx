import { useEffect, useId, useState } from "react";
import { AppBar, Box, Button, Container, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography, useMediaQuery } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import clinovaLogo from "../../../public/logo/logo.png";
import { bookingLinkProps } from "../../config/contact";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems: { label: string; short?: string; href: string; icon: typeof HomeRoundedIcon }[] = [
    { label: "الرئيسية", href: "#home", icon: HomeRoundedIcon },
    { label: "من نحن", href: "#about", icon: InfoRoundedIcon },
    { label: "لماذا Clinova؟", href: "#reach", icon: AutoAwesomeRoundedIcon },
    { label: "خدماتنا", href: "#services", icon: WidgetsRoundedIcon },
    { label: "رحلة المريض", href: "#contact-system", icon: RouteRoundedIcon },
    { label: "تخصصاتنا", href: "#specialties", icon: MedicalServicesRoundedIcon },
    { label: "قصص النجاح", href: "#case-studies", icon: TrendingUpRoundedIcon },
    { label: "شركاؤنا", href: "#partners", icon: HandshakeRoundedIcon },
    { label: "الأسئلة الشائعة", short: "أسئلة شائعة", href: "#faq", icon: HelpOutlineRoundedIcon },
    { label: "تواصل معنا", href: "#contact-cta", icon: PhoneRoundedIcon },
];

const bookingStyle = {
    borderRadius: "999px", flexShrink: 0, minHeight: 44,
    background: "linear-gradient(135deg, var(--clinova-color-b8c8ef), var(--clinova-color-8ea8e8) 55%, var(--clinova-color-7894d2))",
    color: "var(--clinova-color-0b111b)", boxShadow: "0 4px 20px var(--clinova-rgba-142-168-232-0_16)",
    "& .MuiButton-endIcon": { margin: 0, marginInlineStart: "10px" },
    "&:hover": { background: "var(--clinova-color-b8c8ef)", boxShadow: "0 6px 24px var(--clinova-rgba-142-168-232-0_24)" },
};

function Logo({ compact = false }: { compact?: boolean }) {
    return <Box component="a" href="#home" sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Box component="img" src={clinovaLogo} alt="Clinova Healthcare" sx={{ width: compact ? { xs: 108, sm: 130 } : 145, height: "auto", display: "block", filter: "var(--clinova-logo-filter)" }} />
    </Box>;
}

export default function Header() {
    const { t, isRtl, direction } = useSiteTranslation();
    const compact = useMediaQuery("(max-width:1399px)");
    const [active, setActive] = useState("#home");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const drawerId = useId();

    useEffect(() => {
        // A narrow viewport band tracks the section the visitor is reading.
        const observer = new IntersectionObserver((entries) => {
            const visible = entries.filter((entry) => entry.isIntersecting)
                .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
            if (visible[0]) setActive(`#${visible[0].target.id}`);
        }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
        navItems.forEach((item) => {
            const section = document.getElementById(item.href.slice(1));
            if (section) observer.observe(section);
        });
        return () => observer.disconnect();
    }, []);

    const select = (href: string) => {
        setActive(href);
        setDrawerOpen(false);
    };

    return <>
        <AppBar position="fixed" elevation={0} sx={{ background: "transparent", py: { xs: 1.25, md: 2 }, pointerEvents: "none" }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>
                <Toolbar disableGutters className="clinova-header-bar" sx={{
                    minHeight: { xs: 64, md: 76 }, px: { xs: 1.25, md: 2.5 }, gap: { xs: 0.75, sm: 1.5 },
                    direction: "ltr", flexDirection: compact || isRtl ? "row" : "row-reverse",
                    borderRadius: "999px", border: "1px solid var(--clinova-rgba-142-168-232-0_22)",
                    background: "linear-gradient(115deg, var(--clinova-rgba-26-38-59-0_94), var(--clinova-rgba-11-17-27-0_94) 58%)",
                    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 12px 40px var(--clinova-rgba-0-0-0-0_28), inset 0 1px 0 var(--clinova-rgba-184-200-239-0_06)",
                    pointerEvents: "auto",
                }}>
                    {compact ? <>
                        <Box sx={{ flex: 1, minWidth: 0 }}><Logo compact /></Box>
                        <ThemeToggle compact />
                        <LanguageSwitcher compact />
                        <Button {...bookingLinkProps} className="clinova-shine" endIcon={<PhoneRoundedIcon />} sx={{ ...bookingStyle, "@media (max-width:399px)": { display: "none" }, px: { xs: 1.4, sm: 2 }, fontSize: "0.8rem" }}>{t("احجز")}</Button>
                        <IconButton aria-label={t("فتح قائمة التنقل")} aria-expanded={drawerOpen} aria-controls={drawerOpen ? drawerId : undefined} onClick={() => setDrawerOpen(true)} sx={{ width: 42, height: 42, color: "primary.light", backgroundColor: "var(--clinova-rgba-142-168-232-0_08)", border: "1px solid var(--clinova-rgba-142-168-232-0_16)" }}><MenuRoundedIcon /></IconButton>
                    </> : <>
                        <Button {...bookingLinkProps} className="clinova-shine" endIcon={<PhoneRoundedIcon />} sx={{ ...bookingStyle, px: 2.5 }}>{t("احجز موعد")}</Button>
                        <ThemeToggle />
                        <LanguageSwitcher />
                        <Box component="nav" dir={direction} aria-label={t("التنقل الرئيسي")} sx={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
                            <Stack direction="row" sx={{ width: "100%", maxWidth: 1040, alignItems: "stretch", justifyContent: "space-between", px: { lg: 1, xl: 2 } }}>
                                {navItems.map((item, index) => {
                                    const current = active === item.href;
                                    return <Button
                                        component="a" href={item.href} key={item.href} onClick={() => select(item.href)} aria-current={current ? "location" : undefined}
                                        className="clinova-nav-item" style={{ animationDelay: `${120 + index * 45}ms` }}
                                        sx={{ minWidth: 0, maxWidth: { lg: 84, xl: 104 }, px: { lg: 0.6, xl: 1 }, py: 0.75, gap: 0.4, flexDirection: "column", justifyContent: "flex-start", borderRadius: "18px", fontSize: { lg: "0.7rem", xl: "0.76rem" }, lineHeight: 1.2, textAlign: "center", fontWeight: current ? 600 : 500,
                                            color: current ? "primary.light" : "var(--clinova-rgba-245-247-250-0_72)", backgroundColor: current ? "var(--clinova-rgba-142-168-232-0_12)" : "transparent",
                                            "& .clinova-nav-icon": { fontSize: 20, color: current ? "primary.light" : "var(--clinova-rgba-142-168-232-0_6)" },
                                            "&:hover": { color: "var(--clinova-color-f5f7fa)", backgroundColor: "var(--clinova-rgba-142-168-232-0_08)" },
                                            "&:hover .clinova-nav-icon": { color: "primary.light" } }}
                                    ><item.icon className="clinova-nav-icon" />{t(item.short ?? item.label)}</Button>;
                                })}
                            </Stack>
                        </Box>
                        <Box sx={{ borderLeft: "1px solid var(--clinova-rgba-142-168-232-0_16)", pl: 2.5 }}><Logo /></Box>
                    </>}
                </Toolbar>
            </Container>
        </AppBar>
        <Drawer anchor={isRtl ? "right" : "left"} open={drawerOpen} onClose={() => setDrawerOpen(false)} slotProps={{ paper: { dir: direction, sx: { width: { xs: "min(350px, 92vw)", sm: 380 }, p: 2.5, background: "linear-gradient(160deg, var(--clinova-color-18243a), var(--clinova-color-0b111b) 65%)", borderInlineStart: "1px solid var(--clinova-rgba-142-168-232-0_18)" } } }}>
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Logo compact /><IconButton aria-label={t("إغلاق القائمة")} onClick={() => setDrawerOpen(false)} sx={{ color: "text.secondary", backgroundColor: "var(--clinova-rgba-142-168-232-0_08)" }}><CloseRoundedIcon /></IconButton>
            </Stack>
            <Typography sx={{ fontSize: "0.72rem", color: "primary.main", mb: 1.5 }}>{t("التنقل الرئيسي")}</Typography>
            <Box component="nav" id={drawerId} aria-label={t("التنقل الرئيسي")}>
                <List disablePadding>
                    {navItems.map((item, index) => <ListItemButton component="a" href={item.href} key={item.href} selected={active === item.href} aria-current={active === item.href ? "location" : undefined} onClick={() => select(item.href)} sx={{ borderRadius: 2.5, mb: 0.5, py: 1.1, px: 1.5, gap: 1.5, textAlign: "start", "&.Mui-selected": { backgroundColor: "var(--clinova-rgba-142-168-232-0_13)", boxShadow: "inset 0 0 0 1px var(--clinova-rgba-142-168-232-0_18)" } }}>
                        <ListItemIcon sx={{ minWidth: 0, color: active === item.href ? "primary.light" : "var(--clinova-rgba-142-168-232-0_6)" }}><item.icon sx={{ fontSize: 21 }} /></ListItemIcon>
                        <ListItemText primary={t(item.label)} slotProps={{ primary: { sx: { fontSize: "0.92rem", fontWeight: active === item.href ? 600 : 400 } } }} />
                        <Typography aria-hidden="true" dir="ltr" sx={{ color: "var(--clinova-text-rgba-142-168-232-0_3)", fontSize: "0.65rem" }}>{String(index + 1).padStart(2, "0")}</Typography>
                    </ListItemButton>)}
                </List>
            </Box>
            <Box sx={{ mt: "auto", pt: 3 }}><Button fullWidth {...bookingLinkProps} className="clinova-shine" endIcon={<PhoneRoundedIcon />} sx={bookingStyle}>{t("احجز موعد")}</Button></Box>
        </Drawer>
    </>;
}
