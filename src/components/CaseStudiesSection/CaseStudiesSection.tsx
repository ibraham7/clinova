import { useState } from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

type CaseStudy = {
    id: string;
    number: string;
    name: string;
    location: string;
    specialty: string;
    result: string;
    resultLabel: string;
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
                    "radial-gradient(circle at 70% 50%, rgba(142,168,232,0.07), transparent 35%), #0B111B",

                direction: "rtl",
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
                            lg: "right",
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

                                color: "text.secondary",
                            }}
                        >
                            أعمال مختارة
                        </Typography>
                    </Box>

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
                                lg: "4.8rem",
                            },

                            fontWeight: 600,

                            lineHeight: 1.25,

                            letterSpacing: 0,

                            color: "#F5F7FA",
                        }}
                    >
                        نجاحات حقيقية.
                        <Box
                            component="span"
                            sx={{
                                display: "block",

                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                color: "primary.main",
                            }}
                        >
                            أرقام حقيقية.
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            mt: 3,

                            fontFamily:
                                '"IBM Plex Sans Arabic", sans-serif',

                            fontSize: {
                                xs: "0.88rem",
                                md: "0.98rem",
                            },

                            lineHeight: 2,

                            color: "text.secondary",
                        }}
                    >
                        بعض المشاريع الأخيرة. دراسات الحالة الكاملة
                        متوفرة عند الطلب.
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

                            direction: "rtl",

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
                    ? "1px solid rgba(142,168,232,0.45)"
                    : "1px solid rgba(142,168,232,0.09)",

                backgroundColor: active
                    ? "rgba(142,168,232,0.07)"
                    : "rgba(11,17,27,0.35)",

                cursor: "pointer",

                textAlign: "right",

                direction: "ltr",

                color: "inherit",

                transition:
                    "all 0.3s ease",

                "&:hover": {
                    borderColor:
                        "rgba(142,168,232,0.28)",

                    backgroundColor:
                        "rgba(142,168,232,0.045)",
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
                        : "rgba(245,247,250,0.38)",
                }}
            >
                {caseStudy.number}
            </Typography>

            {/* Content */}
            <Box
                sx={{
                    direction: "rtl",

                    minWidth: 0,
                }}
            >
                <Typography
                    sx={{
                        fontFamily:
                            '"IBM Plex Sans Arabic", sans-serif',

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
                    {caseStudy.name}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.3,

                        fontFamily:
                            '"IBM Plex Sans Arabic", sans-serif',

                        fontSize: "0.58rem",

                        color:
                            "rgba(245,247,250,0.35)",

                        whiteSpace:
                            "nowrap",

                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",
                    }}
                >
                    {caseStudy.location}
                    {" · "}
                    {caseStudy.specialty}
                </Typography>
            </Box>

            {/* Arrow */}
            <ArrowBackRoundedIcon
                sx={{
                    fontSize: 15,

                    color: active
                        ? "primary.main"
                        : "rgba(245,247,250,0.18)",

                    transform: "rotate(180deg)",
                }}
            />
        </Box>
    );
}

/* =========================================
   RESULT CARD
========================================= */

function ResultCard({
    caseStudy,
}: {
    caseStudy: CaseStudy;
}) {
    return (
        <Box
            sx={{
                position: "relative",

                minHeight: {
                    xs: 420,
                    md: 450,
                },

                p: {
                    xs: 3,
                    sm: 4,
                    md: 5,
                },

                borderRadius: 4,

                border:
                    "1px solid rgba(142,168,232,0.18)",

                background:
                    "linear-gradient(145deg, rgba(142,168,232,0.08), rgba(21,31,45,0.65))",

                overflow: "hidden",

                direction: "rtl",

                transition:
                    "border-color 0.3s ease",

                "&::before": {
                    content: '""',

                    position: "absolute",

                    width: 420,
                    height: 420,

                    right: -150,
                    top: -230,

                    borderRadius: "50%",

                    background:
                        "radial-gradient(circle, rgba(142,168,232,0.12), transparent 68%)",

                    pointerEvents: "none",
                },
            }}
        >
            {/* =================================
                HEADER
            ================================== */}

            <Stack
                sx={{
                    flexDirection: "row",

                    alignItems: "center",

                    justifyContent:
                        "space-between",

                    direction: "rtl",
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontFamily:
                                '"IBM Plex Sans Arabic", sans-serif',

                            fontSize: "1rem",

                            fontWeight: 600,

                            color: "text.primary",
                        }}
                    >
                        {caseStudy.name}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.4,

                            fontFamily:
                                '"IBM Plex Sans Arabic", sans-serif',

                            fontSize: "0.65rem",

                            color: "text.secondary",
                        }}
                    >
                        {caseStudy.location} ·{" "}
                        {caseStudy.specialty}
                    </Typography>
                </Box>

                {/* Mini logo */}
                <Box
                    sx={{
                        width: 76,
                        height: 48,

                        display: "flex",

                        alignItems: "center",
                        justifyContent: "center",

                        borderRadius: 2,

                        border:
                            "1px solid rgba(142,168,232,0.12)",

                        backgroundColor:
                            "rgba(11,17,27,0.4)",
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily:
                                '"Plus Jakarta Sans", sans-serif',

                            fontSize: "0.5rem",

                            fontWeight: 600,

                            color:
                                "rgba(142,168,232,0.65)",

                            letterSpacing:
                                "0.06em",
                        }}
                    >
                        CLINOVA
                    </Typography>
                </Box>
            </Stack>

            {/* =================================
                SPECIALTY BADGE
            ================================== */}

            <Box
                sx={{
                    display: "inline-flex",

                    alignItems: "center",

                    mt: 3,

                    px: 1.8,
                    py: 0.7,

                    borderRadius: "999px",

                    border:
                        "1px solid rgba(142,168,232,0.18)",

                    backgroundColor:
                        "rgba(142,168,232,0.04)",
                }}
            >
                <Typography
                    sx={{
                        fontFamily:
                            '"IBM Plex Sans Arabic", sans-serif',

                        fontSize: "0.65rem",

                        color: "primary.light",
                    }}
                >
                    {caseStudy.specialty}
                </Typography>
            </Box>

            {/* =================================
                MAIN RESULT
            ================================== */}

            <Box
                sx={{
                    mt: 3,

                    textAlign: "right",
                }}
            >
                <Typography
                    sx={{
                        fontFamily:
                            '"Plus Jakarta Sans", sans-serif',

                        fontSize: {
                            xs: "4rem",
                            sm: "5rem",
                            md: "5.5rem",
                        },

                        fontWeight: 400,

                        lineHeight: 1,

                        letterSpacing:
                            "-0.045em",

                        background:
                            "linear-gradient(110deg, #5F78B5, #8EA8E8, #B8C8EF)",

                        WebkitBackgroundClip:
                            "text",

                        WebkitTextFillColor:
                            "transparent",

                        backgroundClip:
                            "text",
                    }}
                >
                    {caseStudy.result}
                </Typography>

                <Typography
                    sx={{
                        mt: 1,

                        fontFamily:
                            '"IBM Plex Sans Arabic", sans-serif',

                        fontSize: "0.75rem",

                        color: "text.secondary",
                    }}
                >
                    {caseStudy.resultLabel}
                </Typography>
            </Box>

            {/* =================================
                STATS
            ================================== */}

            <Box
                sx={{
                    position: "absolute",

                    left: {
                        xs: 20,
                        md: 32,
                    },

                    right: {
                        xs: 20,
                        md: 32,
                    },

                    bottom: {
                        xs: 20,
                        md: 32,
                    },

                    display: "grid",

                    gridTemplateColumns:
                        "repeat(3, 1fr)",

                    border:
                        "1px solid rgba(142,168,232,0.12)",

                    borderRadius: 2.5,

                    overflow: "hidden",
                }}
            >
                {caseStudy.stats.map(
                    (stat, index) => (
                        <Box
                            key={stat.label}
                            sx={{
                                py: 2,

                                px: 1.5,

                                textAlign:
                                    "center",

                                borderLeft:
                                    index !== 2
                                        ? "1px solid rgba(142,168,232,0.10)"
                                        : "none",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Plus Jakarta Sans", sans-serif',

                                    fontSize: {
                                        xs: "1.1rem",
                                        md: "1.35rem",
                                    },

                                    fontWeight: 600,

                                    color:
                                        "text.primary",
                                }}
                            >
                                {stat.value}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,

                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',

                                    fontSize:
                                        "0.6rem",

                                    color:
                                        "text.secondary",
                                }}
                            >
                                {stat.label}
                            </Typography>
                        </Box>
                    ),
                )}
            </Box>

            {/* Decorative icon */}
            <TrendingUpRoundedIcon
                sx={{
                    position: "absolute",

                    right: 32,
                    bottom: 115,

                    fontSize: 24,

                    color:
                        "rgba(142,168,232,0.18)",
                }}
            />
        </Box>
    );
}

export default CaseStudiesSection;