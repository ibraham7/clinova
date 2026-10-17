import { useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import { api, messageFor } from "./api";

const T = {
    title: "شعار الموقع",
    intro: "يظهر في رأس الصفحة وأسفلها وفي الواجهة الرئيسية والمدونة ونتائج البحث. الأفضل صورة بخلفية شفافة (PNG أو WebP) بعرض 800 بكسل على الأقل. في الوضع الفاتح يُعتَّم الشعار تلقائيًا ليبقى واضحًا.",
    current: "الحالي",
    dark: "على الخلفية الداكنة",
    light: "على الخلفية الفاتحة",
    choose: "اختيار شعار جديد",
    save: "حفظ ونشر الشعار",
    saving: "جارٍ الحفظ…",
    cancel: "إلغاء",
    restore: "استرجاع الشعار الأصلي",
    confirmRestore: "هل تريد إرجاع الشعار الذي كان على الموقع قبل أول تغيير؟",
    badType: "استخدم صورة PNG أو JPG أو WebP.",
    tooBig: "الصورة أكبر من 5 ميغابايت.",
    saved: "تم الحفظ. يظهر الشعار الجديد على الموقع خلال دقيقتين تقريبًا (حدّث الصفحة بعدها).",
    restored: "تم الاسترجاع. يعود الشعار الأصلي خلال دقيقتين تقريبًا.",
    noOriginal: "الشعار الحالي هو الأصلي، لا يوجد ما يُسترجع.",
};

// The site's logo is a PNG; any picked image is redrawn as a PNG no wider than 1200 px (transparency kept).
async function toPng(file: File) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1200 / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("png");
    return { url: URL.createObjectURL(blob), data: await new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] ?? ""); reader.readAsDataURL(blob); }) };
}

const lightFilter = "brightness(.56) saturate(1.2)";

export default function SiteLogoCard() {
    const [picked, setPicked] = useState<{ url: string; data: string } | null>(null);
    // A fresh query each time the page opens, so the newly published logo shows instead of a cached one.
    const [shown, setShown] = useState(() => `/logo/logo.png?v=${Date.now()}`);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

    const choose = async (file?: File) => {
        if (!file) return;
        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) { setMessage({ type: "error", text: T.badType }); return; }
        if (file.size > 5_000_000) { setMessage({ type: "error", text: T.tooBig }); return; }
        setMessage(null);
        try { setPicked(await toPng(file)); } catch { setMessage({ type: "error", text: T.badType }); }
    };
    const send = async (body: { data: string } | { restore: true }) => {
        setBusy(true);
        const result = await api.siteLogo(body);
        setBusy(false);
        if (result.status === 404) { setMessage({ type: "info", text: T.noOriginal }); return; }
        if (result.status !== 200) { setMessage({ type: "error", text: messageFor(result.data.error) }); return; }
        if ("data" in body && picked) { setShown(picked.url); setPicked(null); setMessage({ type: "success", text: T.saved }); }
        else setMessage({ type: "success", text: T.restored });
    };

    const preview = picked?.url ?? shown;
    const swatch = (background: string, filter: string, label: string) => <Box sx={{ flex: 1, minWidth: 200 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "rgba(245,247,250,0.6)", mb: 0.75 }}>{label}</Typography>
        <Box sx={{ height: 96, display: "grid", placeItems: "center", borderRadius: "12px", backgroundColor: background, border: "1px solid rgba(142,168,232,0.16)" }}>
            <Box component="img" src={preview} alt="" sx={{ maxWidth: "70%", maxHeight: 56, objectFit: "contain", filter }} />
        </Box>
    </Box>;

    return <Box sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: "20px", border: "1px solid rgba(142,168,232,0.16)", backgroundColor: "rgba(142,168,232,0.04)" }}>
        <Typography component="h2" sx={{ fontSize: "1.15rem", fontWeight: 700, mb: 0.5 }}>{T.title}</Typography>
        <Typography sx={{ fontSize: "0.85rem", color: "rgba(245,247,250,0.7)", mb: 2, maxWidth: 760, lineHeight: 1.8 }}>{T.intro}</Typography>
        {message && <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>{message.text}</Alert>}
        <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap", mb: 2 }}>
            {swatch("#0B111B", "none", picked ? T.dark : `${T.current} · ${T.dark}`)}
            {swatch("#F5F7FA", lightFilter, picked ? T.light : `${T.current} · ${T.light}`)}
        </Stack>
        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
            {picked ? <>
                <Button variant="contained" disabled={busy} onClick={() => void send({ data: picked.data })}>{busy ? T.saving : T.save}</Button>
                <Button disabled={busy} onClick={() => setPicked(null)}>{T.cancel}</Button>
            </> : <>
                <Button component="label" variant="outlined" startIcon={<ImageRoundedIcon />} disabled={busy}>
                    {T.choose}
                    <input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { void choose(event.target.files?.[0]); event.target.value = ""; }} />
                </Button>
                <Button color="inherit" startIcon={<RestoreRoundedIcon />} disabled={busy} onClick={() => { if (window.confirm(T.confirmRestore)) void send({ restore: true }); }}>{T.restore}</Button>
            </>}
        </Stack>
    </Box>;
}
