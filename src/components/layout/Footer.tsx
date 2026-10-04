import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import {
    Box,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import clinovaLogo from "../../../public/logo/logo.png";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";

const services = [
    "نظامنا",
    "أعمالنا",
    "آراء العملاء",
];

const company = [
    "من نحن",
    "دليل الأطباء",
    "لماذا نحن مميزون",
    "احجز مكالمة",
];

function Footer() {
    const { direction, t } = useSiteTranslation();

    return (
        <Box
            component="footer"
            sx={{
                position: "relative",

                pt: {
                    xs: 8,
                    md: 10,
                },

                pb: {
                    xs: 3,
                    md: 4,
                },

                background:
                    "radial-gradient(circle at 85% 0%, var(--clinova-rgba-142-168-232-0_055), transparent 30%), var(--clinova-color-0b111b)",

                borderTop:
                    "1px solid var(--clinova-rgba-142-168-232-0_08)",

                direction: direction,
            }}
        >
            <Container>
                {/* =====================================
                    MAIN FOOTER
                ====================================== */}

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "1.6fr 1fr 1fr 1fr",
                        },

                        gap: {
                            xs: 5,
                            sm: 5,
                            md: 8,
                        },

                        pb: {
                            xs: 6,
                            md: 8,
                        },
                    }}
                >
                    {/* =================================
                        BRAND
                    ================================== */}

                    <Stack
                        sx={{
                            alignItems: {
                                xs: "center",
                                md: "flex-start",
                            },

                            gap: 2.5,

                            textAlign: {
                                xs: "center",
                                md: "start",
                            },
                        }}
                    >
                        {/* Logo */}

                        <Stack
                            sx={{
                                flexDirection:
                                    "row",

                                alignItems:
                                    "center",

                                gap: 1.2,

                                direction: "ltr",
                            }}
                        >


 

                            {/* Logo Text */}

                            <Box
                                component="img"
                                src={clinovaLogo} style={{ filter: "var(--clinova-logo-filter)" }}
                                alt="Clinova Healthcare"
                                sx={{
                                    width: {
                                        xs: 150,
                                        md: 175,
                                    },

                                    height: "auto",

                                    objectFit: "contain",

                                    display: "block",
                                }}
                            />
                        </Stack>

                        {/* Description */}

                        <Typography
                            sx={{
                                maxWidth: 330,

                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize:
                                    "0.82rem",

                                lineHeight:
                                    1.9,

                                color:
                                    "text.secondary",
                            }}
                        >
                            {t("شريكك لبناء حضور رقمي ونظام نمو متكامل للعيادات والمراكز الطبية.")}
                        </Typography>

                        {/* Social */}

                        <Stack
                            sx={{
                                flexDirection:
                                    "row",

                                alignItems:
                                    "center",

                                gap: 1,

                                direction:
                                    "ltr",
                            }}
                        >
                            <SocialButton>
                                <InstagramIcon />
                            </SocialButton>

                            <SocialButton>
                                <LinkedInIcon />
                            </SocialButton>

                            <SocialButton>
                                <FacebookOutlinedIcon />
                            </SocialButton>
                        </Stack>
                    </Stack>

                    {/* =================================
                        SERVICES
                    ================================== */}

                    <FooterColumn
                        title="الخدمات"
                        items={services}
                    />

                    {/* =================================
                        COMPANY
                    ================================== */}

                    <FooterColumn
                        title="الشركة"
                        items={company}
                    />

                    {/* =================================
                        CONTACT
                    ================================== */}

                    <Stack
                        sx={{
                            alignItems: {
                                xs: "center",
                                md: "flex-start",
                            },

                            gap: 2.5,

                            textAlign: {
                                xs: "center",
                                md: "start",
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize:
                                    "0.72rem",

                                fontWeight: 500,

                                color:
                                    "var(--clinova-rgba-245-247-250-0_42)",
                            }}
                        >
                            {t("تواصل")}
                        </Typography>

                        <Typography
                            component="a"
                            href="mailto:hello@clinova.com"
                            sx={{
                                fontFamily:
                                    '"Plus Jakarta Sans", sans-serif',

                                fontSize:
                                    "0.85rem",

                                color:
                                    "text.secondary",

                                textDecoration:
                                    "none",

                                direction:
                                    "ltr",

                                transition:
                                    "color 0.25s ease",

                                "&:hover": {
                                    color:
                                        "primary.main",
                                },
                            }}
                        >
                            hello@clinova.com
                        </Typography>
                    </Stack>
                </Box>

                {/* =====================================
                    BOTTOM
                ====================================== */}

                <Box
                    sx={{
                        pt: 2.5,

                        borderTop:
                            "1px solid var(--clinova-rgba-142-168-232-0_08)",

                        display: "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "space-between",

                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },

                        gap: 2,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily:
                                '"Plus Jakarta Sans", sans-serif',

                            fontSize:
                                "0.62rem",

                            color:
                                "var(--clinova-rgba-245-247-250-0_3)",

                            direction:
                                "ltr",
                        }}
                    >
                        © {new Date().getFullYear()} Clinova.
                        {t("All rights reserved.")}
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily:
                                "var(--clinova-font-family)",

                            fontSize:
                                "0.62rem",

                            color:
                                "var(--clinova-rgba-245-247-250-0_3)",
                        }}
                    >
                        {t("نصنع نموًا حقيقيًا للقطاع الطبي.")}
                        </Typography>
                </Box>
            </Container>
        </Box>
    );
}

/* =========================================
   FOOTER COLUMN
========================================= */

function FooterColumn({
    title,
    items,
}: {
    title: string;
    items: string[];
}) {
    const { t } = useSiteTranslation();

    return (
        <Stack
            sx={{
                alignItems: {
                    xs: "center",
                    md: "flex-start",
                },

                gap: 2,

                textAlign: {
                    xs: "center",
                    md: "start",
                },
            }}
        >
            <Typography
                sx={{
                    fontFamily:
                        "var(--clinova-font-family)",

                    fontSize:
                        "0.72rem",

                    fontWeight: 500,

                    color:
                        "var(--clinova-rgba-245-247-250-0_42)",
                }}
            >
                {t(title)}
            </Typography>

            <Stack
                sx={{
                    gap: 1.4,

                    alignItems: {
                        xs: "center",
                        md: "flex-start",
                    },
                }}
            >
                {items.map((item) => (
                    <Typography
                        key={item}
                        component="a"
                        href="#"
                        sx={{
                            fontFamily:
                                "var(--clinova-font-family)",

                            fontSize:
                                "0.78rem",

                            color:
                                "text.secondary",

                            textDecoration:
                                "none",

                            transition:
                                "color 0.25s ease, transform 0.25s ease",

                            "&:hover": {
                                color:
                                    "primary.main",

                                transform:
                                    "translateX(-3px)",
                            },
                        }}
                    >
                        {t(item)}
                    </Typography>
                ))}
            </Stack>
        </Stack>
    );
}

/* =========================================
   SOCIAL BUTTON
========================================= */

function SocialButton({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box
            component="a"
            href="#"
            sx={{
                width: 38,
                height: 38,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                borderRadius: 2,

                border:
                    "1px solid var(--clinova-rgba-142-168-232-0_15)",

                backgroundColor:
                    "var(--clinova-rgba-142-168-232-0_025)",

                color:
                    "var(--clinova-rgba-245-247-250-0_5)",

                transition:
                    "all 0.25s ease",

                "& svg": {
                    fontSize: 17,
                },

                "&:hover": {
                    color:
                        "primary.main",

                    borderColor:
                        "var(--clinova-rgba-142-168-232-0_4)",

                    backgroundColor:
                        "var(--clinova-rgba-142-168-232-0_07)",

                    transform:
                        "translateY(-2px)",
                },
            }}
        >
            {children}
        </Box>
    );
}

export default Footer;