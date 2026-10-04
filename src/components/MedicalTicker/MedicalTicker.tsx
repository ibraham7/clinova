import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { useLayoutEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

const tickerScroll = keyframes`
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(-50%, 0, 0); }
`;

const pixelsPerSecond = 48;

const items = [
    "طب الأسنان",
    "زراعة الأسنان",
    "ابتسامة هوليوود",
    "التقويم",
    "الجاذبية",
    "الجراحة التجميلية",
    "زراعة الشعر",
];

function MedicalTicker() {
    const { direction, t } = useSiteTranslation();

    const viewportRef = useRef<HTMLDivElement>(null);
    const unitRef = useRef<HTMLDivElement>(null);
    const [repetitions, setRepetitions] = useState(1);
    const [duration, setDuration] = useState(25);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        const unit = unitRef.current;
        if (!viewport || !unit) return;

        const updateRepetitions = () => {
            const unitWidth = unit.getBoundingClientRect().width;
            if (unitWidth <= 0) return;

            // Each half of the track must cover the viewport on its own.
            // Also remeasure when responsive typography or web fonts change.
            const nextRepetitions = Math.max(1, Math.ceil(viewport.clientWidth / unitWidth));
            setRepetitions(nextRepetitions);
            // Keep the same readable speed across viewport sizes and languages.
            setDuration((unitWidth * nextRepetitions) / pixelsPerSecond);
        };

        updateRepetitions();
        const observer = new ResizeObserver(updateRepetitions);
        observer.observe(viewport);
        observer.observe(unit);
        return () => observer.disconnect();
    }, []);

    return (
        <Box
            ref={viewportRef}
            sx={{
                width: "100%",
                overflow: "hidden",
                py: 2.2,
                backgroundColor: "var(--clinova-color-101525)",
                borderTop: "1px solid var(--clinova-rgba-142-168-232-0_08)",
                borderBottom: "1px solid var(--clinova-rgba-142-168-232-0_08)",
                direction: "ltr",
            }}
        >
            <Box
                className="clinova-ticker"
                sx={{
                    display: "flex",
                    width: "max-content",
                    willChange: "transform",
                    animation: `${tickerScroll} ${duration}s linear infinite`,
                    // Keep the requested ticker moving, gently, when the device
                    // prefers reduced motion instead of freezing it completely.
                    "@media (prefers-reduced-motion: reduce)": {
                        animationDuration: `${duration * 2}s`,
                    },
                }}
            >
                {[0, 1].map((group) => (
                    <Box
                        key={group}
                        aria-hidden={group === 1 ? true : undefined}
                        sx={{ display: "flex", flexShrink: 0 }}
                    >
                        {Array.from({ length: repetitions }, (_, repetition) => (
                            <Box
                                key={repetition}
                                ref={group === 0 && repetition === 0 ? unitRef : undefined}
                                aria-hidden={repetition > 0 ? true : undefined}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                    gap: 4,
                                    direction: direction,
                                    // Same spacing within a unit and across both seams.
                                    paddingInlineEnd: 4,
                                }}
                            >
                                {items.map((item) => (
                                    <Box
                                        key={item}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: "var(--clinova-font-family)",
                                                fontSize: { xs: "0.85rem", md: "1rem" },
                                                fontWeight: 500,
                                                color: "var(--clinova-rgba-245-247-250-0_65)",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {t(item)}
                                        </Typography>
                                        <Box
                                            aria-hidden="true"
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                flexShrink: 0,
                                                borderRadius: "50%",
                                                backgroundColor: "primary.main",
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default MedicalTicker;
