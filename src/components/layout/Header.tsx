import { useEffect, useId, useState } from "react";
import { AppBar, Box, Button, Container, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Toolbar, Typography, useMediaQuery } from "@mui/material";
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
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import clinovaLogo from "../../../public/logo/logo.png";
import { bookingLinkProps } from "../../config/contact";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems = [
    { label: "الرئيسية", href: "#home", icon: HomeRoundedIcon, primary: true },
    { label: "من نحن", href: "#about", icon: InfoRoundedIcon, primary: true },
    { label: "لماذا Clinova؟", href: "#reach", icon: AutoAwesomeRoundedIcon, primary: false },
    { label: "خدماتنا", href: "#services", icon: WidgetsRoundedIcon, primary: true },
    { label: "رحلة المريض", href: "#contact-system", icon: RouteRoundedIcon, primary: true },
    { label: "تخصصاتنا", href: "#specialties", icon: MedicalServicesRoundedIcon, primary: true },
    { label: "قصص النجاح", href: "#case-studies", icon: TrendingUpRoundedIcon, primary: true },
    { label: "شركاؤنا", href: "#partners", icon: HandshakeRoundedIcon, primary: false },
    { label: "الأسئلة الشائعة", href: "#faq", icon: HelpOutlineRoundedIcon, primary: false },
    { label: "تواصل معنا", href: "#contact-cta", icon: PhoneRoundedIcon, primary: false },
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
    const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);
    const moreId = useId();
    const drawerId = useId();
    const moreActive = navItems.some((item) => !item.primary && item.href === active);

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
        setMoreAnchor(null);
    };

    return <>
        <AppBar position="fixed" elevation={0} sx={{ background: "transparent", py: { xs: 1.25, md: 2 }, pointerEvents: "none" }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>
                <Toolbar disableGutters sx={{
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
                        <Button {...bookingLinkProps} endIcon={<PhoneRoundedIcon />} sx={{ ...bookingStyle, "@media (max-width:399px)": { display: "none" }, px: { xs: 1.4, sm: 2 }, fontSize: "0.8rem" }}>{t("احجز")}</Button>
                        <IconButton aria-label={t("فتح قائمة التنقل")} aria-expanded={drawerOpen} aria-controls={drawerOpen ? drawerId : undefined} onClick={() => setDrawerOpen(true)} sx={{ width: 42, height: 42, color: "primary.light", backgroundColor: "var(--clinova-rgba-142-168-232-0_08)", border: "1px solid var(--clinova-rgba-142-168-232-0_16)" }}><MenuRoundedIcon /></IconButton>
                    </> : <>
                        <Button {...bookingLinkProps} endIcon={<PhoneRoundedIcon />} sx={{ ...bookingStyle, px: 2.5 }}>{t("احجز موعد")}</Button>
                        <ThemeToggle />
                        <LanguageSwitcher />
                        <Box component="nav" dir={direction} aria-label={t("التنقل الرئيسي")} sx={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
                            <Stack direction="row" sx={{ alignItems: "center", gap: 0.25 }}>
                                {navItems.filter((item) => item.primary).map((item) => <Button
                                    component="a" href={item.href} key={item.href} onClick={() => select(item.href)} aria-current={active === item.href ? "location" : undefined}
                                    sx={{ minWidth: 0, px: { lg: 1.2, xl: 1.7 }, py: 1.2, whiteSpace: "nowrap", borderRadius: "999px", fontSize: "0.85rem", fontWeight: active === item.href ? 600 : 500,
                                        color: active === item.href ? "primary.light" : "var(--clinova-rgba-245-247-250-0_72)", backgroundColor: active === item.href ? "var(--clinova-rgba-142-168-232-0_12)" : "transparent",
                                        "&:hover": { color: "var(--clinova-color-f5f7fa)", backgroundColor: "var(--clinova-rgba-142-168-232-0_08)" } }}
                                >{t(item.label)}</Button>)}
                                <Button id={`${moreId}-button`} aria-haspopup="menu" aria-expanded={Boolean(moreAnchor)} aria-controls={moreAnchor ? moreId : undefined} onClick={(event) => setMoreAnchor(event.currentTarget)} endIcon={<KeyboardArrowDownRoundedIcon />} sx={{ minWidth: 0, px: 1.5, borderRadius: "999px", color: moreActive ? "primary.light" : "text.secondary", backgroundColor: moreActive ? "var(--clinova-rgba-142-168-232-0_12)" : "transparent", "& .MuiButton-endIcon": { margin: 0, marginInlineStart: "4px" } }}>{t("المزيد")}</Button>
                            </Stack>
                        </Box>
                        <Box sx={{ borderLeft: "1px solid var(--clinova-rgba-142-168-232-0_16)", pl: 2.5 }}><Logo /></Box>
                    </>}
                </Toolbar>
            </Container>
        </AppBar>
        <Menu id={moreId} anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)} slotProps={{
            list: { "aria-labelledby": `${moreId}-button` },
            paper: { dir: direction, sx: { mt: 1.5, p: 0.75, minWidth: 240, borderRadius: 3, border: "1px solid var(--clinova-rgba-142-168-232-0_2)", background: "var(--clinova-color-111b2a)", boxShadow: "0 18px 50px var(--clinova-rgba-0-0-0-0_4)" } },
        }}>
            {navItems.filter((item) => !item.primary).map((item) => <MenuItem component="a" href={item.href} key={item.href} selected={active === item.href} aria-current={active === item.href ? "location" : undefined} onClick={() => select(item.href)} sx={{ borderRadius: 2, py: 1.5, gap: 1.5 }}>
                <item.icon sx={{ fontSize: 20, color: "primary.main" }} /><Typography variant="body2">{t(item.label)}</Typography>
            </MenuItem>)}
        </Menu>
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
            <Box sx={{ mt: "auto", pt: 3 }}><Button fullWidth {...bookingLinkProps} endIcon={<PhoneRoundedIcon />} sx={bookingStyle}>{t("احجز موعد")}</Button></Box>
        </Drawer>
    </>;
}
