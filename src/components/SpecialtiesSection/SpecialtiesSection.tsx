import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
    Box,
    Container,
    Typography,
} from "@mui/material";

import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import FaceRetouchingNaturalOutlinedIcon from "@mui/icons-material/FaceRetouchingNaturalOutlined";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import { isEditing, prefersReducedMotion, usePointerStage } from "../../motion/usePointerStage";

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

const autoMs = 6500;

function SpecialtiesSection() {
    const { direction, t } = useSiteTranslation();

    const [activeId, setActiveId] = useState("dental");
    // The open panel moves on by itself while the section is on screen and nobody is using the panels (mouse over them or focus inside). "run" counts the
    // countdowns so the progress line restarts with each one; 0 means paused.
    const [run, setRun] = useState(0);
    const section = useRef<HTMLElement>(null);
    const board = useRef<HTMLDivElement>(null);
    const busy = useRef(false);
    // Once the visitor has chosen a specialty it stays until they scroll away; the panels never move on while someone reads.
    const chosen = useRef(false);
    useEffect(() => {
        const element = section.current;
        const zone = board.current;
        // Stacked on small screens the open panel changes the height of the page, so nothing moves by itself there.
        if (!element || !zone || isEditing() || prefersReducedMotion() || window.matchMedia("(max-width: 899px)").matches) return;
        let onScreen = false;
        let timer = 0;
        const start = () => {
            window.clearTimeout(timer);
            if (!onScreen || busy.current || chosen.current || document.visibilityState !== "visible") { setRun(0); return; }
            setRun((value) => value + 1);
            timer = window.setTimeout(() => {
                setActiveId((current) => specialties[(specialties.findIndex((item) => item.id === current) + 1) % specialties.length].id);
            }, autoMs);
        };
        const observer = new IntersectionObserver(([entry]) => { onScreen = !!entry?.isIntersecting; if (!onScreen) chosen.current = false; start(); }, { threshold: 0.35 });
        observer.observe(element);
        const enter = () => { busy.current = true; start(); };
        const leave = () => { busy.current = false; start(); };
        zone.addEventListener("pointerenter", enter);
        zone.addEventListener("pointerleave", leave);
        zone.addEventListener("focusin", enter);
        zone.addEventListener("focusout", leave);
        document.addEventListener("visibilitychange", start);
        start();
        return () => {
            window.clearTimeout(timer);
            observer.disconnect();
            zone.removeEventListener("pointerenter", enter);
            zone.removeEventListener("pointerleave", leave);
            zone.removeEventListener("focusin", enter);
            zone.removeEventListener("focusout", leave);
            document.removeEventListener("visibilitychange", start);
        };
    }, [activeId]);
    return (
        <Box
            component="section"
            id="specialties"
            ref={section}
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 10,
                    md: 14,
                    lg: 18,
                },

                background:
                    "radial-gradient(circle at 80% 20%, var(--clinova-rgba-142-168-232-0_08), transparent 32%), var(--clinova-color-0b111b)",

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

                            color: "var(--clinova-color-f5f7fa)",
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

                {/* Three panels: the open one is wide and shows the specialty in full, the others are narrow tabs.
                    A click, a tap or the arrow keys open another one (interactive.css, "Specialties"). */}
                <Box ref={board} className="spx" style={{ "--spx-ms": `${autoMs}ms` } as CSSProperties}>
                    {specialties.map((specialty) => (
                        <SpecialtyPanel key={specialty.id} specialty={specialty} active={activeId === specialty.id}
                            progress={activeId === specialty.id && run > 0 ? run : 0} onPick={(id) => { chosen.current = true; setActiveId(id); }} />
                    ))}
                </Box>
            </Container>
        </Box>
    );
}

function SpecialtyPanel({ specialty, active, progress, onPick }: {
    specialty: (typeof specialties)[number];
    active: boolean;
    /** Number of the running countdown, 0 when there is none. */
    progress: number;
    onPick: (id: string) => void;
}) {
    const onOpen = () => onPick(specialty.id);
    const { t, isRtl } = useSiteTranslation();
    const stage = usePointerStage<HTMLDivElement>();
    const Icon = specialty.icon;
    const bodyId = `specialty-${specialty.id}`;
    // Arrow keys move between the three panels (following the reading direction), Home and End jump to the ends.
    const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        const forward = isRtl ? "ArrowLeft" : "ArrowRight";
        const back = isRtl ? "ArrowRight" : "ArrowLeft";
        const step = event.key === forward || event.key === "ArrowDown" ? 1 : event.key === back || event.key === "ArrowUp" ? -1 : event.key === "Home" ? -9 : event.key === "End" ? 9 : 0;
        if (!step) return;
        const heads = Array.from(event.currentTarget.closest(".spx")?.querySelectorAll<HTMLElement>(".spx-head") ?? []);
        const next = heads[Math.max(0, Math.min(heads.length - 1, heads.indexOf(event.currentTarget) + step))];
        if (!next || next === event.currentTarget) return;
        event.preventDefault();
        next.focus();
        next.click();
    };
    return (
        <Box component="article" data-fx="spot" className={active ? "spx-panel is-active" : "spx-panel"}>
            <div className="spx-inner">
                <Box component="button" type="button" className="spx-head" aria-expanded={active} aria-controls={bodyId} onClick={onOpen} onKeyDown={onKeyDown}>
                    <span className="spx-num" dir="ltr">{specialty.number}</span>
                    <span className="spx-icon" aria-hidden="true"><Icon /></span>
                    <Typography component="h3" className="spx-title" sx={{ fontFamily: "var(--clinova-font-family)", fontWeight: 600, color: "var(--clinova-color-f5f7fa)" }}>
                        {t(specialty.title)}
                    </Typography>
                </Box>
                <div className="spx-more" id={bodyId} inert={!active || undefined}>
                    <div className="spx-more-in">
                        <Typography className="spx-desc" sx={{ fontFamily: "var(--clinova-font-family)", fontSize: { xs: "0.86rem", md: "0.95rem" }, lineHeight: 2, color: "text.secondary" }}>
                            {t(specialty.description)}
                        </Typography>
                        {/* One bar per specialty; the open one fills while it waits to move on. Mouse only: the tabs are the real controls. */}
                        <div aria-hidden="true" className="spx-pager">
                            {specialties.map((item) => (
                                <button key={item.id} type="button" tabIndex={-1} className={item.id === specialty.id ? "is-current" : undefined} onClick={() => onPick(item.id)}>
                                    {item.id === specialty.id && progress > 0 && <i key={progress} />}
                                </button>
                            ))}
                        </div>
                        {/* The services of the specialty circle its icon; they pause under the mouse. */}
                        <div ref={stage} className="spx-stage">
                            <span aria-hidden="true" className="spx-ring spx-ring-a" />
                            <span aria-hidden="true" className="spx-ring spx-ring-b" />
                            <span aria-hidden="true" className="spx-core"><Icon /></span>
                            <ul className="spx-tags" style={{ "--n": specialty.tags.length } as CSSProperties}>
                                {specialty.tags.map((tag, index) => (
                                    <li key={tag} style={{ "--i": index } as CSSProperties}>
                                        <i aria-hidden="true" />
                                        <Typography component="span" sx={{ fontFamily: "var(--clinova-font-family)", fontSize: { xs: "0.72rem", md: "0.78rem" }, fontWeight: 500, color: "var(--clinova-color-f5f7fa)" }}>{t(tag)}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );
}

export default SpecialtiesSection;
