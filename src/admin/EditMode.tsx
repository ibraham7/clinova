import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Switch, TextField, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import ar from "../i18n/locales/ar.json";
import en from "../i18n/locales/en.json";
import tr from "../i18n/locales/tr.json";
import fr from "../i18n/locales/fr.json";
import i18n, { languages, type SiteLanguage } from "../i18n";
import type { SiteContent } from "../content/siteContent";
import { api, messageFor } from "./api";

const builtIn: Record<SiteLanguage, Record<string, string>> = { ar, en, tr, fr };
const codes = languages.map((language) => language.code) as SiteLanguage[];
const T = {
    checking: "جارٍ التحقق من تسجيل الدخول…",
    signedOut: "وضع التعديل يحتاج تسجيل الدخول.",
    login: "تسجيل الدخول",
    hint: "مرّر الماوس على أي نص واضغط عليه لتعديله",
    browse: "وضع التعديل",
    unsaved: (count: number) => `${count} تعديل غير محفوظ`,
    clean: "لا توجد تعديلات غير محفوظة",
    save: "حفظ ونشر",
    saving: "جارٍ الحفظ…",
    saved: "تم الحفظ. سيظهر التعديل على الموقع خلال دقيقة أو دقيقتين.",
    discard: "إلغاء التعديلات",
    dialogTitle: "تعديل النص",
    shared: "هذا النص يظهر في أكثر من مكان في الموقع، وسيتغير في كل الأماكن.",
    original: "النص الأصلي",
    apply: "تطبيق",
    cancel: "إلغاء",
    reset: "استرجاع النص الأصلي",
    names: { ar: "العربية", en: "English", tr: "Türkçe", fr: "Français" } as Record<SiteLanguage, string>,
};

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

/** The text node under the pointer, if the pointer is really over its glyphs. */
function textNodeAt(x: number, y: number): Text | null {
    const doc = document as Document & { caretRangeFromPoint?: (x: number, y: number) => Range | null; caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null };
    const node = doc.caretRangeFromPoint?.(x, y)?.startContainer ?? doc.caretPositionFromPoint?.(x, y)?.offsetNode;
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const range = document.createRange();
    range.selectNodeContents(node);
    const inside = Array.from(range.getClientRects()).some((rect) => x >= rect.left - 2 && x <= rect.right + 2 && y >= rect.top - 2 && y <= rect.bottom + 2);
    return inside ? (node as Text) : null;
}

const isEditorUi = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest("[data-clinova-editor]"));

/** Click-to-edit layer shown on top of the live site at /<lang>?edit for signed-in admins. */
export default function EditMode() {
    const [status, setStatus] = useState<"checking" | "signed-out" | "ready">("checking");
    const [content, setContent] = useState<SiteContent | null>(null);
    const [sha, setSha] = useState("");
    const [saved, setSaved] = useState<SiteContent["texts"] | null>(null);
    const [draft, setDraft] = useState<SiteContent["texts"] | null>(null);
    const [enabled, setEnabled] = useState(true);
    const [hover, setHover] = useState<{ keys: string[]; rect: DOMRect } | null>(null);
    const [dialog, setDialog] = useState<{ keys: string[]; values: Record<SiteLanguage, string> } | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const [version, setVersion] = useState(0);
    const lang = (i18n.resolvedLanguage ?? "ar") as SiteLanguage;

    const apply = useCallback((texts: SiteContent["texts"]) => {
        for (const code of codes) i18n.addResourceBundle(code, "translation", { ...builtIn[code], ...texts[code] }, true, true);
        void i18n.changeLanguage(i18n.language);
        setVersion((value) => value + 1);
    }, []);

    useEffect(() => {
        void (async () => {
            const session = await api.session();
            if (session.status !== 200) { setStatus("signed-out"); return; }
            const loaded = await api.load();
            if (loaded.status !== 200) { setStatus("ready"); setMessage({ type: "error", text: messageFor(loaded.data.error) }); return; }
            setContent(loaded.data.content);
            setSha(loaded.data.sha);
            setSaved(loaded.data.content.texts);
            setDraft(loaded.data.content.texts);
            apply(loaded.data.content.texts);
            setStatus("ready");
        })();
    }, [apply]);

    // Rendered text → the translation keys that produce it in the current language.
    const lookup = useMemo(() => {
        const map = new Map<string, string[]>();
        void version;
        for (const [key, value] of Object.entries(i18n.getResourceBundle(lang, "translation") as Record<string, string>)) {
            const text = normalize(value);
            if (text) map.set(text, [...(map.get(text) ?? []), key]);
        }
        return map;
    }, [lang, version]);

    const hoverRef = useRef(hover);
    useEffect(() => { hoverRef.current = hover; }, [hover]);
    const active = status === "ready" && enabled && Boolean(draft) && !dialog;

    useEffect(() => {
        if (!active) return;
        const move = (event: MouseEvent) => {
            if (isEditorUi(event.target)) { setHover(null); return; }
            const node = textNodeAt(event.clientX, event.clientY);
            const keys = node ? lookup.get(normalize(node.data)) : undefined;
            if (!node || !keys) { setHover(null); return; }
            const range = document.createRange();
            range.selectNodeContents(node);
            setHover({ keys, rect: range.getBoundingClientRect() });
        };
        // Capture clicks before the site's own handlers so links and buttons don't fire while editing.
        const click = (event: MouseEvent) => {
            if (isEditorUi(event.target)) return;
            event.preventDefault();
            event.stopPropagation();
            const current = hoverRef.current;
            if (!current) return;
            const values = Object.fromEntries(codes.map((code) => [code, (i18n.getResourceBundle(code, "translation") as Record<string, string>)[current.keys[0]] ?? ""])) as Record<SiteLanguage, string>;
            setDialog({ keys: current.keys, values });
        };
        window.addEventListener("mousemove", move, { passive: true });
        window.addEventListener("click", click, true);
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("click", click, true);
        };
    }, [active, lookup]);

    const changes = useMemo(() => {
        if (!draft || !saved) return 0;
        const keys = new Set(codes.flatMap((code) => [...Object.keys(draft[code]), ...Object.keys(saved[code])].map((key) => `${code}:${key}`)));
        return [...keys].filter((id) => { const [code, key] = [id.slice(0, 2) as SiteLanguage, id.slice(3)]; return draft[code][key] !== saved[code][key]; }).length;
    }, [draft, saved]);

    const applyDialog = () => {
        if (!dialog || !draft) return;
        const next = Object.fromEntries(codes.map((code) => [code, { ...draft[code] }])) as SiteContent["texts"];
        for (const key of dialog.keys) {
            for (const code of codes) {
                const value = dialog.values[code];
                // Only differences from the built-in translation are stored.
                if (!value.trim() || value === builtIn[code][key]) delete next[code][key];
                else next[code][key] = value;
            }
        }
        setDraft(next);
        apply(next);
        setDialog(null);
    };

    const save = async () => {
        if (!content || !draft) return;
        setBusy(true);
        const next = { ...content, texts: draft };
        const result = await api.save(next, sha, content);
        setBusy(false);
        if (result.status !== 200) { setMessage({ type: "error", text: messageFor(result.data.error) }); return; }
        // The saved file can hold edits saved meanwhile from another tab or device: show those too.
        const merged = result.data.content ?? next;
        setContent(merged);
        setSha(result.data.sha);
        setSaved(merged.texts);
        setDraft(merged.texts);
        apply(merged.texts);
        setMessage({ type: "success", text: T.saved });
    };

    if (status === "checking") return null;
    const bar = { position: "fixed" as const, zIndex: 1500, left: "50%", transform: "translateX(-50%)", bottom: 16 };
    if (status === "signed-out") return <Box data-clinova-editor dir="rtl" sx={{ ...bar }}>
        <Alert severity="warning" action={<Button href="/admin" color="inherit" size="small">{T.login}</Button>}>{T.signedOut}</Alert>
    </Box>;

    return <>
        {hover && active && <Box aria-hidden="true" sx={{
            position: "fixed", zIndex: 1400, pointerEvents: "none", borderRadius: "6px",
            left: hover.rect.left - 6, top: hover.rect.top - 4, width: hover.rect.width + 12, height: hover.rect.height + 8,
            outline: "2px solid #F5C451", backgroundColor: "rgba(245, 196, 81, 0.12)", boxShadow: "0 0 0 4px rgba(245, 196, 81, 0.18)",
            transition: "left 120ms ease, top 120ms ease, width 120ms ease, height 120ms ease",
        }} />}

        <Box data-clinova-editor dir="rtl" sx={{
            ...bar, display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: 1.5, px: 2, py: 1.25, maxWidth: "calc(100vw - 24px)",
            borderRadius: "18px", backgroundColor: "#111B2A", color: "#F5F7FA", border: "1px solid rgba(245, 196, 81, 0.5)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        }}>
            <EditRoundedIcon sx={{ color: "#F5C451" }} />
            <Typography sx={{ fontSize: "0.82rem", display: { xs: "none", md: "block" } }}>{T.hint}</Typography>
            <Stack direction="row" sx={{ alignItems: "center" }}>
                <Switch size="small" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
                <Typography sx={{ fontSize: "0.78rem" }}>{T.browse}</Typography>
            </Stack>
            <Typography sx={{ fontSize: "0.78rem", color: changes ? "#F5C451" : "rgba(245,247,250,0.6)" }}>{changes ? T.unsaved(changes) : T.clean}</Typography>
            {changes > 0 && <Button size="small" color="inherit" onClick={() => window.location.reload()}>{T.discard}</Button>}
            <Button size="small" variant="contained" disabled={!changes || busy} onClick={save} startIcon={<CloudDoneRoundedIcon />} sx={{ borderRadius: "999px", "& .MuiButton-startIcon": { marginLeft: "8px", marginRight: "-4px" } }}>{busy ? T.saving : T.save}</Button>
        </Box>

        {message && <Box data-clinova-editor dir="rtl" sx={{ position: "fixed", zIndex: 1700, top: 16, left: "50%", transform: "translateX(-50%)", maxWidth: "calc(100vw - 24px)" }}>
            <Alert severity={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>
        </Box>}

        {/* Above the save bar (z-index 1500), which would otherwise cover the Apply button. */}
        <Dialog open={Boolean(dialog)} onClose={() => setDialog(null)} fullWidth maxWidth="sm" data-clinova-editor sx={{ zIndex: 1600 }} slotProps={{ paper: { dir: "rtl" } }}>
            <DialogTitle>{T.dialogTitle}</DialogTitle>
            {dialog && <DialogContent>
                {dialog.keys.length > 1 && <Alert severity="info" sx={{ mb: 2 }}>{T.shared}</Alert>}
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 2 }}>{T.original}: {dialog.keys[0]}</Typography>
                <Stack sx={{ gap: 2 }}>
                    {[lang, ...codes.filter((code) => code !== lang)].map((code) => <TextField
                        key={code} label={T.names[code]} value={dialog.values[code]} multiline minRows={1} maxRows={8} fullWidth
                        autoFocus={code === lang}
                        slotProps={{ htmlInput: { dir: code === "ar" ? "rtl" : "ltr", maxLength: 4000 } }}
                        onChange={(event) => setDialog({ ...dialog, values: { ...dialog.values, [code]: event.target.value } })}
                    />)}
                </Stack>
            </DialogContent>}
            <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
                <Button color="inherit" onClick={() => dialog && setDialog({ ...dialog, values: Object.fromEntries(codes.map((code) => [code, builtIn[code][dialog.keys[0]] ?? ""])) as Record<SiteLanguage, string> })}>{T.reset}</Button>
                <Stack direction="row" sx={{ gap: 1 }}>
                    <Button onClick={() => setDialog(null)}>{T.cancel}</Button>
                    <Button variant="contained" onClick={applyDialog}>{T.apply}</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    </>;
}
