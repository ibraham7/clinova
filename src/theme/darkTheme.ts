import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";
import { typography } from "./typography";
import { shadows } from "./shadows";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",

        primary: {
            main: colors.primary,
            light: colors.primaryLight,
            dark: colors.primaryDark,
            contrastText: colors.dark.background,
        },

        background: {
            default: colors.dark.background,
            paper: colors.dark.surface,
        },

        text: {
            primary: colors.dark.text,
            secondary: colors.dark.textSecondary,
        },

        divider: colors.dark.border,
    },

    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },

    shape: {
        borderRadius: 12,
    },

    typography,

    shadows: [...shadows],

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: colors.dark.background,
                },

                "::selection": {
                    backgroundColor: "rgba(142, 168, 232, 0.25)",
                    color: colors.dark.text,
                },
            },
        },

        MuiContainer: {
            defaultProps: {
                maxWidth: "xl",
            },

            styleOverrides: {
                root: {
                    paddingLeft: 24,
                    paddingRight: 24,

                    "@media (min-width: 900px)": {
                        paddingLeft: 40,
                        paddingRight: 40,
                    },

                    "@media (min-width: 1200px)": {
                        paddingLeft: 48,
                        paddingRight: 48,
                    },
                },
            },
        },

        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },

            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: "12px 20px",
                    minHeight: 48,
                    fontWeight: 600,
                },

                containedPrimary: {
                    background:
                        "linear-gradient(135deg, #8EA8E8 0%, #7894D2 100%)",

                    color: "#0B111B",

                    "&:hover": {
                        background:
                            "linear-gradient(135deg, #B8C8EF 0%, #8EA8E8 100%)",
                    },
                },

                outlined: {
                    borderColor: "rgba(255, 255, 255, 0.10)",

                    "&:hover": {
                        borderColor: "rgba(142, 168, 232, 0.45)",
                        backgroundColor: "rgba(142, 168, 232, 0.05)",
                    },
                },

                text: {
                    "&:hover": {
                        backgroundColor: "rgba(142, 168, 232, 0.06)",
                    },
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    backgroundImage: "none",
                    backgroundColor: colors.dark.surface,
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    boxShadow: "0 20px 45px rgba(0, 0, 0, 0.12)",
                },
            },
        },

        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },

            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 12,

                        "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.10)",
                        },

                        "&:hover fieldset": {
                            borderColor: "rgba(142, 168, 232, 0.35)",
                        },

                        "&.Mui-focused fieldset": {
                            borderColor: colors.primary,
                        },
                    },
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
    },
});