import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";
import { typography } from "./typography";
import { shadows } from "./shadows";

export const lightTheme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: colors.primaryDark,
            light: colors.primary,
            dark: "#4B6398",
            contrastText: colors.white,
        },

        background: {
            default: colors.light.background,
            paper: colors.light.surface,
        },

        text: {
            primary: colors.light.text,
            secondary: colors.light.textSecondary,
        },

        divider: colors.light.border,
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

    shadows,

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: colors.light.background,
                },

                "::selection": {
                    backgroundColor: "rgba(95, 120, 181, 0.18)",
                    color: colors.light.text,
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

                    "&.MuiButton-containedPrimary": {
                        background:
                            "linear-gradient(135deg, #5F78B5 0%, #7894D2 100%)",

                        color: "#FFFFFF",

                        "&:hover": {
                            background:
                                "linear-gradient(135deg, #4B6398 0%, #5F78B5 100%)",
                        },
                    },
                },

                outlined: {
                    borderColor: colors.light.border,

                    "&:hover": {
                        borderColor: "rgba(95, 120, 181, 0.45)",
                        backgroundColor: "rgba(95, 120, 181, 0.05)",
                    },
                },

                text: {
                    "&:hover": {
                        backgroundColor: "rgba(95, 120, 181, 0.06)",
                    },
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    backgroundImage: "none",
                    backgroundColor: colors.light.surface,
                    border: `1px solid ${colors.light.border}`,
                    boxShadow:
                        "0 16px 36px rgba(16, 24, 39, 0.08)",
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
                            borderColor: colors.light.border,
                        },

                        "&:hover fieldset": {
                            borderColor:
                                "rgba(95, 120, 181, 0.35)",
                        },

                        "&.Mui-focused fieldset": {
                            borderColor: colors.primaryDark,
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