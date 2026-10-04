import { useLayoutEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

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
    const viewportRef = useRef<HTMLDivElement>(null);
    const unitRef = useRef<HTMLDivElement>(null);
    const [repetitions, setRepetitions] = useState(1);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        const unit = unitRef.current;
        if (!viewport || !unit) return;

        const updateRepetitions = () => {
            const unitWidth = unit.getBoundingClientRect().width;
            if (unitWidth <= 0) return;

            // Each half of the track must cover the viewport on its own.
            // Also remeasure when responsive typography or web fonts change.
            setRepetitions(Math.max(1, Math.ceil(viewport.clientWidth / unitWidth)));
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
                backgroundColor: "#101525",
                borderTop: "1px solid rgba(142, 168, 232, 0.08)",
                borderBottom: "1px solid rgba(142, 168, 232, 0.08)",
                direction: "ltr",
                "& .clinova-ticker": {
                    display: "flex",
                    width: "max-content",
                    animation: "clinovaTicker 25s linear infinite",
                },
                "@keyframes clinovaTicker": {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
                "@media (prefers-reduced-motion: reduce)": {
                    "& .clinova-ticker": { animation: "none" },
                },
            }}
        >
            <Box className="clinova-ticker">
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
                                    direction: "rtl",
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
                                                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                                                fontSize: { xs: "0.85rem", md: "1rem" },
                                                fontWeight: 500,
                                                color: "rgba(245, 247, 250, 0.65)",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {item}
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
