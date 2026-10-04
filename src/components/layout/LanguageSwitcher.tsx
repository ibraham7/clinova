import { useId, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
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
            <Button
                id={buttonId}
                variant="outlined"
                aria-label={t("اختيار اللغة")}
                aria-haspopup="menu"
                aria-controls={anchor ? menuId : undefined}
                aria-expanded={Boolean(anchor)}
                onClick={(event) => setAnchor(event.currentTarget)}
                startIcon={compact ? undefined : <LanguageRoundedIcon />}
                endIcon={compact ? undefined : <KeyboardArrowDownRoundedIcon />}
                sx={{
                    borderRadius: "999px",
                    minWidth: compact ? 44 : 118,
                    height: compact ? 42 : 48,
                    px: compact ? 1 : 2,
                    color: "text.secondary",
                    borderColor: "rgba(142,168,232,0.18)",
                    whiteSpace: "nowrap",
                }}
            >
                {compact ? selected.code.toUpperCase() : selected.name}
            </Button>
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
