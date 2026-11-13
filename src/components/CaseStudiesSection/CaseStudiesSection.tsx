import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import CountUp from "../motion/CountUp";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
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
    // The shown case moves on by itself every few seconds while the section is on screen; a click or the pointer pauses it.
    const touched = useRef(0);
    useEffect(() => {
        const section = document.getElementById("case-studies");
        if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let timer = 0;
        const stop = () => { window.clearInterval(timer); timer = 0; };
        const observer = new IntersectionObserver(([entry]) => {
            stop();
            if (!entry?.isIntersecting) return;
            timer = window.setInterval(() => {
                if (document.visibilityState !== "visible" || Date.now() - touched.current < 12000) return;
                setActiveId((current) => caseStudies[(caseStudies.findIndex((item) => item.id === current) + 1) % caseStudies.length].id);
            }, 6500);
        }, { threshold: 0.4 });
        observer.observe(section);
        return () => { observer.disconnect(); stop(); };
    }, []);

    // Which way the result card comes in: 1 when moving to a later clinic, -1 to an earlier one.
    const [from, setFrom] = useState(1);
    const select = (id: string) => {
        touched.current = Date.now();
        const delta = caseStudies.findIndex((item) => item.id === id) - caseStudies.findIndex((item) => item.id === activeId);
        if (!delta) return;
        setFrom(delta > 0 ? 1 : -1);
        setActiveId(id);
    };
    const step = (delta: number) => {
        const index = caseStudies.findIndex((item) => item.id === activeId);
        touched.current = Date.now();
        setFrom(delta > 0 ? 1 : -1);
        setActiveId(caseStudies[(index + delta + caseStudies.length) % caseStudies.length].id);
    };
    // The light behind the list follows the chosen clinic.
    const list = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const element = list.current;
        const place = () => {
            const item = element?.querySelector<HTMLElement>(".case-item.is-active");
            if (!element || !item) return;
            element.style.setProperty("--csx-y", `${item.offsetTop}px`);
            element.style.setProperty("--csx-h", `${item.offsetHeight}px`);
        };
        place();
        if (!element || typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(place);
        observer.observe(element);
        return () => observer.disconnect();
    }, [activeId]);
    // Arrow keys, Home and End move through the clinics.
    const onListKey = (event: KeyboardEvent<HTMLElement>) => {
        const move = { ArrowDown: 1, ArrowUp: -1, Home: -99, End: 99 }[event.key];
        if (move === undefined) return;
        const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(".case-item"));
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (index < 0) return;
        const next = Math.max(0, Math.min(items.length - 1, index + move));
        if (next === index) return;
        event.preventDefault();
        items[next].focus();
        select(caseStudies[next].id);
    };
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
                        ref={list}
                        className="csx-list"
                        onKeyDown={onListKey}
                        sx={{
                            position: "relative",
                            gap: 1.2,
                            direction: direction,
                            order: {
                                xs: 2,
                                lg: 1,
                            },
                        }}
                    >
                        {/* A light that slides to the chosen clinic (interactive.css, "Case studies"). */}
                        <span aria-hidden="true" className="csx-glider" />
                        {caseStudies.map((caseStudy) => {
                            const active =
                                activeId === caseStudy.id;

                            return (
                                <CaseItem key={caseStudy.id} caseStudy={caseStudy} active={active} onHover={() => { touched.current = Date.now(); }} onClick={() => select(caseStudy.id)} />
                            );
                        })}
                    </Stack>

                    {/* =================================
                        RESULT CARD
                    ================================== */}

                    <ResultCard key={activeCase.number} caseStudy={activeCase} from={from} onPick={select} onStep={step} />
                </Box>
            </Container>
        </Box>
    );
}

/* =========================================
   CASE ITEM
========================================= */

function CaseItem({ caseStudy, active, onClick, onHover, }: { caseStudy: CaseStudy; active: boolean; onClick: () => void; onHover: () => void; }) {
    const { direction, t } = useSiteTranslation();

    return (
        <Box component="button" data-fx="spot" className={active ? "case-item is-active" : "case-item"} onPointerMove={onHover} onClick={onClick} sx={{ position: "relative", width: "100%", minHeight: 68,

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

function ResultCard({ caseStudy, from, onPick, onStep }: { caseStudy: CaseStudy; from: number; onPick: (id: string) => void; onStep: (delta: number) => void }) {
    const { direction, t, isRtl } = useSiteTranslation();
    // On touch screens a sideways swipe moves to the next or the previous clinic; the card follows the finger.
    const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
    const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
        if (event.pointerType === "mouse") return;
        swipe.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    };
    const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
        const start = swipe.current;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x;
        if (Math.abs(event.clientY - start.y) > Math.abs(dx) + 12) { swipe.current = null; event.currentTarget.style.removeProperty("--csx-drag"); return; }
        event.currentTarget.style.setProperty("--csx-drag", `${(dx * 0.35).toFixed(0)}px`);
    };
    const onPointerEnd = (event: ReactPointerEvent<HTMLElement>) => {
        const start = swipe.current;
        swipe.current = null;
        event.currentTarget.style.removeProperty("--csx-drag");
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) < 64) return;
        // Dragging toward the start of the line brings the next clinic, like turning a page.
        onStep((dx < 0) !== isRtl ? 1 : -1);
    };

    const bookedAppointments = caseStudy.stats.find(
        (stat) => stat.label === "موعد محجوز",
    );

    return (
        <Box
            component="article" data-fx="spot" className={`case-result csx-card ${from > 0 ? "is-next" : "is-prev"}`} aria-label={t("تجربة {{name}}", { name: t(caseStudy.name) })}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}
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

            <Box className="case-big" sx={{ mt: 3, p: { xs: 2, sm: 3 }, borderRadius: 3, border: "1px solid var(--clinova-rgba-142-168-232-0_14)",
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
                    <CountUp value={caseStudy.result} />
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
                {caseStudy.stats.map((stat, statIndex) => ( <Box key={stat.label} data-fx="spot" className="case-stat csx-tile" style={{ "--i": statIndex } as CSSProperties} sx={{ p: 2,
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
                            <CountUp value={t(stat.value)} />
                        </Typography>
                        <Typography sx={{ mt: 0.7, fontSize: "0.7rem", color: "text.secondary" }}>
                            {t(stat.label)}
                        </Typography>
                        {stat.label === "موعد محجوز" && <AppointmentBars activeId={caseStudy.id} onPick={onPick} />}
                        {stat.label === "العائد على الاستثمار" && <ReturnGauge value={stat.value} />}
                        {stat.label === "متوسط إيراد الموعد" && <span aria-hidden="true" className="csx-coin"><i /><i /><i /></span>}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

const statOf = (caseStudy: CaseStudy, label: string) => Number.parseFloat((caseStudy.stats.find((stat) => stat.label === label)?.value ?? "0").replace(/[^\d.]/g, "")) || 0;
const mostAppointments = Math.max(...caseStudies.map((item) => statOf(item, "موعد محجوز")));

/**
 * Booked appointments of all five clinics side by side, the shown clinic lit. A bar under the mouse names its clinic,
 * a click shows it. A picture of numbers that are already on the page, so it is hidden from screen readers.
 */
function AppointmentBars({ activeId, onPick }: { activeId: string; onPick: (id: string) => void }) {
    const { t } = useSiteTranslation();
    return <div aria-hidden="true" className="csx-bars" dir="ltr">
        {caseStudies.map((item, index) => {
            const count = statOf(item, "موعد محجوز");
            return <button key={item.id} type="button" tabIndex={-1} className={item.id === activeId ? "is-current" : undefined} onClick={() => onPick(item.id)}
                style={{ "--h": `${Math.round((count / mostAppointments) * 100)}%`, "--i": index } as CSSProperties}>
                <i />
                <span>{t(item.name)} · {count}</span>
            </button>;
        })}
    </div>;
}

const gaugeLength = Math.PI * 40;
const gaugeTop = 8;

/** The return on investment as a half-circle gauge that sweeps up to its value (decoration: the figure is written above it). */
function ReturnGauge({ value }: { value: string }) {
    const share = Math.max(0, Math.min(1, (Number.parseFloat(value.replace(/[^\d.]/g, "")) || 0) / gaugeTop));
    return <svg aria-hidden="true" focusable="false" className="csx-gauge" viewBox="0 0 100 56">
        <path className="csx-gauge-track" d="M10 50 A40 40 0 0 1 90 50" />
        <path className="csx-gauge-fill" d="M10 50 A40 40 0 0 1 90 50" style={{ "--len": gaugeLength, "--off": gaugeLength * (1 - share) } as CSSProperties} />
        <g className="csx-gauge-needle" style={{ "--turn": `${share * 180 - 90}deg` } as CSSProperties}><line x1="50" y1="50" x2="50" y2="20" /><circle cx="50" cy="50" r="3.2" /></g>
    </svg>;
}

export default CaseStudiesSection;
