import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import clinovaLogo from "../../../public/logo/logo.png";

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

/** Decorative illustration: no timers, network requests, or live metrics. */
export default function HeroVisual() {
    return (
        <Box
            aria-hidden="true"
            sx={{
                width: "100%",
                maxWidth: { xs: 350, md: 440, lg: 520 },
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
                "@media (prefers-reduced-motion: reduce)": {
                    "& .hero-float": { animationName: `${gentleFloat}`, animationDuration: "12s" },
                    "& .hero-halo": { animationDuration: "16s" },
                    "& .hero-signal": { animationDuration: "24s" },
                },
            }}
        >
            <svg viewBox="0 0 520 520" fill="none" focusable="false">
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
                <circle cx="260" cy="260" r="155" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.16" strokeDasharray="3 10" />
                <path d="M100 180C150 180 158 220 198 244M328 244C360 210 377 158 415 152M275 333C290 385 335 402 383 398" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.18" />
                <path className="hero-signal" d="M100 180C150 180 158 220 198 244M328 244C360 210 377 158 415 152M275 333C290 385 335 402 383 398" stroke="var(--clinova-color-b8c8ef)" strokeOpacity="0.65" strokeWidth="2" strokeDasharray="5 75" strokeLinecap="round" />

                <g className="hero-float">
                    <rect x="184" y="184" width="152" height="160" rx="38" fill="var(--clinova-color-050a12)" fillOpacity="0.25" />
                    <rect x="184" y="176" width="152" height="160" rx="38" fill="url(#clinova-hero-panel)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.35" />
                    <rect x="193" y="185" width="134" height="142" rx="31" stroke="var(--clinova-color-b8c8ef)" strokeOpacity="0.07" />
                    <image href={clinovaLogo} style={{ filter: "var(--clinova-logo-filter)" }} x="194" y="225" width="132" height="62" preserveAspectRatio="xMidYMid meet" />
                    <circle cx="260" cy="315" r="2" fill="var(--clinova-color-b8c8ef)" fillOpacity="0.6" />
                </g>

                <g className="hero-float hero-float-delayed">
                    <rect x="47" y="133" width="112" height="92" rx="22" fill="var(--clinova-color-121e30)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.24" />
                    <path d="M81 154H124C128 154 131 157 131 161V180C131 184 128 187 124 187H103L92 196V187H81C77 187 74 184 74 180V161C74 157 77 154 81 154Z" stroke="var(--clinova-color-b8c8ef)" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M87 167H118M87 175H107" stroke="var(--clinova-color-8ea8e8)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M80 211H125" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.2" strokeWidth="3" strokeLinecap="round" />
                </g>

                <g className="hero-float">
                    <rect x="368" y="106" width="100" height="100" rx="24" fill="var(--clinova-color-121e30)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.24" />
                    <rect x="394" y="130" width="48" height="47" rx="8" stroke="var(--clinova-color-b8c8ef)" strokeWidth="2" />
                    <path d="M406 125V135M430 125V135M394 143H442M408 158L416 166L430 152" stroke="var(--clinova-color-b8c8ef)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="418" cy="189" r="2" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.5" />
                </g>

                <g className="hero-float hero-float-delayed">
                    <rect x="321" y="357" width="140" height="84" rx="22" fill="var(--clinova-color-121e30)" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.24" />
                    <path d="M343 417H439" stroke="var(--clinova-color-8ea8e8)" strokeOpacity="0.2" />
                    <rect x="350" y="400" width="10" height="12" rx="3" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.3" />
                    <rect x="370" y="390" width="10" height="22" rx="3" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.45" />
                    <rect x="390" y="378" width="10" height="34" rx="3" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.65" />
                    <path d="M414 399L435 378M420 378H435V393" stroke="var(--clinova-color-b8c8ef)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                <circle cx="85" cy="364" r="5" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.5" />
                <circle cx="271" cy="56" r="3" fill="var(--clinova-color-b8c8ef)" fillOpacity="0.65" />
                <circle cx="205" cy="457" r="3" fill="var(--clinova-color-8ea8e8)" fillOpacity="0.4" />
            </svg>
        </Box>
    );
}
