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

/** Decorative patient journey, independent of language and live patient data. */
export default function PatientJourneyVisual() {
    return (
        <Box
            aria-hidden="true"
            sx={{
                width: "100%",
                maxWidth: { xs: 320, sm: 400, lg: 500 },
                aspectRatio: "500 / 420",
                mx: "auto",
                pointerEvents: "none",
                "& svg": { display: "block", width: "100%", height: "100%" },
                "& .journey-card": { animation: `${drift} 7s ease-in-out infinite` },
                "& .journey-card-middle": { animationDelay: "-2.3s" },
                "& .journey-card-last": { animationDelay: "-4.6s" },
                "& .journey-signal": { animation: `${signal} 9s linear infinite` },
                "& .journey-glow": { animation: `${pulse} 6s ease-in-out infinite` },
                "& .journey-step": { animation: `${stepPulse} 6s ease-in-out infinite` },
                "@media (prefers-reduced-motion: reduce)": {
                    "& .journey-card": { animationName: `${gentleDrift}`, animationDuration: "12s" },
                    "& .journey-signal": { animationDuration: "18s" },
                    "& .journey-glow, & .journey-step": { animationDuration: "10s" },
                },
            }}
        >
            <svg viewBox="0 0 500 420" fill="none" focusable="false">
                <defs>
                    <radialGradient id="clinova-journey-glow">
                        <stop stopColor="#8EA8E8" stopOpacity="0.2" />
                        <stop offset="1" stopColor="#8EA8E8" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="clinova-journey-panel" x1="0" y1="0" x2="1" y2="1">
                        <stop stopColor="#1D2B42" />
                        <stop offset="1" stopColor="#101925" />
                    </linearGradient>
                </defs>
                <ellipse cx="250" cy="215" rx="245" ry="200" fill="url(#clinova-journey-glow)" />
                <path d="M85 237C85 162 150 132 242 132S415 180 415 237" stroke="#8EA8E8" strokeOpacity="0.18" strokeWidth="2" />
                <path className="journey-signal" d="M85 237C85 162 150 132 242 132S415 180 415 237" stroke="#BDCEF5" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 94" />
                <path d="M85 297C175 352 324 352 415 297" stroke="#8EA8E8" strokeOpacity="0.12" strokeDasharray="3 8" />

                <g className="journey-card">
                    <rect x="25" y="222" width="124" height="108" rx="25" fill="url(#clinova-journey-panel)" stroke="#8EA8E8" strokeOpacity="0.3" />
                    <path d="M62 247H111A8 8 0 0 1 119 255V279A8 8 0 0 1 111 287H87L73 298V287H62A8 8 0 0 1 54 279V255A8 8 0 0 1 62 247Z" stroke="#BDCEF5" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M67 262H105M67 272H92" stroke="#8EA8E8" strokeWidth="3" strokeLinecap="round" />
                    <circle className="journey-glow" cx="130" cy="237" r="4" fill="#8EA8E8" />
                </g>

                <g className="journey-card journey-card-middle">
                    <rect x="177" y="66" width="146" height="160" rx="29" fill="url(#clinova-journey-panel)" stroke="#8EA8E8" strokeOpacity="0.35" />
                    <circle cx="250" cy="122" r="27" fill="#8EA8E8" fillOpacity="0.09" />
                    <circle cx="250" cy="114" r="10" stroke="#BDCEF5" strokeWidth="2" />
                    <path d="M232 141V137C232 129 240 125 250 125S268 129 268 137V141" stroke="#BDCEF5" strokeWidth="2" strokeLinecap="round" />
                    <path d="M209 172H267M209 187H249" stroke="#8EA8E8" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="284" cy="180" r="13" fill="#8EA8E8" fillOpacity="0.14" />
                    <path d="M278 180L282 184L290 175" stroke="#BDCEF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                <g className="journey-card journey-card-last">
                    <rect x="351" y="222" width="124" height="108" rx="25" fill="url(#clinova-journey-panel)" stroke="#8EA8E8" strokeOpacity="0.3" />
                    <rect x="386" y="247" width="55" height="57" rx="9" stroke="#BDCEF5" strokeWidth="2" />
                    <path d="M399 241V253M428 241V253M387 264H440M401 282L409 290L426 274" stroke="#BDCEF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle className="journey-glow" cx="456" cy="237" r="4" fill="#8EA8E8" />
                </g>

                <path d="M166 353H334" stroke="#8EA8E8" strokeOpacity="0.2" />
                {[166, 250, 334].map((x, index) => (
                    <g key={x}>
                        <circle cx={x} cy="353" r="9" fill="#121E30" stroke="#8EA8E8" strokeOpacity="0.5" />
                        <circle className="journey-step" cx={x} cy="353" r="3" fill="#BDCEF5" style={{ animationDelay: `${index * -1.2}s` }} />
                    </g>
                ))}
            </svg>
        </Box>
    );
}
