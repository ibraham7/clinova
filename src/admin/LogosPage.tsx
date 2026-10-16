import { useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import type { ClientLogo } from "../content/siteContent";
import { api, fileToBase64, messageFor, newId } from "./api";
import type { useAdminContent } from "./useAdminContent";

const T = {
    title: "شعارات العملاء",
    intro: "تظهر الشعارات في قسم «شركاؤنا» المتحرك. يُفضّل شعار بخلفية شفافة (PNG أو WebP) بعرض 400 بكسل تقريبًا، وحجم حتى 1 ميغابايت.",
    add: "إضافة شعار",
    empty: "لا توجد شعارات بعد. يعرض الموقع مربعات فارغة حتى تضيف أول شعار.",
    name: "اسم العميل أو العيادة",
    choose: "اختيار صورة الشعار",
    badType: "استخدم صورة PNG أو JPG أو WebP.",
    tooBig: "حجم الصورة أكبر من 1 ميغابايت.",
    save: "رفع وحفظ",
    saving: "جارٍ الرفع…",
    cancel: "إلغاء",
    remove: "حذف الشعار",
    confirmRemove: "هل تريد حذف هذا الشعار من الموقع؟",
    pending: "يظهر على الموقع بعد النشر",
    saved: "تم الحفظ. سيظهر التعديل على الموقع خلال دقيقة أو دقيقتين.",
};

export default function LogosPage({ admin }: { admin: ReturnType<typeof useAdminContent> }) {
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    // Freshly uploaded logos show from memory until the new build is live.
    const [previews, setPreviews] = useState<Record<string, string>>({});
    const logos = admin.content?.logos ?? [];

    const persist = async (next: ClientLogo[]) => {
        if (!admin.content) return false;
        const error = await admin.save({ ...admin.content, logos: next });
        setMessage(error ? { type: "error", text: error } : { type: "success", text: T.saved });
        return !error;
    };
    const choose = (picked?: File) => {
        if (!picked) return;
        if (!["image/png", "image/jpeg", "image/webp"].includes(picked.type)) { setMessage({ type: "error", text: T.badType }); return; }
        if (picked.size > 1_000_000) { setMessage({ type: "error", text: T.tooBig }); return; }
        setMessage(null);
        setFile(picked);
    };
    const submit = async () => {
        if (!file || !name.trim()) return;
        setBusy(true);
        const uploaded = await api.uploadLogo(name.trim(), await fileToBase64(file));
        if (uploaded.status !== 200) { setBusy(false); setMessage({ type: "error", text: messageFor(uploaded.data.error) }); return; }
        const logo = { id: newId("logo"), name: name.trim(), src: uploaded.data.src };
        setPreviews((current) => ({ ...current, [logo.src]: URL.createObjectURL(file) }));
        const ok = await persist([...logos, logo]);
        setBusy(false);
        if (ok) { setAdding(false); setName(""); setFile(null); }
    };
    const move = (index: number, delta: number) => {
        const next = [...logos];
        [next[index], next[index + delta]] = [next[index + delta], next[index]];
        void persist(next);
    };

    return <Box>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography component="h1" sx={{ fontSize: "1.4rem", fontWeight: 700 }}>{T.title}</Typography>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAdding(true)} disabled={!admin.content}>{T.add}</Button>
        </Stack>
        <Typography sx={{ fontSize: "0.88rem", color: "rgba(245,247,250,0.7)", mb: 3, maxWidth: 760, lineHeight: 1.8 }}>{T.intro}</Typography>
        {message && <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>{message.text}</Alert>}
        {admin.content && !logos.length && <Typography sx={{ color: "text.secondary" }}>{T.empty}</Typography>}
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {logos.map((logo, index) => <Box key={logo.id} sx={{ p: 2, borderRadius: "16px", border: "1px solid rgba(142,168,232,0.16)", backgroundColor: "rgba(142,168,232,0.04)" }}>
                <Box sx={{ height: 90, display: "grid", placeItems: "center", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.04)", mb: 1.5 }}>
                    <Box component="img" src={previews[logo.src] ?? logo.src} alt={logo.name} sx={{ maxWidth: "80%", maxHeight: 70, objectFit: "contain" }} />
                </Box>
                <Typography sx={{ fontWeight: 600 }} noWrap>{logo.name}</Typography>
                {previews[logo.src] && <Typography sx={{ fontSize: "0.72rem", color: "warning.light" }}>{T.pending}</Typography>}
                <Stack direction="row" sx={{ mt: 1, justifyContent: "flex-end" }}>
                    <IconButton size="small" disabled={index === 0 || admin.saving} onClick={() => move(index, -1)} aria-label="↑"><ArrowUpwardRoundedIcon fontSize="small" /></IconButton>
                    <IconButton size="small" disabled={index === logos.length - 1 || admin.saving} onClick={() => move(index, 1)} aria-label="↓"><ArrowDownwardRoundedIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" disabled={admin.saving} aria-label={T.remove} onClick={() => { if (window.confirm(T.confirmRemove)) void persist(logos.filter((item) => item.id !== logo.id)); }}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
                </Stack>
            </Box>)}
        </Box>
        <Dialog open={adding} onClose={() => !busy && setAdding(false)} fullWidth maxWidth="xs" slotProps={{ paper: { dir: "rtl" } }}>
            <DialogTitle>{T.add}</DialogTitle>
            <DialogContent>
                <Stack sx={{ gap: 2, pt: 1 }}>
                    <TextField label={T.name} value={name} onChange={(event) => setName(event.target.value)} fullWidth required slotProps={{ htmlInput: { maxLength: 80 } }} />
                    <Button component="label" variant="outlined" startIcon={<ImageRoundedIcon />}>
                        {file ? file.name : T.choose}
                        <input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => choose(event.target.files?.[0])} />
                    </Button>
                    {file && <Box component="img" src={URL.createObjectURL(file)} alt="" sx={{ maxHeight: 100, objectFit: "contain" }} />}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={() => setAdding(false)} disabled={busy}>{T.cancel}</Button>
                <Button variant="contained" onClick={submit} disabled={busy || !file || !name.trim()}>{busy ? T.saving : T.save}</Button>
            </DialogActions>
        </Dialog>
    </Box>;
}
