import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { useState } from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

type CaseStudy = {
    id: string;
    number: string;
    name: string;
    location: string;
    specialty: string;
    result: string;
    resultLabel: string;
    challenge?: string;
    solution?: string;
    stats: {
        value: string;
        label: string;
    }[];
};

const caseStudies: CaseStudy[] = [
    {
        id: "dalya",
        number: "01",
        name: "د. داليا الصديق",
        location: "الشارقة، الإمارات",
        specialty: "زراعة + تجميل",
        result: "385K",
        resultLabel: "إيرادات من 812 موعد محجوز",
        stats: [
            {
                value: "812",
                label: "موعد محجوز",
            },
            {
                value: "AED 475",
                label: "متوسط إيراد الموعد",
            },
            {
                value: "6.4×",
                label: "العائد على الاستثمار",
            },
        ],
    },

    {
        id: "dentist",
        number: "02",
        name: "عيادات دانتين",
        location: "الخبر، السعودية",
        specialty: "أسنان",
        result: "276K",
        resultLabel: "إيرادات من 594 موعد محجوز",
        stats: [
            {
                value: "594",
                label: "موعد محجوز",
            },
            {
                value: "SAR 465",
                label: "متوسط إيراد الموعد",
            },
            {
                value: "5.8×",
                label: "العائد على الاستثمار",
            },
        ],
    },

    {
        id: "yousef",
        number: "03",
        name: "عيادات يوسف حكيم لطب الأسنان",
        location: "المدينة المنورة، السعودية",
        specialty: "طب أسنان أطفال",
        result: "198K",
        resultLabel: "إيرادات من 421 موعد محجوز",
        stats: [
            {
                value: "421",
                label: "موعد محجوز",
            },
            {
                value: "SAR 470",
                label: "متوسط إيراد الموعد",
            },
            {
                value: "5.2×",
                label: "العائد على الاستثمار",
            },
        ],
    },

    {
        id: "skai",
        number: "04",
        name: "سكاي دنتال",
        location: "أبوظبي، الإمارات",
        specialty: "أسنان متقدمة",
        result: "342K",
        resultLabel: "إيرادات من 683 موعد محجوز",
        stats: [
            {
                value: "683",
                label: "موعد محجوز",
            },
            {
                value: "AED 501",
                label: "متوسط إيراد الموعد",
            },
            {
                value: "6.1×",
                label: "العائد على الاستثمار",
            },
        ],
    },

    {
        id: "asnan",
        number: "05",
        name: "أسنان كير",
        location: "المنامة، البحرين",
        specialty: "تقويم شفاف",
        result: "164K",
        resultLabel: "إيرادات من 318 موعد محجوز",
        stats: [
            {
                value: "318",
                label: "موعد محجوز",
            },
            {
                value: "BHD 516",
                label: "متوسط إيراد الموعد",
            },
            {
                value: "4.9×",
                label: "العائد على الاستثمار",
            },
        ],
    },
];

function CaseStudiesSection() {
    const { direction, t } = useSiteTranslation();

    const [activeId, setActiveId] = useState("dalya");

    const activeCase =
        caseStudies.find(
            (caseStudy) => caseStudy.id === activeId,
        ) ?? caseStudies[0];

    return (
        <Box
            component="section"
            id="case-studies"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 10,
                    md: 14,
                    lg: 18,
                },

                background:
                    "radial-gradient(circle at 70% 50%, var(--clinova-rgba-142-168-232-0_07), transparent 35%), var(--clinova-color-0b111b)",

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

                            borderRadius: "999px",

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

                                borderRadius: "50%",

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

                                fontSize: "0.72rem",

                                color: "text.secondary",
                            }}
                        >
                            {t("أعمال مختارة")}
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
                        {t("نجاحات حقيقية.")}<Box
                            component="span"
                            sx={{
                                display: "block",

                                fontFamily:
                                    "var(--clinova-font-family)",

                                color: "primary.main",
                            }}
                        >
                            {t("أرقام حقيقية.")}
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            mt: 3,

                            fontFamily:
                                "var(--clinova-font-family)",

                            fontSize: {
                                xs: "0.88rem",
                                md: "0.98rem",
                            },

                            lineHeight: 2,

                            color: "text.secondary",
                        }}
                    >
                        {t("بعض المشاريع الأخيرة. دراسات الحالة الكاملة متوفرة عند الطلب.")}
                        </Typography>
                </Box>

                {/* =====================================
                    MAIN CONTENT
                ====================================== */}

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "280px 1fr",
                        },

                        gap: {
                            xs: 3,
                            lg: 2,
                        },

                        direction: "ltr",
                    }}
                >
                    {/* =================================
                        CASE LIST
                    ================================== */}

                    <Stack
                        sx={{
                            gap: 1.2,

                            direction: direction,

                            order: {
                                xs: 2,
                                lg: 1,
                            },
                        }}
                    >
                        {caseStudies.map((caseStudy) => {
                            const active =
                                activeId === caseStudy.id;

                            return (
                                <CaseItem
                                    key={caseStudy.id}
                                    caseStudy={caseStudy}
                                    active={active}
                                    onClick={() =>
                                        setActiveId(
                                            caseStudy.id,
                                        )
                                    }
                                />
                            );
                        })}
                    </Stack>

                    {/* =================================
                        RESULT CARD
                    ================================== */}

                    <ResultCard
                        caseStudy={activeCase}
                    />
                </Box>
            </Container>
        </Box>
    );
}

/* =========================================
   CASE ITEM
========================================= */

function CaseItem({
    caseStudy,
    active,
    onClick,
}: {
    caseStudy: CaseStudy;
    active: boolean;
    onClick: () => void;
}) {
    const { direction, t } = useSiteTranslation();

    return (
        <Box
            component="button"
            onClick={onClick}
            sx={{
                position: "relative",

                width: "100%",

                minHeight: 68,

                display: "grid",

                gridTemplateColumns:
                    "30px 1fr 18px",

                alignItems: "center",

                gap: 1,

                px: 1.8,

                borderRadius: 2.5,

                border: active
                    ? "1px solid var(--clinova-rgba-142-168-232-0_45)"
                    : "1px solid var(--clinova-rgba-142-168-232-0_09)",

                backgroundColor: active
                    ? "var(--clinova-rgba-142-168-232-0_07)"
                    : "var(--clinova-rgba-11-17-27-0_35)",

                cursor: "pointer",

                textAlign: "start",

                direction: "ltr",

                color: "inherit",

                transition:
                    "all 0.3s ease",

                "&:hover": {
                    borderColor:
                        "var(--clinova-rgba-142-168-232-0_28)",

                    backgroundColor:
                        "var(--clinova-rgba-142-168-232-0_045)",
                },
            }}
        >
            {/* Number */}
            <Typography
                sx={{
                    fontFamily:
                        '"Plus Jakarta Sans", sans-serif',

                    fontSize: "0.55rem",

                    letterSpacing: "0.08em",

                    color: active
                        ? "primary.main"
                        : "var(--clinova-rgba-245-247-250-0_38)",
                }}
            >
                {caseStudy.number}
            </Typography>

            {/* Content */}
            <Box
                sx={{
                    direction: direction,

                    minWidth: 0,
                }}
            >
                <Typography
                    sx={{
                        fontFamily:
                            "var(--clinova-font-family)",

                        fontSize: "0.78rem",

                        fontWeight: active
                            ? 600
                            : 500,

                        color: active
                            ? "text.primary"
                            : "text.secondary",

                        whiteSpace:
                            "nowrap",

                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",
                    }}
                >
                    {t(caseStudy.name)}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.3,

                        fontFamily:
                            "var(--clinova-font-family)",

                        fontSize: "0.58rem",

                        color:
                            "var(--clinova-rgba-245-247-250-0_35)",

                        whiteSpace:
                            "nowrap",

                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",
                    }}
                >
                    {t(caseStudy.location)}
                    {" · "}
                    {t(caseStudy.specialty)}
                </Typography>
            </Box>

            {/* Arrow */}
            <ArrowBackRoundedIcon
                sx={{
                    fontSize: 15,

                    color: active
                        ? "primary.main"
                        : "var(--clinova-rgba-245-247-250-0_18)",

                    transform: "rotate(180deg)",
                }}
            />
        </Box>
    );
}

/* =========================================
   RESULT CARD
========================================= */

function ResultCard({ caseStudy }: { caseStudy: CaseStudy }) {
    const { direction, t } = useSiteTranslation();

    const bookedAppointments = caseStudy.stats.find(
        (stat) => stat.label === "موعد محجوز",
    );

    return (
        <Box
            component="article"
            aria-label={t("تجربة {{name}}", { name: t(caseStudy.name) })}
            sx={{
                order: { xs: 1, lg: 2 },
                minWidth: 0,
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 4,
                border: "1px solid var(--clinova-rgba-142-168-232-0_18)",
                background:
                    "linear-gradient(145deg, var(--clinova-rgba-142-168-232-0_08), var(--clinova-rgba-21-31-45-0_65))",
                direction: direction,
            }}
        >
            <Typography
                sx={{
                    color: "primary.main",
                    fontSize: "0.7rem",
                    mb: 1.5,
                }}
            >
                {t("تجربة العيادة /")}{caseStudy.number}
            </Typography>
            <Typography
                component="h3"
                sx={{
                    fontSize: { xs: "1.5rem", md: "1.9rem" },
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: "text.primary",
                }}
            >
                {t(caseStudy.name)}
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                    my: 3,
                }}
            >
                {[
                    { label: "الموقع", value: caseStudy.location },
                    { label: "التخصص", value: caseStudy.specialty },
                ].map((item) => (
                    <Box
                        key={item.label}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "var(--clinova-rgba-11-17-27-0_35)",
                            border: "1px solid var(--clinova-rgba-142-168-232-0_1)",
                        }}
                    >
                        <Typography sx={{ color: "text.secondary", fontSize: "0.7rem", mb: 0.7 }}>
                            {t(item.label)}
                        </Typography>
                        <Typography sx={{ color: "text.primary", fontSize: "0.9rem" }}>
                            {t(item.value)}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {[
                { title: "التحدّي", text: caseStudy.challenge },
                { title: "كيف ساعدنا العيادة", text: caseStudy.solution },
            ].map((detail) =>
                detail.text ? (
                    <Box key={detail.title} sx={{ mb: 3 }}>
                        <Typography component="h4" sx={{ fontWeight: 600, mb: 1 }}>
                            {t(detail.title)}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", lineHeight: 2, fontSize: "0.9rem" }}>
                            {t(detail.text)}
                        </Typography>
                    </Box>
                ) : null,
            )}

            <Typography component="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {t("نتائج التجربة")}
                        </Typography>
            {bookedAppointments && (
                <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", lineHeight: 2 }}>
                    {t("نتائج الحجوزات {{count}}", { count: bookedAppointments.value })}
                </Typography>
            )}

            <Box
                sx={{
                    mt: 3,
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    border: "1px solid var(--clinova-rgba-142-168-232-0_14)",
                    backgroundColor: "var(--clinova-rgba-142-168-232-0_04)",
                }}
            >
                <Typography
                    dir="ltr"
                    sx={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: { xs: "2.6rem", md: "3.2rem" },
                        color: "primary.light",
                        lineHeight: 1.2,
                        textAlign: direction === "rtl" ? "right" : "left",
                    }}
                >
                    {caseStudy.result}
                </Typography>
                <Typography sx={{ mt: 1, color: "text.secondary", fontSize: "0.8rem" }}>
                    {t(caseStudy.resultLabel)}
                </Typography>
            </Box>

            <Box
                sx={{
                    mt: 2,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                    gap: 1.5,
                }}
            >
                {caseStudy.stats.map((stat) => (
                    <Box
                        key={stat.label}
                        sx={{
                            p: 2,
                            textAlign: "center",
                            borderRadius: 2,
                            border: "1px solid var(--clinova-rgba-142-168-232-0_1)",
                        }}
                    >
                        <Typography
                            dir="ltr"
                            sx={{
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontSize: "1.2rem",
                                fontWeight: 600,
                                color: "text.primary",
                            }}
                        >
                            {t(stat.value)}
                        </Typography>
                        <Typography sx={{ mt: 0.7, fontSize: "0.7rem", color: "text.secondary" }}>
                            {t(stat.label)}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default CaseStudiesSection;
