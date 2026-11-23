import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Box, Container, Typography } from "@mui/material";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { logoSmall as clinovaLogo } from "../../config/logo";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";

// Two chapters of the same story. On a large screen the section is a scroll-driven story: the picture keeps still while
// scrolling grows a single dot into a whole system, the text changes chapter, and the timeline below can be clicked.
// On small screens, with reduced motion and in the text editor both chapters are simply shown (nothing is hidden).
const stages = [
    {
        eyebrow: "المرحلة الأولى",
        title: "حلول رقمية",
        description: "بدأت Clinova مع نظام CRM لمتابعة مرضى عيادات الأسنان.",
        number: "01",
        year: "البداية",
    },
    {
        eyebrow: "المرحلة الثانية",
        title: "منظومة متكاملة",
        description: "اليوم نقدم منظومة نمو متكاملة تساعد العيادات على بناء حضور قوي، وجلب مرضى جدد، وتقديم تجربة أفضل للمريض.",
        number: "02",
        year: "Clinova",
    },
];

// The system grows ring by ring: `k` says when (in the first half of the scroll) each part appears; the first is always there.
const rings = [
    { size: 52, seconds: 46, reverse: false },
    { size: 74, seconds: 78, reverse: true },
    { size: 98, seconds: 120, reverse: false },
];
const nodes = [
    { Icon: MedicalServicesRoundedIcon, ring: 0, angle: 20, k: -1 },
    { Icon: CampaignRoundedIcon, ring: 1, angle: 70, k: 0.4 },
    { Icon: ChatRoundedIcon, ring: 1, angle: 190, k: 0.9 },
    { Icon: CalendarMonthRoundedIcon, ring: 1, angle: 310, k: 1.4 },
    { Icon: TrendingUpRoundedIcon, ring: 2, angle: 120, k: 1.9 },
    { Icon: GroupsRoundedIcon, ring: 2, angle: 250, k: 2.4 },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function StorySection() {
    const { direction, t } = useSiteTranslation();
    const track = useRef<HTMLDivElement>(null);
    const [animated, setAnimated] = useState(false);
    // Phones: no scroll story, but the same picture is driven by a finger instead (tap a chapter, swipe the picture).
    const [compact, setCompact] = useState(false);
    const [stage, setStage] = useState(0);
    const progress = useRef(0.3);
    const tween = useRef(0);

    // The scroll story needs room, a calm visitor and the text editor out of the way.
    useEffect(() => {
        const decide = () => {
            const calm = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !new URLSearchParams(window.location.search).has("edit");
            setAnimated(calm && window.innerWidth >= 900 && window.innerHeight >= 680);
            setCompact(calm && window.innerWidth < 900);
        };
        decide();
        window.addEventListener("resize", decide);
        return () => window.removeEventListener("resize", decide);
    }, []);

    // Scroll progress through the section (0 to 1) goes to one CSS variable on the track; the chapter flips at one half.
    useEffect(() => {
        const element = track.current;
        if (!animated || !element) return;
        let frame = 0;
        const update = () => {
            frame = 0;
            const rect = element.getBoundingClientRect();
            const travel = rect.height - window.innerHeight;
            const progress = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;
            element.style.setProperty("--p", progress.toFixed(3));
            setStage(progress >= 0.5 ? 1 : 0);
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, [animated]);

    // Phone version. `--p` is the same 0..1 value the scroll story uses (0.3 = chapter one, 1 = chapter two); here it is eased
    // towards a target after a tap, or follows the finger while the picture is dragged sideways. Only custom properties on the track move.
    const setProgress = (value: number) => {
        progress.current = value;
        track.current?.style.setProperty("--p", value.toFixed(3));
        setStage(value >= 0.65 ? 1 : 0);
    };
    const easeTo = (target: number, ms = 900) => {
        cancelAnimationFrame(tween.current);
        const from = progress.current;
        const start = performance.now();
        const step = (now: number) => {
            const k = Math.min((now - start) / ms, 1);
            setProgress(from + (target - from) * (1 - Math.pow(1 - k, 3)));
            if (k < 1) tween.current = requestAnimationFrame(step);
        };
        tween.current = requestAnimationFrame(step);
    };

    useEffect(() => {
        const element = track.current;
        if (!compact || !element) return;
        const parts = [element.querySelector<HTMLElement>(".story-visual"), element.querySelector<HTMLElement>(".story-panels")].filter(Boolean) as HTMLElement[];
        const sign = direction === "rtl" ? -1 : 1;
        let startX = 0;
        let startP = 0;
        let live = false;
        let moved = false;
        const down = (event: PointerEvent) => {
            if ((event.target as Element).closest(".story-node")) return;
            live = true; moved = false; startX = event.clientX; startP = progress.current;
            cancelAnimationFrame(tween.current);
        };
        const move = (event: PointerEvent) => {
            if (!live) return;
            const dx = event.clientX - startX;
            if (!moved && Math.abs(dx) < 8) return;
            moved = true;
            setProgress(clamp(startP + (sign * dx) / 260, 0.08, 1));
        };
        const up = (event: PointerEvent) => {
            if (!live) return;
            live = false;
            if ((event.target as Element).closest(".story-node")) return;
            easeTo(moved ? (progress.current >= 0.65 ? 1 : 0.3) : (progress.current >= 0.65 ? 0.3 : 1), moved ? 500 : 900);
        };
        parts.forEach((part) => { part.addEventListener("pointerdown", down); part.addEventListener("pointermove", move); part.addEventListener("pointerup", up); part.addEventListener("pointercancel", up); });

        // The first time the picture is seen, the single dot grows into its first ring.
        setProgress(0.02);
        const seen = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { seen.disconnect(); easeTo(0.3, 1400); } }, { threshold: 0.35 });
        seen.observe(element);

        // A finger on a circle lights it in gold; another tap puts it out.
        const light = (event: MouseEvent) => (event.target as Element).closest(".story-node")?.classList.toggle("is-gold");
        element.addEventListener("click", light);

        return () => {
            cancelAnimationFrame(tween.current);
            seen.disconnect();
            element.removeEventListener("click", light);
            parts.forEach((part) => { part.removeEventListener("pointerdown", down); part.removeEventListener("pointermove", move); part.removeEventListener("pointerup", up); part.removeEventListener("pointercancel", up); });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compact, direction]);

    const go = (index: number) => {
        const element = track.current;
        if (!element) return;
        if (compact) { easeTo(index ? 1 : 0.3); return; }
        const top = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + (index ? element.offsetHeight - window.innerHeight : 0), behavior: "smooth" });
    };

    return (
        <Box
            component="section"
            id="story"
            sx={{
                position: "relative",
                // "clip", not "hidden": hidden would stop the sticky stage from sticking.
                overflow: "clip",
                pb: animated ? 0 : { xs: 10, md: 14, lg: 18 },
                pt: animated ? 0 : { xs: 4, md: 6 },
                background: "radial-gradient(circle at 50% 45%, var(--clinova-rgba-95-120-181-0_08), transparent 38%), var(--clinova-color-0b111b)",
                direction: direction,
            }}
        >
            <Container>
                <Box
                    ref={track}
                    className="story-track"
                    data-animated={animated ? "" : undefined}
                    data-compact={compact ? "" : undefined}
                    style={{ "--p": animated ? 0 : compact ? 0.3 : 1 } as CSSProperties}
                    sx={{ position: "relative", height: animated ? { md: "190vh" } : "auto" }}
                >
                    <Box
                        className="story-stage"
                        sx={animated ? {
                            position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
                            pt: 12, pb: 4, gap: { md: 3, lg: 4 },
                        } : { display: "flex", flexDirection: "column", gap: { xs: 5, md: 7 } }}
                    >
                        {/* Header */}
                        <Box sx={{ maxWidth: 850, mx: "auto", textAlign: "center" }}>
                            <Typography sx={{ mb: animated ? 1 : 2, fontFamily: "var(--clinova-font-family)", fontSize: { xs: "1.4rem", md: "1.7rem" }, fontWeight: 600, color: "primary.main" }}>
                                {t("قصتنا")}
                            </Typography>
                            <Typography sx={{ fontFamily: "var(--clinova-font-family)", fontSize: { xs: "1rem", md: "1.15rem" }, fontWeight: 500, color: "primary.light", lineHeight: 1.8 }}>
                                {t("بدأنا من تخصص واحد، وتوسعنا مع نجاح عملائنا.")}
                            </Typography>
                            <Typography sx={{ mt: animated ? 1.5 : 3, fontFamily: "var(--clinova-font-family)", fontSize: { xs: "0.9rem", md: animated ? "0.9rem" : "0.98rem" }, fontWeight: 400, lineHeight: animated ? 1.9 : 2.1, color: "text.secondary" }}>
                                {t("بدأت رحلتنا من فهم عميق للتحديات التي تواجه العيادات الطبية، وكيف يمكن للتجربة الرقمية أن تكون جزءًا أساسيًا من نجاحها. في Clinova نعمل على تطوير حلول رقمية تساعد العيادات والأطباء على بناء حضور احترافي، وتحسين تجربة المريض، وتحويل النمو الرقمي إلى نتائج واضحة وقابلة للقياس.")}
                            </Typography>
                        </Box>

                        {/* Chapters and picture */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                alignItems: "center",
                                gap: { xs: 5, md: 6, lg: 10 },
                                direction: direction,
                            }}
                        >
                            <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 4, md: 3 }, minWidth: 0 }}>
                                <Box className="story-panels" sx={{ display: "grid", gap: { xs: 3, md: 0 }, gridTemplateColumns: "1fr" }}>
                                    {stages.map((item, index) => (
                                        <Box
                                            key={item.number}
                                            className={`story-panel${animated || compact ? (stage === index ? " is-on" : " is-off") : ""}`}
                                            aria-hidden={(animated || compact) && stage !== index ? true : undefined}
                                            sx={{ position: "relative", minWidth: 0, textAlign: "start" }}
                                        >
                                            <Box className="story-big" aria-hidden="true">{item.number}</Box>
                                            <Typography sx={{ mb: 1, fontFamily: "var(--clinova-font-family)", fontSize: "0.85rem", fontWeight: 500, color: "primary.main" }}>
                                                {t(item.eyebrow)}
                                            </Typography>
                                            <Typography component="h3" sx={{ fontFamily: "var(--clinova-font-family)", fontSize: { xs: "1.9rem", md: "2.3rem", lg: "2.6rem" }, fontWeight: 600, lineHeight: 1.35, color: "text.primary" }}>
                                                {t(item.title)}
                                            </Typography>
                                            <Typography sx={{ mt: 2, maxWidth: 480, fontFamily: "var(--clinova-font-family)", fontSize: { xs: "0.9rem", md: "0.95rem" }, lineHeight: 2, color: "text.secondary" }}>
                                                {t(item.description)}
                                            </Typography>
                                            <Typography sx={{ mt: 2, fontFamily: "var(--clinova-font-family)", fontSize: "0.78rem", color: "text.secondary" }}>
                                                {t(item.year)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {(animated || compact) && (
                                    <Box className="story-timeline" role="group">
                                        {stages.map((item, index) => (
                                            <Box
                                                key={item.number}
                                                component="button"
                                                type="button"
                                                className={stage === index ? "story-stop is-on" : "story-stop"}
                                                aria-pressed={stage === index}
                                                onClick={() => go(index)}
                                            >
                                                <span className="story-stop-dot">{item.number}</span>
                                                <span className="story-stop-label">{t(item.year)}</span>
                                            </Box>
                                        ))}
                                        <Box className="story-line" aria-hidden="true">
                                            <i />
                                            <b />
                                        </Box>
                                    </Box>
                                )}
                            </Box>

                            {/* One dot grows into a system */}
                            <Box className="story-visual" data-fx={animated || compact ? "tilt" : undefined} aria-hidden="true">
                                {rings.map((ring, index) => (
                                    <Box
                                        key={ring.size}
                                        className={`story-ring story-ring-${index + 1}`}
                                        style={{ "--size": `${ring.size}%`, "--dur": `${ring.seconds}s`, "--dir": ring.reverse ? "reverse" : "normal" } as CSSProperties}
                                    >
                                        {nodes.filter((node) => node.ring === index).map(({ Icon, angle, k }) => (
                                            <span key={angle} className="story-arm" style={{ rotate: `${angle}deg` }}>
                                                <span className="story-node" style={{ "--ang": `${angle}deg`, "--k": k } as CSSProperties}>
                                                    <Icon />
                                                </span>
                                            </span>
                                        ))}
                                    </Box>
                                ))}
                                <Box className="story-core">
                                    <Box component="img" src={clinovaLogo} alt="" sx={{ width: "74%", height: "auto", filter: "var(--clinova-logo-filter)" }} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default StorySection;
