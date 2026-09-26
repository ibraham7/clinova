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
    return (
        <Box
            sx={{
                width: "100%",
                overflow: "hidden",

                py: 2.2,

                backgroundColor: "#101525",

                borderTop:
                    "1px solid rgba(142, 168, 232, 0.08)",

                borderBottom:
                    "1px solid rgba(142, 168, 232, 0.08)",

                direction: "ltr",

                // 👇 هذا مكانه
                "& .clinova-ticker": {
                    display: "flex",
                    width: "max-content",
                    animation:
                        "clinovaTicker 25s linear infinite",
                    willChange: "transform",
                },

                // 👇 وهذا تحته مباشرة
                "@keyframes clinovaTicker": {
                    from: {
                        transform: "translateX(0)",
                    },

                    to: {
                        transform: "translateX(-50%)",
                    },
                },
            }}
        >
            <Box className="clinova-ticker">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                        gap: 4,
                        direction: "rtl",
                        pr: 4,
                    }}
                >
                    {items.map((item) => (
                        <Box
                            key={`first-${item}`}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                flexShrink: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',
                                    fontSize: {
                                        xs: "0.85rem",
                                        md: "1rem",
                                    },
                                    fontWeight: 500,
                                    color:
                                        "rgba(245, 247, 250, 0.65)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {item}
                            </Typography>

                            <Box
                                sx={{
                                    width: 6,
                                    height: 6,
                                    flexShrink: 0,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        "primary.main",
                                }}
                            />
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                        gap: 4,
                        direction: "rtl",
                        pr: 4,
                    }}
                >
                    {items.map((item) => (
                        <Box
                            key={`second-${item}`}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                flexShrink: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',
                                    fontSize: {
                                        xs: "0.85rem",
                                        md: "1rem",
                                    },
                                    fontWeight: 500,
                                    color:
                                        "rgba(245, 247, 250, 0.65)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {item}
                            </Typography>

                            <Box
                                sx={{
                                    width: 6,
                                    height: 6,
                                    flexShrink: 0,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        "primary.main",
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default MedicalTicker;