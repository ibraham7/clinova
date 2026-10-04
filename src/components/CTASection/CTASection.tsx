import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import {
    Box,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import ProfileDownloadButton from "../layout/ProfileDownloadButton";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { bookingLinkProps } from "../../config/contact";

function CTASection() {
    const { direction, t } = useSiteTranslation();

    return (
        <Box
            component="section"
            id="contact-cta"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 8,
                    md: 12,
                    lg: 14,
                },

                backgroundColor: "var(--clinova-color-0b111b)",

                direction: direction,
            }}
        >
            <Container>
                <Box
                    sx={{
                        position: "relative",

                        overflow: "hidden",

                        minHeight: {
                            xs: 320,
                            md: 360,
                        },

                        display: "flex",

                        alignItems: "center",
                        justifyContent: "center",

                        px: {
                            xs: 3,
                            sm: 5,
                            md: 8,
                        },

                        py: {
                            xs: 5,
                            md: 7,
                        },

                        borderRadius: 5,

                        border:
                            "1px solid var(--clinova-rgba-142-168-232-0_2)",

                        background:
                            "linear-gradient(135deg, var(--clinova-rgba-95-120-181-0_18) 0%, var(--clinova-rgba-142-168-232-0_09) 42%, var(--clinova-rgba-21-31-45-0_72) 100%)",

                        boxShadow:
                            "0 30px 80px var(--clinova-rgba-0-0-0-0_2)",

                        isolation: "isolate",

                        "&::before": {
                            content: '""',

                            position: "absolute",

                            width: 500,
                            height: 500,

                            top: -300,
                            right: -100,

                            borderRadius: "50%",

                            background:
                                "radial-gradient(circle, var(--clinova-rgba-142-168-232-0_18), transparent 68%)",

                            filter: "blur(10px)",

                            pointerEvents: "none",

                            zIndex: -1,
                        },

                        "&::after": {
                            content: '""',

                            position: "absolute",

                            width: 400,
                            height: 400,

                            bottom: -280,
                            left: -80,

                            borderRadius: "50%",

                            background:
                                "radial-gradient(circle, var(--clinova-rgba-95-120-181-0_16), transparent 68%)",

                            filter: "blur(10px)",

                            pointerEvents: "none",

                            zIndex: -1,
                        },
                    }}
                >
                    {/* =================================
                        CONTENT
                    ================================== */}

                    <Stack
                        sx={{
                            alignItems: "center",

                            justifyContent: "center",

                            gap: 2.5,

                            maxWidth: 700,

                            textAlign: "center",

                            position: "relative",

                            zIndex: 2,
                        }}
                    >
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
                                    lg: "4.7rem",
                                },

                                fontWeight: 600,

                                lineHeight: 1.25,

                                letterSpacing: 0,

                                color: "var(--clinova-color-f5f7fa)",
                            }}
                        >
                            {t("لنملأ دفتر مواعيدك.")}
                        </Typography>

                        {/* Description */}

                        <Typography
                            sx={{
                                maxWidth: 580,

                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize: {
                                    xs: "0.8rem",
                                    md: "0.9rem",
                                },

                                lineHeight: 2,

                                color:
                                    "var(--clinova-rgba-245-247-250-0_62)",
                            }}
                        >
                            {t("مكالمة استراتيجية مجانية لمدة 30 دقيقة. نراجع تسويقك الحالي، نحدد مكامن النمو، ونترك لك خطة واضحة تبدأ بها.")}
                        </Typography>

                        {/* CTA */}
                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: 1.5, alignItems: "center", justifyContent: "center", mt: 1 }}>
                        <Box
                            component="a"
                            {...bookingLinkProps}
                            sx={{
                                minHeight: 50,

                                display: "inline-flex",

                                alignItems: "center",

                                justifyContent: "center",

                                gap: 1,

                                px: 3,

                                border: 0,
                                textDecoration: "none",

                                borderRadius:
                                    "999px",

                                background:
                                    "linear-gradient(135deg, var(--clinova-color-8ea8e8) 0%, var(--clinova-color-7894d2) 100%)",

                                color:
                                    "var(--clinova-color-0b111b)",

                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize:
                                    "0.8rem",

                                fontWeight: 600,

                                cursor: "pointer",

                                boxShadow:
                                    "0 10px 35px var(--clinova-rgba-142-168-232-0_18)",

                                transition:
                                    "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",

                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg, var(--clinova-color-b8c8ef) 0%, var(--clinova-color-8ea8e8) 100%)",

                                    transform:
                                        "translateY(-2px)",

                                    boxShadow:
                                        "0 14px 40px var(--clinova-rgba-142-168-232-0_28)",
                                },

                                "&:active": {
                                    transform:
                                        "translateY(0)",
                                },
                            }}
                        >
                            {t("احجز مكالمة استراتيجية")}<PhoneRoundedIcon
                                sx={{
                                    fontSize: 15,
                                }}
                            />
                        </Box>
                        <ProfileDownloadButton outlined />
                        </Stack>
                    </Stack>

                    {/* =================================
                        DECORATIVE GRID
                    ================================== */}

                    <Box
                        sx={{
                            position:
                                "absolute",

                            inset: 0,

                            opacity: 0.18,

                            backgroundImage: `
                                linear-gradient(
                                    var(--clinova-rgba-142-168-232-0_07) 1px,
                                    transparent 1px
                                ),
                                linear-gradient(
                                    90deg,
                                    var(--clinova-rgba-142-168-232-0_07) 1px,
                                    transparent 1px
                                )
                            `,

                            backgroundSize:
                                "55px 55px",

                            maskImage:
                                "radial-gradient(circle at center, black, transparent 72%)",

                            pointerEvents:
                                "none",

                            zIndex: -1,
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}

export default CTASection;