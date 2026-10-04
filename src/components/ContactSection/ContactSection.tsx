import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { Box, Container, Stack, Typography } from "@mui/material";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import PatientJourneyVisual from "./PatientJourneyVisual";

const conversations = [
    {
        name: "محمد S",
        location: "Riyadh · dental",
        status: "BOOKED",
        time: "3:42",
    },
    {
        name: "Layla M",
        location: "Dubai · derm",
        status: "QUALIFIED",
        time: "1:28",
    },
    {
        name: "Omar K",
        location: "Jeddah · hair",
        status: "BOOKED",
        time: "2:33",
    },
    {
        name: "Fatima A",
        location: "Doha · cosmetic",
        status: "REFERRED",
        time: "0:47",
    },
    {
        name: "Yousef H",
        location: "Manama · dental",
        status: "QUALIFIED",
        time: "2:12",
    },
];

function ContactSection() {
    const { direction, t } = useSiteTranslation();

    return (
        <Box
            component="section"
            id="contact-system"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 10,
                    md: 14,
                    lg: 18,
                },

                background:
                    "radial-gradient(circle at 80% 60%, rgba(142,168,232,0.08), transparent 35%), #0B111B",

                direction: direction,
            }}
        >
            <Container>
                {/* =====================================
                    TOP CONTENT
                ====================================== */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", lg: "1.15fr 1fr" },
                        alignItems: "center",
                        gap: { xs: 3, lg: 8 },
                        mb: { xs: 7, md: 9 },
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 620,

                            mx: "auto",
                            width: "100%",

                            textAlign: {
                                xs: "center",
                                lg: "start",
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
                                {t("التواصل المتكامل")}
                            </Typography>
                        </Box>

                        {/* Heading */}
                        <Typography
                            component="h2"
                            sx={{
                                m: 0,

                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize: {
                                    xs: "2.5rem",
                                    sm: "3.2rem",
                                    md: "4.1rem",
                                    lg: "4.7rem",
                                },

                                fontWeight: 600,

                                lineHeight: {
                                    xs: 1.35,
                                    md: 1.25,
                                },

                                letterSpacing: 0,

                                color: "#F5F7FA",
                            }}
                        >
                            {t("لا ندير الإعلانات فقط،")}<Box
                                component="span"
                                sx={{
                                    display: "block",

                                    fontFamily:
                                        "var(--clinova-font-family)",

                                    color: "primary.main",
                                }}
                            >
                                {t("نبني رحلة المريض")}
                            </Box>
                            <Box
                                component="span"
                                sx={{
                                    display: "block",

                                    fontFamily:
                                        "var(--clinova-font-family)",

                                    color: "#F5F7FA",
                                }}
                            >
                                {t("من أول تواصل إلى الحجز.")}
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
                                    md: "0.95rem",
                                },

                                lineHeight: 2,

                                color: "text.secondary",
                            }}
                        >
                            {t("في Clinova لا نقيس النجاح بعدد الاستفسارات أو المشاهدات، بل بقدرتنا على تحويل الاهتمام إلى مرضى فعليين. لذلك نبني نظامًا متكاملًا يشمل جذب المرضى المحتملين وإدارة التواصل معهم وتحسين تجربتهم حتى لحظة الحجز.")}
                            </Typography>
                    </Box>

                    <PatientJourneyVisual />
                </Box>

                {/* =====================================
                    MAIN SYSTEM
                ====================================== */}

                <Box
                    sx={{
                        position: "relative",

                        minHeight: {
                            xs: "auto",
                            lg: 370,
                        },

                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "0.9fr 1.1fr",
                        },

                        alignItems: "center",

                        gap: {
                            xs: 5,
                            lg: 8,
                        },

                        px: {
                            xs: 2,
                            sm: 4,
                            md: 6,
                            lg: 8,
                        },

                        py: {
                            xs: 4,
                            md: 5,
                        },

                        borderRadius: 5,

                        border:
                            "1px solid rgba(142,168,232,0.20)",

                        background:
                            "linear-gradient(135deg, rgba(142,168,232,0.12) 0%, rgba(95,120,181,0.07) 45%, rgba(142,168,232,0.04) 100%)",

                        boxShadow:
                            "0 30px 90px rgba(0,0,0,0.20)",

                        overflow: "hidden",

                        "&::before": {
                            content: '""',

                            position: "absolute",

                            width: 500,
                            height: 500,

                            left: "35%",
                            bottom: -400,

                            borderRadius: "50%",

                            background:
                                "radial-gradient(circle, rgba(142,168,232,0.13), transparent 68%)",

                            filter: "blur(20px)",

                            pointerEvents: "none",
                        },
                    }}
                >
                    {/* =================================
                        LIVE QUEUE
                    ================================== */}

                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,

                            width: "100%",
                            maxWidth: 430,

                            mx: {
                                xs: "auto",
                                lg: 0,
                            },

                            borderRadius: 3,

                            border:
                                "1px solid rgba(142,168,232,0.16)",

                            backgroundColor:
                                "rgba(11,17,27,0.72)",

                            backdropFilter: "blur(14px)",

                            overflow: "hidden",
                        }}
                    >
                        {/* Queue header */}
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",

                                px: 2,

                                height: 38,

                                borderBottom:
                                    "1px solid rgba(142,168,232,0.10)",

                                direction: "ltr",
                            }}
                        >
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

                                        letterSpacing: "0.15em",

                                        color:
                                            "rgba(245,247,250,0.4)",
                                    }}
                                >
                                    {t("ACTIVE")}
                        </Typography>

                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Plus Jakarta Sans", sans-serif',

                                        fontSize: "0.48rem",

                                        color: "primary.main",
                                    }}
                                >
                                    5
                                </Typography>
                            </Stack>

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

                                        letterSpacing: "0.15em",

                                        color:
                                            "rgba(245,247,250,0.4)",
                                    }}
                                >
                                    {t("LIVE QUEUE")}
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

                                        animation:
                                            "clinovaPulse 1.5s ease-in-out infinite",

                                        "@keyframes clinovaPulse": {
                                            "0%, 100%": {
                                                opacity: 0.4,
                                            },

                                            "50%": {
                                                opacity: 1,
                                            },
                                        },
                                    }}
                                />
                            </Stack>
                        </Stack>

                        {/* Conversations */}
                        <Box
                            sx={{
                                px: 1.2,
                                py: 1,
                            }}
                        >
                            {conversations.map(
                                (conversation, index) => (
                                    <Conversation
                                        key={conversation.name}
                                        {...conversation}
                                        active={index === 1}
                                    />
                                ),
                            )}
                        </Box>

                        {/* Queue footer */}
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",

                                px: 2,

                                height: 34,

                                borderTop:
                                    "1px solid rgba(142,168,232,0.08)",

                                direction: "ltr",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Plus Jakarta Sans", sans-serif',

                                    fontSize: "0.45rem",

                                    letterSpacing: "0.08em",

                                    color:
                                        "rgba(245,247,250,0.3)",
                                }}
                            >
                                {t("COVERAGE")}
                        </Typography>

                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Plus Jakarta Sans", sans-serif',

                                    fontSize: "0.48rem",

                                    color: "primary.main",
                                }}
                            >
                                24/7
                            </Typography>
                        </Stack>
                    </Box>

                    {/* =================================
                        RIGHT CONTENT
                    ================================== */}

                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,

                            textAlign: {
                                xs: "center",
                                lg: "start",
                            },

                            direction: direction,
                        }}
                    >
                        {/* Small label */}
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
                            <PhoneRoundedIcon
                                sx={{
                                    fontSize: 13,
                                    color: "primary.main",
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
                                {t("التواصل مع المرضى")}
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
                                    md: "2.7rem",
                                    lg: "3.1rem",
                                },

                                fontWeight: 600,

                                lineHeight: 1.3,

                                letterSpacing: 0,

                                color: "#F5F7FA",
                            }}
                        >
                            {t("مركز اتصال داخلي")}
                        </Typography>

                        {/* Description */}
                        <Typography
                            sx={{
                                mt: 2,

                                maxWidth: 520,

                                ml: {
                                    lg: "auto",
                                },

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
                            {t("موظفونا الناطقون بالعربية والإنجليزية والتركية يتحدثون مع كل عميل خلال دقائق، بلهجته وبفهم مباشر لاحتياجه. نتابع الاستفسار ونساعد المريض على الوصول إلى الخدمة المناسبة حتى إتمام الحجز والمتابعة بعد الإجراء العلاجي.")}
                        </Typography>

                        {/* Stats */}
                        <Stack
                            sx={{
                                flexDirection: "row",

                                alignItems: "center",

                                justifyContent: {
                                    xs: "center",
                                    lg: "flex-start",
                                },

                                gap: {
                                    xs: 3,
                                    md: 5,
                                },

                                mt: 4,

                                pt: 3,

                                borderTop:
                                    "1px solid rgba(142,168,232,0.12)",
                            }}
                        >
                            <Stat
                                value="82%"
                                label="نسبة الحجز"
                            />

                            <Stat
                                value="71%"
                                label="تحويل الاستفسارات"
                            />

                            <Stat
                                value="< 5"
                                label="متوسط الرد"
                            />

                            <ArrowOutwardRoundedIcon
                                sx={{
                                    ml: "auto",

                                    display: {
                                        xs: "none",
                                        md: "block",
                                    },

                                    color:
                                        "primary.main",

                                    fontSize: 22,
                                }}
                            />
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

/* =========================================
   CONVERSATION
========================================= */

function Conversation({
    name,
    location,
    status,
    time,
    active,
}: {
    name: string;
    location: string;
    status: string;
    time: string;
    active: boolean;
}) {
    const { t } = useSiteTranslation();

    return (
        <Box
            sx={{
                display: "grid",

                gridTemplateColumns: "72px 1fr 70px",

                alignItems: "center",

                gap: 1,

                minHeight: 47,

                px: 1,

                mb: 0.7,

                borderRadius: 1.5,

                border: active
                    ? "1px solid rgba(142,168,232,0.32)"
                    : "1px solid rgba(142,168,232,0.07)",

                backgroundColor: active
                    ? "rgba(142,168,232,0.07)"
                    : "rgba(255,255,255,0.015)",

                transition:
                    "border-color 0.25s ease, background-color 0.25s ease",

                "&:hover": {
                    borderColor:
                        "rgba(142,168,232,0.24)",

                    backgroundColor:
                        "rgba(142,168,232,0.04)",
                },
            }}
        >
            {/* Status */}
            <Box
                sx={{
                    direction: "ltr",
                }}
            >
                <Typography
                    sx={{
                        display: "inline-block",

                        px: 0.8,
                        py: 0.25,

                        borderRadius: "4px",

                        fontFamily:
                            '"Plus Jakarta Sans", sans-serif',

                        fontSize: "0.43rem",

                        letterSpacing: "0.05em",

                        color:
                            status === "REFERRED"
                                ? "#8EA8E8"
                                : "#8EA8E8",

                        border:
                            "1px solid rgba(142,168,232,0.25)",
                    }}
                >
                    {t(status)}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.3,

                        fontFamily:
                            '"Plus Jakarta Sans", sans-serif',

                        fontSize: "0.42rem",

                        color:
                            "rgba(245,247,250,0.3)",
                    }}
                >
                    {time}
                </Typography>
            </Box>

            {/* Patient */}
            <Box
                sx={{
                    minWidth: 0,

                    textAlign: "start",
                }}
            >
                <Typography
                    sx={{
                        fontFamily:
                            '"Plus Jakarta Sans", sans-serif',

                        fontSize: "0.65rem",

                        fontWeight: 600,

                        color:
                            "rgba(245,247,250,0.82)",

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",
                    }}
                >
                    {t(name)}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.2,

                        fontFamily:
                            '"Plus Jakarta Sans", sans-serif',

                        fontSize: "0.48rem",

                        color:
                            "rgba(245,247,250,0.35)",

                        whiteSpace: "nowrap",
                    }}
                >
                    {t(location)}
                </Typography>
            </Box>

            {/* Wave */}
            <VoiceWave active={active} />
        </Box>
    );
}

/* =========================================
   VOICE WAVE
========================================= */

function VoiceWave({ active }: { active: boolean }) {
    const bars = [
        7, 14, 10, 20, 12, 25, 9, 17, 11, 22, 8, 15,
    ];

    return (
        <Box
            sx={{
                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                gap: "2px",

                height: 28,

                opacity: active ? 1 : 0.35,
            }}
        >
            {bars.map((height, index) => (
                <Box
                    key={index}
                    sx={{
                        width: 2,

                        height,

                        borderRadius: "999px",

                        backgroundColor:
                            "primary.main",

                        transformOrigin: "center",

                        animation: active
                            ? `clinovaWave ${0.55 + (index % 4) * 0.12
                            }s ease-in-out infinite alternate`
                            : "none",

                        animationDelay: `${index * 0.055
                            }s`,

                        "@keyframes clinovaWave": {
                            "0%": {
                                transform: "scaleY(0.35)",
                                opacity: 0.45,
                            },

                            "50%": {
                                transform: "scaleY(1)",
                                opacity: 1,
                            },

                            "100%": {
                                transform: "scaleY(0.5)",
                                opacity: 0.65,
                            },
                        },
                    }}
                />
            ))}
        </Box>
    );
}

/* =========================================
   STAT
========================================= */

function Stat({
    value,
    label,
}: {
    value: string;
    label: string;
}) {
    const { t } = useSiteTranslation();

    return (
        <Box>
            <Typography
                sx={{
                    fontFamily:
                        '"Plus Jakarta Sans", sans-serif',

                    fontSize: {
                        xs: "1.25rem",
                        md: "1.45rem",
                    },

                    fontWeight: 600,

                    color: "primary.main",
                }}
            >
                {value}
            </Typography>

            <Typography
                sx={{
                    mt: 0.3,

                    fontFamily:
                        "var(--clinova-font-family)",

                    fontSize: "0.65rem",

                    color: "text.secondary",

                    whiteSpace: "nowrap",
                }}
            >
                {t(label)}
            </Typography>
        </Box>
    );
}

export default ContactSection;