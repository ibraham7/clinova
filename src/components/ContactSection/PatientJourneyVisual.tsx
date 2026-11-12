import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";

const drift = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
`;
const gentleDrift = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
`;
const stepPulse = keyframes`
    0%, 65%, 100% { opacity: 0.35; }
    25%, 40% { opacity: 1; }
`;
const signal = keyframes`
    to { stroke-dashoffset: -200; }
`;
const pulse = keyframes`
    0%, 100% { opacity: 0.35; }
    50% { opacity: 0.8; }
`;
const ripple = keyframes`
    from { opacity: 0.7; transform: scale(1); }
    to { opacity: 0; transform: scale(5.5); }
`;
const typing = keyframes`
    0%, 100% { transform: scaleX(0.25); }
    45%, 70% { transform: scaleX(1); }
`;
const tick = keyframes`
    0%, 12% { stroke-dashoffset: 24; }
    38%, 86% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 24; }
`;
const halo = keyframes`
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.18); }
`;
const spin = keyframes`
    to { transform: rotate(360deg); }
`;
const fillLine = keyframes`
    0% { stroke-dashoffset: 168; }
    55%, 85% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -168; }
`;
const twinkle = keyframes`
    0%, 100% { opacity: 0.15; transform: scale(0.6); }
    50% { opacity: 0.95; transform: scale(1.4); }
`;

const arc = "M85 237C85 162 150 132 242 132S415 180 415 237";
const lowerArc = "M85 297C175 352 324 352 415 297";

/** Decorative patient journey, independent of language and live patient data. */
export default function PatientJourneyVisual() {
    const svg = useRef<SVGSVGElement>(null);
    // The travelling lights are SMIL animations: pause them with reduced motion and while the picture is off screen.
    useEffect(() => {
        const element = svg.current;
        if (!element || typeof element.pauseAnimations !== "function") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { element.pauseAnimations(); return; }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry?.isIntersecting) element.unpauseAnimations(); else element.pauseAnimations();
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <Box
            aria-hidden="true"
            sx={{
                width: "100%",
                maxWidth: { xs: 320, sm: 400, lg: 500 },
                aspectRatio: "500 / 420",
                mx: "auto",
                pointerEvents: "none",
                "& svg": { display: "block", width: "100%", height: "100%", overflow: "visible" },
                "& .journey-card": { animation: `${drift} 7s ease-in-out infinite` },
                "& .journey-card-middle": { animationDelay: "-2.3s" },
                "& .journey-card-last": { animationDelay: "-4.6s" },
                "& .journey-signal": { animation: `${signal} 9s linear infinite` },
                "& .journey-glow": { animation: `${pulse} 6s ease-in-out infinite` },
                "& .journey-step": { animation: `${stepPulse} 6s ease-in-out infinite` },
                "& .journey-ripple": { transformBox: "fill-box", transformOrigin: "center", animation: `${ripple} 3s ease-out infinite` },
                "& .journey-type": { transformBox: "fill-box", transformOrigin: "0 50%", animation: `${typing} 3.6s ease-in-out infinite` },
                "& .journey-tick": { strokeDasharray: 24, animation: `${tick} 4.2s ease-in-out infinite` },
                "& .journey-halo": { transformBox: "fill-box", transformOrigin: "center", animation: `${halo} 4s ease-in-out infinite` },
                "& .journey-ring": { transformBox: "fill-box", transformOrigin: "center", animation: `${spin} 70s linear infinite` },
                "& .journey-fill": { strokeDasharray: 168, animation: `${fillLine} 6s ease-in-out infinite` },
                "& .journey-spark": { transformBox: "fill-box", transformOrigin: "center", animation: `${twinkle} 3.4s ease-in-out infinite` },
                "@media (prefers-reduced-motion: reduce)": {
                    "& .journey-card": { animationName: `${gentleDrift}`, animationDuration: "12s" },
                    "& .journey-signal": { animationDuration: "18s" },
                    "& .journey-glow, & .journey-step": { animationDuration: "10s" },
                    "& .journey-ripple, & .journey-type, & .journey-halo, & .journey-ring, & .journey-fill, & .journey-spark": { animation: "none" },
                    "& .journey-tick": { animation: "none", strokeDashoffset: 0 },
                    "& .journey-fill": { strokeDashoffset: 0 },
                },
            }}
        >
            <svg ref={svg} viewBox="0 0 500 420" fill="none" focusable="false">
                <defs>
                    <radialGradient id="clinova-journey-glow">
                        <stop stopColor="var(--clinova-color-8ea8e8)" stopOpacity="0.2" />
                        <stop offset="1" stopColor="var(--clinova-color-8ea8e8)" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="clinova-journey-panel" x1="0" y1="0" x2="1" y2="1">
                        <stop stopColor="var(--clinova-color-1d2b42)" />
                        <stop offset="1" stopColor="var(--clinova-color-101925)" />
                    </linearGradient>
                    <path id="clinova-journey-arc" d={arc} />
                    <path id="clinova-journey-lower" d={lowerArc} />
                </defs>
                <ellipse className="journey-glow" cx="250" cy="215" rx="245" ry="200" fill="url(#clinova-journey-glow)" />
                <circle className="journey-ring" cx="250" cy="215" r="196" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.14" strokeDasharray="3 11" />

                <path d={arc} stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.18" strokeWidth="2" />
                <path className="journey-signal" d={arc} stroke="var(--clinova-color-bdcef5)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 94" />
                <path d={lowerArc} stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.12" strokeDasharray="3 8" />

                {/* Lights travelling the journey: a comet along the arc, packets along the lower curve. */}
                {[0, 0.16, 0.32].map((lag, index) => (
                    <circle key={lag} r={4 - index * 1.1} fill="var(--clinova-color-dce6ff)" opacity={1 - index * 0.32}>
                        <animateMotion dur="5.5s" begin={`${lag}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1">
                            <mpath href="#clinova-journey-arc" />
                        </animateMotion>
                    </circle>
                ))}
                {[0, -2, -4].map((begin) => (
                    <rect key={begin} x="-7" y="-4" width="14" height="8" rx="3" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.8">
                        <animateMotion dur="6s" begin={`${begin}s`} repeatCount="indefinite" rotate="auto">
                            <mpath href="#clinova-journey-lower" />
                        </animateMotion>
                    </rect>
                ))}

                <g className="journey-card">
                    <rect x="25" y="222" width="124" height="108" rx="25" fill="url(#clinova-journey-panel)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.3" />
                    <path d="M62 247H111A8 8 0 0 1 119 255V279A8 8 0 0 1 111 287H87L73 298V287H62A8 8 0 0 1 54 279V255A8 8 0 0 1 62 247Z" stroke="var(--clinova-color-bdcef5)" strokeWidth="2" strokeLinejoin="round" />
                    <path className="journey-type" d="M67 262H105" stroke="var(--clinova-color-8ea8e8)" strokeWidth="3" strokeLinecap="round" />
                    <path className="journey-type" style={{ animationDelay: "-1.2s" }} d="M67 272H92" stroke="var(--clinova-color-8ea8e8)" strokeWidth="3" strokeLinecap="round" />
                    <circle className="journey-ripple" cx="130" cy="237" r="4" stroke="var(--clinova-color-8ea8e8)" />
                    <circle className="journey-glow" cx="130" cy="237" r="4" fill="var(--clinova-color-8ea8e8)" />
                </g>

                <g className="journey-card journey-card-middle">
                    <rect x="177" y="66" width="146" height="160" rx="29" fill="url(#clinova-journey-panel)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.35" />
                    <circle className="journey-halo" cx="250" cy="122" r="27" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.09" />
                    <circle cx="250" cy="114" r="10" stroke="var(--clinova-color-bdcef5)" strokeWidth="2" />
                    <path d="M232 141V137C232 129 240 125 250 125S268 129 268 137V141" stroke="var(--clinova-color-bdcef5)" strokeWidth="2" strokeLinecap="round" />
                    <path className="journey-type" d="M209 172H267" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />
                    <path className="journey-type" style={{ animationDelay: "-0.9s" }} d="M209 187H249" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />
                    <circle className="journey-ripple" cx="284" cy="180" r="13" stroke="var(--clinova-color-8ea8e8)" style={{ animationDelay: "-1.5s" }} />
                    <circle cx="284" cy="180" r="13" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.14" />
                    <path className="journey-tick" d="M278 180L282 184L290 175" stroke="var(--clinova-color-bdcef5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                <g className="journey-card journey-card-last">
                    <rect x="351" y="222" width="124" height="108" rx="25" fill="url(#clinova-journey-panel)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.3" />
                    <rect x="386" y="247" width="55" height="57" rx="9" stroke="var(--clinova-color-bdcef5)" strokeWidth="2" />
                    <path d="M399 241V253M428 241V253M387 264H440" stroke="var(--clinova-color-bdcef5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path className="journey-tick" style={{ animationDelay: "-2s" }} d="M401 282L409 290L426 274" stroke="var(--clinova-color-bdcef5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle className="journey-ripple" cx="456" cy="237" r="4" stroke="var(--clinova-color-8ea8e8)" style={{ animationDelay: "-1s" }} />
                    <circle className="journey-glow" cx="456" cy="237" r="4" fill="var(--clinova-color-8ea8e8)" />
                </g>

                <path d="M166 353H334" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.2" />
                <path className="journey-fill" d="M166 353H334" stroke="var(--clinova-color-bdcef5)" strokeWidth="2" strokeLinecap="round" />
                {[166, 250, 334].map((x, index) => (
                    <g key={x}>
                        <circle cx={x} cy="353" r="9" fill="var(--clinova-color-121e30)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.5" />
                        <circle className="journey-step" cx={x} cy="353" r="3" fill="var(--clinova-color-bdcef5)" style={{ animationDelay: `${index * -1.2}s` }} />
                    </g>
                ))}

                {[[60, 120], [440, 110], [110, 395], [405, 385], [250, 25]].map(([x, y], index) => (
                    <circle key={`${x}-${y}`} className="journey-spark" cx={x} cy={y} r="2.5" fill="var(--clinova-color-bdcef5)" style={{ animationDelay: `${index * -0.7}s` }} />
                ))}
            </svg>
        </Box>
    );
}
