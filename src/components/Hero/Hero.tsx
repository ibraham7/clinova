import { Box, Button, Container, Stack, Typography } from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

function Hero() {
    return (
        <Box
            component="section"
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
                        {/* Main glow */}
                        <Box
                            sx={{
                                position: "absolute",

                                width: {
                                    xs: 220,
                                    md: 350,
                                    lg: 500,
                                },

                                height: {
                                    xs: 220,
                                    md: 350,
                                    lg: 500,
                                },

                                left: {
                                    xs: "50%",
                                    lg: "10%",
                                },

                                top: "50%",

                                transform:
                                    "translate(-50%, -50%)",

                                borderRadius: "50%",

                                background:
                                    "radial-gradient(circle, rgba(142,168,232,0.18), rgba(95,120,181,0.05) 45%, transparent 70%)",

                                filter: "blur(15px)",
                            }}
                        />

                        {/* Outer ring */}
                        <Box
                            sx={{
                                position: "absolute",

                                width: {
                                    xs: 180,
                                    md: 280,
                                    lg: 400,
                                },

                                height: {
                                    xs: 180,
                                    md: 280,
                                    lg: 400,
                                },

                                left: {
                                    xs: "50%",
                                    lg: "12%",
                                },

                                top: "50%",

                                transform:
                                    "translate(-50%, -50%)",

                                borderRadius: "50%",

                                border:
                                    "1px solid rgba(142,168,232,0.10)",
                            }}
                        />

                        {/* Inner ring */}
                        <Box
                            sx={{
                                position: "absolute",

                                width: {
                                    xs: 130,
                                    md: 200,
                                    lg: 300,
                                },

                                height: {
                                    xs: 130,
                                    md: 200,
                                    lg: 300,
                                },

                                left: {
                                    xs: "50%",
                                    lg: "12%",
                                },

                                top: "50%",

                                transform:
                                    "translate(-50%, -50%)",

                                borderRadius: "50%",

                                border:
                                    "1px solid rgba(142,168,232,0.08)",
                            }}
                        />
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
                                lg: "right",
                            },

                            order: {
                                xs: 1,
                                lg: 2,
                            },

                            direction: "rtl",
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
                                        '"IBM Plex Sans Arabic", sans-serif',

                                    color: "text.secondary",
                                    fontWeight: 500,
                                }}
                            >
                                رعاية طبية أكثر وضوحًا وثقة
                            </Typography>
                        </Box>

                        {/* =========================
                            HERO TITLE
                        ========================== */}

                        <Box
                            component="h1"
                            sx={{
                                m: 0,

                                direction: "rtl",

                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

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
                                    lg: "right",
                                },
                            }}
                        >
                            {/* السطر الأول */}
                            <Typography
                                component="span"
                                sx={{
                                    display: "block",

                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',

                                    fontSize: "inherit",
                                    fontWeight: "inherit",
                                    lineHeight: "inherit",
                                    letterSpacing: 0,

                                    color: "#F5F7FA",
                                }}
                            >
                                نرتقي
                            </Typography>

                            {/* السطر الثاني */}
                            <Typography
                                component="span"
                                sx={{
                                    display: "block",

                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',

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
                                بتجربة
                            </Typography>

                            {/* السطر الثالث */}
                            <Typography
                                component="span"
                                sx={{
                                    display: "block",

                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',

                                    fontSize: "inherit",
                                    fontWeight: "inherit",
                                    lineHeight: "inherit",
                                    letterSpacing: 0,

                                    color: "primary.main",
                                }}
                            >
                                الرعاية الطبية
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
                                    '"IBM Plex Sans Arabic", sans-serif',

                                color: "text.secondary",

                                fontSize: {
                                    xs: "0.95rem",
                                    md: "1.05rem",
                                },

                                lineHeight: 1.9,

                                direction: "rtl",
                            }}
                        >
                            في Clinova نساعد العيادات والأطباء على بناء
                            حضور رقمي احترافي، وتجربة طبية أكثر سهولة
                            ووضوحًا للمرضى، من خلال حلول رقمية مصممة
                            بعناية.
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
                                variant="contained"
                                color="primary"
                                endIcon={
                                    <ArrowOutwardRoundedIcon />
                                }
                                sx={{
                                    minWidth: 170,

                                    borderRadius: "999px",

                                    px: 3,
                                    py: 1.5,

                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',
                                }}
                            >
                                احجز موعدًا
                            </Button>

                            <Button
                                variant="outlined"
                                endIcon={
                                    <ArrowBackRoundedIcon />
                                }
                                sx={{
                                    minWidth: 145,

                                    borderRadius: "999px",

                                    px: 3,
                                    py: 1.5,

                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',
                                }}
                            >
                                اكتشف المزيد
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Hero;