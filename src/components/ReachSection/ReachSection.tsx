import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { Box, Container, Stack, Typography } from "@mui/material";

import CoverageMap, { coverageLight } from "./CoverageMap";
import { coverageLocations } from "./coverageData";

function ReachSection() {
    const { direction, t } = useSiteTranslation();

    return (
        <Box
            component="section"
            id="reach"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 10,
                    md: 14,
                    lg: 18,
                },

                background:
                    "radial-gradient(circle at 15% 50%, var(--clinova-rgba-142-168-232-0_07), transparent 35%), var(--clinova-color-0b111b)",

                direction: direction,
            }}
        >
            <Container>
                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "1.05fr 1fr",
                        },

                        alignItems: "center",

                        gap: {
                            xs: 7,
                            lg: 10,
                        },
                    }}
                >
                    {/* =====================================
                        DASHBOARD / MAP
                    ====================================== */}

                    <Box
                        sx={{
                            position: "relative",

                            order: {
                                xs: 2,
                                lg: 1,
                            },

                            width: "100%",
                            maxWidth: 600,

                            mx: {
                                xs: "auto",
                                lg: 0,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",

                                width: "100%",

                                borderRadius: 5,

                                overflow: "hidden",

                                border:
                                    "1px solid var(--clinova-rgba-142-168-232-0_18)",

                                background:
                                    "linear-gradient(145deg, var(--clinova-color-111b2a) 0%, var(--clinova-color-0d1623) 100%)",

                                boxShadow:
                                    "0 25px 80px var(--clinova-rgba-0-0-0-0_25)",
                            }}
                        >
                            {/* =================================
                                TOP BAR
                            ================================== */}

                            <Box
                                sx={{
                                    height: 34,

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",

                                    px: 2,

                                    borderBottom:
                                        "1px solid var(--clinova-rgba-142-168-232-0_1)",

                                    backgroundColor:
                                        "var(--clinova-rgba-142-168-232-0_025)",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Plus Jakarta Sans", sans-serif',

                                        fontSize: "0.48rem",

                                        letterSpacing: "0.18em",

                                        color:
                                            "var(--clinova-rgba-245-247-250-0_45)",
                                    }}
                                >
                                    {t("CLINOVA / COVERAGE")}
                        </Typography>

                                <Stack
                                    sx={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 0.7,
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
                                                "0 0 10px var(--clinova-rgba-142-168-232-0_8)",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontFamily:
                                                '"Plus Jakarta Sans", sans-serif',

                                            fontSize: "0.48rem",

                                            letterSpacing: "0.15em",

                                            color:
                                                "primary.light",
                                        }}
                                    >
                                        {t("LIVE")}
                        </Typography>
                                </Stack>
                            </Box>

                            {/* =================================
                                MAP AREA
                            ================================== */}

                            <Box
                                sx={{
                                    position: "relative",

                                    height: {
                                        xs: 320,
                                        sm: 400,
                                        md: 440,
                                    },

                                    overflow: "hidden",

                                    backgroundColor: "var(--clinova-color-0d1623)",

                                    backgroundImage: `
                                        linear-gradient(
                                            var(--clinova-rgba-142-168-232-0_045) 1px,
                                            transparent 1px
                                        ),
                                        linear-gradient(
                                            90deg,
                                            var(--clinova-rgba-142-168-232-0_045) 1px,
                                            transparent 1px
                                        )
                                    `,

                                    backgroundSize: "42px 42px",
                                }}
                            >
                                {/* Decorative grid glow */}
                                <Box
                                    sx={{
                                        position: "absolute",

                                        inset: 0,

                                        background:
                                            "radial-gradient(circle at 50% 48%, var(--clinova-rgba-142-168-232-0_12), transparent 48%)",

                                        pointerEvents: "none",
                                    }}
                                />

                                {/* Corner brackets */}

                                <Corner
                                    position={{
                                        top: 12,
                                        left: 12,
                                    }}
                                />

                                <Corner
                                    position={{
                                        top: 12,
                                        right: 12,
                                    }}
                                    rotate="90deg"
                                />

                                <Corner
                                    position={{
                                        bottom: 12,
                                        left: 12,
                                    }}
                                    rotate="-90deg"
                                />

                                <Corner
                                    position={{
                                        bottom: 12,
                                        right: 12,
                                    }}
                                    rotate="180deg"
                                />

                                {/* =================================
                                    GEOGRAPHIC COVERAGE MAP
                                ================================== */}

                                <CoverageMap />

                                {/* Map label */}
                                <Typography
                                    sx={{
                                        position: "absolute",

                                        left: 20,
                                        bottom: 18,

                                        fontFamily:
                                            '"Plus Jakarta Sans", sans-serif',

                                        fontSize: "0.48rem",

                                        letterSpacing: "0.18em",

                                        color:
                                            "var(--clinova-rgba-245-247-250-0_35)",
                                    }}
                                >
                                    {t("CLINOVA NETWORK")}
                        </Typography>
                            </Box>

                            {/* =================================
                                LOCATION FOOTER
                            ================================== */}

                            <Box
                                sx={{
                                    display: "grid",

                                    gridTemplateColumns: {
                                        xs: "1fr 1fr",
                                        sm: "repeat(3, 1fr)",
                                    },

                                    borderTop:
                                        "1px solid var(--clinova-rgba-142-168-232-0_1)",
                                }}
                            >
                                {coverageLocations.map((location, index) => (
                                    <Box
                                        key={location.code}
                                        sx={{
                                            position: "relative",

                                            px: 2,
                                            py: 1.5,

                                            minHeight: 52,

                                            borderLeft:
                                                "1px solid var(--clinova-rgba-142-168-232-0_08)",

                                            "&:nth-of-type(3n)": {
                                                borderLeft: "none",
                                            },
                                        }}
                                    >
                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent:
                                                    "space-between",
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily:
                                                        '"Plus Jakarta Sans", sans-serif',

                                                    fontSize: "0.48rem",

                                                    letterSpacing:
                                                        "0.14em",

                                                    color:
                                                        "primary.main",
                                                }}
                                            >
                                                <Box component="span" aria-hidden="true" sx={{
                                                    display: "inline-block", width: 5, height: 5,
                                                    borderRadius: "50%", backgroundColor: "primary.main",
                                                    marginInlineEnd: "6px", boxShadow: "0 0 7px var(--clinova-rgba-142-168-232-0_8)",
                                                    animation: `${coverageLight} 5s ease-in-out infinite`,
                                                    animationDelay: `${index * -0.8}s`,
                                                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                                                }} />
                                                {t(location.status)}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontFamily:
                                                        '"Plus Jakarta Sans", sans-serif',

                                                    fontSize: "0.5rem",

                                                    letterSpacing:
                                                        "0.12em",

                                                    color:
                                                        "var(--clinova-rgba-245-247-250-0_35)",
                                                }}
                                            >
                                                {location.code}
                                            </Typography>
                                        </Stack>

                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,

                                                fontFamily:
                                                    '"Plus Jakarta Sans", sans-serif',

                                                fontSize: "0.72rem",

                                                color:
                                                    "var(--clinova-rgba-245-247-250-0_75)",
                                            }}
                                        >
                                            <Box component="img" src={location.flag} alt="" aria-hidden="true" width={20} height={15} sx={{ flexShrink: 0, borderRadius: "2px", objectFit: "cover" }} />
                                            {t(location.name)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* =====================================
                        CONTENT
                    ====================================== */}

                    <Box
                        sx={{
                            order: {
                                xs: 1,
                                lg: 2,
                            },

                            textAlign: {
                                xs: "center",
                                lg: "start",
                            },

                            direction: direction,
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

                                mb: {
                                    xs: 3,
                                    md: 4,
                                },

                                borderRadius: "999px",

                                border:
                                    "1px solid var(--clinova-rgba-142-168-232-0_18)",

                                backgroundColor:
                                    "var(--clinova-rgba-142-168-232-0_04)",

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
                                        "0 0 12px var(--clinova-rgba-142-168-232-0_7)",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontFamily:
                                        "var(--clinova-font-family)",

                                    fontSize: "0.75rem",

                                    fontWeight: 500,

                                    color: "text.secondary",
                                }}
                            >
                                {t("لماذا نحن مختلفون؟")}
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
                                    sm: "3.3rem",
                                    md: "4.2rem",
                                    lg: "4.8rem",
                                },

                                fontWeight: 600,

                                lineHeight: {
                                    xs: 1.3,
                                    md: 1.2,
                                },

                                letterSpacing: 0,

                                color: "var(--clinova-color-f5f7fa)",
                            }}
                        >
                            {t("نعرف كيف نصل إلى")}<Box
                                component="span"
                                sx={{
                                    display: "block",

                                    fontFamily:
                                        "var(--clinova-font-family)",

                                    color: "primary.main",
                                }}
                            >
                                {t("المريض المناسب لعيادتك")}
                        </Box>
                        </Typography>

                        {/* Description */}
                        <Typography
                            sx={{
                                mt: 4,

                                maxWidth: 620,

                                ml: {
                                    lg: "auto",
                                },

                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize: {
                                    xs: "0.9rem",
                                    md: "1rem",
                                },

                                lineHeight: 2,

                                color: "text.secondary",
                            }}
                        >
                            {t("من أول إعلان أو استفسار، وحتى حجز الموعد والمتابعة بعده، نبني تجربة متكاملة حول المريض. نستخدم التسويق والتقنية والذكاء الاصطناعي، إلى جانب فريقنا البشري، لضمان وصول الاستفسارات إلى الطريق الصحيح وتحويل الفرص إلى مرضى فعليين.")}
                        </Typography>

                        {/* Small stats */}
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

                                mt: 5,
                            }}
                        >
                            <ReachStat
                                value="24/7"
                                label="استجابة ومتابعة رقمية"
                            />

                            <Box
                                sx={{
                                    width: "1px",
                                    height: 38,
                                    flexShrink: 0,

                                    backgroundColor:
                                        "var(--clinova-rgba-142-168-232-0_15)",
                                }}
                            />

                            <ReachStat
                                value="AI + Human"
                                label="ذكاء اصطناعي وفريق بشري"
                            />
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

/* =========================================
   CORNER
========================================= */

function Corner({
    position,
    rotate,
}: {
    position: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    rotate?: string;
}) {
    return (
        <Box
            sx={{
                position: "absolute",

                ...position,

                width: 18,
                height: 18,

                borderTop:
                    "1px solid var(--clinova-rgba-142-168-232-0_35)",

                borderLeft:
                    "1px solid var(--clinova-rgba-142-168-232-0_35)",

                transform: `rotate(${rotate ?? "0deg"})`,

                pointerEvents: "none",
            }}
        />
    );
}

/* =========================================
   STAT
========================================= */

function ReachStat({
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
                dir="ltr"
                sx={{
                    fontFamily:
                        '"Plus Jakarta Sans", sans-serif',

                    fontSize: {
                        xs: "1.2rem",
                        md: "1.4rem",
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

                    fontSize: "0.72rem",

                    color: "text.secondary",
                }}
            >
                {t(label)}
            </Typography>
        </Box>
    );
}

export default ReachSection;