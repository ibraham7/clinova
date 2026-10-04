import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { useId } from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import { countryBoundaries, coverageLocations } from "./coverageData";

const pulse = keyframes`
    0%, 100% { opacity: 0.25; transform: scale(0.85); }
    50% { opacity: 0.65; transform: scale(1.2); }
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
                "@media (prefers-reduced-motion: reduce)": {
                    "& .coverage-pulse": { animation: "none" },
                },
            }}
        >
            <title id={titleId}>
                {t("Clinova coverage: Türkiye, Syria, Saudi Arabia, UAE, Qatar and Kuwait")}
                        </title>
            {countryBoundaries.map((country) => {
                const active = coverageLocations.some((location) => location.code === country.code);
                return (
                    <path
                        key={country.code}
                        d={country.path}
                        fill={active ? "rgba(142,168,232,0.18)" : "rgba(142,168,232,0.035)"}
                        stroke={active ? "rgba(142,168,232,0.65)" : "rgba(142,168,232,0.18)"}
                        strokeWidth={active ? 1.3 : 0.8}
                        strokeLinejoin="round"
                        fillRule="evenodd"
                    />
                );
            })}
            {coverageLocations.map((location, index) => (
                <g key={location.code}>
                    <circle
                        className="coverage-pulse"
                        cx={location.x}
                        cy={location.y}
                        r="11"
                        fill="rgba(142,168,232,0.15)"
                        stroke="#8EA8E8"
                        strokeWidth="0.8"
                        style={{ animationDelay: `${index * -0.8}s` }}
                    />
                    <circle cx={location.x} cy={location.y} r="3.5" fill="#B8C8EF" />
                    {Math.abs(location.dx) > 30 && (
                        <path
                            d={`M${location.x + 7},${location.y}L${location.x + location.dx - 8},${location.y + location.dy - 4}`}
                            stroke="rgba(184,200,239,0.35)"
                            strokeWidth="1"
                        />
                    )}
                    <text
                        x={location.x + location.dx}
                        y={location.y + location.dy}
                        textAnchor={location.dx > 30 ? "start" : "middle"}
                        fill="#DCE6FF"
                        fontSize="15"
                        fontWeight="500"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                        stroke="#0D1623"
                        strokeWidth="4"
                        strokeLinejoin="round"
                        paintOrder="stroke"
                    >
                        {t(location.name)}
                    </text>
                </g>
            ))}
        </Box>
    );
}
