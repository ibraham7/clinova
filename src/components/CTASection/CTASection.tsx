import {
    Box,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";

function CTASection() {
    return (
        <Box
            component="section"
            id="contact-cta"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 8,
                    md: 12,
                    lg: 14,
                },

                backgroundColor: "#0B111B",

                direction: "rtl",
            }}
        >
            <Container>
                <Box
                    sx={{
                        position: "relative",

                        overflow: "hidden",

                        minHeight: {
                            xs: 320,
                            md: 360,
                        },

                        display: "flex",

                        alignItems: "center",
                        justifyContent: "center",

                        px: {
                            xs: 3,
                            sm: 5,
                            md: 8,
                        },

                        py: {
                            xs: 5,
                            md: 7,
                        },

                        borderRadius: 5,

                        border:
                            "1px solid rgba(142,168,232,0.20)",

                        background:
                            "linear-gradient(135deg, rgba(95,120,181,0.18) 0%, rgba(142,168,232,0.09) 42%, rgba(21,31,45,0.72) 100%)",

                        boxShadow:
                            "0 30px 80px rgba(0,0,0,0.20)",

                        isolation: "isolate",

                        "&::before": {
                            content: '""',

                            position: "absolute",

                            width: 500,
                            height: 500,

                            top: -300,
                            right: -100,

                            borderRadius: "50%",

                            background:
                                "radial-gradient(circle, rgba(142,168,232,0.18), transparent 68%)",

                            filter: "blur(10px)",

                            pointerEvents: "none",

                            zIndex: -1,
                        },

                        "&::after": {
                            content: '""',

                            position: "absolute",

                            width: 400,
                            height: 400,

                            bottom: -280,
                            left: -80,

                            borderRadius: "50%",

                            background:
                                "radial-gradient(circle, rgba(95,120,181,0.16), transparent 68%)",

                            filter: "blur(10px)",

                            pointerEvents: "none",

                            zIndex: -1,
                        },
                    }}
                >
                    {/* =================================
                        CONTENT
                    ================================== */}

                    <Stack
                        sx={{
                            alignItems: "center",

                            justifyContent: "center",

                            gap: 2.5,

                            maxWidth: 700,

                            textAlign: "center",

                            position: "relative",

                            zIndex: 2,
                        }}
                    >
                        {/* Title */}

                        <Typography
                            component="h2"
                            sx={{
                                m: 0,

                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                fontSize: {
                                    xs: "2.5rem",
                                    sm: "3.2rem",
                                    md: "4.2rem",
                                    lg: "4.7rem",
                                },

                                fontWeight: 600,

                                lineHeight: 1.25,

                                letterSpacing: 0,

                                color: "#F5F7FA",
                            }}
                        >
                            لنملأ دفتر مواعيدك.
                        </Typography>

                        {/* Description */}

                        <Typography
                            sx={{
                                maxWidth: 580,

                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                fontSize: {
                                    xs: "0.8rem",
                                    md: "0.9rem",
                                },

                                lineHeight: 2,

                                color:
                                    "rgba(245,247,250,0.62)",
                            }}
                        >
                            مكالمة استراتيجية مجانية لمدة 30 دقيقة.
                            نراجع تسويقك الحالي، نحدد مكامن
                            النمو، ونترك لك خطة واضحة تبدأ بها.
                        </Typography>

                        {/* CTA */}

                        <Box
                            component="button"
                            sx={{
                                mt: 1,

                                minHeight: 50,

                                display: "inline-flex",

                                alignItems: "center",

                                justifyContent: "center",

                                gap: 1,

                                px: 3,

                                border: 0,

                                borderRadius:
                                    "999px",

                                background:
                                    "linear-gradient(135deg, #8EA8E8 0%, #7894D2 100%)",

                                color:
                                    "#0B111B",

                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                fontSize:
                                    "0.8rem",

                                fontWeight: 600,

                                cursor: "pointer",

                                boxShadow:
                                    "0 10px 35px rgba(142,168,232,0.18)",

                                transition:
                                    "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",

                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg, #B8C8EF 0%, #8EA8E8 100%)",

                                    transform:
                                        "translateY(-2px)",

                                    boxShadow:
                                        "0 14px 40px rgba(142,168,232,0.28)",
                                },

                                "&:active": {
                                    transform:
                                        "translateY(0)",
                                },
                            }}
                        >
                            احجز مكالمة استراتيجية

                            <ArrowOutwardRoundedIcon
                                sx={{
                                    fontSize: 15,
                                }}
                            />
                        </Box>
                    </Stack>

                    {/* =================================
                        DECORATIVE GRID
                    ================================== */}

                    <Box
                        sx={{
                            position:
                                "absolute",

                            inset: 0,

                            opacity: 0.18,

                            backgroundImage: `
                                linear-gradient(
                                    rgba(142,168,232,0.07) 1px,
                                    transparent 1px
                                ),
                                linear-gradient(
                                    90deg,
                                    rgba(142,168,232,0.07) 1px,
                                    transparent 1px
                                )
                            `,

                            backgroundSize:
                                "55px 55px",

                            maskImage:
                                "radial-gradient(circle at center, black, transparent 72%)",

                            pointerEvents:
                                "none",

                            zIndex: -1,
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}

export default CTASection;