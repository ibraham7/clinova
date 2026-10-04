import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { useState } from "react";
import {
    Box,
    Container,
    Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

const faqs = [
    {
        id: "01",
        question: "ماذا تقدم Clinova للعيادات؟",
        answer:
            "تقدم Clinova منظومة متكاملة للتسويق الطبي، تبدأ من بناء الاستراتيجية وصناعة المحتوى وإدارة الحملات الإعلانية، وتمتد إلى تحسين رحلة المريض وقياس النتائج ومتابعة الحجوزات.",
    },
    {
        id: "02",
        question: "ما الدول والمناطق التي تخدمونها؟",
        answer:
            "نعمل مع العيادات والمراكز الطبية في الأسواق التي نستطيع فيها بناء استراتيجية مناسبة لطبيعة المرضى والسوق المحلي، مع تركيز خاص على منطقة الخليج والشرق الأوسط.",
    },
    {
        id: "03",
        question: "ما أنواع العيادات والتخصصات التي تتعاونون معها؟",
        answer:
            "نركز على التخصصات الطبية التي تحتاج إلى بناء ثقة عالية ورحلة قرار واضحة لدى المريض، مثل طب الأسنان والجلدية والتجميل والجراحة التجميلية وغيرها من التخصصات المختارة.",
    },
    {
        id: "04",
        question: "ما الذي يميز Clinova عن الوكالات الأخرى؟",
        answer:
            "نحن لا ننظر إلى الإعلانات كهدف بحد ذاته، بل نربط التسويق برحلة المريض كاملة، ونستخدم البيانات لفهم مصدر المريض وسلوكه وتحسين تجربة التواصل والحجز.",
    },
    {
        id: "05",
        question: "هل تكتفون بإدارة الإعلانات أم تتابعون المواعيد؟",
        answer:
            "نعمل على بناء منظومة متكاملة يمكن أن تشمل الاستراتيجية والإعلانات والمحتوى والتواصل وتتبع العملاء والحجوزات، بحسب احتياجات كل عيادة.",
    },
    {
        id: "06",
        question: "هل أحتاج إلى فريق تسويق داخلي؟",
        answer:
            "ليس بالضرورة. يمكن أن تعمل Clinova كشريك تسويقي متكامل للعيادة، أو كامتداد للفريق الداخلي، ويتم تحديد نطاق العمل بناءً على احتياجات المشروع.",
    },
    {
        id: "07",
        question: "ما النتائج التي يمكنني قياسها؟",
        answer:
            "نركز على مؤشرات مرتبطة بالعمل الفعلي، مثل جودة الاستفسارات، معدل التحويل، الحجوزات، تكلفة اكتساب المريض، ومصادر المرضى، بدل الاعتماد على أرقام التفاعل فقط.",
    },
    {
        id: "08",
        question: "هل تعملون مع عيادات جديدة أم فقط العيادات القائمة؟",
        answer:
            "يمكننا العمل مع العيادات في مراحل مختلفة، سواء كانت في بداية إطلاقها أو تمتلك حضورًا قائمًا وتحتاج إلى تطوير استراتيجيتها وتحسين نتائجها.",
    },
    {
        id: "09",
        question: "كيف أبدأ مع Clinova؟",
        answer:
            "تبدأ الخطوة الأولى بالتواصل معنا وفهم وضع العيادة وأهدافها والتحديات الحالية، ثم نحدد الفرص المناسبة ونقترح نطاق العمل والاستراتيجية الملائمة.",
    },
];

function FAQSection() {
    const { direction, t } = useSiteTranslation();

    const [activeId, setActiveId] = useState("01");

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
                overflow: "hidden",

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

                        maxWidth: 1050,

                        mx: "auto",
                    }}
                >
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
                            />
                        );
                    })}
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
}: {
    id: string;
    question: string;
    answer: string;
    active: boolean;
    onClick: () => void;
}) {
    const { direction, t } = useSiteTranslation();

    return (
        <Box
            sx={{
                position: "relative",

                mb: 1.2,

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