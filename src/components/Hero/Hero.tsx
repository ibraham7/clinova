import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { bookingLinkProps } from "../../config/contact";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HeroVisual from "./HeroVisual";

function Hero() {
    const { direction, t, isRtl } = useSiteTranslation();

    return (
        <Box
            component="section"
            id="home"
            dir={isRtl ? "ltr" : "rtl"}
            sx={{
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",

                pt: {
                    xs: 16,
                    md: 18,
                    lg: 20,
                },

                pb: {
                    xs: 10,
                    md: 12,
                },

                background:
                    "radial-gradient(circle at 8% 18%, rgba(142,168,232,0.22), transparent 30%), radial-gradient(circle at 82% 55%, rgba(95,120,181,0.10), transparent 35%), #0B111B",
            }}
        >
            {/* Background glow */}
            <Box
                sx={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    left: "-15%",
                    top: "10%",
                    borderRadius: "50%",

                    background:
                        "radial-gradient(circle, rgba(142,168,232,0.16), transparent 70%)",

                    filter: "blur(30px)",
                    pointerEvents: "none",
                }}
            />

            <Container>
                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "1fr 1.1fr",
                        },

                        alignItems: "center",

                        minHeight: {
                            lg: "calc(100vh - 140px)",
                        },

                        gap: {
                            xs: 6,
                            lg: 4,
                        },
                    }}
                >
                    {/* =========================
                        VISUAL SIDE
                    ========================== */}

                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",

                            minHeight: {
                                xs: 220,
                                md: 320,
                                lg: 520,
                            },

                            order: {
                                xs: 2,
                                lg: 1,
                            },
                        }}
                    >
                        <HeroVisual />
                    </Box>

                    {/* =========================
                        CONTENT
                    ========================== */}

                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,

                            textAlign: {
                                xs: "center",
                                lg: "start",
                            },

                            order: {
                                xs: 1,
                                lg: 2,
                            },

                            direction: direction,
                        }}
                    >
                        {/* Eyebrow */}
                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,

                                px: 2,
                                py: 0.8,

                                mb: {
                                    xs: 3,
                                    md: 4,
                                },

                                borderRadius: "999px",

                                border:
                                    "1px solid rgba(142,168,232,0.18)",

                                backgroundColor:
                                    "rgba(142,168,232,0.04)",

                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 6,
                                    height: 6,
                                    flexShrink: 0,

                                    borderRadius: "50%",

                                    backgroundColor:
                                        "primary.main",

                                    boxShadow:
                                        "0 0 12px rgba(142,168,232,0.7)",
                                }}
                            />

                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily:
                                        "var(--clinova-font-family)",

                                    color: "text.secondary",
                                    fontWeight: 500,
                                }}
                            >
                                {t("رعاية طبية أكثر وضوحًا وثقة")}
                        </Typography>
                        </Box>

                        {/* =========================
                            HERO TITLE
                        ========================== */}

                        <Box
                            component="h1"
                            sx={{
                                m: 0,

                                direction: direction,

                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize: {
                                    xs: "3rem",
                                    sm: "4rem",
                                    md: "5rem",
                                    lg: "6rem",
                                    xl: "6.5rem",
                                },

                                fontWeight: 600,

                                lineHeight: {
                                    xs: 1.35,
                                    sm: 1.3,
                                    md: 1.25,
                                    lg: 1.2,
                                },

                                letterSpacing: 0,

                                textAlign: {
                                    xs: "center",
                                    lg: "start",
                                },
                            }}
                        >
                            {/* السطر الأول */}
                            <Typography
                                component="span"
                                sx={{
                                    display: "block",

                                    fontFamily:
                                        "var(--clinova-font-family)",

                                    fontSize: "inherit",
                                    fontWeight: "inherit",
                                    lineHeight: "inherit",
                                    letterSpacing: 0,

                                    color: "#F5F7FA",
                                }}
                            >
                                {t("نرتقي")}
                        </Typography>

                            {/* السطر الثاني */}
                            <Typography
                                component="span"
                                sx={{
                                    display: "block",

                                    fontFamily:
                                        "var(--clinova-font-family)",

                                    fontSize: "inherit",
                                    fontWeight: "inherit",
                                    lineHeight: "inherit",
                                    letterSpacing: 0,

                                    background:
                                        "linear-gradient(110deg, #FFFFFF 10%, #B8C8EF 45%, #8EA8E8 85%)",

                                    WebkitBackgroundClip:
                                        "text",

                                    WebkitTextFillColor:
                                        "transparent",

                                    backgroundClip: "text",
                                }}
                            >
                                {t("بتجربة")}
                        </Typography>

                            {/* السطر الثالث */}
                            <Typography
                                component="span"
                                sx={{
                                    display: "block",

                                    fontFamily:
                                        "var(--clinova-font-family)",

                                    fontSize: "inherit",
                                    fontWeight: "inherit",
                                    lineHeight: "inherit",
                                    letterSpacing: 0,

                                    color: "primary.main",
                                }}
                            >
                                {t("الرعاية الطبية")}
                        </Typography>
                        </Box>

                        {/* =========================
                            DESCRIPTION
                        ========================== */}

                        <Typography
                            variant="body1"
                            sx={{
                                mt: 4,

                                maxWidth: 650,

                                ml: {
                                    lg: "auto",
                                },

                                fontFamily:
                                    "var(--clinova-font-family)",

                                color: "text.secondary",

                                fontSize: {
                                    xs: "0.95rem",
                                    md: "1.05rem",
                                },

                                lineHeight: 1.9,

                                direction: direction,
                            }}
                        >
                            {t("في Clinova نساعد العيادات والأطباء على بناء حضور رقمي احترافي، وتجربة طبية أكثر سهولة ووضوحًا للمرضى، من خلال حلول رقمية مصممة بعناية.")}
                        </Typography>

                        {/* =========================
                            ACTIONS
                        ========================== */}

                        <Stack
                            sx={{
                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },

                                alignItems: "center",

                                justifyContent: {
                                    xs: "center",
                                    lg: "flex-start",
                                },

                                gap: 1.5,

                                mt: 5,
                            }}
                        >
                            <Button
                                {...bookingLinkProps}
                                variant="contained"
                                color="primary"
                                endIcon={
                                    <PhoneRoundedIcon />
                                }
                                sx={{
                                    minWidth: 170,

                                    borderRadius: "999px",

                                    px: 3,
                                    py: 1.5,

                                    fontFamily:
                                        "var(--clinova-font-family)",
                                }}
                            >
                                {t("احجز موعدًا")}
                        </Button>

                            <Button
                                href="https://clisis.novanoai.online/"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="outlined"
                                endIcon={
                                    <ArrowBackRoundedIcon sx={{ transform: isRtl ? "none" : "rotate(180deg)" }} />
                                }
                                sx={{
                                    minWidth: 145,

                                    borderRadius: "999px",

                                    px: 3,
                                    py: 1.5,

                                    fontFamily:
                                        "var(--clinova-font-family)",
                                }}
                            >
                                {t("جرّب نظام الـ CRM")}
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Hero;
