import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { useState } from "react";
import {
    Box,
    Container,
    Typography,
} from "@mui/material";

import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import FaceRetouchingNaturalOutlinedIcon from "@mui/icons-material/FaceRetouchingNaturalOutlined";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";

const specialties = [
    {
        id: "dental",
        number: "01",
        title: "طب الأسنان",
        description:
            "نركز على خدمات الأسنان والابتسامة، من زراعة الأسنان والتقويم إلى التجميل والعلاجات المتقدمة، مع فهم واضح لرحلة المريض.",
        tags: [
            "زراعة الأسنان",
            "ابتسامة هوليوود",
            "التقويم",
        ],
        icon: MedicalServicesOutlinedIcon,
    },

    {
        id: "dermatology",
        number: "02",
        title: "الجلدية",
        description:
            "نبني استراتيجيات تسويقية للعيادات الجلدية والتجميلية تساعد على تقديم الخدمات بطريقة واضحة وجذب المرضى المناسبين.",
        tags: [
            "علاجات البشرة",
            "البوتوكس والفيلر",
            "تجديد البشرة",
            "العناية بالبشرة",
        ],
        icon: FaceRetouchingNaturalOutlinedIcon,
    },

    {
        id: "cosmetic",
        number: "03",
        title: "الجراحة التجميلية",
        description:
            "نفهم طبيعة القرار في الجراحات التجميلية ونبني حضورًا رقميًا يركز على الثقة، المحتوى المناسب، وتجربة المريض.",
        tags: [
            "تجميل الأنف",
            "شد الجسم",
            "زراعة الشعر",
            "نحت الجسم",
        ],
        icon: HealingOutlinedIcon,
    },
];

function SpecialtiesSection() {
    const { direction, t } = useSiteTranslation();

    const [activeId, setActiveId] = useState("dental");

    return (
        <Box
            component="section"
            id="specialties"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 10,
                    md: 14,
                    lg: 18,
                },

                background:
                    "radial-gradient(circle at 80% 20%, rgba(142,168,232,0.08), transparent 32%), #0B111B",

                direction: direction,
            }}
        >
            <Container>
                {/* =====================================
                    HEADER
                ====================================== */}

                <Box
                    sx={{
                        maxWidth: 720,

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
                                    "var(--clinova-font-family)",

                                fontSize: "0.72rem",

                                fontWeight: 500,

                                color: "text.secondary",
                            }}
                        >
                            {t("تخصصاتنا")}
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
                        {t("تخصصات نعرفها بعمق.")}
                        </Typography>

                    {/* Description */}
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
                        {t("نحن لا نعمل مع كل التخصصات الطبية، نركز على التخصصات التي تتطلب بناء ثقة عالية ورحلة قرار أطول لدى المريض، ما يمنحنا فهمًا أعمق لسلوك المرضى والتحديات التسويقية الخاصة بكل مجال.")}
                        </Typography>
                </Box>

                {/* =====================================
                    SPECIALTY CARDS
                ====================================== */}

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(3, 1fr)",
                        },

                        border:
                            "1px solid rgba(142,168,232,0.12)",

                        borderRadius: 5,

                        overflow: "hidden",
                    }}
                >
                    {specialties.map((specialty, index) => {
                        const active =
                            activeId === specialty.id;

                        return (
                            <SpecialtyCard
                                key={specialty.id}
                                specialty={specialty}
                                active={active}
                                first={index === 0}
                                onClick={() =>
                                    setActiveId(
                                        specialty.id,
                                    )
                                }
                            />
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
}

function SpecialtyCard({
    specialty,
    active,
    first,
    onClick,
}: {
    specialty: (typeof specialties)[number];
    active: boolean;
    first: boolean;
    onClick: () => void;
}) {
    const { t } = useSiteTranslation();

    const Icon = specialty.icon;

    return (
        <Box
            component="button"
            onClick={onClick}
            sx={{
                position: "relative",

                minHeight: {
                    xs: 380,
                    sm: 360,
                    md: 365,
                },

                display: "flex",
                flexDirection: "column",

                alignItems: "flex-end",

                justifyContent: "flex-start",

                p: {
                    xs: 3,
                    md: 4,
                    lg: 5,
                },

                textAlign: "start",

                border: 0,

                borderLeft: {
                    xs: "none",
                    md: first
                        ? "none"
                        : "1px solid rgba(142,168,232,0.10)",
                },

                borderBottom: {
                    xs: "1px solid rgba(142,168,232,0.10)",
                    md: "none",
                },

                cursor: "pointer",

                background: active
                    ? "linear-gradient(145deg, rgba(142,168,232,0.16), rgba(95,120,181,0.07))"
                    : "rgba(11,17,27,0.35)",

                color: "inherit",

                transition:
                    "background 0.35s ease, transform 0.35s ease",

                "&:last-child": {
                    borderBottom: "none",
                },

                "&:hover": {
                    background: active
                        ? "linear-gradient(145deg, rgba(142,168,232,0.18), rgba(95,120,181,0.08))"
                        : "rgba(142,168,232,0.045)",
                },

                "&::before": {
                    content: '""',

                    position: "absolute",

                    top: 0,
                    right: 0,

                    width: "100%",
                    height: 2,

                    background: active
                        ? "linear-gradient(90deg, transparent, #8EA8E8)"
                        : "transparent",

                    boxShadow: active
                        ? "0 0 20px rgba(142,168,232,0.35)"
                        : "none",
                },
            }}
        >
            {/* =================================
                ICON + NUMBER
            ================================== */}

            <Box
                sx={{
                    width: "100%",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "space-between",

                    mb: {
                        xs: 5,
                        md: 7,
                    },

                    direction: "ltr",
                }}
            >
                {/* Number */}
                <Box
                    sx={{
                        width: 34,
                        height: 34,

                        display: "flex",

                        alignItems: "center",
                        justifyContent: "center",

                        borderRadius: "50%",

                        border:
                            "1px solid rgba(142,168,232,0.15)",

                        backgroundColor:
                            "rgba(142,168,232,0.03)",
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily:
                                '"Plus Jakarta Sans", sans-serif',

                            fontSize: "0.55rem",

                            color:
                                "rgba(245,247,250,0.35)",
                        }}
                    >
                        {specialty.number}
                    </Typography>
                </Box>

                {/* Icon */}
                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",
                        justifyContent: "center",

                        color: active
                            ? "primary.main"
                            : "primary.light",

                        transition:
                            "color 0.3s ease",

                        "& svg": {
                            fontSize: {
                                xs: 38,
                                md: 42,
                            },

                            strokeWidth: 1,
                        },
                    }}
                >
                    <Icon />
                </Box>
            </Box>

            {/* =================================
                TITLE
            ================================== */}

            <Typography
                component="h3"
                sx={{
                    fontFamily:
                        "var(--clinova-font-family)",

                    fontSize: {
                        xs: "1.65rem",
                        md: "1.85rem",
                    },

                    fontWeight: 600,

                    lineHeight: 1.4,

                    color: active
                        ? "#F5F7FA"
                        : "rgba(245,247,250,0.82)",

                    transition:
                        "color 0.3s ease",
                }}
            >
                {t(specialty.title)}
            </Typography>

            {/* =================================
                DESCRIPTION
            ================================== */}

            <Typography
                sx={{
                    mt: 2.5,

                    fontFamily:
                        "var(--clinova-font-family)",

                    fontSize: {
                        xs: "0.82rem",
                        md: "0.86rem",
                    },

                    lineHeight: 2,

                    color: "text.secondary",
                }}
            >
                {t(specialty.description)}
            </Typography>

            {/* =================================
                TAGS
            ================================== */}

            <Box
                sx={{
                    width: "100%",

                    mt: "auto",
                    pt: 3,

                    display: "flex",

                    flexWrap: "wrap",

                    justifyContent: "flex-start",

                    gap: 0.8,

                    borderTop:
                        "1px solid rgba(142,168,232,0.10)",
                }}
            >
                {specialty.tags.map((tag) => (
                    <Box
                        key={tag}
                        sx={{
                            px: 1.2,
                            py: 0.55,

                            borderRadius: "999px",

                            border: active
                                ? "1px solid rgba(142,168,232,0.28)"
                                : "1px solid rgba(142,168,232,0.10)",

                            backgroundColor:
                                active
                                    ? "rgba(142,168,232,0.06)"
                                    : "rgba(255,255,255,0.015)",

                            transition:
                                "all 0.3s ease",
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize: "0.65rem",

                                whiteSpace:
                                    "nowrap",

                                color:
                                    active
                                        ? "primary.light"
                                        : "text.secondary",
                            }}
                        >
                            {t(tag)}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default SpecialtiesSection;