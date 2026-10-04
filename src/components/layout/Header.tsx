import { useState } from "react";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import {
    AppBar,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Box,
    Button,
    Container,
    IconButton,
    Stack,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import clinovaLogo from "../../../public/logo/logo.png";

import LanguageSwitcher from "./LanguageSwitcher";

import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { bookingLinkProps } from "../../config/contact";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const navItems = [
    {
        label: "الرئيسية",
        href: "#home",
    },
    {
        label: "من نحن",
        href: "#about",
    },
    {
        label: "خدماتنا",
        href: "#services",
    },
    {
        label: "الأطباء",
        href: "#specialties",
    },
    {
        label: "تواصل معنا",
        href: "#contact-cta",
    },
];

function Header() {
    const { isRtl } = useSiteTranslation();
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <AppBar
            position="absolute"
            elevation={0}
            sx={{
                top: 0,
                left: 0,
                right: 0,
                background: "transparent",
                boxShadow: "none",
                py: { xs: 1.5, md: 2.5 },
            }}
        >
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: { xs: 64, md: 76 },
                        direction: "ltr",
                        flexDirection: isMobile || isRtl ? "row" : "row-reverse",
                        px: { xs: 1.5, md: 2.5 },

                        borderRadius: "999px",

                        background:
                            "rgba(11, 17, 27, 0.72)",

                        border:
                            "1px solid rgba(142, 168, 232, 0.16)",

                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",

                        boxShadow:
                            "0 12px 40px rgba(0, 0, 0, 0.22)",

                        position: "relative",

                        overflow: "hidden",

                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "8%",
                            width: "35%",
                            height: "100%",

                            background:
                                "radial-gradient(circle, rgba(142,168,232,0.08), transparent 70%)",

                            pointerEvents: "none",
                        },
                    }}
                >
                    {isMobile ? (
                        <MobileHeader />
                    ) : (
                        <DesktopHeader />
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

function DesktopHeader() {
    const { t, direction } = useSiteTranslation();

    return (
        <>
            {/* CTA */}
            <Button
                {...bookingLinkProps}
                variant="contained"
                color="primary"
                endIcon={<PhoneRoundedIcon />}
                sx={{
                    flexShrink: 0,

                    minWidth: 145,
                    height: 48,

                    borderRadius: "999px",

                    background:
                        "linear-gradient(135deg, #8EA8E8 0%, #7894D2 100%)",

                    color: "#0B111B",

                    boxShadow:
                        "0 0 30px rgba(142, 168, 232, 0.16)",

                    "&:hover": {
                        background:
                            "linear-gradient(135deg, #B8C8EF 0%, #8EA8E8 100%)",

                        boxShadow:
                            "0 0 40px rgba(142, 168, 232, 0.25)",
                    },

                    transition:
                        "all 0.3s ease",
                }}
            >
                {t("احجز موعد")}
                        </Button>

            <Box sx={{ mx: 2 }}>
                <LanguageSwitcher />
            </Box>

            {/* Navigation */}
            <Box
                component="nav"
                dir={direction}
                aria-label={t("التنقل الرئيسي")}
                sx={{
                    flex: 1,

                    display: "flex",
                    justifyContent: "center",

                    mr: 4,
                    ml: 4,
                }}
            >
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: { md: 2, lg: 4.5 },
                    }}
                >
                    {navItems.map((item) => (
                        <Typography
                            key={item.href}
                            component="a"
                            href={item.href}
                            variant="body2"
                            sx={{
                                color:
                                    "rgba(245, 247, 250, 0.72)",

                                textDecoration: "none",

                                whiteSpace: "nowrap",

                                fontSize: "0.95rem",

                                fontWeight: 500,

                                position: "relative",

                                transition:
                                    "color 0.25s ease",

                                "&::after": {
                                    content: '""',

                                    position: "absolute",

                                    bottom: -8,
                                    left: "50%",

                                    width: 0,
                                    height: 2,

                                    borderRadius: "999px",

                                    backgroundColor:
                                        "primary.main",

                                    transform:
                                        "translateX(-50%)",

                                    transition:
                                        "width 0.25s ease",
                                },

                                "&:hover": {
                                    color:
                                        "text.primary",

                                    "&::after": {
                                        width: 18,
                                    },
                                },
                            }}
                        >
                            {t(item.label)}
                        </Typography>
                    ))}
                </Stack>
            </Box>

            {/* Logo */}
            <Box
                component="a"
                href="#home"
                sx={{
                    display: "flex",
                    alignItems: "center",

                    textDecoration: "none",

                    flexShrink: 0,
                }}
            >
                <Box
                    component="img"
                    src={clinovaLogo}
                    alt="Clinova Healthcare"
                    sx={{
                        width: 145,
                        height: "auto",

                        display: "block",

                        objectFit: "contain",
                    }}
                />

    


                </Box>

        </>
    );
}

function MobileHeader() {
    const { t, direction, isRtl } = useSiteTranslation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Logo */}
            <Box
                component="a"
                href="#home"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,

                    textDecoration: "none",

                    color: "inherit",

                    flex: 1,
                }}
            >
                <Box
                    component="img"
                    src={clinovaLogo}
                    alt="Clinova Healthcare"
                    sx={{ width: { xs: 108, sm: 135 }, height: "auto", display: "block", objectFit: "contain" }}
                />
            </Box>

            <Box sx={{ mx: 0.5 }}>
                <LanguageSwitcher compact />
            </Box>

            {/* Mobile CTA */}
            <Button
                endIcon={<PhoneRoundedIcon />}
                {...bookingLinkProps}
                variant="contained"
                color="primary"
                sx={{
                    minWidth: 0,
                    minHeight: 42,
                    px: 2,

                    borderRadius: "999px",

                    fontSize: "0.8rem",
                }}
            >
                {t("احجز")}
                        </Button>

            {/* Menu */}
            <IconButton
                aria-label={t("فتح قائمة التنقل")}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                sx={{
                    ml: 1,

                    width: 44,
                    height: 44,

                    color: "text.primary",

                    border:
                        "1px solid rgba(142, 168, 232, 0.14)",

                    borderRadius: "50%",
                }}
            >
                <MenuRoundedIcon />
            </IconButton>
            <Drawer
                anchor={isRtl ? "right" : "left"}
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                slotProps={{ paper: { dir: direction, sx: { width: 280, p: 2 } } }}
            >
                <Box component="nav" aria-label={t("التنقل الرئيسي")}>
                    <List>
                        {navItems.map((item) => (
                            <ListItemButton
                                key={item.href}
                                component="a"
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                sx={{ textAlign: "start", borderRadius: 2 }}
                            >
                                <ListItemText primary={t(item.label)} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}

export default Header;
