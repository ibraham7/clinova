import { useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Stack, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { languages, type SiteLanguage } from "../i18n";
import { videoPoster, youtubeId, type ClientVideo } from "../content/siteContent";
import { newId, uploadVideo, type VideoUploadConfig } from "./api";
import type { useAdminContent } from "./useAdminContent";
import { translated } from "./i18n";

const T = translated({
    title: "فيديوهات العملاء",
    intro: "تظهر الفيديوهات في قسم «تجارب حقيقية» بالموقع. يظهر القسم تلقائيًا عند إضافة أول فيديو.",
    add: "إضافة فيديو",
    empty: "لا توجد فيديوهات بعد.",
    edit: "تعديل الفيديو",
    source: "مصدر الفيديو",
    youtube: "رابط YouTube",
    upload: "رفع ملف",
    youtubeLabel: "رابط الفيديو على YouTube",
    youtubeHelp: "مثال: https://www.youtube.com/watch?v=… أو رابط Shorts. يمكن أن يكون الفيديو «غير مدرج» على YouTube.",
    badYoutube: "الرابط ليس رابط فيديو YouTube صحيحًا.",
    chooseFile: "اختيار ملف فيديو (حتى 100 ميغابايت)",
    uploaded: "تم رفع الفيديو ✓",
    uploadOff: "رفع الملفات غير مفعّل بعد: أضف CLOUDINARY_CLOUD_NAME وCLOUDINARY_UPLOAD_PRESET في إعدادات Netlify. يمكنك الآن استخدام رابط YouTube.",
    uploadFailed: "تعذر رفع الفيديو. تأكد من حجم الملف واتصالك ثم أعد المحاولة.",
    tooBig: "حجم الملف أكبر من 100 ميغابايت.",
    name: "اسم العميل أو العيادة",
    details: "التخصص والمدينة",
    detailsHelp: "مثال: طب الأسنان · الرياض",
    quote: "جملة من رأي العميل (اختياري)",
    langHelp: "العربية مطلوبة، وباقي اللغات اختيارية (تُعرض العربية إذا تُركت فارغة).",
    save: "حفظ ونشر",
    saving: "جارٍ الحفظ…",
    cancel: "إلغاء",
    remove: "حذف الفيديو",
    confirmRemove: "هل تريد حذف هذا الفيديو من الموقع؟",
    saved: "تم الحفظ. سيظهر التعديل على الموقع خلال دقيقة أو دقيقتين.",
});

const empty = (): ClientVideo => ({ id: newId("video"), url: "", name: "", details: {}, quote: {}, addedAt: new Date().toISOString().slice(0, 10) });

function VideoDialog({ initial, upload, onClose, onSave, saving }: { initial: ClientVideo; upload: VideoUploadConfig | null; onClose: () => void; onSave: (video: ClientVideo) => void; saving: boolean }) {
    const [video, setVideo] = useState(initial);
    const [source, setSource] = useState<"youtube" | "upload">(initial.url && !youtubeId(initial.url) ? "upload" : "youtube");
    const [lang, setLang] = useState<SiteLanguage>("ar");
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const youtubeOk = Boolean(youtubeId(video.url));
    const ready = video.name.trim() && video.details.ar?.trim() && (source === "youtube" ? youtubeOk : Boolean(video.url && !youtubeId(video.url)));

    const pick = async (file?: File) => {
        if (!file || !upload) return;
        if (file.size > 100 * 1024 * 1024) { setError(T.tooBig); return; }
        setError(null);
        setProgress(0);
        try {
            const result = await uploadVideo(file, upload, setProgress);
            setVideo((current) => ({ ...current, url: result.url, poster: result.poster }));
        } catch { setError(T.uploadFailed); }
        setProgress(null);
    };

    return <Dialog open onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { dir: "rtl" } }}>
        <DialogTitle>{initial.url ? T.edit : T.add}</DialogTitle>
        <DialogContent>
            <Stack sx={{ gap: 2.5, pt: 1 }}>
                <Box>
                    <Typography sx={{ fontSize: "0.8rem", mb: 1, color: "text.secondary" }}>{T.source}</Typography>
                    <ToggleButtonGroup exclusive size="small" value={source} onChange={(_, value) => { if (value) { setSource(value); setVideo((current) => ({ ...current, url: "", poster: undefined })); } }}>
                        <ToggleButton value="youtube">{T.youtube}</ToggleButton>
                        <ToggleButton value="upload">{T.upload}</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                {source === "youtube" ? <TextField label={T.youtubeLabel} value={video.url} dir="ltr" fullWidth
                    error={Boolean(video.url) && !youtubeOk} helperText={video.url && !youtubeOk ? T.badYoutube : T.youtubeHelp}
                    onChange={(event) => setVideo({ ...video, url: event.target.value.trim(), poster: undefined })} />
                    : !upload ? <Alert severity="info">{T.uploadOff}</Alert>
                    : <Box>
                        <Button component="label" variant="outlined" startIcon={<CloudUploadRoundedIcon />} disabled={progress !== null}>
                            {T.chooseFile}
                            <input hidden type="file" accept="video/*" onChange={(event) => pick(event.target.files?.[0])} />
                        </Button>
                        {progress !== null && <LinearProgress variant="determinate" value={progress * 100} sx={{ mt: 1.5 }} />}
                        {video.url && progress === null && <Typography sx={{ mt: 1, fontSize: "0.85rem", color: "success.main" }}>{T.uploaded}</Typography>}
                    </Box>}
                {error && <Alert severity="error">{error}</Alert>}
                {videoPoster(video) && <Box component="img" src={videoPoster(video)} alt="" sx={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 2 }} />}
                <TextField label={T.name} value={video.name} required fullWidth onChange={(event) => setVideo({ ...video, name: event.target.value })} slotProps={{ htmlInput: { maxLength: 120 } }} />
                <Box>
                    <Tabs value={lang} onChange={(_, value) => setLang(value)} variant="scrollable">
                        {languages.map((language) => <Tab key={language.code} value={language.code} label={language.name} />)}
                    </Tabs>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", my: 1 }}>{T.langHelp}</Typography>
                    <Stack sx={{ gap: 2 }}>
                        <TextField label={T.details} helperText={lang === "ar" ? T.detailsHelp : undefined} required={lang === "ar"} value={video.details[lang] ?? ""} dir={lang === "ar" ? "rtl" : "ltr"} fullWidth
                            onChange={(event) => setVideo({ ...video, details: { ...video.details, [lang]: event.target.value } })} slotProps={{ htmlInput: { maxLength: 200 } }} />
                        <TextField label={T.quote} value={video.quote[lang] ?? ""} dir={lang === "ar" ? "rtl" : "ltr"} multiline minRows={2} fullWidth
                            onChange={(event) => setVideo({ ...video, quote: { ...video.quote, [lang]: event.target.value } })} slotProps={{ htmlInput: { maxLength: 600 } }} />
                    </Stack>
                </Box>
            </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose}>{T.cancel}</Button>
            <Button variant="contained" disabled={!ready || saving || progress !== null} onClick={() => onSave(clean(video))}>{saving ? T.saving : T.save}</Button>
        </DialogActions>
    </Dialog>;
}

// Empty translations are dropped so the site falls back to Arabic.
function clean(video: ClientVideo): ClientVideo {
    const trim = (value: ClientVideo["details"]) => Object.fromEntries(Object.entries(value).map(([key, text]) => [key, text?.trim()]).filter(([, text]) => text));
    return { ...video, name: video.name.trim(), details: trim(video.details), quote: trim(video.quote) };
}

export default function VideosPage({ admin, upload }: { admin: ReturnType<typeof useAdminContent>; upload: VideoUploadConfig | null }) {
    const [editing, setEditing] = useState<ClientVideo | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const videos = admin.content?.videos ?? [];
    const persist = async (next: ClientVideo[]) => {
        if (!admin.content) return false;
        const error = await admin.save({ ...admin.content, videos: next });
        setMessage(error ? { type: "error", text: error } : { type: "success", text: T.saved });
        return !error;
    };
    const move = (index: number, delta: number) => {
        const next = [...videos];
        [next[index], next[index + delta]] = [next[index + delta], next[index]];
        void persist(next);
    };
    return <Box>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography component="h1" sx={{ fontSize: "1.4rem", fontWeight: 700 }}>{T.title}</Typography>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setEditing(empty())} disabled={!admin.content}>{T.add}</Button>
        </Stack>
        <Typography sx={{ fontSize: "0.88rem", color: "rgba(245,247,250,0.7)", mb: 3 }}>{T.intro}</Typography>
        {message && <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>{message.text}</Alert>}
        {admin.content && !videos.length && <Typography sx={{ color: "text.secondary" }}>{T.empty}</Typography>}
        <Stack sx={{ gap: 1.5 }}>
            {videos.map((video, index) => <Stack key={video.id} direction="row" sx={{ alignItems: "center", gap: 2, p: 1.5, borderRadius: "16px", border: "1px solid rgba(142,168,232,0.16)", backgroundColor: "rgba(142,168,232,0.04)" }}>
                <Box component="img" src={videoPoster(video)} alt="" sx={{ width: 120, height: 68, objectFit: "cover", borderRadius: "10px", backgroundColor: "#000", flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600 }} noWrap>{video.name}</Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }} noWrap>{video.details.ar}</Typography>
                </Box>
                <IconButton disabled={index === 0 || admin.saving} onClick={() => move(index, -1)} aria-label="↑"><ArrowUpwardRoundedIcon /></IconButton>
                <IconButton disabled={index === videos.length - 1 || admin.saving} onClick={() => move(index, 1)} aria-label="↓"><ArrowDownwardRoundedIcon /></IconButton>
                <IconButton onClick={() => setEditing(video)} aria-label={T.edit}><EditRoundedIcon /></IconButton>
                <IconButton color="error" disabled={admin.saving} aria-label={T.remove} onClick={() => { if (window.confirm(T.confirmRemove)) void persist(videos.filter((item) => item.id !== video.id)); }}><DeleteOutlineRoundedIcon /></IconButton>
            </Stack>)}
        </Stack>
        {editing && <VideoDialog initial={editing} upload={upload} saving={admin.saving} onClose={() => setEditing(null)} onSave={async (video) => {
            const exists = videos.some((item) => item.id === video.id);
            if (await persist(exists ? videos.map((item) => (item.id === video.id ? video : item)) : [...videos, video])) setEditing(null);
        }} />}
    </Box>;
}
