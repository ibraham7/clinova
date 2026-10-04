import { useState } from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

type Service = {
    id: string;
    number: string;
    title: string;
    navLabel: string;
    categoryTitle?: string;
    subtitle: string;
    description: string;
    features: string[];
    stats: {
        label: string;
        value: string;
    }[];
};

const services: Service[] = [
    {
        id: "ads",
        number: "01",
        navLabel: "جذب المريض",
        title: "نوصل عيادتك إلى المرضى المناسبين",
        categoryTitle: "إدارة المحتوى والتسويق",
        subtitle: "جذب المرضى",
        description:
            "Google + Meta + SEO وحملات موجهة لجذب استفسارات حقيقية من أشخاص يبحثون عن خدمات عيادتك.",
        features: [
            "استراتيجية الحملات",
            "استهداف الجمهور",
            "تحسين التحويل",
            "تقارير أداء واضحة",
        ],
        stats: [
            {
                label: "META",
                value: "82%",
            },
            {
                label: "GOOGLE",
                value: "65%",
            },
            {
                label: "TIKTOK",
                value: "48%",
            },
            {
                label: "SNAP",
                value: "28%",
            },
        ],
    },

    {
        id: "content",
        number: "02",
        navLabel: "استجابة فورية",
        title: "نضمن استجابة فورية لكل استفسار",
        categoryTitle: "تأهيل ومتابعة المرضى",
        subtitle: "التواصل الذكي",
        description:
            "AI يستجيب للمرضى على مدار الساعة عبر WhatsApp، مع انتقال المتابعة إلى فريقنا البشري خلال أوقات العمل.",
        features: [
            "استراتيجية المحتوى",
            "كتابة المحتوى الطبي",
            "تصميم المنشورات",
            "إدارة الهوية البصرية",
        ],
        stats: [
            {
                label: "EDUCATION",
                value: "90%",
            },
            {
                label: "TRUST",
                value: "78%",
            },
            {
                label: "REACH",
                value: "64%",
            },
            {
                label: "ENGAGE",
                value: "52%",
            },
        ],
    },

    {
        id: "growth",
        number: "03",
        navLabel: "تأهيل المريض",
        title: "نحوّل الاستفسارات إلى مواعيد",
        categoryTitle: "نمو العيادة",
        subtitle: "تأهيل وحجز",
        description:
            "نفهم احتياج المريض، نجيب عن استفساراته، نؤهله ونساعده على الوصول إلى حجز الموعد المناسب.",
        features: [
            "تحليل رحلة المريض",
            "تحسين تجربة الحجز",
            "قياس النتائج",
            "استراتيجية النمو",
        ],
        stats: [
            {
                label: "LEADS",
                value: "86%",
            },
            {
                label: "BOOKING",
                value: "73%",
            },
            {
                label: "RETENTION",
                value: "61%",
            },
            {
                label: "GROWTH",
                value: "54%",
            },
        ],
    },

    {
        id: "crm",
        number: "04",
        navLabel: "حجز الموعد",
        title: "كل مريض وفرصة في مكان واحد",
        subtitle: "إدارة ونمو العيادة",
        description:
            "CRM يجمع الاستفسارات والمواعيد والمتابعات، ويمنحك رؤية واضحة لمسار كل مريض وفرصة داخل عيادتك.",
        features: [
            "إدارة بيانات المرضى",
            "متابعة الاستفسارات",
            "تنظيم الحجوزات",
            "تقارير دورية",
        ],
        stats: [
            {
                label: "FOLLOW UP",
                value: "91%",
            },
            {
                label: "RESPONSE",
                value: "84%",
            },
            {
                label: "BOOKING",
                value: "76%",
            },
            {
                label: "RETENTION",
                value: "69%",
            },
        ],
    },

    {
        id: "booking",
        number: "05",
        navLabel: "متابعة وتحويل",
        title: "نساعد المريض على اتخاذ القرار",
        subtitle: "تنسيق علاجي ومبيعات",
        description:
            "فريق متخصص يتولى التواصل والمتابعة، ويفهم احتياج المريض ويشرح له الخيارات العلاجية المناسبة باحترافية وإنسانية.",
        features: [
            "تتبع مصادر المرضى",
            "متابعة الحجوزات",
            "تنبيهات المتابعة",
            "تحليل التحويلات",
        ],
        stats: [
            {
                label: "TRACKED",
                value: "95%",
            },
            {
                label: "FOLLOW UP",
                value: "88%",
            },
            {
                label: "BOOKING",
                value: "72%",
            },
            {
                label: "CONVERT",
                value: "63%",
            },
        ],
    },

    {
        id: "creative",
        number: "06",
        navLabel: "إعادة تنشيط",
        title: "نستعيد الفرص التي لم تكتمل",
        subtitle: "إعادة تنشيط المرضى",
        description:
            "نعيد التواصل مع المرضى السابقين والاستفسارات غير المكتملة عبر حملات متابعة وتنشيط مدروسة.",
        features: [
            "الهوية البصرية",
            "التصميم الإبداعي",
            "تصميم الحملات",
            "تجربة المستخدم",
        ],
        stats: [
            {
                label: "BRAND",
                value: "92%",
            },
            {
                label: "DESIGN",
                value: "87%",
            },
            {
                label: "UX",
                value: "81%",
            },
            {
                label: "IDENTITY",
                value: "76%",
            },
        ],
    },
];

function ServicesSection() {
    const [activeService, setActiveService] = useState("ads");

    const active =
        services.find((service) => service.id === activeService) ??
        services[0];

    return (
        <Box
            component="section"
            id="services"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 10,
                    md: 14,
                    lg: 18,
                },

                background:
                    "radial-gradient(circle at 50% 45%, rgba(142,168,232,0.07), transparent 38%), #0B111B",

                direction: "rtl",
            }}
        >
            <Container>
                {/* =========================================
                    TOP TABS
                ========================================== */}

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(3, 1fr)",
                        },

                        gap: 1.5,

                        mb: {
                            xs: 4,
                            md: 5,
                        },
                    }}
                >
                    {services.slice(0, 3).map((service) => {
                        const isActive =
                            activeService === service.id;

                        return (
                            <ServiceTopTab
                                key={service.id}
                                service={service}
                                active={isActive}
                                onClick={() =>
                                    setActiveService(service.id)
                                }
                            />
                        );
                    })}
                </Box>

                {/* =========================================
                    MAIN PANEL
                ========================================== */}

                <Box
                    sx={{
                        position: "relative",

                        minHeight: {
                            xs: "auto",
                            lg: 365,
                        },

                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },

                        borderRadius: 5,

                        border:
                            "1px solid rgba(142,168,232,0.20)",

                        background:
                            "linear-gradient(135deg, rgba(142,168,232,0.08), rgba(21,31,45,0.72))",

                        overflow: "hidden",

                        "&::before": {
                            content: '""',

                            position: "absolute",

                            width: 500,
                            height: 500,

                            right: -200,
                            bottom: -350,

                            borderRadius: "50%",

                            background:
                                "radial-gradient(circle, rgba(142,168,232,0.12), transparent 68%)",

                            pointerEvents: "none",
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,

                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",
                                lg: "1fr 1fr",
                            },

                            gap: {
                                xs: 5,
                                lg: 7,
                            },

                            alignItems: "center",
                        }}
                    >
                        {/* =================================
                            ANALYTICS
                        ================================== */}

                        <AnalyticsPanel
                            stats={active.stats}
                        />

                        {/* =================================
                            CONTENT
                        ================================== */}

                        <Box
                            sx={{
                                px: {
                                    xs: 1,
                                    md: 2,
                                },

                                py: {
                                    xs: 2,
                                    md: 3,
                                },

                                textAlign: "right",
                            }}
                        >
                            {/* Badge */}
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 1,

                                    px: 1.8,
                                    py: 0.7,

                                    borderRadius: "999px",

                                    border:
                                        "1px solid rgba(142,168,232,0.20)",

                                    backgroundColor:
                                        "rgba(142,168,232,0.05)",
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
                                            "0 0 10px rgba(142,168,232,0.7)",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"IBM Plex Sans Arabic", sans-serif',

                                        fontSize: "0.7rem",

                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    {active.number} / {active.subtitle}
                                </Typography>
                            </Box>

                            {/* Title */}
                            <Typography
                                component="h3"
                                sx={{
                                    mt: 2.5,

                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',

                                    fontSize: {
                                        xs: "2rem",
                                        md: "2.6rem",
                                        lg: "3rem",
                                    },

                                    fontWeight: 600,

                                    lineHeight: 1.35,

                                    letterSpacing: 0,

                                    color: "#F5F7FA",
                                }}
                            >
                                {active.title}
                            </Typography>

                            {/* Description */}
                            <Typography
                                sx={{
                                    mt: 2,

                                    maxWidth: 520,

                                    ml: "auto",

                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',

                                    fontSize: {
                                        xs: "0.85rem",
                                        md: "0.92rem",
                                    },

                                    lineHeight: 2,

                                    color: "text.secondary",
                                }}
                            >
                                {active.description}
                            </Typography>

                            {/* Features */}
                            <Box
                                sx={{
                                    mt: 4,

                                    display: "grid",

                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                    },

                                    gap: 1.3,
                                }}
                            >
                                {active.features.map(
                                    (feature) => (
                                        <Stack
                                            key={feature}
                                            sx={{
                                                flexDirection:
                                                    "row",

                                                alignItems:
                                                    "center",

                                                gap: 1,

                                                justifyContent:
                                                    "flex-start",
                                            }}
                                        >
                                            <CheckRoundedIcon
                                                sx={{
                                                    fontSize: 15,

                                                    color:
                                                        "primary.main",
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    fontFamily:
                                                        '"IBM Plex Sans Arabic", sans-serif',

                                                    fontSize:
                                                        "0.75rem",

                                                    color:
                                                        "text.secondary",
                                                }}
                                            >
                                                {feature}
                                            </Typography>
                                        </Stack>
                                    ),
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* =========================================
                    BOTTOM SERVICES NAV
                ========================================== */}

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(3, 1fr)",
                            md: "repeat(6, 1fr)",
                        },

                        columnGap: 3,
                        mt: 3,

                        borderTop:
                            "1px solid rgba(142,168,232,0.10)",
                    }}
                >
                    {services.map((service, index) => {
                        const isActive =
                            activeService === service.id;

                        return (
                            <Box
                                key={service.id}
                                component="button"
                                onClick={() =>
                                    setActiveService(
                                        service.id,
                                    )
                                }
                                sx={{
                                    position: "relative",

                                    border: 0,

                                    background:
                                        "transparent",

                                    cursor: "pointer",

                                    px: 1,

                                    py: 2,

                                    textAlign: "center",

                                    color: isActive
                                        ? "primary.main"
                                        : "text.secondary",

                                    "&::before": {
                                        content: '""',

                                        position:
                                            "absolute",

                                        top: -1,

                                        left: 0,
                                        right: 0,

                                        height: 2,

                                        backgroundColor:
                                            isActive
                                                ? "primary.main"
                                                : "transparent",

                                        boxShadow:
                                            isActive
                                                ? "0 0 12px rgba(142,168,232,0.45)"
                                                : "none",

                                        transition:
                                            "background-color 0.25s ease",
                                    },

                                    "&:hover": {
                                        color:
                                            "primary.light",
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Plus Jakarta Sans", sans-serif',

                                        fontSize:
                                            "0.5rem",

                                        letterSpacing:
                                            "0.12em",

                                        mb: 0.6,

                                        color:
                                            isActive
                                                ? "primary.main"
                                                : "rgba(245,247,250,0.3)",
                                    }}
                                >
                                    {service.number}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"IBM Plex Sans Arabic", sans-serif',

                                        fontSize: {
                                            xs: "0.68rem",
                                            md: "0.72rem",
                                        },

                                        whiteSpace:
                                            "nowrap",
                                    }}
                                >
                                    {service.navLabel}
                                </Typography>
                                {index < services.length - 1 && (
                                    <ArrowBackRoundedIcon
                                        aria-hidden="true"
                                        sx={{
                                            position: "absolute",
                                            left: -12,
                                            top: "50%",
                                            transform: "translate(-50%, -50%)",
                                            fontSize: 18,
                                            color: isActive
                                                ? "primary.main"
                                                : "rgba(142,168,232,0.45)",
                                            pointerEvents: "none",
                                            display: {
                                                xs: (index + 1) % 2 === 0 ? "none" : "block",
                                                sm: (index + 1) % 3 === 0 ? "none" : "block",
                                                md: "block",
                                            },
                                        }}
                                    />
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
}

/* =========================================
   TOP TAB
========================================= */

function ServiceTopTab({
    service,
    active,
    onClick,
}: {
    service: Service;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <Box
            component="button"
            onClick={onClick}
            sx={{
                position: "relative",

                minHeight: {
                    xs: 90,
                    md: 82,
                },

                display: "flex",

                alignItems: "center",

                justifyContent: "space-between",

                px: {
                    xs: 2,
                    md: 3,
                },

                borderRadius: 3,

                border: active
                    ? "1px solid rgba(142,168,232,0.55)"
                    : "1px solid rgba(142,168,232,0.12)",

                background: active
                    ? "linear-gradient(135deg, rgba(142,168,232,0.12), rgba(95,120,181,0.05))"
                    : "rgba(11,17,27,0.35)",

                cursor: "pointer",

                color: "inherit",

                transition:
                    "all 0.3s ease",

                "&:hover": {
                    borderColor:
                        "rgba(142,168,232,0.35)",
                },
            }}
        >
            {/* Text */}
            <Box
                sx={{
                    textAlign: "right",
                }}
            >
                <Typography
                    sx={{
                        fontFamily:
                            '"IBM Plex Sans Arabic", sans-serif',

                        fontSize: "0.9rem",

                        fontWeight: 600,

                        color: active
                            ? "text.primary"
                            : "text.secondary",
                    }}
                >
                    {service.categoryTitle ?? service.subtitle}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,

                        fontFamily:
                            '"IBM Plex Sans Arabic", sans-serif',

                        fontSize: "0.65rem",

                        color:
                            "text.secondary",
                    }}
                >
                    {service.subtitle}
                </Typography>
            </Box>

            {/* Number */}
            <Box
                sx={{
                    width: 34,
                    height: 34,

                    display: "flex",

                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,

                    borderRadius: "50%",

                    backgroundColor: active
                        ? "primary.main"
                        : "rgba(142,168,232,0.04)",

                    border:
                        "1px solid rgba(142,168,232,0.18)",

                    color: active
                        ? "#0B111B"
                        : "text.secondary",
                }}
            >
                <Typography
                    sx={{
                        fontFamily:
                            '"Plus Jakarta Sans", sans-serif',

                        fontSize: "0.55rem",

                        fontWeight: 600,
                    }}
                >
                    {service.number}
                </Typography>
            </Box>
        </Box>
    );
}

/* =========================================
   ANALYTICS PANEL
========================================= */

function AnalyticsPanel({
    stats,
}: {
    stats: Service["stats"];
}) {
    return (
        <Box
            sx={{
                position: "relative",

                width: "100%",

                minHeight: {
                    xs: 280,
                    md: 310,
                },

                borderRadius: 3,

                border:
                    "1px solid rgba(142,168,232,0.16)",

                backgroundColor:
                    "rgba(11,17,27,0.68)",

                overflow: "hidden",

                p: {
                    xs: 2,
                    md: 3,
                },
            }}
        >
            {/* Header */}
            <Stack
                sx={{
                    flexDirection: "row",

                    alignItems: "center",

                    justifyContent:
                        "space-between",

                    direction: "ltr",

                    mb: 3,
                }}
            >
                <Typography
                    sx={{
                        fontFamily:
                            '"Plus Jakarta Sans", sans-serif',

                        fontSize: "0.5rem",

                        letterSpacing: "0.15em",

                        color:
                            "rgba(245,247,250,0.4)",
                    }}
                >
                    CLINOVA / ANALYTICS
                </Typography>

                <Stack
                    sx={{
                        flexDirection: "row",

                        alignItems: "center",

                        gap: 0.7,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily:
                                '"Plus Jakarta Sans", sans-serif',

                            fontSize: "0.48rem",

                            letterSpacing:
                                "0.12em",

                            color:
                                "rgba(245,247,250,0.35)",
                        }}
                    >
                        LIVE
                    </Typography>

                    <Box
                        sx={{
                            width: 6,
                            height: 6,

                            borderRadius: "50%",

                            backgroundColor:
                                "primary.main",

                            boxShadow:
                                "0 0 10px rgba(142,168,232,0.8)",
                        }}
                    />
                </Stack>
            </Stack>

            {/* Bars */}
            <Box
                sx={{
                    display: "flex",

                    flexDirection: "column",

                    gap: 2,
                }}
            >
                {stats.map((stat, index) => (
                    <Box
                        key={stat.label}
                        sx={{
                            display: "grid",

                            gridTemplateColumns:
                                "75px 1fr 45px",

                            alignItems: "center",

                            gap: 1.5,

                            direction: "ltr",
                        }}
                    >
                        {/* Label */}
                        <Typography
                            sx={{
                                fontFamily:
                                    '"Plus Jakarta Sans", sans-serif',

                                fontSize: "0.62rem",

                                letterSpacing:
                                    "0.08em",

                                color:
                                    "rgba(245,247,250,0.55)",
                            }}
                        >
                            {stat.label}
                        </Typography>

                        {/* Bar */}
                        <Box
                            sx={{
                                position: "relative",

                                height: 14,

                                borderRadius:
                                    "999px",

                                backgroundColor:
                                    "rgba(142,168,232,0.08)",

                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    width: stat.value,

                                    height: "100%",

                                    borderRadius:
                                        "999px",

                                    background:
                                        "linear-gradient(90deg, #5F78B5, #8EA8E8)",

                                    boxShadow:
                                        "0 0 16px rgba(142,168,232,0.18)",

                                    animation:
                                        `clinovaBar 0.8s ease ${index * 0.08
                                        }s both`,

                                    "@keyframes clinovaBar": {
                                        from: {
                                            transform:
                                                "scaleX(0)",
                                            transformOrigin:
                                                "left",
                                        },

                                        to: {
                                            transform:
                                                "scaleX(1)",
                                        },
                                    },
                                }}
                            />
                        </Box>

                        {/* Value */}
                        <Typography
                            sx={{
                                fontFamily:
                                    '"Plus Jakarta Sans", sans-serif',

                                fontSize: "0.65rem",

                                color:
                                    "primary.light",
                            }}
                        >
                            {stat.value}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Footer */}
            <Typography
                sx={{
                    position: "absolute",

                    left: 24,
                    bottom: 22,

                    fontFamily:
                        '"Plus Jakarta Sans", sans-serif',

                    fontSize: "0.48rem",

                    letterSpacing:
                        "0.12em",

                    color:
                        "rgba(245,247,250,0.28)",
                }}
            >
                PERFORMANCE / THIS MONTH
            </Typography>

            <PauseRoundedIcon
                sx={{
                    position: "absolute",

                    right: 20,
                    bottom: 18,

                    fontSize: 17,

                    color:
                        "rgba(245,247,250,0.22)",
                }}
            />
        </Box>
    );
}

export default ServicesSection;