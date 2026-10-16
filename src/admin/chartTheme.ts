import { adminLocale } from "./i18n";

// Colours and number format shared by the reports charts.
export const chart = {
    mark: "#8EA8E8",
    markHover: "#B8C8EF",
    grid: "rgba(245,247,250,0.08)",
    axis: "rgba(245,247,250,0.5)",
    text: "#F5F7FA",
    muted: "rgba(245,247,250,0.62)",
    event: "#E8B86E",
    surface: "#111B2A",
};

export const formatNumber = (value: number) => new Intl.NumberFormat(adminLocale(), { maximumFractionDigits: 1 }).format(value);
