import { useSiteTranslation } from "../../i18n/useSiteTranslation";
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
    const { direction, t, isRtl } = useSiteTranslation();

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
                    "radial-gradient(circle at 50% 45%, var(--clinova-rgba-142-168-232-0_07), transparent 38%), var(--clinova-color-0b111b)",

                direction: direction,
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
                            "1px solid var(--clinova-rgba-142-168-232-0_2)",

                        background:
                            "linear-gradient(135deg, var(--clinova-rgba-142-168-232-0_08), var(--clinova-rgba-21-31-45-0_72))",

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
                                "radial-gradient(circle, var(--clinova-rgba-142-168-232-0_12), transparent 68%)",

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

                                textAlign: "start",
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
                                        "1px solid var(--clinova-rgba-142-168-232-0_2)",

                                    backgroundColor:
                                        "var(--clinova-rgba-142-168-232-0_05)",
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
                                            "0 0 10px var(--clinova-rgba-142-168-232-0_7)",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontFamily:
                                            "var(--clinova-font-family)",

                                        fontSize: "0.7rem",

                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    {active.number} / {t(active.subtitle)}
                                </Typography>
                            </Box>

                            {/* Title */}
                            <Typography
                                component="h3"
                                sx={{
                                    mt: 2.5,

                                    fontFamily:
                                        "var(--clinova-font-family)",

                                    fontSize: {
                                        xs: "2rem",
                                        md: "2.6rem",
                                        lg: "3rem",
                                    },

                                    fontWeight: 600,

                                    lineHeight: 1.35,

                                    letterSpacing: 0,

                                    color: "var(--clinova-color-f5f7fa)",
                                }}
                            >
                                {t(active.title)}
                            </Typography>

                            {/* Description */}
                            <Typography
                                sx={{
                                    mt: 2,

                                    maxWidth: 520,

                                    ml: "auto",

                                    fontFamily:
                                        "var(--clinova-font-family)",

                                    fontSize: {
                                        xs: "0.85rem",
                                        md: "0.92rem",
                                    },

                                    lineHeight: 2,

                                    color: "text.secondary",
                                }}
                            >
                                {t(active.description)}
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
                                                        "var(--clinova-font-family)",

                                                    fontSize:
                                                        "0.75rem",

                                                    color:
                                                        "text.secondary",
                                                }}
                                            >
                                                {t(feature)}
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
                            "1px solid var(--clinova-rgba-142-168-232-0_1)",
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
                                                ? "0 0 12px var(--clinova-rgba-142-168-232-0_45)"
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
                                                : "var(--clinova-rgba-245-247-250-0_3)",
                                    }}
                                >
                                    {service.number}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily:
                                            "var(--clinova-font-family)",

                                        fontSize: {
                                            xs: "0.68rem",
                                            md: "0.72rem",
                                        },

                                        whiteSpace: "normal",
                                    }}
                                >
                                    {t(service.navLabel)}
                                </Typography>
                                {index < services.length - 1 && (
                                    <ArrowBackRoundedIcon
                                        aria-hidden="true"
                                        sx={{
                                            position: "absolute",
                                            insetInlineEnd: -12,
                                            top: "50%",
                                            transform: isRtl
                                                ? "translate(-50%, -50%)"
                                                : "translate(50%, -50%) rotate(180deg)",
                                            fontSize: 18,
                                            color: isActive
                                                ? "primary.main"
                                                : "var(--clinova-rgba-142-168-232-0_45)",
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
    const { t } = useSiteTranslation();

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
                    ? "1px solid var(--clinova-rgba-142-168-232-0_55)"
                    : "1px solid var(--clinova-rgba-142-168-232-0_12)",

                background: active
                    ? "linear-gradient(135deg, var(--clinova-rgba-142-168-232-0_12), var(--clinova-rgba-95-120-181-0_05))"
                    : "var(--clinova-rgba-11-17-27-0_35)",

                cursor: "pointer",

                color: "inherit",

                transition:
                    "all 0.3s ease",

                "&:hover": {
                    borderColor:
                        "var(--clinova-rgba-142-168-232-0_35)",
                },
            }}
        >
            {/* Text */}
            <Box
                sx={{
                    textAlign: "start",
                }}
            >
                <Typography
                    sx={{
                        fontFamily:
                            "var(--clinova-font-family)",

                        fontSize: "0.9rem",

                        fontWeight: 600,

                        color: active
                            ? "text.primary"
                            : "text.secondary",
                    }}
                >
                    {t(service.categoryTitle ?? service.subtitle)}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,

                        fontFamily:
                            "var(--clinova-font-family)",

                        fontSize: "0.65rem",

                        color:
                            "text.secondary",
                    }}
                >
                    {t(service.subtitle)}
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
                        : "var(--clinova-rgba-142-168-232-0_04)",

                    border:
                        "1px solid var(--clinova-rgba-142-168-232-0_18)",

                    color: active
                        ? "var(--clinova-color-0b111b)"
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
    const { t } = useSiteTranslation();

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
                    "1px solid var(--clinova-rgba-142-168-232-0_16)",

                backgroundColor:
                    "var(--clinova-rgba-11-17-27-0_68)",

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
                            "var(--clinova-rgba-245-247-250-0_4)",
                    }}
                >
                    {t("CLINOVA / ANALYTICS")}
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
                                "var(--clinova-rgba-245-247-250-0_35)",
                        }}
                    >
                        {t("LIVE")}
                        </Typography>

                    <Box
                        sx={{
                            width: 6,
                            height: 6,

                            borderRadius: "50%",

                            backgroundColor:
                                "primary.main",

                            boxShadow:
                                "0 0 10px var(--clinova-rgba-142-168-232-0_8)",
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
                                    "var(--clinova-rgba-245-247-250-0_55)",
                            }}
                        >
                            {t(stat.label)}
                        </Typography>

                        {/* Bar */}
                        <Box
                            sx={{
                                position: "relative",

                                height: 14,

                                borderRadius:
                                    "999px",

                                backgroundColor:
                                    "var(--clinova-rgba-142-168-232-0_08)",

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
                                        "linear-gradient(90deg, var(--clinova-color-5f78b5), var(--clinova-color-8ea8e8))",

                                    boxShadow:
                                        "0 0 16px var(--clinova-rgba-142-168-232-0_18)",

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
                            {t(stat.value)}
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
                        "var(--clinova-rgba-245-247-250-0_28)",
                }}
            >
                {t("PERFORMANCE / THIS MONTH")}
                        </Typography>

            <PauseRoundedIcon
                sx={{
                    position: "absolute",

                    right: 20,
                    bottom: 18,

                    fontSize: 17,

                    color:
                        "var(--clinova-rgba-245-247-250-0_22)",
                }}
            />
        </Box>
    );
}

export default ServicesSection;
