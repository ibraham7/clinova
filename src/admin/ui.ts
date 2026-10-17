// Shared styles for the admin panel.

/**
 * Toggle button groups as separate rounded pills. MUI rounds a group's outer corners for left-to-right
 * layouts, so in the Arabic panel the ends came out square and the corners landed between buttons.
 */
export const segmentedSx = {
    gap: 0.75,
    flexWrap: "wrap",
    "& .MuiToggleButtonGroup-grouped": {
        m: 0, px: 1.75, borderRadius: "10px !important", border: "1px solid rgba(142,168,232,0.25) !important",
        color: "rgba(245,247,250,0.75)", textTransform: "none",
        "&.Mui-selected": { color: "#F5F7FA", backgroundColor: "rgba(142,168,232,0.22)", borderColor: "rgba(142,168,232,0.55) !important" },
        "&.Mui-selected:hover": { backgroundColor: "rgba(142,168,232,0.3)" },
    },
} as const;
