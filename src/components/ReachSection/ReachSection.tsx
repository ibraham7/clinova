import { Box, Container, Stack, Typography } from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

const locations = [
    {
        code: "TUR",
        name: "Türkiye",
        status: "ACTIVE",
    },
    {
        code: "UAE",
        name: "U.A.E",
        status: "ACTIVE",
    },
    {
        code: "SAU",
        name: "Saudi Arabia",
        status: "ACTIVE",
    },
    {
        code: "QAT",
        name: "Qatar",
        status: "ACTIVE",
    },
    {
        code: "KWT",
        name: "Kuwait",
        status: "ACTIVE",
    },
    {
        code: "BHR",
        name: "Bahrain",
        status: "ACTIVE",
    },
];

function ReachSection() {
    return (
        <Box
            component="section"
            id="reach"
            sx={{
                position: "relative",
                overflow: "hidden",

                py: {
                    xs: 10,
                    md: 14,
                    lg: 18,
                },

                background:
                    "radial-gradient(circle at 15% 50%, rgba(142,168,232,0.07), transparent 35%), #0B111B",

                direction: "rtl",
            }}
        >
            <Container>
                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "1.05fr 1fr",
                        },

                        alignItems: "center",

                        gap: {
                            xs: 7,
                            lg: 10,
                        },
                    }}
                >
                    {/* =====================================
                        DASHBOARD / MAP
                    ====================================== */}

                    <Box
                        sx={{
                            position: "relative",

                            order: {
                                xs: 2,
                                lg: 1,
                            },

                            width: "100%",
                            maxWidth: 600,

                            mx: {
                                xs: "auto",
                                lg: 0,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",

                                width: "100%",

                                borderRadius: 5,

                                overflow: "hidden",

                                border:
                                    "1px solid rgba(142,168,232,0.18)",

                                background:
                                    "linear-gradient(145deg, #111B2A 0%, #0D1623 100%)",

                                boxShadow:
                                    "0 25px 80px rgba(0,0,0,0.25)",
                            }}
                        >
                            {/* =================================
                                TOP BAR
                            ================================== */}

                            <Box
                                sx={{
                                    height: 34,

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",

                                    px: 2,

                                    borderBottom:
                                        "1px solid rgba(142,168,232,0.10)",

                                    backgroundColor:
                                        "rgba(142,168,232,0.025)",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Plus Jakarta Sans", sans-serif',

                                        fontSize: "0.48rem",

                                        letterSpacing: "0.18em",

                                        color:
                                            "rgba(245,247,250,0.45)",
                                    }}
                                >
                                    CLINOVA / COVERAGE
                                </Typography>

                                <Stack
                                    sx={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 0.7,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,

                                            borderRadius: "50%",

                                            backgroundColor:
                                                "primary.main",

                                            boxShadow:
                                                "0 0 10px rgba(142,168,232,0.8)",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontFamily:
                                                '"Plus Jakarta Sans", sans-serif',

                                            fontSize: "0.48rem",

                                            letterSpacing: "0.15em",

                                            color:
                                                "primary.light",
                                        }}
                                    >
                                        LIVE
                                    </Typography>
                                </Stack>
                            </Box>

                            {/* =================================
                                MAP AREA
                            ================================== */}

                            <Box
                                sx={{
                                    position: "relative",

                                    height: {
                                        xs: 280,
                                        sm: 340,
                                        md: 390,
                                    },

                                    overflow: "hidden",

                                    backgroundColor: "#0D1623",

                                    backgroundImage: `
                                        linear-gradient(
                                            rgba(142,168,232,0.045) 1px,
                                            transparent 1px
                                        ),
                                        linear-gradient(
                                            90deg,
                                            rgba(142,168,232,0.045) 1px,
                                            transparent 1px
                                        )
                                    `,

                                    backgroundSize: "42px 42px",
                                }}
                            >
                                {/* Decorative grid glow */}
                                <Box
                                    sx={{
                                        position: "absolute",

                                        inset: 0,

                                        background:
                                            "radial-gradient(circle at 50% 48%, rgba(142,168,232,0.12), transparent 48%)",

                                        pointerEvents: "none",
                                    }}
                                />

                                {/* Corner brackets */}

                                <Corner
                                    position={{
                                        top: 12,
                                        left: 12,
                                    }}
                                />

                                <Corner
                                    position={{
                                        top: 12,
                                        right: 12,
                                    }}
                                    rotate="90deg"
                                />

                                <Corner
                                    position={{
                                        bottom: 12,
                                        left: 12,
                                    }}
                                    rotate="-90deg"
                                />

                                <Corner
                                    position={{
                                        bottom: 12,
                                        right: 12,
                                    }}
                                    rotate="180deg"
                                />

                                {/* =================================
                                    SCHEMATIC MAP
                                ================================== */}

                                <Box
                                    component="svg"
                                    viewBox="0 0 600 390"
                                    sx={{
                                        position: "absolute",

                                        width: "90%",
                                        height: "90%",

                                        left: "5%",
                                        top: "5%",

                                        overflow: "visible",
                                    }}
                                >
                                    {/* Outer glow */}
                                    <path
                                        d="M150 45
                                           L225 55
                                           L285 95
                                           L350 105
                                           L390 145
                                           L430 165
                                           L465 220
                                           L450 275
                                           L390 305
                                           L310 320
                                           L245 300
                                           L205 265
                                           L180 210
                                           L140 175
                                           L115 115
                                           Z"
                                        fill="rgba(142,168,232,0.04)"
                                        stroke="rgba(142,168,232,0.18)"
                                        strokeWidth="2"
                                    />

                                    {/* Main area */}
                                    <path
                                        d="M150 45
                                           L225 55
                                           L285 95
                                           L350 105
                                           L390 145
                                           L430 165
                                           L465 220
                                           L450 275
                                           L390 305
                                           L310 320
                                           L245 300
                                           L205 265
                                           L180 210
                                           L140 175
                                           L115 115
                                           Z"
                                        fill="rgba(142,168,232,0.10)"
                                        stroke="#8EA8E8"
                                        strokeOpacity="0.5"
                                        strokeWidth="1.5"
                                    />

                                    {/* Inner lines */}
                                    <path
                                        d="M225 55 L205 265"
                                        stroke="rgba(142,168,232,0.13)"
                                        strokeWidth="1"
                                    />

                                    <path
                                        d="M285 95 L245 300"
                                        stroke="rgba(142,168,232,0.13)"
                                        strokeWidth="1"
                                    />

                                    <path
                                        d="M350 105 L310 320"
                                        stroke="rgba(142,168,232,0.13)"
                                        strokeWidth="1"
                                    />

                                    <path
                                        d="M140 175 L450 275"
                                        stroke="rgba(142,168,232,0.10)"
                                        strokeWidth="1"
                                    />

                                    {/* Connection line */}
                                    <path
                                        d="M170 150
                                           C240 105 325 135 390 190
                                           C425 220 430 245 410 260"
                                        fill="none"
                                        stroke="#8EA8E8"
                                        strokeOpacity="0.35"
                                        strokeWidth="1"
                                        strokeDasharray="4 6"
                                    />

                                    {/* Location points */}

                                    <MapPoint
                                        x="175"
                                        y="145"
                                        label="IST"
                                    />

                                    <MapPoint
                                        x="320"
                                        y="185"
                                        label="Riyadh"
                                    />

                                    <MapPoint
                                        x="385"
                                        y="210"
                                        label="DXB"
                                    />

                                    <MapPoint
                                        x="405"
                                        y="235"
                                        label="DOH"
                                    />
                                </Box>

                                {/* Map label */}
                                <Typography
                                    sx={{
                                        position: "absolute",

                                        left: 20,
                                        bottom: 18,

                                        fontFamily:
                                            '"Plus Jakarta Sans", sans-serif',

                                        fontSize: "0.48rem",

                                        letterSpacing: "0.18em",

                                        color:
                                            "rgba(245,247,250,0.35)",
                                    }}
                                >
                                    CLINOVA NETWORK
                                </Typography>
                            </Box>

                            {/* =================================
                                LOCATION FOOTER
                            ================================== */}

                            <Box
                                sx={{
                                    display: "grid",

                                    gridTemplateColumns: {
                                        xs: "1fr 1fr",
                                        sm: "repeat(3, 1fr)",
                                    },

                                    borderTop:
                                        "1px solid rgba(142,168,232,0.10)",
                                }}
                            >
                                {locations.map((location) => (
                                    <Box
                                        key={location.code}
                                        sx={{
                                            position: "relative",

                                            px: 2,
                                            py: 1.5,

                                            minHeight: 52,

                                            borderLeft:
                                                "1px solid rgba(142,168,232,0.08)",

                                            "&:nth-of-type(3n)": {
                                                borderLeft: "none",
                                            },
                                        }}
                                    >
                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent:
                                                    "space-between",
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily:
                                                        '"Plus Jakarta Sans", sans-serif',

                                                    fontSize: "0.48rem",

                                                    letterSpacing:
                                                        "0.14em",

                                                    color:
                                                        "primary.main",
                                                }}
                                            >
                                                {location.status}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontFamily:
                                                        '"Plus Jakarta Sans", sans-serif',

                                                    fontSize: "0.5rem",

                                                    letterSpacing:
                                                        "0.12em",

                                                    color:
                                                        "rgba(245,247,250,0.35)",
                                                }}
                                            >
                                                {location.code}
                                            </Typography>
                                        </Stack>

                                        <Typography
                                            sx={{
                                                mt: 0.5,

                                                fontFamily:
                                                    '"Plus Jakarta Sans", sans-serif',

                                                fontSize: "0.72rem",

                                                color:
                                                    "rgba(245,247,250,0.75)",
                                            }}
                                        >
                                            {location.name}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* =====================================
                        CONTENT
                    ====================================== */}

                    <Box
                        sx={{
                            order: {
                                xs: 1,
                                lg: 2,
                            },

                            textAlign: {
                                xs: "center",
                                lg: "right",
                            },

                            direction: "rtl",
                        }}
                    >
                        {/* Badge */}
                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,

                                px: 2,
                                py: 0.8,

                                mb: {
                                    xs: 3,
                                    md: 4,
                                },

                                borderRadius: "999px",

                                border:
                                    "1px solid rgba(142,168,232,0.18)",

                                backgroundColor:
                                    "rgba(142,168,232,0.04)",

                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 6,
                                    height: 6,

                                    borderRadius: "50%",

                                    backgroundColor:
                                        "primary.main",

                                    boxShadow:
                                        "0 0 12px rgba(142,168,232,0.7)",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',

                                    fontSize: "0.75rem",

                                    fontWeight: 500,

                                    color: "text.secondary",
                                }}
                            >
                                لماذا نحن مختلفون؟
                            </Typography>
                        </Box>

                        {/* Heading */}
                        <Typography
                            component="h2"
                            sx={{
                                m: 0,

                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                fontSize: {
                                    xs: "2.5rem",
                                    sm: "3.3rem",
                                    md: "4.2rem",
                                    lg: "4.8rem",
                                },

                                fontWeight: 600,

                                lineHeight: {
                                    xs: 1.3,
                                    md: 1.2,
                                },

                                letterSpacing: 0,

                                color: "#F5F7FA",
                            }}
                        >
                            نفهم كيف يفكر
                            <Box
                                component="span"
                                sx={{
                                    display: "block",

                                    fontFamily:
                                        '"IBM Plex Sans Arabic", sans-serif',

                                    color: "primary.main",
                                }}
                            >
                                المريض الخليجي.
                            </Box>
                        </Typography>

                        {/* Description */}
                        <Typography
                            sx={{
                                mt: 4,

                                maxWidth: 620,

                                ml: {
                                    lg: "auto",
                                },

                                fontFamily:
                                    '"IBM Plex Sans Arabic", sans-serif',

                                fontSize: {
                                    xs: "0.9rem",
                                    md: "1rem",
                                },

                                lineHeight: 2,

                                color: "text.secondary",
                            }}
                        >
                            المريض في الرعاية الصحية لا يتخذ قراره بنفس
                            طريقة المريض في مجالات أخرى، لذلك نعتمد على
                            البيانات وسلوك المستخدم وتحليل السوق لبناء
                            حملات تستهدف المريض المناسب في الوقت المناسب،
                            وبالرسالة المناسبة. نحن لا نركز فقط على
                            التحويل، بل على فهم حقيقي للمريض الذي تبحث
                            عنه.
                        </Typography>

                        {/* Small stats */}
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",

                                justifyContent: {
                                    xs: "center",
                                    lg: "flex-start",
                                },

                                gap: {
                                    xs: 3,
                                    md: 5,
                                },

                                mt: 5,
                            }}
                        >
                            <ReachStat
                                value="+24"
                                label="نقطة تواصل"
                            />

                            <Box
                                sx={{
                                    width: 1,
                                    height: 38,

                                    backgroundColor:
                                        "rgba(142,168,232,0.15)",
                                }}
                            />

                            <ReachStat
                                value="24/7"
                                label="متابعة رقمية"
                            />
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

/* =========================================
   MAP POINT
========================================= */

function MapPoint({
    x,
    y,
    label,
}: {
    x: string;
    y: string;
    label: string;
}) {
    return (
        <g>
            <circle
                cx={x}
                cy={y}
                r="14"
                fill="rgba(142,168,232,0.08)"
                stroke="rgba(142,168,232,0.25)"
            />

            <circle
                cx={x}
                cy={y}
                r="4"
                fill="#8EA8E8"
            />

            <text
                x={Number(x) + 10}
                y={Number(y) - 10}
                fill="rgba(245,247,250,0.55)"
                fontSize="8"
                fontFamily="Plus Jakarta Sans"
            >
                {label}
            </text>
        </g>
    );
}

/* =========================================
   CORNER
========================================= */

function Corner({
    position,
    rotate,
}: {
    position: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    rotate?: string;
}) {
    return (
        <Box
            sx={{
                position: "absolute",

                ...position,

                width: 18,
                height: 18,

                borderTop:
                    "1px solid rgba(142,168,232,0.35)",

                borderLeft:
                    "1px solid rgba(142,168,232,0.35)",

                transform: `rotate(${rotate ?? "0deg"})`,

                pointerEvents: "none",
            }}
        />
    );
}

/* =========================================
   STAT
========================================= */

function ReachStat({
    value,
    label,
}: {
    value: string;
    label: string;
}) {
    return (
        <Box>
            <Typography
                sx={{
                    fontFamily:
                        '"Plus Jakarta Sans", sans-serif',

                    fontSize: {
                        xs: "1.2rem",
                        md: "1.4rem",
                    },

                    fontWeight: 600,

                    color: "primary.main",
                }}
            >
                {value}
            </Typography>

            <Typography
                sx={{
                    mt: 0.3,

                    fontFamily:
                        '"IBM Plex Sans Arabic", sans-serif',

                    fontSize: "0.72rem",

                    color: "text.secondary",
                }}
            >
                {label}
            </Typography>
        </Box>
    );
}

export default ReachSection;