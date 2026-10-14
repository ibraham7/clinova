import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { useEffect, useId, useRef, useState } from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import { countryBoundaries, coverageLocations } from "./coverageData";

const pulse = keyframes`
    0%, 65%, 100% { opacity: 0.12; transform: scale(0.8); }
    25%, 40% { opacity: 0.8; transform: scale(1.3); }
`;

export const coverageLight = keyframes`
    0%, 65%, 100% { opacity: 0.25; }
    25%, 40% { opacity: 1; }
`;

const ripple = keyframes`
    from { opacity: 0.85; transform: scale(0.6); }
    to { opacity: 0; transform: scale(3.2); }
`;

const flow = keyframes`
    to { stroke-dashoffset: -28; }
`;

const draw = keyframes`
    from { stroke-dashoffset: 1; fill-opacity: 0; }
    60% { fill-opacity: 0; }
`;

const pinIn = keyframes`
    from { opacity: 0; transform: scale(0); }
    70% { transform: scale(1.25); }
`;

const scan = keyframes`
    0% { transform: translateY(-80px); opacity: 0; }
    10%, 85% { opacity: 1; }
    100% { transform: translateY(600px); opacity: 0; }
`;

const regionGlow = keyframes`
    0%, 65%, 100% { fill: var(--clinova-rgba-142-168-232-0_08); }
    25%, 40% { fill: var(--clinova-rgba-142-168-232-0_3); }
`;

// Network links drawn as gentle arcs between the covered countries.
const links = [["TUR", "SYR"], ["SYR", "KWT"], ["SYR", "SAU"], ["KWT", "SAU"], ["KWT", "QAT"], ["SAU", "QAT"], ["QAT", "ARE"], ["SAU", "ARE"], ["TUR", "KWT"]] as const;
const locationByCode = Object.fromEntries(coverageLocations.map((location) => [location.code, location]));

function arc(from: string, to: string) {
    const a = locationByCode[from];
    const b = locationByCode[to];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const bend = 0.22;
    return `M${a.x},${a.y} Q${mx - dy * bend},${my + dx * bend} ${b.x},${b.y}`;
}

function canAnimate() {
    return typeof window !== "undefined" && typeof IntersectionObserver !== "undefined"
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Interactive coverage map: hovering a country (or its card) lights it up and dims the rest. */
export default function CoverageMap({ focus, onFocus }: { focus: string | null; onFocus: (code: string | null) => void }) {
    const { t } = useSiteTranslation();
    const titleId = useId();
    const ref = useRef<SVGSVGElement>(null);
    const [drawn, setDrawn] = useState(() => !canAnimate());

    useEffect(() => {
        if (drawn || !ref.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry?.isIntersecting) return;
            observer.disconnect();
            setDrawn(true);
        }, { threshold: 0.35 });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [drawn]);

    const activeCodes = new Set<string>(coverageLocations.map((location) => location.code));

    return (
        <Box
            component="svg"
            ref={ref}
            viewBox="0 0 600 560"
            role="img"
            aria-labelledby={titleId}
            focusable="false"
            className={[drawn ? "is-drawn" : "is-waiting", focus ? "has-focus" : ""].join(" ")}
            sx={{
                position: "absolute",
                width: "94%",
                height: "94%",
                left: "3%",
                top: "3%",
                direction: "ltr",
                overflow: "visible",
                "& .coverage-pulse": {
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    animation: `${pulse} 5s ease-in-out infinite`,
                },
                "& .coverage-light": {
                    animation: `${coverageLight} 5s ease-in-out infinite`,
                    filter: "drop-shadow(0 0 4px var(--clinova-color-8ea8e8))",
                },
                "& .coverage-region": { animation: `${regionGlow} 5s ease-in-out infinite` },
                "& .coverage-regions, & .coverage-location, & .coverage-link": { transition: "opacity 600ms ease" },
                "&.has-focus .coverage-regions": { opacity: 0.55 },
                "&.has-focus .coverage-location:not(.is-focus)": { opacity: 0.4 },
                "& .coverage-hit": { cursor: "pointer" },
                "& .coverage-highlight": {
                    opacity: 0,
                    pointerEvents: "none",
                    transition: "opacity 600ms ease",
                    filter: "drop-shadow(0 0 10px var(--clinova-rgba-142-168-232-0_6))",
                },
                "& .coverage-highlight.is-focus": { opacity: 1 },
                "& .coverage-link-base": { transition: "stroke 600ms ease, opacity 600ms ease" },
                "& .coverage-link-flow": {
                    strokeDasharray: "3 11",
                    animation: `${flow} 1.6s linear infinite`,
                    transition: "stroke 600ms ease, opacity 600ms ease",
                },
                "&.has-focus .coverage-link:not(.is-focus)": { opacity: 0.25 },
                "& .coverage-link.is-focus .coverage-link-base": { stroke: "var(--clinova-rgba-142-168-232-0_6)" },
                "& .coverage-link.is-focus .coverage-link-flow": { stroke: "var(--clinova-color-dce6ff)", animationDuration: "0.9s" },
                "& .coverage-pin, & .coverage-label": {
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                },
                "& .coverage-location.is-focus .coverage-pin": { transform: "scale(1.45)" },
                "& .coverage-location.is-focus .coverage-label": { transform: "scale(1.1)" },
                "& .coverage-label rect": { transition: "stroke 500ms ease, fill-opacity 500ms ease" },
                "& .coverage-location.is-focus .coverage-label rect": { stroke: "var(--clinova-color-8ea8e8)", fillOpacity: 1 },
                "& .coverage-ripple": { opacity: 0, transformBox: "fill-box", transformOrigin: "center" },
                "& .coverage-location.is-focus .coverage-ripple": { animation: `${ripple} 1.8s ease-out infinite` },
                "& .coverage-location.is-focus .coverage-ripple + .coverage-ripple": { animationDelay: "0.9s" },
                "& .coverage-scan": { animation: `${scan} 7s linear infinite`, pointerEvents: "none" },
                "&.is-waiting .coverage-country, &.is-waiting .coverage-location, &.is-waiting .coverage-link, &.is-waiting .coverage-scan": { visibility: "hidden" },
                "&.is-drawn .coverage-country": {
                    strokeDasharray: 1,
                    animation: `${draw} 1.8s ease-out both`,
                },
                "&.is-drawn .coverage-country.coverage-region": {
                    animation: `${draw} 1.8s ease-out both, ${regionGlow} 5s ease-in-out 1.8s infinite`,
                },
                "&.is-drawn .coverage-location": { animation: `${pinIn} 700ms cubic-bezier(0.22, 1, 0.36, 1) backwards`, transformBox: "fill-box", transformOrigin: "center" },
                "&.is-drawn .coverage-link": { animation: `${pinIn} 900ms ease backwards` },
                "@media (prefers-reduced-motion: reduce)": {
                    "& .coverage-pulse, & .coverage-light, & .coverage-region, & .coverage-link-flow, & .coverage-scan, & .coverage-location.is-focus .coverage-ripple": { animation: "none" },
                    "& .coverage-scan": { display: "none" },
                },
            }}
        >
            <title id={titleId}>
                {t("Clinova coverage: Türkiye, Syria, Saudi Arabia, UAE, Qatar and Kuwait")}
                        </title>
            <defs>
                <linearGradient id={`${titleId}-scan`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--clinova-color-8ea8e8)" stopOpacity="0" />
                    <stop offset="0.85" stopColor="var(--clinova-color-8ea8e8)" stopOpacity="0.06" />
                    <stop offset="1" stopColor="var(--clinova-color-b8c8ef)" stopOpacity="0.32" />
                </linearGradient>
            </defs>
            <g className="coverage-regions">
                {countryBoundaries.map((country, order) => {
                    const activeIndex = coverageLocations.findIndex((location) => location.code === country.code);
                    const active = activeIndex >= 0;
                    return (
                        <path
                            key={country.code}
                            className={active ? "coverage-country coverage-region" : "coverage-country"}
                            style={active ? { animationDelay: `${order * 0.06}s, ${activeIndex * -0.8}s` } : { animationDelay: `${order * 0.06}s` }}
                            d={country.path}
                            pathLength={1}
                            fill={active ? "var(--clinova-rgba-142-168-232-0_18)" : "var(--clinova-rgba-142-168-232-0_035)"}
                            stroke={active ? "var(--clinova-rgba-142-168-232-0_65)" : "var(--clinova-rgba-142-168-232-0_18)"}
                            strokeWidth={active ? 1.3 : 0.8}
                            strokeLinejoin="round"
                            fillRule="evenodd"
                            onPointerEnter={active ? undefined : () => onFocus(null)}
                        />
                    );
                })}
            </g>
            {countryBoundaries.filter((country) => activeCodes.has(country.code)).map((country) => (
                <path
                    key={`${country.code}-highlight`}
                    className={focus === country.code ? "coverage-highlight is-focus" : "coverage-highlight"}
                    d={country.path}
                    fill="var(--clinova-rgba-142-168-232-0_4)"
                    stroke="var(--clinova-color-b8c8ef)"
                    strokeWidth={1.8}
                    strokeLinejoin="round"
                    fillRule="evenodd"
                />
            ))}
            {countryBoundaries.filter((country) => activeCodes.has(country.code)).map((country) => (
                <path
                    key={`${country.code}-hit`}
                    className="coverage-hit"
                    d={country.path}
                    fill="transparent"
                    fillRule="evenodd"
                    onPointerEnter={() => onFocus(country.code)}
                    onClick={() => onFocus(country.code)}
                />
            ))}
            {links.map(([from, to], index) => {
                const linked = focus === from || focus === to;
                const d = arc(from, to);
                return (
                    <g key={`${from}-${to}`} className={linked ? "coverage-link is-focus" : "coverage-link"} style={{ animationDelay: `${1.2 + index * 0.08}s` }} pointerEvents="none">
                        <path className="coverage-link-base" d={d} fill="none" stroke="var(--clinova-rgba-142-168-232-0_2)" strokeWidth="1" />
                        <path className="coverage-link-flow" d={d} fill="none" stroke="var(--clinova-rgba-184-200-239-0_35)" strokeWidth="1.6" strokeLinecap="round" style={{ animationDelay: `${index * -0.35}s` }} />
                    </g>
                );
            })}
            <rect className="coverage-scan" x="-300" y="0" width="1200" height="80" fill={`url(#${titleId}-scan)`} />
            {coverageLocations.map((location, index) => {
                const labelWidth = location.name.length * 8 + 28;
                const labelX = Math.min(600 - labelWidth - 8, location.x + location.dx - (location.dx > 30 ? 0 : labelWidth / 2));
                const focused = focus === location.code;
                return (
                <g
                    key={location.code}
                    className={focused ? "coverage-location is-focus" : "coverage-location"}
                    style={{ animationDelay: `${1 + index * 0.12}s` }}
                    onPointerEnter={() => onFocus(location.code)}
                    onClick={() => onFocus(location.code)}
                    cursor="pointer"
                >
                    <circle className="coverage-ripple" cx={location.x} cy={location.y} r="8" fill="none" stroke="var(--clinova-color-b8c8ef)" strokeWidth="1" />
                    <circle className="coverage-ripple" cx={location.x} cy={location.y} r="8" fill="none" stroke="var(--clinova-color-b8c8ef)" strokeWidth="1" />
                    <circle
                        className="coverage-pulse"
                        cx={location.x}
                        cy={location.y}
                        r="11"
                        fill="var(--clinova-rgba-142-168-232-0_15)"
                        stroke="var(--clinova-color-8ea8e8)"
                        strokeWidth="0.8"
                        style={{ animationDelay: `${index * -0.8}s` }}
                    />
                    <g className="coverage-pin">
                        <circle className="coverage-light" cx={location.x} cy={location.y} r="3.5" fill="var(--clinova-color-dce6ff)" style={{ animationDelay: `${index * -0.8}s` }} />
                    </g>
                    {Math.abs(location.dx) > 30 && (
                        <path
                            d={`M${location.x + 7},${location.y}L${location.x + location.dx - 8},${location.y + location.dy - 4}`}
                            stroke="var(--clinova-rgba-184-200-239-0_35)"
                            strokeWidth="1"
                        />
                    )}
                    <g transform={`translate(${labelX}, ${location.y + location.dy})`}>
                        <g className="coverage-label">
                            <rect x="-3" y="-17" width={labelWidth + 6} height="24" rx="5" fill="var(--clinova-color-0d1623)" fillOpacity="0.85" stroke="transparent" />
                            <image href={location.flag} x="0" y="-12" width="20" height="15" aria-hidden="true" />
                            <text x="27" y="0" textAnchor="start" fill="var(--clinova-color-dce6ff)" fontSize="14" fontWeight="500" fontFamily="Plus Jakarta Sans, sans-serif">
                                {t(location.name)}
                            </text>
                        </g>
                    </g>
                </g>
            );
            })}
        </Box>
    );
}
