import { useId, useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import { languages } from "../../i18n";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
    const { t, i18n, direction } = useSiteTranslation();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const menuId = useId();
    const buttonId = useId();
    const selected = languages.find((language) => language.code === i18n.resolvedLanguage) ?? languages[0];

    return (
        <>
            <IconButton
                id={buttonId}
                aria-label={t("اختيار اللغة")}
                aria-haspopup="menu"
                aria-controls={anchor ? menuId : undefined}
                aria-expanded={Boolean(anchor)}
                onClick={(event) => setAnchor(event.currentTarget)}
                sx={{
                    borderRadius: "999px",
                    width: compact ? 42 : 48,
                    height: compact ? 42 : 48,
                    p: 1,
                    flexShrink: 0,
                    border: "1px solid",
                    color: "text.secondary",
                    borderColor: "var(--clinova-rgba-142-168-232-0_18)",
                    whiteSpace: "nowrap",
                }}
            >
                <TranslateRoundedIcon fontSize="small" />
            </IconButton>
            <Menu
                id={menuId}
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                slotProps={{ list: { "aria-labelledby": buttonId }, paper: { dir: direction } }}
            >
                {languages.map((language) => (
                    <MenuItem
                        key={language.code}
                        lang={language.code}
                        dir={language.code === "ar" ? "rtl" : "ltr"}
                        selected={selected.code === language.code}
                        onClick={() => {
                            void i18n.changeLanguage(language.code);
                            setAnchor(null);
                        }}
                        sx={{ minWidth: 150 }}
                    >
                        {language.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
