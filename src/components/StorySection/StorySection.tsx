import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { Box, Container, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

function StorySection() {
    const { direction, t, isRtl } = useSiteTranslation();

    return (
        <Box
            component="section"
            id="story"
            sx={{
                position: "relative",
                overflow: "hidden",

                pb: {
                    xs: 10,
                    md: 14,
                    lg: 18,
                },

                pt: { xs: 4, md: 6 },

                background:
                    "radial-gradient(circle at 50% 45%, rgba(95,120,181,0.08), transparent 38%), #0B111B",

                direction: direction,
            }}
        >
            <Container>
                {/* Header */}
                <Box
                    sx={{
                        maxWidth: 850,
                        mx: "auto",

                        textAlign: "center",

                        mb: {
                            xs: 7,
                            md: 9,
                        },
                    }}
                >
                    {/* Label */}
                    <Typography
                        sx={{
                            mb: 2,

                            fontFamily:
                                "var(--clinova-font-family)",

                            fontSize: {
                                xs: "1.4rem",
                                md: "1.7rem",
                            },

                            fontWeight: 600,

                            color: "primary.main",
                        }}
                    >
                        {t("قصتنا")}
                        </Typography>

                    {/* Subtitle */}
                    <Typography
                        sx={{
                            fontFamily:
                                "var(--clinova-font-family)",

                            fontSize: {
                                xs: "1rem",
                                md: "1.15rem",
                            },

                            fontWeight: 500,

                            color: "primary.light",

                            lineHeight: 1.8,
                        }}
                    >
                        {t("بدأنا من تخصص واحد، وتوسعنا مع نجاح عملائنا.")}
                        </Typography>

                    {/* Description */}
                    <Typography
                        sx={{
                            mt: 3,

                            fontFamily:
                                "var(--clinova-font-family)",

                            fontSize: {
                                xs: "0.9rem",
                                md: "0.98rem",
                            },

                            fontWeight: 400,

                            lineHeight: 2.1,

                            color: "text.secondary",
                        }}
                    >
                        {t("بدأت رحلتنا من فهم عميق للتحديات التي تواجه العيادات الطبية، وكيف يمكن للتجربة الرقمية أن تكون جزءًا أساسيًا من نجاحها. في Clinova نعمل على تطوير حلول رقمية تساعد العيادات والأطباء على بناء حضور احترافي، وتحسين تجربة المريض، وتحويل النمو الرقمي إلى نتائج واضحة وقابلة للقياس.")}
                        </Typography>
                </Box>

                {/* Timeline / Story */}
                <Box
                    sx={{
                        position: "relative",

                        maxWidth: 950,

                        mx: "auto",
                    }}
                >
                    <Stack
                        sx={{
                            flexDirection: {
                                xs: "column",
                                md: "row",
                            },

                            alignItems: "center",

                            justifyContent: "center",

                            gap: {
                                xs: 5,
                                md: 10,
                            },
                        }}
                    >
                        {/* First Card */}
                        <StoryCard
                            eyebrow="المرحلة الأولى"
                            title="حلول رقمية"
                            description="بدأت Clinova مع نظام CRM لمتابعة مرضى عيادات الأسنان."
                            number="01"
                            year="البداية"
                        />

                        {/* Arrow */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                width: 58,
                                height: 58,

                                flexShrink: 0,

                                borderRadius: "50%",

                                background:
                                    "linear-gradient(135deg, #8EA8E8, #5F78B5)",

                                color: "#0B111B",

                                boxShadow:
                                    "0 0 35px rgba(142,168,232,0.18)",

                                transform: {
                                    xs: "rotate(-90deg)",
                                    md: isRtl ? "none" : "rotate(180deg)",
                                },
                            }}
                        >
                            <ArrowBackRoundedIcon />
                        </Box>

                        {/* Second Card */}
                        <StoryCard
                            eyebrow="اليوم"
                            title="منظومة متكاملة"
                            description="اليوم نقدم منظومة نمو متكاملة تساعد العيادات على بناء حضور قوي، وجلب مرضى جدد، وتقديم تجربة أفضل للمريض."
                            number="02"
                            year="Clinova"
                        />
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

function StoryCard({
    eyebrow,
    title,
    description,
    number,
    year,
}: {
    eyebrow: string;
    title: string;
    description: string;
    number: string;
    year: string;
}) {
    const { t } = useSiteTranslation();

    return (
        <Box
            sx={{
                position: "relative",

                width: "100%",
                maxWidth: 380,

                minHeight: 250,

                display: "flex",
                flexDirection: "column",
                justifyContent: "center",

                px: {
                    xs: 3,
                    md: 4,
                },

                py: 4,

                borderRadius: 4,

                border:
                    "1px solid rgba(142,168,232,0.16)",

                background:
                    "linear-gradient(145deg, rgba(21,31,45,0.75), rgba(16,25,37,0.45))",

                backdropFilter: "blur(14px)",

                overflow: "hidden",

                "&::before": {
                    content: '""',

                    position: "absolute",

                    width: 180,
                    height: 180,

                    top: -100,
                    right: -80,

                    borderRadius: "50%",

                    background:
                        "radial-gradient(circle, rgba(142,168,232,0.12), transparent 70%)",

                    pointerEvents: "none",
                },

                transition:
                    "transform 0.3s ease, border-color 0.3s ease",

                "&:hover": {
                    transform: "translateY(-6px)",

                    borderColor:
                        "rgba(142,168,232,0.30)",
                },
            }}
        >
            {/* Number */}
            <Typography
                sx={{
                    position: "absolute",

                    top: 22,
                    left: 24,

                    fontFamily:
                        '"Plus Jakarta Sans", sans-serif',

                    fontSize: "0.75rem",

                    fontWeight: 600,

                    color: "rgba(142,168,232,0.55)",
                }}
            >
                {number}
            </Typography>

            {/* Eyebrow */}
            <Typography
                sx={{
                    mb: 1.5,

                    fontFamily:
                        "var(--clinova-font-family)",

                    fontSize: "0.8rem",

                    fontWeight: 500,

                    color: "primary.main",
                }}
            >
                {t(eyebrow)}
            </Typography>

            {/* Title */}
            <Typography
                component="h3"
                sx={{
                    fontFamily:
                        "var(--clinova-font-family)",

                    fontSize: {
                        xs: "1.7rem",
                        md: "2rem",
                    },

                    fontWeight: 600,

                    lineHeight: 1.4,

                    color: "text.primary",
                }}
            >
                {t(title)}
            </Typography>

            {/* Description */}
            <Typography
                sx={{
                    mt: 2,

                    fontFamily:
                        "var(--clinova-font-family)",

                    fontSize: "0.88rem",

                    lineHeight: 1.9,

                    color: "text.secondary",
                }}
            >
                {t(description)}
            </Typography>

            {/* Year */}
            <Typography
                sx={{
                    mt: "auto",
                    pt: 3,

                    fontFamily:
                        "var(--clinova-font-family)",

                    fontSize: "0.75rem",

                    color: "text.secondary",
                }}
            >
                {t(year)}
            </Typography>
        </Box>
    );
}

export default StorySection;