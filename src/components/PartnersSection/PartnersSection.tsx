import { Box, Container, Stack, Typography } from "@mui/material";

const partnersTop = [
    "العيادة الأولى",
    "العيادة الثانية",
    "العيادة الثالثة",
    "العيادة الرابعة",
    "العيادة الخامسة",
    "العيادة السادسة",
];

const partnersBottom = [
    "العيادة السابعة",
    "العيادة الثامنة",
    "العيادة التاسعة",
    "العيادة العاشرة",
    "العيادة الحادية عشرة",
    "العيادة الثانية عشرة",
];

function PartnersSection() {
    return (
        <Box
            component="section"
            id="partners"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 10,
                    md: 14,
                    lg: 17,
                },

                background:
                    "radial-gradient(circle at 20% 50%, rgba(142,168,232,0.06), transparent 35%), #0B111B",

                direction: "rtl",
            }}
        >
            <Container>
                {/* =====================================
                    HEADER
                ====================================== */}

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr auto",
                        },

                        alignItems: "end",

                        gap: 5,

                        mb: {
                            xs: 6,
                            md: 8,
                        },
                    }}
                >
                    {/* Title */}
                    <Box
                        sx={{
                            maxWidth: 650,

                            mr: {
                                md: 0,
                            },

                            ml: {
                                md: "auto",
                            },

                            textAlign: {
                                xs: "center",
                                md: "right",
                            },
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

                                mb: 3,

                                borderRadius: "999px",

                                border:
                                    "1px solid rgba(142,168,232,0.18)",

                                backgroundColor:
                                    "rgba(142,168,232,0.04)",
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

                                    fontSize: "0.72rem",

                                    color:
                                        "text.secondary",
                                }}
                            >
                                شركاؤنا
                            </Typography>
                        </Box>

                        <Typography
                            component="h2"
                            sx={{
                                m: 0,

                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                fontSize: {
                                    xs: "2.5rem",
                                    sm: "3.2rem",
                                    md: "4.1rem",
                                    lg: "4.7rem",
                                },

                                fontWeight: 600,

                                lineHeight: 1.25,

                                letterSpacing: 0,

                                color: "#F5F7FA",
                            }}
                        >
                            عيادات تنمو معنا.
                        </Typography>

                        <Typography
                            sx={{
                                mt: 3,

                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                fontSize: {
                                    xs: "0.88rem",
                                    md: "0.95rem",
                                },

                                lineHeight: 2,

                                color:
                                    "text.secondary",
                            }}
                        >
                            مجموعة من العيادات التي تعمل معنا في دول
                            الخليج، من مجموعات الأسنان في الرياض إلى
                            مراكز التجميل في دبي.
                        </Typography>
                    </Box>

                    {/* Stats */}
                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns:
                                "repeat(2, 1fr)",

                            minWidth: {
                                xs: "100%",
                                md: 230,
                            },

                            border:
                                "1px solid rgba(142,168,232,0.16)",

                            borderRadius: 3,

                            overflow: "hidden",

                            backgroundColor:
                                "rgba(11,17,27,0.45)",

                            direction: "ltr",
                        }}
                    >
                        <PartnerStat
                            value="150+"
                            label="عيادة"
                        />

                        <PartnerStat
                            value="4"
                            label="أسواق خليجية"
                            last
                        />
                    </Box>
                </Box>
            </Container>

            {/* =====================================
                MARQUEE AREA
            ====================================== */}

            <Box
                sx={{
                    position: "relative",

                    width: "100%",

                    overflow: "hidden",

                    /* Fade edges */
                    "&::before": {
                        content: '""',

                        position: "absolute",

                        zIndex: 5,

                        top: 0,
                        bottom: 0,
                        left: 0,

                        width: {
                            xs: 45,
                            md: 120,
                        },

                        background:
                            "linear-gradient(90deg, #0B111B, transparent)",

                        pointerEvents: "none",
                    },

                    "&::after": {
                        content: '""',

                        position: "absolute",

                        zIndex: 5,

                        top: 0,
                        bottom: 0,
                        right: 0,

                        width: {
                            xs: 45,
                            md: 120,
                        },

                        background:
                            "linear-gradient(270deg, #0B111B, transparent)",

                        pointerEvents: "none",
                    },
                }}
            >
                {/* =================================
                    TOP ROW → LEFT
                ================================== */}

                <MarqueeRow
                    items={partnersTop}
                    direction="left"
                    duration={30}
                />

                {/* =================================
                    BOTTOM ROW → RIGHT
                ================================== */}

                <MarqueeRow
                    items={partnersBottom}
                    direction="right"
                    duration={34}
                />
            </Box>
        </Box>
    );
}

/* =========================================
   MARQUEE ROW
========================================= */

function MarqueeRow({
    items,
    direction,
    duration,
}: {
    items: string[];
    direction: "left" | "right";
    duration: number;
}) {
    /*
     * نكرر العناصر مرتين حتى تكون الحركة
     * مستمرة بدون فراغ أو قفزة.
     */
    const duplicatedItems = [...items, ...items];

    return (
        <Box
            sx={{
                position: "relative",

                width: "100%",

                overflow: "hidden",

                mb: 2,

                direction: "ltr",
            }}
        >
            <Box
                sx={{
                    display: "flex",

                    width: "max-content",

                    gap: 1.5,

                    animation:
                        `${direction === "left"
                            ? "clinovaMarqueeLeft"
                            : "clinovaMarqueeRight"
                        } ${duration}s linear infinite`,

                    willChange: "transform",

                    "@keyframes clinovaMarqueeLeft": {
                        from: {
                            transform: "translateX(0)",
                        },

                        to: {
                            transform: "translateX(-50%)",
                        },
                    },

                    "@keyframes clinovaMarqueeRight": {
                        from: {
                            transform: "translateX(-50%)",
                        },

                        to: {
                            transform: "translateX(0)",
                        },
                    },
                }}
            >
                {duplicatedItems.map((item, index) => (
                    <PartnerPlaceholder
                        key={`${item}-${index}`}
                    />
                ))}
            </Box>
        </Box>
    );
}

/* =========================================
   PLACEHOLDER
========================================= */

function PartnerPlaceholder() {
    return (
        <Box
            sx={{
                width: {
                    xs: 180,
                    sm: 210,
                    md: 250,
                },

                height: {
                    xs: 90,
                    md: 100,
                },

                flexShrink: 0,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                borderRadius: 3,

                border:
                    "1px solid rgba(142,168,232,0.10)",

                background:
                    "linear-gradient(145deg, rgba(142,168,232,0.035), rgba(255,255,255,0.01))",

                transition:
                    "border-color 0.3s ease, background-color 0.3s ease",

                "&:hover": {
                    borderColor:
                        "rgba(142,168,232,0.22)",

                    backgroundColor:
                        "rgba(142,168,232,0.035)",
                },
            }}
        >
            {/* Placeholder فقط */}
            <Box
                sx={{
                    width: 55,
                    height: 28,

                    borderRadius: 1,

                    border:
                        "1px dashed rgba(142,168,232,0.14)",

                    opacity: 0.5,
                }}
            />
        </Box>
    );
}

/* =========================================
   STAT
========================================= */

function PartnerStat({
    value,
    label,
    last = false,
}: {
    value: string;
    label: string;
    last?: boolean;
}) {
    return (
        <Stack
            sx={{
                alignItems: "center",

                justifyContent: "center",

                gap: 0.3,

                minHeight: 85,

                px: 2,

                borderLeft: last
                    ? "none"
                    : "1px solid rgba(142,168,232,0.10)",
            }}
        >
            <Typography
                sx={{
                    fontFamily:
                        '"Plus Jakarta Sans", sans-serif',

                    fontSize: {
                        xs: "1.5rem",
                        md: "1.7rem",
                    },

                    fontWeight: 400,

                    lineHeight: 1,

                    color: "primary.main",
                }}
            >
                {value}
            </Typography>

            <Typography
                sx={{
                    fontFamily:
                        '"IBM Plex Sans Arabic", sans-serif',

                    fontSize: "0.62rem",

                    color: "text.secondary",

                    whiteSpace: "nowrap",
                }}
            >
                {label}
            </Typography>
        </Stack>
    );
}

export default PartnersSection;