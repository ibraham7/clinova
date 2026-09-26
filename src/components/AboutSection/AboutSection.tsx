import { Box, Container, Typography } from "@mui/material";

function AboutSection() {
    return (
        <Box
            component="section"
            id="about"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 10,
                    sm: 12,
                    md: 16,
                    lg: 20,
                },

                background:
                    "radial-gradient(circle at 50% 0%, rgba(95,120,181,0.10), transparent 38%), #0B111B",
            }}
        >
            {/* Background glow */}
            <Box
                sx={{
                    position: "absolute",

                    width: {
                        xs: 300,
                        md: 500,
                        lg: 700,
                    },

                    height: {
                        xs: 300,
                        md: 500,
                        lg: 700,
                    },

                    top: -350,
                    left: "50%",

                    transform: "translateX(-50%)",

                    borderRadius: "50%",

                    background:
                        "radial-gradient(circle, rgba(142,168,232,0.10), transparent 68%)",

                    filter: "blur(30px)",

                    pointerEvents: "none",
                }}
            />

            <Container>
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,

                        maxWidth: 900,

                        mx: "auto",

                        textAlign: "center",

                        direction: "rtl",
                    }}
                >
                    {/* Badge */}
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

                                borderRadius: "50%",

                                backgroundColor:
                                    "primary.main",

                                boxShadow:
                                    "0 0 12px rgba(142,168,232,0.7)",
                            }}
                        />

                        <Typography
                            sx={{
                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                fontSize: "0.75rem",

                                fontWeight: 500,

                                color: "text.secondary",
                            }}
                        >
                            من نحن
                        </Typography>
                    </Box>

                    {/* Heading */}
                    <Typography
                        component="h2"
                        sx={{
                            m: 0,

                            fontFamily:
                                '"IBM Plex Sans Arabic", sans-serif',

                            fontSize: {
                                xs: "2.4rem",
                                sm: "3.2rem",
                                md: "4.2rem",
                                lg: "5rem",
                            },

                            fontWeight: 600,

                            lineHeight: {
                                xs: 1.3,
                                md: 1.25,
                            },

                            letterSpacing: 0,

                            color: "#F5F7FA",
                        }}
                    >
                        نبني أنظمة نمو متكاملة
                        <Box
                            component="span"
                            sx={{
                                display: "block",

                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                color: "primary.main",
                            }}
                        >
                            للعيادات الطبية.
                        </Box>
                    </Typography>

                    {/* Description */}
                    <Typography
                        sx={{
                            mt: {
                                xs: 3,
                                md: 4,
                            },

                            maxWidth: 680,

                            mx: "auto",

                            fontFamily:
                                '"IBM Plex Sans Arabic", sans-serif',

                            fontSize: {
                                xs: "0.9rem",
                                md: "1rem",
                            },

                            fontWeight: 400,

                            lineHeight: 2,

                            color: "text.secondary",
                        }}
                    >
                        في Clinova، نؤمن أن نجاح العيادة لا يعتمد على
                        الإعلانات وحدها، بل على بناء نظام متكامل يبدأ من
                        جذب المريض المناسب، ويتحول إلى تجربة واضحة وموثوقة،
                        ثم يعمل على تحسين رحلة المريض وبناء نمو قابل للقياس
                        ومستدام.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default AboutSection;