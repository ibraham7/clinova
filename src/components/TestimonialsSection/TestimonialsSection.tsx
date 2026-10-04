import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { useState } from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";

const testimonials = [
    {
        id: 1,
        name: "د. أحمد",
        specialty: "طب الأسنان",
        location: "الرياض · السعودية",
        text: "تجربة مختلفة في طريقة فهم احتياجات العيادة وتحويل التسويق إلى نتائج فعلية.",
    },
    {
        id: 2,
        name: "د. محمد",
        specialty: "الجلدية والتجميل",
        location: "دبي · الإمارات",
        text: "أصبح لدينا وضوح أكبر في رحلة المريض، من أول تواصل حتى الحجز.",
    },
    {
        id: 3,
        name: "د. خالد",
        specialty: "زراعة الأسنان",
        location: "جدة · السعودية",
        text: "الفرق الحقيقي كان في المتابعة والتحليل المستمر، وليس فقط تشغيل الإعلانات.",
    },
    {
        id: 4,
        name: "د. سارة",
        specialty: "التجميل",
        location: "الدوحة · قطر",
        text: "ساعدنا الفريق على بناء حضور رقمي يعكس مستوى الخدمات التي نقدمها.",
    },
    {
        id: 5,
        name: "د. يوسف",
        specialty: "طب الأسنان",
        location: "أبوظبي · الإمارات",
        text: "أصبحنا نعرف بشكل أوضح من أين يأتي المريض وما الذي يجعله يتخذ قرار الحجز.",
    },
    {
        id: 6,
        name: "د. عمر",
        specialty: "الجراحة التجميلية",
        location: "المنامة · البحرين",
        text: "من أفضل الأشياء كانت القدرة على قياس النتائج وفهم ما يحتاج إلى تحسين.",
    },
];

function TestimonialsSection() {
    const { direction, t } = useSiteTranslation();

    const [activeIndex, setActiveIndex] = useState(0);

    const active = testimonials[activeIndex];

    const nextTestimonial = () => {
        setActiveIndex(
            (current) =>
                (current + 1) % testimonials.length,
        );
    };

    const previousTestimonial = () => {
        setActiveIndex(
            (current) =>
                (current - 1 + testimonials.length) %
                testimonials.length,
        );
    };

    return (
        <Box
            component="section"
            id="testimonials"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 10,
                    md: 14,
                    lg: 18,
                },

                background:
                    "radial-gradient(circle at 50% 40%, rgba(142,168,232,0.07), transparent 38%), #0B111B",

                direction: direction,
            }}
        >
            <Container>
                {/* =====================================
                    HEADER
                ====================================== */}

                <Box
                    sx={{
                        maxWidth: 680,

                        mr: {
                            lg: 0,
                        },

                        ml: {
                            lg: "auto",
                        },

                        textAlign: {
                            xs: "center",
                            lg: "start",
                        },

                        mb: {
                            xs: 6,
                            md: 8,
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

                            borderRadius:
                                "999px",

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

                                borderRadius:
                                    "50%",

                                backgroundColor:
                                    "primary.main",

                                boxShadow:
                                    "0 0 12px rgba(142,168,232,0.7)",
                            }}
                        />

                        <Typography
                            sx={{
                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize:
                                    "0.72rem",

                                color:
                                    "text.secondary",
                            }}
                        >
                            {t("ماذا يقول أصحاب العيادات؟")}
                        </Typography>
                    </Box>

                    {/* Title */}

                    <Typography
                        component="h2"
                        sx={{
                            m: 0,

                            fontFamily:
                                "var(--clinova-font-family)",

                            fontSize: {
                                xs: "2.5rem",
                                sm: "3.2rem",
                                md: "4.2rem",
                                lg: "4.8rem",
                            },

                            fontWeight: 600,

                            lineHeight: 1.25,

                            letterSpacing: 0,

                            color: "#F5F7FA",
                        }}
                    >
                        {t("تجارب حقيقية.")}<Box
                            component="span"
                            sx={{
                                display: "block",

                                color:
                                    "primary.main",

                                fontFamily:
                                    "var(--clinova-font-family)",
                            }}
                        >
                            {t("من أصحاب العيادات.")}
                        </Box>
                    </Typography>

                    {/* Description */}

                    <Typography
                        sx={{
                            mt: 3,

                            fontFamily:
                                "var(--clinova-font-family)",

                            fontSize: {
                                xs: "0.88rem",
                                md: "0.96rem",
                            },

                            lineHeight: 2,

                            color:
                                "text.secondary",
                        }}
                    >
                        {t("أصحاب عيادات حقيقية، وتجارب حقيقية، ونتائج يمكن قياسها. قريبًا سنشارككم قصصهم بالفيديو.")}
                        </Typography>
                </Box>

                {/* =====================================
                    MAIN TESTIMONIAL
                ====================================== */}

                <Box
                    sx={{
                        position: "relative",

                        width: "100%",

                        maxWidth: 1100,

                        mx: "auto",

                        mb: 3,

                        borderRadius: 4,

                        border:
                            "1px solid rgba(142,168,232,0.18)",

                        background:
                            "linear-gradient(145deg, rgba(142,168,232,0.08), rgba(11,17,27,0.75))",

                        overflow: "hidden",
                    }}
                >
                    {/* =================================
                        VIDEO PLACEHOLDER
                    ================================== */}

                    <Box
                        sx={{
                            position: "relative",

                            minHeight: {
                                xs: 280,
                                sm: 360,
                                md: 470,
                            },

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            overflow: "hidden",

                            background:
                                "radial-gradient(circle at center, rgba(142,168,232,0.12), transparent 42%), #090F18",

                            "&::before": {
                                content: '""',

                                position:
                                    "absolute",

                                inset: 0,

                                backgroundImage: `
                                    linear-gradient(
                                        rgba(142,168,232,0.035) 1px,
                                        transparent 1px
                                    ),
                                    linear-gradient(
                                        90deg,
                                        rgba(142,168,232,0.035) 1px,
                                        transparent 1px
                                    )
                                `,

                                backgroundSize:
                                    "45px 45px",

                                maskImage:
                                    "linear-gradient(to bottom, black, transparent)",

                                pointerEvents:
                                    "none",
                            },
                        }}
                    >
                        {/* Top technical bar */}

                        <Stack
                            sx={{
                                position:
                                    "absolute",

                                top: 0,
                                left: 0,
                                right: 0,

                                height: 34,

                                px: 2,

                                display:
                                    "flex",

                                flexDirection:
                                    "row",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "space-between",

                                direction:
                                    "ltr",

                                borderBottom:
                                    "1px solid rgba(142,168,232,0.08)",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Plus Jakarta Sans", sans-serif',

                                    fontSize:
                                        "0.46rem",

                                    letterSpacing:
                                        "0.16em",

                                    color:
                                        "rgba(245,247,250,0.3)",
                                }}
                            >
                                {t("CLINOVA / TESTIMONIAL")}
                        </Typography>

                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Plus Jakarta Sans", sans-serif',

                                    fontSize:
                                        "0.46rem",

                                    letterSpacing:
                                        "0.14em",

                                    color:
                                        "primary.main",
                                }}
                            >
                                {t("COMING SOON")}
                        </Typography>
                        </Stack>

                        {/* Center Play */}

                        <Box
                            sx={{
                                position:
                                    "relative",

                                zIndex: 2,

                                width: {
                                    xs: 68,
                                    md: 82,
                                },

                                height: {
                                    xs: 68,
                                    md: 82,
                                },

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                borderRadius:
                                    "50%",

                                border:
                                    "1px solid rgba(142,168,232,0.45)",

                                background:
                                    "rgba(142,168,232,0.10)",

                                backdropFilter:
                                    "blur(10px)",

                                boxShadow:
                                    "0 0 50px rgba(142,168,232,0.14)",

                                cursor:
                                    "default",
                            }}
                        >
                            <PlayArrowRoundedIcon
                                sx={{
                                    fontSize: {
                                        xs: 30,
                                        md: 36,
                                    },

                                    color:
                                        "primary.main",

                                    ml: 0.5,
                                }}
                            />
                        </Box>

                        {/* Bottom info */}

                        <Box
                            sx={{
                                position:
                                    "absolute",

                                left: {
                                    xs: 20,
                                    md: 32,
                                },

                                right: {
                                    xs: 20,
                                    md: 32,
                                },

                                bottom: {
                                    xs: 18,
                                    md: 28,
                                },

                                display:
                                    "flex",

                                alignItems:
                                    "flex-end",

                                justifyContent:
                                    "space-between",

                                direction:
                                    direction,
                            }}
                        >
                            <Box
                                sx={{
                                    textAlign:
                                        "start",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily:
                                            "var(--clinova-font-family)",

                                        fontSize: {
                                            xs: "0.85rem",
                                            md: "1rem",
                                        },

                                        fontWeight:
                                            600,

                                        color:
                                            "text.primary",
                                    }}
                                >
                                    {t(active.name)}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.4,

                                        fontFamily:
                                            "var(--clinova-font-family)",

                                        fontSize:
                                            "0.62rem",

                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    {t(active.specialty)}
                                    {" · "}
                                    {t(active.location)}
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Plus Jakarta Sans", sans-serif',

                                    fontSize:
                                        "0.48rem",

                                    letterSpacing:
                                        "0.12em",

                                    color:
                                        "rgba(245,247,250,0.28)",
                                }}
                            >
                                {t("VIDEO 01")}
                        </Typography>
                        </Box>
                    </Box>

                    {/* =================================
                        QUOTE
                    ================================== */}

                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "auto 1fr",
                            },

                            gap: 3,

                            alignItems: "center",

                            p: {
                                xs: 3,
                                md: 4,
                            },

                            borderTop:
                                "1px solid rgba(142,168,232,0.10)",
                        }}
                    >
                        <FormatQuoteRoundedIcon
                            sx={{
                                fontSize: 40,

                                color:
                                    "rgba(142,168,232,0.35)",
                            }}
                        />

                        <Typography
                            sx={{
                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize: {
                                    xs: "0.95rem",
                                    md: "1.1rem",
                                },

                                lineHeight: 1.9,

                                color:
                                    "rgba(245,247,250,0.75)",

                                textAlign: "start",
                            }}
                        >
                            {t(active.text)}
                        </Typography>
                    </Box>
                </Box>

                {/* =====================================
                    ARROWS
                ====================================== */}

                <Stack
                    sx={{
                        flexDirection: "row",

                        alignItems: "center",

                        justifyContent:
                            "center",

                        gap: 1,

                        mb: 4,
                    }}
                >
                    <ArrowButton
                        onClick={
                            previousTestimonial
                        }
                        rotate={false}
                    />

                    <Typography
                        sx={{
                            mx: 1,

                            fontFamily:
                                '"Plus Jakarta Sans", sans-serif',

                            fontSize:
                                "0.55rem",

                            letterSpacing:
                                "0.12em",

                            color:
                                "rgba(245,247,250,0.3)",
                        }}
                    >
                        {String(
                            activeIndex + 1,
                        ).padStart(2, "0")}{" "}
                        /{" "}
                        {String(
                            testimonials.length,
                        ).padStart(2, "0")}
                    </Typography>

                    <ArrowButton
                        onClick={
                            nextTestimonial
                        }
                        rotate
                    />
                </Stack>

                {/* =====================================
                    THUMBNAILS
                ====================================== */}

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(3, 1fr)",
                            md: "repeat(6, 1fr)",
                        },

                        gap: 1.5,

                        maxWidth: 1100,

                        mx: "auto",
                    }}
                >
                    {testimonials.map(
                        (testimonial, index) => {
                            const active =
                                activeIndex ===
                                index;

                            return (
                                <Box
                                    key={
                                        testimonial.id
                                    }
                                    component="button"
                                    onClick={() =>
                                        setActiveIndex(
                                            index,
                                        )
                                    }
                                    sx={{
                                        position:
                                            "relative",

                                        height: {
                                            xs: 100,
                                            md: 115,
                                        },

                                        display:
                                            "flex",

                                        flexDirection:
                                            "column",

                                        alignItems:
                                            "flex-end",

                                        justifyContent:
                                            "flex-end",

                                        p: 1.5,

                                        textAlign:
                                            "start",

                                        borderRadius:
                                            2.5,

                                        border:
                                            active
                                                ? "1px solid rgba(142,168,232,0.45)"
                                                : "1px solid rgba(142,168,232,0.09)",

                                        background:
                                            active
                                                ? "rgba(142,168,232,0.08)"
                                                : "rgba(11,17,27,0.4)",

                                        cursor:
                                            "pointer",

                                        overflow:
                                            "hidden",

                                        color:
                                            "inherit",

                                        transition:
                                            "all 0.3s ease",

                                        "&:hover": {
                                            borderColor:
                                                "rgba(142,168,232,0.3)",
                                        },
                                    }}
                                >
                                    {/* Fake video image */}

                                    <Box
                                        sx={{
                                            position:
                                                "absolute",

                                            inset: 0,

                                            background:
                                                "linear-gradient(135deg, rgba(142,168,232,0.06), transparent)",

                                            "&::after":
                                                {
                                                    content:
                                                        '""',

                                                    position:
                                                        "absolute",

                                                    width: 24,
                                                    height: 24,

                                                    top: "50%",
                                                    left: "50%",

                                                    transform:
                                                        "translate(-50%, -50%)",

                                                    borderRadius:
                                                        "50%",

                                                    border:
                                                        "1px solid rgba(142,168,232,0.25)",
                                                },
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            position:
                                                "relative",

                                            zIndex: 1,

                                            width: "100%",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily:
                                                    "var(--clinova-font-family)",

                                                fontSize:
                                                    "0.68rem",

                                                fontWeight:
                                                    600,

                                                color:
                                                    active
                                                        ? "text.primary"
                                                        : "text.secondary",
                                            }}
                                        >
                                            {t(testimonial.name)}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 0.3,

                                                fontFamily:
                                                    "var(--clinova-font-family)",

                                                fontSize:
                                                    "0.52rem",

                                                color:
                                                    "rgba(245,247,250,0.32)",
                                            }}
                                        >
                                            {t(testimonial.specialty)}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        },
                    )}
                </Box>
            </Container>
        </Box>
    );
}

/* =========================================
   ARROW BUTTON
========================================= */

function ArrowButton({
    onClick,
    rotate,
}: {
    onClick: () => void;
    rotate: boolean;
}) {
    return (
        <Box
            component="button"
            onClick={onClick}
            sx={{
                width: 38,
                height: 38,

                display: "flex",

                alignItems: "center",
                justifyContent: "center",

                borderRadius: "50%",

                border:
                    "1px solid rgba(142,168,232,0.16)",

                backgroundColor:
                    "rgba(142,168,232,0.035)",

                color:
                    "rgba(245,247,250,0.6)",

                cursor: "pointer",

                transition:
                    "all 0.25s ease",

                "&:hover": {
                    borderColor:
                        "rgba(142,168,232,0.4)",

                    color:
                        "primary.main",

                    backgroundColor:
                        "rgba(142,168,232,0.07)",
                },
            }}
        >
            <ArrowBackRoundedIcon
                sx={{
                    fontSize: 17,

                    transform: rotate
                        ? "rotate(180deg)"
                        : "none",
                }}
            />
        </Box>
    );
}

export default TestimonialsSection;