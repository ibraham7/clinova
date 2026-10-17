import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Collapse, IconButton, LinearProgress, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import { api, messageFor, type AdminArticle, type ArticleLang } from "./api";

const T = {
    title: "المدونة",
    intro: "اكتب مقالة جديدة أو عدّل مقالة موجودة بالعربية والإنجليزية والتركية والفرنسية. سيرينا تكتب لك مسودة وتترجمها، وأنت تراجعها قبل النشر. كل حفظ يُنشر على الموقع خلال دقيقتين تقريبًا.",
    add: "مقالة جديدة",
    empty: "لا توجد مقالات بعد.",
    loading: "جارٍ التحميل…",
    edit: "تعديل",
    remove: "حذف",
    confirmRemove: "هل تريد حذف هذه المقالة بكل لغاتها من الموقع؟",
    removed: "تم حذف المقالة. تختفي من الموقع خلال دقيقتين تقريبًا.",
    back: "رجوع إلى المقالات",
    newTitle: "مقالة جديدة",
    editTitle: "تعديل مقالة",
    slug: "رابط المقالة (بالإنجليزية)",
    slugHelp: "يظهر في العنوان: /ar/blog/الرابط. أحرف إنجليزية صغيرة وأرقام وشرطات. لا يتغير بعد النشر.",
    date: "تاريخ النشر",
    cover: "صورة الغلاف",
    coverHelp: "تظهر على بطاقة المقالة وفي أعلاها وعند مشاركة الرابط. الأفضل صورة عرضية (16:9)، تُصغَّر تلقائيًا.",
    chooseCover: "اختيار صورة",
    removeCover: "إزالة الصورة",
    badImage: "استخدم صورة PNG أو JPG أو WebP حتى 8 ميغابايت.",
    articleTitle: "العنوان",
    description: "وصف قصير (يظهر في Google وعلى بطاقة المقالة)",
    body: "نص المقالة",
    filled: "مكتملة",
    missing: "فارغة",
    help: "طريقة الكتابة",
    helpText: [
        "> سطر يبدأ بـ «> » هو الخلاصة في أعلى المقالة.",
        "## سطر يبدأ بـ «## » هو عنوان قسم.",
        "- سطر يبدأ بـ «- » نقطة في قائمة، و«1. » قائمة مرقمة.",
        "**نص** يصبح عريضًا، و[نص الرابط](/ar/blog/clinic-crm-system) يصبح رابطًا.",
        "Q: سؤال، ثم في السطر التالي A: الجواب، للأسئلة الشائعة في آخر المقالة.",
        "اترك سطرًا فارغًا بين الفقرات.",
    ],
    serena: "اكتب مع سيرينا",
    topic: "موضوع المقالة",
    topicHint: "مثال: كيف تختار عيادة الأسنان شركة تسويق؟",
    notes: "ملاحظات لسيرينا (اختياري): الجمهور، النقاط المهمة، الأسلوب…",
    draft: "اكتبي المسودة بالعربية",
    drafting: "سيرينا تكتب المسودة…",
    translate: "ترجمي للإنجليزية والتركية والفرنسية",
    translating: "سيرينا تترجم…",
    replaceDraft: "سيستبدل هذا النص العربي الحالي. متابعة؟",
    replaceTranslations: "سيستبدل هذا الترجمات الحالية. متابعة؟",
    needArabic: "اكتب المقالة العربية أولًا (العنوان والوصف والنص).",
    checkFormat: "راجع صيغة النص: سيرينا لم تلتزم بالصيغة تمامًا.",
    translated: "اكتملت الترجمة. راجع كل لغة قبل النشر.",
    translateFailed: "تعذرت ترجمة: ",
    save: "حفظ ونشر",
    saving: "جارٍ النشر…",
    saved: "تم النشر. تظهر المقالة على الموقع خلال دقيقتين تقريبًا.",
    view: "عرض على الموقع",
    required: "العنوان والوصف والنص بالعربية مطلوبة.",
    partial: "أكمل العنوان والوصف والنص في: ",
    dropLanguage: "اللغات الفارغة لن تُنشر (وتُحذف إن كانت منشورة سابقًا): ",
    langs: { ar: "العربية", en: "English", tr: "Türkçe", fr: "Français" } as Record<ArticleLang, string>,
};

const languages: ArticleLang[] = ["ar", "en", "tr", "fr"];
type Fields = { title: string; description: string; body: string; seoTitle?: string };
type Draft = { slug: string; isNew: boolean; date: string; updated?: string; cover: string | null; texts: Record<ArticleLang, Fields> };

const today = () => new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10);
const emptyFields = (): Fields => ({ title: "", description: "", body: "" });
const newDraft = (): Draft => ({ slug: "", isNew: true, date: today(), cover: null, texts: { ar: emptyFields(), en: emptyFields(), tr: emptyFields(), fr: emptyFields() } });
const filled = (fields: Fields) => Boolean(fields.title.trim() && fields.description.trim() && fields.body.trim());
const blank = (fields: Fields) => !fields.title.trim() && !fields.description.trim() && !fields.body.trim();
const oneLine = (text: string) => text.replace(/\s*\n\s*/g, " ").trim();

function parse(markdown: string): { meta: Record<string, string>; body: string } {
    const source = markdown.replace(/\r\n/g, "\n");
    const match = /^---\n([\s\S]*?)\n---\n/.exec(source);
    if (!match) return { meta: {}, body: source };
    const meta: Record<string, string> = {};
    for (const line of match[1].split("\n")) {
        const at = line.indexOf(":");
        if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
    }
    return { meta, body: source.slice(match[0].length).replace(/^\n+/, "") };
}
const fieldsOf = (markdown: string): Fields => {
    const { meta, body } = parse(markdown);
    return { title: meta.title ?? "", description: meta.description ?? "", body, seoTitle: meta.seoTitle };
};
function build(fields: Fields, draft: Draft) {
    const meta: [string, string | undefined][] = [["title", oneLine(fields.title)], ["seoTitle", fields.seoTitle], ["description", oneLine(fields.description)], ["date", draft.date], ["updated", draft.updated]];
    return `---\n${meta.filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join("\n")}\n---\n${fields.body.trim()}\n`;
}
const slugFrom = (text: string) => text.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

// Covers are redrawn as WebP no wider than 1600 px, which keeps them well under the 1.5 MB upload limit.
async function toCover(file: File) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    if (!blob) throw new Error("image");
    const data = await new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] ?? ""); reader.readAsDataURL(blob); });
    return { url: URL.createObjectURL(blob), data };
}

const card = { p: { xs: 2, md: 3 }, borderRadius: "20px", border: "1px solid rgba(142,168,232,0.16)", backgroundColor: "rgba(142,168,232,0.04)" };

export default function BlogPage() {
    const [list, setList] = useState<AdminArticle[] | null>(null);
    const [draft, setDraft] = useState<Draft | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error" | "info" | "warning"; text: string; link?: string } | null>(null);
    const [reload, setReload] = useState(0);
    const [opening, setOpening] = useState<string | null>(null);

    useEffect(() => {
        let live = true;
        void api.articles().then((result) => {
            if (!live) return;
            if (result.status === 200) setList(result.data.articles);
            else { setList([]); setMessage({ type: "error", text: messageFor(result.data.error) }); }
        });
        return () => { live = false; };
    }, [reload]);

    const open = async (article: AdminArticle) => {
        setOpening(article.slug);
        const result = await api.article(article.slug);
        setOpening(null);
        if (result.status !== 200) { setMessage({ type: "error", text: messageFor(result.data.error) }); return; }
        const texts = Object.fromEntries(languages.map((lang) => [lang, result.data.files[lang] ? fieldsOf(result.data.files[lang]!) : emptyFields()])) as Record<ArticleLang, Fields>;
        const meta = parse(result.data.files.ar ?? Object.values(result.data.files)[0] ?? "").meta;
        setMessage(null);
        setDraft({ slug: article.slug, isNew: false, date: meta.date ?? today(), cover: meta.cover ?? null, texts });
    };
    const remove = async (article: AdminArticle) => {
        if (!window.confirm(T.confirmRemove)) return;
        const result = await api.deleteArticle(article.slug);
        if (result.status !== 200) { setMessage({ type: "error", text: messageFor(result.data.error) }); return; }
        setMessage({ type: "success", text: T.removed });
        setList((current) => current?.filter((item) => item.slug !== article.slug) ?? null);
    };

    if (draft) return <Editor draft={draft} setDraft={setDraft} close={(saved) => { setDraft(null); if (saved) { setMessage(saved); setReload((count) => count + 1); } }} />;

    return <Box>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography component="h1" sx={{ fontSize: "1.4rem", fontWeight: 700 }}>{T.title}</Typography>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => { setMessage(null); setDraft(newDraft()); }}>{T.add}</Button>
        </Stack>
        <Typography sx={{ fontSize: "0.88rem", color: "rgba(245,247,250,0.7)", mb: 3, maxWidth: 760, lineHeight: 1.8 }}>{T.intro}</Typography>
        {message && <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }} action={message.link ? <Button color="inherit" size="small" href={message.link} target="_blank" rel="noopener" endIcon={<OpenInNewRoundedIcon />}>{T.view}</Button> : undefined}>{message.text}</Alert>}
        {!list && <Stack direction="row" sx={{ gap: 1, alignItems: "center", color: "text.secondary" }}><CircularProgress size={18} />{T.loading}</Stack>}
        {list && !list.length && <Typography sx={{ color: "text.secondary" }}>{T.empty}</Typography>}
        <Stack sx={{ gap: 1.5 }}>
            {list?.map((article) => <Stack key={article.slug} direction={{ xs: "column", sm: "row" }} sx={{ ...card, p: 2, gap: 2, alignItems: { sm: "center" } }}>
                <Box sx={{ width: { xs: "100%", sm: 128 }, aspectRatio: "16 / 9", flexShrink: 0, borderRadius: "12px", overflow: "hidden", backgroundColor: "rgba(142,168,232,0.08)", display: "grid", placeItems: "center" }}>
                    {article.cover ? <Box component="img" src={article.cover} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageRoundedIcon sx={{ color: "rgba(142,168,232,0.4)" }} />}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, lineHeight: 1.6 }}>{article.title}</Typography>
                    <Stack direction="row" sx={{ gap: 0.75, mt: 0.75, flexWrap: "wrap", alignItems: "center" }}>
                        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", me: 1 }} dir="ltr">{article.updated ?? article.date} · /{article.slug}</Typography>
                        {languages.map((lang) => <Chip key={lang} size="small" label={lang.toUpperCase()} variant={article.languages.includes(lang) ? "filled" : "outlined"} sx={{ height: 20, fontSize: "0.68rem", opacity: article.languages.includes(lang) ? 1 : 0.4 }} />)}
                    </Stack>
                </Box>
                <Stack direction="row" sx={{ gap: 0.5, flexShrink: 0 }}>
                    <Button size="small" startIcon={opening === article.slug ? <CircularProgress size={14} /> : <EditRoundedIcon />} disabled={Boolean(opening)} onClick={() => void open(article)}>{T.edit}</Button>
                    <IconButton size="small" href={`/ar/blog/${article.slug}`} target="_blank" rel="noopener" aria-label={T.view}><OpenInNewRoundedIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" aria-label={T.remove} onClick={() => void remove(article)}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
                </Stack>
            </Stack>)}
        </Stack>
    </Box>;
}

function Editor({ draft, setDraft, close }: { draft: Draft; setDraft: (draft: Draft) => void; close: (saved?: { type: "success"; text: string; link: string }) => void }) {
    const [lang, setLang] = useState<ArticleLang>("ar");
    const [cover, setCover] = useState<{ url: string; data: string } | null>(null);
    const [removeCover, setRemoveCover] = useState(false);
    const [topic, setTopic] = useState("");
    const [notes, setNotes] = useState("");
    const [busy, setBusy] = useState<"draft" | "translate" | "save" | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error" | "info" | "warning"; text: string } | null>(null);
    const [help, setHelp] = useState(false);
    const [slugTouched, setSlugTouched] = useState(!draft.isNew);
    const fields = draft.texts[lang];

    const setFields = (target: ArticleLang, next: Partial<Fields>) => {
        const texts = { ...draft.texts, [target]: { ...draft.texts[target], ...next } };
        // A new article's link follows its English title until the admin types one.
        const slug = draft.isNew && !slugTouched && target === "en" && next.title !== undefined ? slugFrom(next.title) : draft.slug;
        setDraft({ ...draft, slug, texts });
    };

    const chooseCover = async (file?: File) => {
        if (!file) return;
        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 8_000_000) { setMessage({ type: "error", text: T.badImage }); return; }
        try { setCover(await toCover(file)); setRemoveCover(false); } catch { setMessage({ type: "error", text: T.badImage }); }
    };

    const writeDraft = async () => {
        if (!blank(draft.texts.ar) && !window.confirm(T.replaceDraft)) return;
        setBusy("draft");
        setMessage(null);
        const result = await api.articleAi({ action: "draft", topic, notes: notes || undefined });
        setBusy(null);
        if (result.status !== 200) { setMessage({ type: "error", text: messageFor(result.data.error) }); return; }
        setLang("ar");
        setDraft({ ...draft, texts: { ...draft.texts, ar: { ...fieldsOf(result.data.markdown), seoTitle: undefined } } });
        if (result.data.check) setMessage({ type: "warning", text: T.checkFormat });
    };

    const translateAll = async () => {
        if (!filled(draft.texts.ar)) { setMessage({ type: "error", text: T.needArabic }); return; }
        const targets: ArticleLang[] = ["en", "tr", "fr"];
        if (targets.some((target) => !blank(draft.texts[target])) && !window.confirm(T.replaceTranslations)) return;
        setBusy("translate");
        setMessage(null);
        const markdown = build(draft.texts.ar, draft);
        // One request per language, all at once: each fits the server's time limit on its own.
        const results = await Promise.all(targets.map((to) => api.articleAi({ action: "translate", markdown, to }).then((result) => ({ to, result }))));
        setBusy(null);
        const texts = { ...draft.texts };
        const failed: string[] = [];
        for (const { to, result } of results) {
            if (result.status === 200) texts[to] = fieldsOf(result.data.markdown);
            else failed.push(`${T.langs[to]} (${messageFor(result.data.error)})`);
        }
        let slug = draft.slug;
        if (draft.isNew && !slugTouched && texts.en.title) slug = slugFrom(texts.en.title);
        setDraft({ ...draft, slug, texts });
        setMessage(failed.length ? { type: "error", text: T.translateFailed + failed.join("، ") } : { type: "success", text: T.translated });
    };

    const save = async () => {
        if (!filled(draft.texts.ar)) { setLang("ar"); setMessage({ type: "error", text: T.required }); return; }
        const partial = languages.filter((code) => !blank(draft.texts[code]) && !filled(draft.texts[code]));
        if (partial.length) { setLang(partial[0]); setMessage({ type: "error", text: T.partial + partial.map((code) => T.langs[code]).join("، ") }); return; }
        const empty = languages.filter((code) => blank(draft.texts[code]));
        if (empty.length && !draft.isNew && !window.confirm(T.dropLanguage + empty.map((code) => T.langs[code]).join("، "))) return;
        const stamped = { ...draft, updated: draft.isNew ? undefined : today() };
        const files = Object.fromEntries(languages.filter((code) => filled(draft.texts[code])).map((code) => [code, build(draft.texts[code], stamped)]));
        setBusy("save");
        setMessage(null);
        const result = await api.saveArticle({ slug: draft.slug, isNew: draft.isNew, files, ...(cover ? { cover: cover.data } : removeCover ? { removeCover: true } : {}) });
        setBusy(null);
        if (result.status !== 200) {
            const error = result.data as { error?: string; lang?: ArticleLang };
            if (error.lang) setLang(error.lang);
            setMessage({ type: "error", text: messageFor(error.error) + (error.lang ? ` (${T.langs[error.lang]})` : "") });
            return;
        }
        close({ type: "success", text: T.saved, link: `/ar/blog/${draft.slug}` });
    };

    const shownCover = cover?.url ?? (removeCover ? null : draft.cover);
    return <Box>
        <Button startIcon={<ArrowForwardRoundedIcon />} onClick={() => close()} disabled={Boolean(busy)} sx={{ mb: 2 }}>{T.back}</Button>
        <Typography component="h1" sx={{ fontSize: "1.4rem", fontWeight: 700, mb: 2 }}>{draft.isNew ? T.newTitle : T.editTitle}</Typography>
        {message && <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>{message.text}</Alert>}

        <Box sx={{ ...card, mb: 2.5, borderColor: "rgba(142,168,232,0.3)", background: "linear-gradient(135deg, rgba(142,168,232,0.1), rgba(142,168,232,0.03))" }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 1.5 }}><AutoAwesomeRoundedIcon sx={{ color: "primary.light" }} /><Typography sx={{ fontWeight: 700 }}>{T.serena}</Typography></Stack>
            <Stack sx={{ gap: 1.5 }}>
                <TextField label={T.topic} placeholder={T.topicHint} value={topic} onChange={(event) => setTopic(event.target.value)} fullWidth size="small" />
                <TextField label={T.notes} value={notes} onChange={(event) => setNotes(event.target.value)} fullWidth size="small" multiline maxRows={4} />
                <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
                    <Button variant="contained" startIcon={<AutoAwesomeRoundedIcon />} disabled={Boolean(busy) || topic.trim().length < 3} onClick={() => void writeDraft()}>{busy === "draft" ? T.drafting : T.draft}</Button>
                    <Button variant="outlined" startIcon={<TranslateRoundedIcon />} disabled={Boolean(busy)} onClick={() => void translateAll()}>{busy === "translate" ? T.translating : T.translate}</Button>
                </Stack>
                {(busy === "draft" || busy === "translate") && <LinearProgress sx={{ borderRadius: 2 }} />}
            </Stack>
        </Box>

        <Box sx={{ ...card, mb: 2.5, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
            <Stack sx={{ gap: 2 }}>
                <TextField label={T.slug} value={draft.slug} disabled={!draft.isNew} onChange={(event) => { setSlugTouched(true); setDraft({ ...draft, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-").slice(0, 80) }); }} helperText={T.slugHelp} size="small" slotProps={{ htmlInput: { dir: "ltr" } }} />
                <TextField label={T.date} type="date" value={draft.date} onChange={(event) => event.target.value && setDraft({ ...draft, date: event.target.value })} size="small" slotProps={{ inputLabel: { shrink: true } }} />
            </Stack>
            <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, mb: 0.5 }}>{T.cover}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 1 }}>{T.coverHelp}</Typography>
                <Stack direction="row" sx={{ gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
                    <Box sx={{ width: 160, aspectRatio: "16 / 9", borderRadius: "12px", overflow: "hidden", backgroundColor: "rgba(142,168,232,0.08)", display: "grid", placeItems: "center" }}>
                        {shownCover ? <Box component="img" src={shownCover} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageRoundedIcon sx={{ color: "rgba(142,168,232,0.4)" }} />}
                    </Box>
                    <Stack sx={{ gap: 0.5 }}>
                        <Button component="label" size="small" variant="outlined" startIcon={<ImageRoundedIcon />}>{T.chooseCover}<input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { void chooseCover(event.target.files?.[0]); event.target.value = ""; }} /></Button>
                        {shownCover && <Button size="small" color="inherit" onClick={() => { setCover(null); setRemoveCover(true); }}>{T.removeCover}</Button>}
                    </Stack>
                </Stack>
            </Box>
        </Box>

        <Box sx={card}>
            <Tabs value={lang} onChange={(_, value) => setLang(value)} variant="scrollable" sx={{ mb: 2, minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none" } }}>
                {languages.map((code) => <Tab key={code} value={code} label={<Stack direction="row" sx={{ gap: 0.75, alignItems: "center" }}>{T.langs[code]}<Box component="span" sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: filled(draft.texts[code]) ? "#7FD6A4" : blank(draft.texts[code]) ? "rgba(245,247,250,0.25)" : "#E8C46A" }} aria-label={filled(draft.texts[code]) ? T.filled : T.missing} /></Stack>} />)}
            </Tabs>
            <Stack sx={{ gap: 2 }} dir={lang === "ar" ? "rtl" : "ltr"}>
                <TextField label={T.articleTitle} value={fields.title} onChange={(event) => setFields(lang, { title: event.target.value })} fullWidth slotProps={{ htmlInput: { maxLength: 200 } }} />
                <TextField label={T.description} value={fields.description} onChange={(event) => setFields(lang, { description: event.target.value })} fullWidth multiline maxRows={3} slotProps={{ htmlInput: { maxLength: 400 } }} helperText={`${fields.description.length} / 160`} />
                <TextField label={T.body} value={fields.body} onChange={(event) => setFields(lang, { body: event.target.value })} fullWidth multiline minRows={16} maxRows={40} sx={{ "& textarea": { lineHeight: 1.9, fontSize: "0.92rem" } }} />
            </Stack>
            <Button size="small" startIcon={<HelpOutlineRoundedIcon />} onClick={() => setHelp(!help)} sx={{ mt: 1 }}>{T.help}</Button>
            <Collapse in={help}><Box component="ul" sx={{ m: 0, mt: 1, ps: 3, fontSize: "0.8rem", color: "rgba(245,247,250,0.75)", lineHeight: 2 }}>{T.helpText.map((line) => <li key={line}>{line}</li>)}</Box></Collapse>
        </Box>

        <Stack direction="row" sx={{ position: "sticky", bottom: 0, mt: 2.5, py: 2, gap: 1.5, alignItems: "center", backgroundColor: "#0B111B", borderTop: "1px solid rgba(142,168,232,0.14)", zIndex: 2 }}>
            <Button variant="contained" size="large" disabled={Boolean(busy) || draft.slug.length < 3} onClick={() => void save()} startIcon={busy === "save" ? <CircularProgress size={16} color="inherit" /> : undefined}>{busy === "save" ? T.saving : T.save}</Button>
            <Button onClick={() => close()} disabled={Boolean(busy)}>{T.back}</Button>
        </Stack>
    </Box>;
}
