import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { useState, type KeyboardEvent } from "react";
import {
    Box,
    Container,
    Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { faqs } from "../../config/faq";
import FaqDial from "./FaqDial";


function FAQSection() {
    const { direction, t } = useSiteTranslation();

    const [activeId, setActiveId] = useState("01");
    const [hoverId, setHoverId] = useState("");
    // A key of the dial opens its question and brings it into view.
    const pick = (id: string) => {
        setActiveId(id);
        document.getElementById(`faq-item-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const handleToggle = (id: string) => {
        setActiveId((current) =>
            current === id ? "" : id,
        );
    };

    return (
        <Box
            component="section"
            id="faq"
            sx={{
                position: "relative",
                // "clip" hides the glows like "hidden" did, but lets the dial stay sticky while the questions scroll.
                overflow: "clip",

                py: {
                    xs: 10,
                    md: 14,
                    lg: 18,
                },

                background:
                    "radial-gradient(circle at 75% 25%, var(--clinova-rgba-142-168-232-0_06), transparent 35%), var(--clinova-color-0b111b)",

                direction: direction,
            }}
        >
            <Container>
                {/* =====================================
                    HEADER
                ====================================== */}

                <Box
                    sx={{
                        maxWidth: 700,

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
                            {t("الأسئلة الشائعة")}
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
                        {t("أسئلة تطرحها العيادات.")}
                        </Typography>

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

                            color:
                                "text.secondary",
                        }}
                    >
                        {t("إجابات مباشرة عن طريقة عملنا، وأين نعمل، وما الذي يمكن أن نقدمه لعيادتك.")}
                        </Typography>
                </Box>

                {/* =====================================
                    FAQ LIST
                ====================================== */}

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: { xs: 1050, lg: 1240 },
                        mx: "auto",
                        display: "grid",
                        gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "260px minmax(0, 1fr)" },
                        gap: { lg: 7 },
                        alignItems: "start",
                    }}
                >
                <Box sx={{ display: { xs: "none", lg: "block" }, position: "sticky", top: 120 }}>
                    <FaqDial ids={faqs.map((faq) => faq.id)} activeId={activeId} hoverId={hoverId} onPick={pick} />
                </Box>
                <Box data-faq-list="" sx={{ minWidth: 0 }}>
                    {faqs.map((faq) => {
                        const active =
                            activeId === faq.id;

                        return (
                            <FAQItem
                                key={faq.id}
                                id={faq.id}
                                question={faq.question}
                                answer={faq.answer}
                                active={active}
                                onClick={() =>
                                    handleToggle(
                                        faq.id,
                                    )
                                }
                                onHover={(over) => setHoverId(over ? faq.id : "")}
                            />
                        );
                    })}
                </Box>
                </Box>
            </Container>
        </Box>
    );
}

/* =========================================
   FAQ ITEM
========================================= */

function FAQItem({
    id,
    question,
    answer,
    active,
    onClick,
    onHover,
}: {
    id: string;
    question: string;
    answer: string;
    active: boolean;
    onClick: () => void;
    onHover: (over: boolean) => void;
}) {
    const { direction, t } = useSiteTranslation();
    // Arrow keys, Home and End move between the questions.
    const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        const step = { ArrowDown: 1, ArrowUp: -1, Home: -Infinity, End: Infinity }[event.key];
        if (step === undefined) return;
        const buttons = Array.from(event.currentTarget.closest("[data-faq-list]")?.querySelectorAll<HTMLElement>("button[aria-expanded]") ?? []);
        const index = buttons.indexOf(event.currentTarget);
        const next = buttons[Math.max(0, Math.min(buttons.length - 1, step === -Infinity ? 0 : step === Infinity ? buttons.length - 1 : index + step))];
        if (!next || next === event.currentTarget) return;
        event.preventDefault();
        next.focus();
    };

    return ( <Box data-fx="spot" id={`faq-item-${id}`} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)} sx={{ position: "relative", mb: 1.2, scrollMarginBlock: "120px",

                borderRadius: 2.5,

                border: active
                    ? "1px solid var(--clinova-rgba-142-168-232-0_45)"
                    : "1px solid var(--clinova-rgba-142-168-232-0_1)",

                backgroundColor: active
                    ? "var(--clinova-rgba-142-168-232-0_055)"
                    : "var(--clinova-rgba-11-17-27-0_35)",

                overflow: "hidden",

                transition:
                    "border-color 0.3s ease, background-color 0.3s ease",

                "&::before": {
                    content: '""',

                    position: "absolute",

                    top: 0,
                    bottom: 0,
                    right: 0,

                    width: 2,

                    backgroundColor: active
                        ? "primary.main"
                        : "transparent",

                    boxShadow: active
                        ? "0 0 18px var(--clinova-rgba-142-168-232-0_5)"
                        : "none",

                    transition:
                        "background-color 0.3s ease",
                },

                "&:hover": {
                    borderColor:
                        "var(--clinova-rgba-142-168-232-0_28)",
                },
            }}
        >
            {/* Question */}

            <Box
                component="button"
                onClick={onClick}
                onKeyDown={onKeyDown}
                aria-expanded={active}
                sx={{
                    width: "100%",

                    minHeight: {
                        xs: 62,
                        md: 68,
                    },

                    display: "grid",

                    gridTemplateColumns:
                        "1fr 36px",

                    alignItems: "center",

                    gap: 2,

                    px: {
                        xs: 2,
                        md: 2.5,
                    },

                    border: 0,

                    background:
                        "transparent",

                    color: "inherit",

                    cursor: "pointer",

                    textAlign: "start",

                    direction: "ltr",
                }}
            >
                {/* Number */}

                <Typography
                    sx={{
                        position:
                            "absolute",

                        left: {
                            xs: 16,
                            md: 20,
                        },

                        top: "50%",

                        transform:
                            "translateY(-50%)",

                        fontFamily:
                            '"Plus Jakarta Sans", sans-serif',

                        fontSize:
                            "0.52rem",

                        letterSpacing:
                            "0.10em",

                        color: active
                            ? "primary.main"
                            : "var(--clinova-rgba-245-247-250-0_28)",
                    }}
                >
                    {id}
                </Typography>

                {/* Question */}

                <Typography
                    sx={{
                        gridColumn: 1,

                        fontFamily:
                            "var(--clinova-font-family)",

                        fontSize: {
                            xs: "0.82rem",
                            md: "0.9rem",
                        },

                        fontWeight: active
                            ? 600
                            : 500,

                        color: active
                            ? "text.primary"
                            : "text.secondary",

                        direction: direction,

                        transition:
                            "color 0.25s ease",
                    }}
                >
                    {t(question)}
                </Typography>

                {/* Toggle */}

                <Box
                    sx={{
                        gridColumn: 2,

                        width: 34,
                        height: 34,

                        display: "flex",

                        alignItems: "center",
                        justifyContent:
                            "center",

                        borderRadius:
                            "50%",

                        border:
                            "1px solid var(--clinova-rgba-142-168-232-0_16)",

                        backgroundColor:
                            active
                                ? "var(--clinova-rgba-142-168-232-0_12)"
                                : "var(--clinova-rgba-142-168-232-0_035)",

                        color: active
                            ? "primary.main"
                            : "text.secondary",

                        transition:
                            "all 0.3s ease",
                    }}
                >
                    <AddRoundedIcon
                        sx={{
                            fontSize: 18,

                            transform: active
                                ? "rotate(45deg)"
                                : "rotate(0deg)",

                            transition:
                                "transform 0.3s ease",
                        }}
                    />
                </Box>
            </Box>

            {/* Answer */}

            <Box
                sx={{
                    display: "grid",

                    gridTemplateRows: active
                        ? "1fr"
                        : "0fr",

                    transition:
                        "grid-template-rows 0.35s ease",
                }}
            >
                <Box
                    sx={{
                        minHeight: 0,

                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            px: {
                                xs: 2,
                                md: 3,
                            },

                            pb: {
                                xs: 2.5,
                                md: 3,
                            },

                            pr: {
                                xs: 2,
                                md: 7,
                            },

                            pt: 0,
                        }}
                    >
                        <Box
                            sx={{
                                height: 1,

                                mb: 2,

                                backgroundColor:
                                    "var(--clinova-rgba-142-168-232-0_08)",
                            }}
                        />

                        <Typography
                            sx={{
                                fontFamily:
                                    "var(--clinova-font-family)",

                                fontSize: {
                                    xs: "0.78rem",
                                    md: "0.84rem",
                                },

                                lineHeight: 2,

                                color:
                                    "text.secondary",

                                textAlign:
                                    "start",
                            }}
                        >
                            {t(answer)}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default FAQSection;