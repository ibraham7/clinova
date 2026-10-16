import { useState } from "react";
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { languages } from "../i18n";

const T = {
    title: "تعديل نصوص الموقع",
    hint: "هذه نسخة حيّة من الموقع. مرّر الماوس على أي نص واضغط عليه لتعديله بكل اللغات، ثم اضغط «حفظ ونشر» في الشريط أسفل الصفحة. لاستخدام القوائم والأزرار عطّل «وضع التعديل» مؤقتًا.",
    fullScreen: "فتح بملء الشاشة",
};

/** Hosts the live site in edit mode (/<lang>?edit), where every text can be clicked and changed. */
export default function TextsPage() {
    const [lang, setLang] = useState("ar");
    const src = `/${lang}?edit`;
    return <Box>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ gap: 2, alignItems: { md: "center" }, justifyContent: "space-between", mb: 2 }}>
            <Box>
                <Typography component="h1" sx={{ fontSize: "1.4rem", fontWeight: 700 }}>{T.title}</Typography>
                <Typography sx={{ mt: 0.5, fontSize: "0.88rem", color: "rgba(245,247,250,0.7)", maxWidth: 760, lineHeight: 1.8 }}>{T.hint}</Typography>
            </Box>
            <Stack direction="row" sx={{ gap: 1, flexShrink: 0 }}>
                <ToggleButtonGroup size="small" exclusive value={lang} onChange={(_, value) => value && setLang(value)}>
                    {languages.map((language) => <ToggleButton key={language.code} value={language.code}>{language.name}</ToggleButton>)}
                </ToggleButtonGroup>
                <Button href={src} target="_blank" rel="noopener" startIcon={<OpenInNewRoundedIcon />}>{T.fullScreen}</Button>
            </Stack>
        </Stack>
        <Box component="iframe" key={src} src={src} title={T.title} sx={{ width: "100%", height: "calc(100vh - 190px)", minHeight: 520, border: "1px solid rgba(142,168,232,0.2)", borderRadius: "16px", backgroundColor: "#0B111B" }} />
    </Box>;
}
