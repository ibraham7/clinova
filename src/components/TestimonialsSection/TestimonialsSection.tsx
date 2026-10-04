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
                    "radial-gradient(circle at 50% 40%, var(--clinova-rgba-142-168-232-0_07), transparent 38%), var(--clinova-color-0b111b)",

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
                                "1px solid var(--clinova-rgba-142-168-232-0_18)",

                            backgroundColor:
                                "var(--clinova-rgba-142-168-232-0_04)",
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
                                    "0 0 12px var(--clinova-rgba-142-168-232-0_7)",
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

                            color: "var(--clinova-color-f5f7fa)",
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
                            "1px solid var(--clinova-rgba-142-168-232-0_18)",

                        background:
                            "linear-gradient(145deg, var(--clinova-rgba-142-168-232-0_08), var(--clinova-rgba-11-17-27-0_75))",

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
                                "radial-gradient(circle at center, var(--clinova-rgba-142-168-232-0_12), transparent 42%), var(--clinova-color-090f18)",

                            "&::before": {
                                content: '""',

                                position:
                                    "absolute",

                                inset: 0,

                                backgroundImage: `
                                    linear-gradient(
                                        var(--clinova-rgba-142-168-232-0_035) 1px,
                                        transparent 1px
                                    ),
                                    linear-gradient(
                                        90deg,
                                        var(--clinova-rgba-142-168-232-0_035) 1px,
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
                                    "1px solid var(--clinova-rgba-142-168-232-0_08)",
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
                                        "var(--clinova-rgba-245-247-250-0_3)",
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
                                    "1px solid var(--clinova-rgba-142-168-232-0_45)",

                                background:
                                    "var(--clinova-rgba-142-168-232-0_1)",

                                backdropFilter:
                                    "blur(10px)",

                                boxShadow:
                                    "0 0 50px var(--clinova-rgba-142-168-232-0_14)",

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
                                        "var(--clinova-rgba-245-247-250-0_28)",
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
                                "1px solid var(--clinova-rgba-142-168-232-0_1)",
                        }}
                    >
                        <FormatQuoteRoundedIcon
                            sx={{
                                fontSize: 40,

                                color:
                                    "var(--clinova-text-rgba-142-168-232-0_35)",
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
                                    "var(--clinova-rgba-245-247-250-0_75)",

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
                                "var(--clinova-rgba-245-247-250-0_3)",
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
                                                ? "1px solid var(--clinova-rgba-142-168-232-0_45)"
                                                : "1px solid var(--clinova-rgba-142-168-232-0_09)",

                                        background:
                                            active
                                                ? "var(--clinova-rgba-142-168-232-0_08)"
                                                : "var(--clinova-rgba-11-17-27-0_4)",

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
                                                "var(--clinova-rgba-142-168-232-0_3)",
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
                                                "linear-gradient(135deg, var(--clinova-rgba-142-168-232-0_06), transparent)",

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
                                                        "1px solid var(--clinova-rgba-142-168-232-0_25)",
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
                                                    "var(--clinova-rgba-245-247-250-0_32)",
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
                    "1px solid var(--clinova-rgba-142-168-232-0_16)",

                backgroundColor:
                    "var(--clinova-rgba-142-168-232-0_035)",

                color:
                    "var(--clinova-rgba-245-247-250-0_6)",

                cursor: "pointer",

                transition:
                    "all 0.25s ease",

                "&:hover": {
                    borderColor:
                        "var(--clinova-rgba-142-168-232-0_4)",

                    color:
                        "primary.main",

                    backgroundColor:
                        "var(--clinova-rgba-142-168-232-0_07)",
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