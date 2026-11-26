import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import { logoSmall as clinovaLogo } from "../../config/logo";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import CountUp from "../motion/CountUp";

const float = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
`;

const gentleFloat = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
`;

const breathe = keyframes`
    0%, 100% { opacity: 0.35; transform: scale(0.96); }
    50% { opacity: 0.65; transform: scale(1.04); }
`;

const travel = keyframes`
    from { stroke-dashoffset: 0; }
    to { stroke-dashoffset: -240; }
`;

const draw = keyframes`
    to { stroke-dashoffset: 0; }
`;

const fadeIn = keyframes`
    to { opacity: 1; }
`;

const pop = keyframes`
    0% { opacity: 0; transform: scale(0.2); }
    70% { opacity: 1; transform: scale(1.35); }
    100% { opacity: 1; transform: scale(1); }
`;

// Everything below moves only transform and opacity, so the browser can animate it without redrawing the card.
const cardGlow = keyframes`
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.95; }
`;

const shine = keyframes`
    0% { transform: translateX(-130%); }
    32%, 100% { transform: translateX(130%); }
`;

const numberPulse = keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
`;

const numberAura = keyframes`
    0%, 100% { opacity: 0.25; transform: scale(0.85); }
    50% { opacity: 0.8; transform: scale(1.15); }
`;

const twinkle = keyframes`
    0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(90deg); }
`;

const ring = keyframes`
    0% { opacity: 0.85; transform: scale(1); }
    100% { opacity: 0; transform: scale(3.4); }
`;

const lineGlow = keyframes`
    0%, 100% { opacity: 0.12; }
    50% { opacity: 0.4; }
`;

/**
 * Decorative illustration (the SVG is hidden from screen readers), plus one real client result on a floating card,
 * which is read out. The figure is a fixed example, not a live metric.
 */
export default function HeroVisual() {
    const { t } = useSiteTranslation();
    return (
        <Box
            className="clinova-parallax"
            sx={{
                position: "relative",
                width: "100%",
                maxWidth: { xs: 350, md: 440, lg: "clamp(300px, calc(100vh - 330px), 520px)" },
                aspectRatio: "1",
                mx: "auto",
                pointerEvents: "none",
                "& svg": { display: "block", width: "100%", height: "100%", overflow: "visible" },
                "& .hero-float": { animation: `${float} 7s ease-in-out infinite` },
                "& .hero-float-delayed": { animationDelay: "-3.5s" },
                "& .hero-halo": {
                    transformOrigin: "260px 260px",
                    animation: `${breathe} 8s ease-in-out infinite`,
                },
                "& .hero-signal": { animation: `${travel} 16s linear infinite` },
                // The story of the chart, in order: a flat line (before Clinova), the start point on day 1, then the climb.
                "& .hero-before-line": { strokeDasharray: 1, strokeDashoffset: 1, animation: `${draw} 0.7s 0.3s ease-out forwards` },
                "& .hero-start": { opacity: 0, transformBox: "fill-box", transformOrigin: "center", animation: `${pop} 0.5s 1s cubic-bezier(0.22, 1, 0.36, 1) forwards` },
                "& .hero-result-line": { strokeDasharray: 1, strokeDashoffset: 1, animation: `${draw} 1.8s 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards` },
                "& .hero-result-fill": { opacity: 0, animation: `${fadeIn} 0.9s 2s ease-out forwards` },
                "& .hero-end": { opacity: 0, animation: `${fadeIn} 0.3s 2.8s forwards` },
                "& .hero-line-glow": { opacity: 0.12, animation: `${lineGlow} 2.4s 3s ease-in-out infinite` },
                "& .hero-ring": { opacity: 0, transformBox: "fill-box", transformOrigin: "center", animation: `${ring} 1.9s 3s ease-out infinite` },
                // What catches the eye on the result card: the glowing edge, a light sweeping over it, a number that swells and shrinks, and twinkling stars.
                "& .hero-card-glow": { animation: `${cardGlow} 2.6s ease-in-out infinite` },
                "& .hero-card-shine": { animation: `${shine} 5s 1.5s ease-in-out infinite` },
                "& .hero-number": { display: "inline-block", transformOrigin: "left center", animation: `${numberPulse} 2.4s 1.8s ease-in-out infinite` },
                "& .hero-number-aura": { animation: `${numberAura} 2.4s 1.8s ease-in-out infinite` },
                "& .hero-spark": { opacity: 0, animation: `${twinkle} 2.2s ease-in-out infinite` },
                // Each floating card sits at its own depth, so they slide against each other as the pointer moves.
                "& .hero-d1": { translate: "calc(var(--clinova-px, 0) * -16px) calc(var(--clinova-py, 0) * -12px)", transition: "translate 900ms cubic-bezier(0.22, 1, 0.36, 1)" },
                "& .hero-d2": { translate: "calc(var(--clinova-px, 0) * 22px) calc(var(--clinova-py, 0) * 16px)", transition: "translate 900ms cubic-bezier(0.22, 1, 0.36, 1)" },
                "& .hero-d3": { translate: "calc(var(--clinova-px, 0) * -30px) calc(var(--clinova-py, 0) * 20px)", transition: "translate 900ms cubic-bezier(0.22, 1, 0.36, 1)" },
                // Phones keep the four floating cards and the travelling signal; the breathing halo and the turning dashed ring stay still,
                // since several animations running inside one SVG make the browser redo the whole picture on every frame.
                "@media (max-width: 899px), (pointer: coarse)": {
                    "& .hero-halo": { animation: "none", opacity: 0.5 },
                    "& .hero-spin": { animation: "none" },
                    // The result card keeps its glow, the sweeping light, the swelling number, the stars and the pulse at the end of the line; only the line's own glow stays still.
                    "& .hero-line-glow": { animation: "none", opacity: 0.2 },
                },
                "@media (prefers-reduced-motion: reduce)": {
                    "& .hero-card-glow": { animation: "none", opacity: 0.55 },
                    "& .hero-card-shine, & .hero-number, & .hero-number-aura, & .hero-spark, & .hero-ring, & .hero-line-glow": { animation: "none" },
                    "& .hero-number-aura": { opacity: 0.4 },
                    "& .hero-spark": { opacity: 0.7 },
                    "& .hero-float": { animationName: `${gentleFloat}`, animationDuration: "12s" },
                    "& .hero-halo": { animationDuration: "16s" },
                    "& .hero-signal": { animationDuration: "24s" },
                },
            }}
        >
            <svg viewBox="0 0 520 520" fill="none" focusable="false" aria-hidden="true">
                <defs>
                    <radialGradient id="clinova-hero-glow">
                        <stop stopColor="var(--clinova-color-8ea8e8)" stopOpacity="0.3" />
                        <stop offset="1" stopColor="var(--clinova-color-8ea8e8)" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="clinova-hero-panel" x1="180" y1="175" x2="340" y2="345" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--clinova-color-24344f)" />
                        <stop offset="1" stopColor="var(--clinova-color-101925)" />
                    </linearGradient>
                </defs>

                <circle className="hero-halo" cx="260" cy="260" r="245" fill="url(#clinova-hero-glow)" />
                <circle cx="260" cy="260" r="204" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.12" />
                <circle className="hero-spin" cx="260" cy="260" r="155" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.16" strokeDasharray="3 10" />
                <g className="hero-orbit">
                    <circle cx="260" cy="105" r="9" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.16" />
                    <circle cx="260" cy="105" r="3.2" fill="var(--clinova-color-b8c8ef)" />
                </g>
                <path d="M100 180C150 180 158 220 198 244M328 244C360 210 377 158 415 152M275 333C290 385 335 402 383 398" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.18" />
                <path className="hero-signal" d="M100 180C150 180 158 220 198 244M328 244C360 210 377 158 415 152M275 333C290 385 335 402 383 398" stroke="var(--clinova-color-b8c8ef)" strokeOpacity="0.65" strokeWidth="2" strokeDasharray="5 75" strokeLinecap="round" />

                <g className="hero-d1"><g className="hero-float">
                    <rect x="184" y="184" width="152" height="160" rx="38" fill="var(--clinova-color-050a12)" fillOpacity="0.25" />
                    <rect x="184" y="176" width="152" height="160" rx="38" fill="url(#clinova-hero-panel)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.35" />
                    <rect x="193" y="185" width="134" height="142" rx="31" stroke="var(--clinova-color-b8c8ef)" strokeOpacity="0.07" />
                    <image href={clinovaLogo} style={{ filter: "var(--clinova-logo-filter)" }} x="194" y="225" width="132" height="62" preserveAspectRatio="xMidYMid meet" />
                    <circle cx="260" cy="315" r="2" fill="var(--clinova-color-b8c8ef)" fillOpacity="0.6" />
                </g></g>

                <g className="hero-d2"><g className="hero-float hero-float-delayed">
                    <rect x="47" y="133" width="112" height="92" rx="22" fill="var(--clinova-color-121e30)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.24" />
                    <path d="M81 154H124C128 154 131 157 131 161V180C131 184 128 187 124 187H103L92 196V187H81C77 187 74 184 74 180V161C74 157 77 154 81 154Z" stroke="var(--clinova-color-b8c8ef)" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M87 167H118M87 175H107" stroke="var(--clinova-color-8ea8e8)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M80 211H125" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.2" strokeWidth="3" strokeLinecap="round" />
                </g></g>

                <g className="hero-d3"><g className="hero-float">
                    <rect x="368" y="106" width="100" height="100" rx="24" fill="var(--clinova-color-121e30)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.24" />
                    <rect x="394" y="130" width="48" height="47" rx="8" stroke="var(--clinova-color-b8c8ef)" strokeWidth="2" />
                    <path d="M406 125V135M430 125V135M394 143H442M408 158L416 166L430 152" stroke="var(--clinova-color-b8c8ef)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="418" cy="189" r="2" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.5" />
                </g></g>

                <g className="hero-d2"><g className="hero-float hero-float-delayed">
                    <rect x="321" y="357" width="140" height="84" rx="22" fill="var(--clinova-color-121e30)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.24" />
                    <path d="M343 417H439" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.2" />
                    <rect x="350" y="400" width="10" height="12" rx="3" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.3" />
                    <rect x="370" y="390" width="10" height="22" rx="3" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.45" />
                    <rect x="390" y="378" width="10" height="34" rx="3" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.65" />
                    <path d="M414 399L435 378M420 378H435V393" stroke="var(--clinova-color-b8c8ef)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g></g>

                <circle cx="85" cy="364" r="5" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.5" />
                <circle cx="271" cy="56" r="3" fill="var(--clinova-color-b8c8ef)" fillOpacity="0.65" />
                <circle cx="205" cy="457" r="3" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.4" />
            </svg>

            {/* One client's result: more than $13K in the first 30 days. The chart is a drawing of the idea: flat before Clinova, climbing from day 1. */}
            <Box className="hero-d3" role="note" sx={{ position: "absolute", left: { xs: "-2%", md: "-6%" }, bottom: { xs: "6%", md: "8%" }, width: { xs: 188, md: 232 } }}>
                <Box className="hero-float hero-float-delayed" sx={{ position: "relative" }}>
                    {/* A gold glow around the edge that breathes. */}
                    <Box className="hero-card-glow" aria-hidden="true" sx={{ position: "absolute", inset: "-2px", borderRadius: "20px", boxShadow: "0 0 26px 3px var(--clinova-gold-glow), 0 0 0 1px color-mix(in srgb, var(--clinova-gold) 70%, transparent)" }} />
                    <Box sx={{
                        position: "relative", p: { xs: 1.4, md: 1.75 }, borderRadius: "18px", overflow: "hidden",
                        background: "linear-gradient(150deg, var(--clinova-rgba-26-38-59-0_94), var(--clinova-rgba-11-17-27-0_94))",
                        border: "1px solid color-mix(in srgb, var(--clinova-gold) 55%, transparent)",
                        boxShadow: "0 18px 40px rgba(3, 7, 14, 0.45), 0 0 0 1px rgba(255,255,255,0.03) inset",
                        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                    }}>
                        {/* A band of light that sweeps across the card every few seconds. */}
                        <Box aria-hidden="true" sx={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", pointerEvents: "none" }}>
                            <Box className="hero-card-shine" sx={{ position: "absolute", top: 0, bottom: 0, left: "-55%", width: "55%", transform: "translateX(-130%)" }}>
                                <Box sx={{ position: "absolute", inset: 0, transform: "skewX(-18deg)", background: "linear-gradient(90deg, transparent 0%, rgba(255, 241, 200, 0.05) 25%, rgba(255, 241, 200, 0.22) 50%, rgba(255, 241, 200, 0.05) 75%, transparent 100%)" }} />
                            </Box>
                        </Box>
                        <Box sx={{ position: "relative", display: "flex", alignItems: "center", gap: 0.75, fontSize: { xs: "0.66rem", md: "0.72rem" }, color: "var(--clinova-rgba-245-247-250-0_72)" }}>
                            <Box component="span" sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "var(--clinova-gold)", boxShadow: "0 0 10px var(--clinova-gold-glow)", flexShrink: 0 }} />
                            {t("من نتائج عملائنا")}
                        </Box>
                        <Box sx={{ position: "relative", mt: 0.5 }}>
                            <Box className="hero-number-aura" aria-hidden="true" sx={{ position: "absolute", left: "-6%", top: "-10%", width: "75%", height: "120%", borderRadius: "50%", background: "radial-gradient(closest-side, var(--clinova-gold-glow), transparent)", opacity: 0.25 }} />
                            <Box component="bdi" dir="ltr" sx={{ position: "relative", display: "block", fontSize: { xs: "1.9rem", md: "2.35rem" }, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", fontFamily: '"Plus Jakarta Sans", var(--clinova-font-family)', textAlign: "start", color: "#fff1c8" }}>
                                <Box component="span" className="hero-number"><CountUp value="+$13K" duration={1600} /></Box>
                            </Box>
                            {/* Stars that twinkle around the number. */}
                            {[{ top: "-14%", left: "62%", size: 11, delay: "0.4s" }, { top: "58%", left: "78%", size: 8, delay: "1.2s" }, { top: "-6%", left: "92%", size: 7, delay: "1.9s" }].map((star) => (
                                <Box key={star.left} component="svg" className="hero-spark" viewBox="0 0 24 24" aria-hidden="true" sx={{ position: "absolute", top: star.top, left: star.left, width: star.size, height: star.size, animationDelay: star.delay }}>
                                    <path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" fill="#fff1c8" />
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ position: "relative", mt: 0.25, fontSize: { xs: "0.7rem", md: "0.78rem" }, lineHeight: 1.5, color: "var(--clinova-color-f5f7fa)" }}>
                            {t("لعيادة واحدة خلال أول 30 يوماً")}
                        </Box>
                        {/* Flat line before day 1, the start point, then the climb to day 30; the last point is the result. */}
                        <Box component="svg" viewBox="0 0 200 44" aria-hidden="true" sx={{ position: "relative", display: "block", width: "100%", height: { xs: 34, md: 42 }, mt: 1, overflow: "visible" }}>
                            <defs>
                                <linearGradient id="clinova-hero-result-fill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0" stopColor="var(--clinova-gold)" stopOpacity="0.34" />
                                    <stop offset="1" stopColor="var(--clinova-gold)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path className="hero-before-line" d="M2 34 H76" stroke="var(--clinova-rgba-245-247-250-0_42)" strokeWidth="2" strokeLinecap="round" fill="none" pathLength="1" />
                            <path className="hero-result-fill" d="M76 34 C94 33 108 30 126 25 S160 14 178 9 S192 5 196 4 L196 44 L76 44 Z" fill="url(#clinova-hero-result-fill)" />
                            <path className="hero-line-glow" d="M76 34 C94 33 108 30 126 25 S160 14 178 9 S192 5 196 4" stroke="var(--clinova-gold)" strokeWidth="7" strokeLinecap="round" fill="none" />
                            <path className="hero-result-line" d="M76 34 C94 33 108 30 126 25 S160 14 178 9 S192 5 196 4" stroke="var(--clinova-gold)" strokeWidth="2.2" strokeLinecap="round" fill="none" pathLength="1" />
                            <g className="hero-start">
                                <path d="M76 6V42" stroke="var(--clinova-gold)" strokeOpacity="0.4" strokeDasharray="2 3" />
                                <circle cx="76" cy="34" r="3.2" fill="var(--clinova-color-101925)" stroke="var(--clinova-gold)" strokeWidth="1.6" />
                            </g>
                            <g className="hero-end">
                                <circle className="hero-ring" cx="196" cy="4" r="3.5" fill="none" stroke="var(--clinova-gold)" strokeWidth="1.4" />
                                <circle cx="196" cy="4" r="3.8" fill="#fff1c8" stroke="var(--clinova-gold)" strokeWidth="1.5" />
                            </g>
                        </Box>
                        <Box sx={{ position: "relative", height: "0.9rem", mt: 0.25, fontSize: "0.6rem", color: "var(--clinova-rgba-245-247-250-0_42)", direction: "ltr", whiteSpace: "nowrap" }}>
                            <Box component="span" sx={{ position: "absolute", left: 0 }}>{t("قبل كلينوفا")}</Box>
                            <Box component="span" sx={{ position: "absolute", left: "38%", transform: "translateX(-50%)", color: "var(--clinova-gold)" }}>{t("اليوم 1")}</Box>
                            <Box component="span" sx={{ position: "absolute", right: 0 }}>{t("اليوم 30")}</Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
