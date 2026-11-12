import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Box, Container, Typography } from "@mui/material";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import clinovaLogo from "../../../public/logo/logo.png";
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
        eyebrow: "اليوم",
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
    const [stage, setStage] = useState(0);

    // The scroll story needs room, a calm visitor and the text editor out of the way.
    useEffect(() => {
        const decide = () => setAnimated(
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
            && !new URLSearchParams(window.location.search).has("edit")
            && window.innerWidth >= 900 && window.innerHeight >= 680,
        );
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

    const go = (index: number) => {
        const element = track.current;
        if (!element) return;
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
                    style={{ "--p": animated ? 0 : 1 } as CSSProperties}
                    sx={{ position: "relative", height: animated ? { md: "280vh" } : "auto" }}
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
                                            className={`story-panel${animated ? (stage === index ? " is-on" : " is-off") : ""}`}
                                            aria-hidden={animated && stage !== index ? true : undefined}
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

                                {animated && (
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
                            <Box className="story-visual" data-fx={animated ? "tilt" : undefined} aria-hidden="true">
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
