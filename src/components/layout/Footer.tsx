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
                    "radial-gradient(circle at 85% 0%, rgba(142,168,232,0.055), transparent 30%), #0B111B",

                borderTop:
                    "1px solid rgba(142,168,232,0.08)",

                direction: "rtl",
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
                                md: "right",
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
                                src={clinovaLogo}
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
                                    '"IBM Plex Sans Arabic", sans-serif',

                                fontSize:
                                    "0.82rem",

                                lineHeight:
                                    1.9,

                                color:
                                    "text.secondary",
                            }}
                        >
                            شريكك لبناء حضور رقمي ونظام نمو
                            متكامل للعيادات والمراكز الطبية.
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
                                md: "right",
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                fontSize:
                                    "0.72rem",

                                fontWeight: 500,

                                color:
                                    "rgba(245,247,250,0.42)",
                            }}
                        >
                            تواصل
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
                            "1px solid rgba(142,168,232,0.08)",

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
                                "rgba(245,247,250,0.3)",

                            direction:
                                "ltr",
                        }}
                    >
                        © {new Date().getFullYear()} Clinova.
                        All rights reserved.
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily:
                                '"IBM Plex Sans Arabic", sans-serif',

                            fontSize:
                                "0.62rem",

                            color:
                                "rgba(245,247,250,0.3)",
                        }}
                    >
                        نصنع نموًا حقيقيًا للقطاع الطبي.
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
                    md: "right",
                },
            }}
        >
            <Typography
                sx={{
                    fontFamily:
                        '"IBM Plex Sans Arabic", sans-serif',

                    fontSize:
                        "0.72rem",

                    fontWeight: 500,

                    color:
                        "rgba(245,247,250,0.42)",
                }}
            >
                {title}
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
                                '"IBM Plex Sans Arabic", sans-serif',

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
                        {item}
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
                    "1px solid rgba(142,168,232,0.15)",

                backgroundColor:
                    "rgba(142,168,232,0.025)",

                color:
                    "rgba(245,247,250,0.5)",

                transition:
                    "all 0.25s ease",

                "& svg": {
                    fontSize: 17,
                },

                "&:hover": {
                    color:
                        "primary.main",

                    borderColor:
                        "rgba(142,168,232,0.4)",

                    backgroundColor:
                        "rgba(142,168,232,0.07)",

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