import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { useId } from "react";
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

const regionGlow = keyframes`
    0%, 65%, 100% { fill: var(--clinova-rgba-142-168-232-0_08); }
    25%, 40% { fill: var(--clinova-rgba-142-168-232-0_3); }
`;

export default function CoverageMap() {
    const { t } = useSiteTranslation();

    const titleId = useId();

    return (
        <Box
            component="svg"
            viewBox="0 0 600 560"
            role="img"
            aria-labelledby={titleId}
            focusable="false"
            sx={{
                position: "absolute",
                width: "94%",
                height: "94%",
                left: "3%",
                top: "3%",
                direction: "ltr",
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
                "@media (prefers-reduced-motion: reduce)": {
                    "& .coverage-pulse, & .coverage-light, & .coverage-region": { animation: "none" },
                },
            }}
        >
            <title id={titleId}>
                {t("Clinova coverage: Türkiye, Syria, Saudi Arabia, UAE, Qatar and Kuwait")}
                        </title>
            {countryBoundaries.map((country) => {
                const activeIndex = coverageLocations.findIndex((location) => location.code === country.code);
                const active = activeIndex >= 0;
                return (
                    <path
                        key={country.code}
                        className={active ? "coverage-region" : undefined}
                        style={active ? { animationDelay: `${activeIndex * -0.8}s` } : undefined}
                        d={country.path}
                        fill={active ? "var(--clinova-rgba-142-168-232-0_18)" : "var(--clinova-rgba-142-168-232-0_035)"}
                        stroke={active ? "var(--clinova-rgba-142-168-232-0_65)" : "var(--clinova-rgba-142-168-232-0_18)"}
                        strokeWidth={active ? 1.3 : 0.8}
                        strokeLinejoin="round"
                        fillRule="evenodd"
                    />
                );
            })}
            {coverageLocations.map((location, index) => {
                const labelWidth = location.name.length * 8 + 28;
                const labelX = Math.min(600 - labelWidth - 8, location.x + location.dx - (location.dx > 30 ? 0 : labelWidth / 2));
                return (
                <g key={location.code}>
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
                    <circle className="coverage-light" cx={location.x} cy={location.y} r="3.5" fill="var(--clinova-color-dce6ff)" style={{ animationDelay: `${index * -0.8}s` }} />
                    {Math.abs(location.dx) > 30 && (
                        <path
                            d={`M${location.x + 7},${location.y}L${location.x + location.dx - 8},${location.y + location.dy - 4}`}
                            stroke="var(--clinova-rgba-184-200-239-0_35)"
                            strokeWidth="1"
                        />
                    )}
                    <g transform={`translate(${labelX}, ${location.y + location.dy})`}>
                        <rect x="-3" y="-17" width={labelWidth + 6} height="24" rx="5" fill="var(--clinova-color-0d1623)" fillOpacity="0.85" />
                        <image href={location.flag} x="0" y="-12" width="20" height="15" aria-hidden="true" />
                        <text x="27" y="0" textAnchor="start" fill="var(--clinova-color-dce6ff)" fontSize="14" fontWeight="500" fontFamily="Plus Jakarta Sans, sans-serif">
                            {t(location.name)}
                        </text>
                    </g>
                </g>
            );
            })}
        </Box>
    );
}
