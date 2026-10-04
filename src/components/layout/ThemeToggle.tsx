import { IconButton } from "@mui/material";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { useColorMode } from "../../theme/ColorMode";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
    const { mode, toggle } = useColorMode();
    const { t } = useSiteTranslation();
    const label = mode === "dark" ? t("تفعيل الوضع الفاتح") : t("تفعيل الوضع الداكن");
    return <IconButton onClick={toggle} aria-label={label} title={label} sx={{ width: compact ? 42 : 48, height: compact ? 42 : 48, flexShrink: 0, color: "text.secondary", border: "1px solid var(--clinova-rgba-142-168-232-0_18)" }}>
        {mode === "dark" ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
    </IconButton>;
}
