import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Alert, Box, Button, ButtonBase, CircularProgress, IconButton, Stack, TextField, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { askSerena, messageFor } from "./api";
import type { ReportFilters } from "./reportTypes";

const T = {
    title: "سيرينا",
    subtitle: "مساعدتك الذكية: تقرأ بيانات الموقع وتقترح ماذا نفعل لنطوّر المشروع.",
    placeholder: "اسأل سيرينا عن الزوار، الأقسام، الدول، الاستبيان، أو ما تغيّر بعد تاريخ معيّن…",
    send: "إرسال",
    stop: "إيقاف",
    reset: "محادثة جديدة",
    thinking: "سيرينا تحلّل البيانات…",
    reading: (input: ReportFilters) => `تقرأ بيانات ${input.from} ← ${input.to}${["country", "device", "lang", "source", "channel", "path"].map((key) => input[key as keyof ReportFilters]).filter(Boolean).map((value) => ` · ${value}`).join("")}`,
    daily: "حلّل بيانات هذه الفترة: ماذا يحدث على الموقع، أين يتوقف الزوار، ما الذي تغيّر مقارنة بالفترة السابقة، وما أهم 3 خطوات نعملها هذا الأسبوع؟",
    suggestions: [
        "أين يتوقف الزوار وأي قسم يجذب أكثر اهتمام؟",
        "من أي دول ومصادر يأتي الزوار الذين يتركون إيميلاتهم؟",
        "ماذا تغيّر بعد نشر آخر مقالة في المدونة؟",
        "كيف أداء نافذة الاستبيان؟ وماذا نحسّن فيها؟",
        "ما الذي تغيّر بعد آخر تعديل على نصوص الموقع؟",
    ],
};

type Message = { role: "user" | "assistant"; content: string; error?: string; detail?: string; status?: string };
const storageKey = "clinova.serena";

function load(): { day: string; messages: Message[] } | null {
    try { return JSON.parse(localStorage.getItem(storageKey) ?? "null"); } catch { return null; }
}
function save(messages: Message[]) {
    try { localStorage.setItem(storageKey, JSON.stringify({ day: new Date().toISOString().slice(0, 10), messages: messages.slice(-30) })); } catch { /* Optional. */ }
}

/** Only answered question/answer pairs go back to Serena, so the roles always alternate. */
function answered(history: Message[]) {
    const kept: Message[] = [];
    for (const message of history) {
        if (message.role === "user") { if (kept.at(-1)?.role === "user") kept.pop(); kept.push(message); }
        else if (message.content && !message.error && kept.at(-1)?.role === "user") kept.push({ role: "assistant", content: message.content });
    }
    if (kept.at(-1)?.role === "user") kept.pop();
    return kept;
}

// Minimal markdown: headings, bullet and numbered lists, **bold**. Built as React nodes, never as HTML.
function inline(text: string): ReactNode[] {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part);
}
function Markdown({ text }: { text: string }) {
    const lines = text.split("\n");
    return <Box sx={{ fontSize: "0.92rem", lineHeight: 1.9, "& h3, & h4": { m: 0, mt: 1.5, mb: 0.5, fontSize: "1rem" }, "& ul, & ol": { m: 0, ps: 3 }, "& p": { m: 0, mb: 0.75 } }}>
        {lines.map((line, index) => {
            const heading = line.match(/^#{1,4}\s+(.*)/);
            if (heading) return <h4 key={index}>{inline(heading[1])}</h4>;
            const bullet = line.match(/^\s*[-*•]\s+(.*)/);
            if (bullet) return <ul key={index}><li>{inline(bullet[1])}</li></ul>;
            const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)/);
            if (numbered) return <ol key={index} start={Number(numbered[1])}><li>{inline(numbered[2])}</li></ol>;
            if (/^\s*(---|\|?[-:| ]+\|?)\s*$/.test(line) && line.includes("-")) return null;
            if (line.trim().startsWith("|")) return <Box key={index} component="p" sx={{ fontFamily: "monospace", fontSize: "0.82rem", whiteSpace: "pre-wrap" }}>{line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()).join("  ·  ")}</Box>;
            return line.trim() ? <p key={index}>{inline(line)}</p> : null;
        })}
    </Box>;
}

export default function SerenaPanel({ view, ready }: { view: ReportFilters; ready: boolean }) {
    const [messages, setMessages] = useState<Message[]>(() => load()?.messages ?? []);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const abort = useRef<AbortController | null>(null);
    const end = useRef<HTMLDivElement>(null);
    const autoStarted = useRef(false);

    const ask = async (question: string, history: Message[] = messages) => {
        if (!question.trim() || busy) return;
        const base: Message[] = [...answered(history), { role: "user", content: question.trim() }];
        let answer: Message = { role: "assistant", content: "", status: T.thinking };
        setMessages([...base, answer]);
        setInput("");
        setBusy(true);
        const controller = new AbortController();
        abort.current = controller;
        try {
            await askSerena(base.map(({ role, content }) => ({ role, content })), view, (chunk) => {
                if (chunk.type === "text") answer = { ...answer, content: answer.content + chunk.text, status: undefined };
                else if (chunk.type === "status") answer = { ...answer, status: T.reading(chunk.input) };
                else if (chunk.type === "error") answer = { ...answer, error: chunk.error, detail: chunk.detail, status: undefined };
                else answer = { ...answer, status: undefined };
                setMessages([...base, answer]);
            }, controller.signal);
        } catch (error) {
            if (!(error instanceof DOMException && error.name === "AbortError")) answer = { ...answer, error: "failed" };
        }
        answer = { ...answer, status: undefined };
        // A failed turn leaves the question so the admin can retry; history sent to Serena skips it.
        const final = answer.content || answer.error ? [...base, answer] : base;
        setMessages(final);
        save(answered(final));
        setBusy(false);
        abort.current = null;
    };

    // "First thing every day": a fresh briefing when the reports page opens on a new day.
    useEffect(() => {
        if (!ready || autoStarted.current) return;
        autoStarted.current = true;
        const saved = load();
        const today = new Date().toISOString().slice(0, 10);
        if (saved?.day === today && saved.messages.length) return;
        const timer = window.setTimeout(() => { void ask(T.daily, []); }, 0);
        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready]);

    useEffect(() => { end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [messages]);

    const submit = (event: FormEvent) => { event.preventDefault(); void ask(input); };

    return <Box sx={{
        p: { xs: 2, md: 3 }, borderRadius: "24px", border: "1px solid rgba(184,200,239,0.35)",
        background: "radial-gradient(circle at 100% 0%, rgba(142,168,232,0.2), transparent 45%), radial-gradient(circle at 0% 100%, rgba(232,184,110,0.08), transparent 40%), #111B2A",
    }}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: "50%", display: "grid", placeItems: "center", color: "#0B111B", background: "linear-gradient(135deg, #B8C8EF, #7894D2)", boxShadow: "0 0 24px rgba(142,168,232,0.45)", flexShrink: 0 }}>
                <AutoAwesomeRoundedIcon />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700 }}>{T.title}</Typography>
                <Typography sx={{ fontSize: "0.82rem", color: "rgba(245,247,250,0.65)" }}>{T.subtitle}</Typography>
            </Box>
            {messages.length > 0 && <IconButton aria-label={T.reset} title={T.reset} disabled={busy} onClick={() => { setMessages([]); save([]); }} sx={{ color: "rgba(245,247,250,0.7)" }}><RestartAltRoundedIcon /></IconButton>}
        </Stack>

        <Box sx={{ maxHeight: 520, overflowY: "auto", display: "grid", gap: 1.5, mb: 2, pe: 0.5 }} aria-live="polite">
            {messages.map((message, index) => message.role === "user"
                ? <Box key={index} sx={{ justifySelf: "start", maxWidth: "85%", px: 2, py: 1.25, borderRadius: "16px", backgroundColor: "rgba(142,168,232,0.16)", fontSize: "0.9rem", lineHeight: 1.8 }}>{message.content}</Box>
                : <Box key={index} sx={{ px: 2, py: 1.5, borderRadius: "16px", backgroundColor: "rgba(11,17,27,0.55)", border: "1px solid rgba(142,168,232,0.12)" }}>
                    {message.content && <Markdown text={message.content} />}
                    {message.status && <Stack direction="row" sx={{ alignItems: "center", gap: 1, color: "rgba(245,247,250,0.7)", fontSize: "0.84rem", mt: message.content ? 1 : 0 }}><CircularProgress size={14} />{message.status}</Stack>}
                    {message.error && <Alert severity="error" sx={{ mt: message.content ? 1 : 0 }}>{messageFor(message.error)}
                        {message.detail && <Box component="div" dir="ltr" sx={{ mt: 0.5, fontSize: "0.75rem", opacity: 0.8, textAlign: "left" }}>{message.detail}</Box>}</Alert>}
                </Box>)}
            <div ref={end} />
        </Box>

        {!busy && <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 1.5 }}>
            {T.suggestions.map((suggestion) => <ButtonBase key={suggestion} onClick={() => void ask(suggestion)} sx={{
                px: 1.5, py: 0.75, borderRadius: "999px", fontSize: "0.78rem", color: "rgba(245,247,250,0.8)", border: "1px solid rgba(142,168,232,0.25)",
                transition: "background-color 300ms ease", "&:hover": { backgroundColor: "rgba(142,168,232,0.12)" },
            }}>{suggestion}</ButtonBase>)}
        </Stack>}

        <Box component="form" onSubmit={submit} sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <TextField fullWidth multiline maxRows={5} value={input} placeholder={T.placeholder} onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(input); } }}
                slotProps={{ htmlInput: { maxLength: 4000, "aria-label": T.placeholder } }} />
            {busy
                ? <Button variant="outlined" onClick={() => abort.current?.abort()} startIcon={<StopRoundedIcon />} sx={{ borderRadius: "999px", flexShrink: 0, py: 1.4 }}>{T.stop}</Button>
                : <Button type="submit" variant="contained" disabled={!input.trim()} startIcon={<SendRoundedIcon />} sx={{ borderRadius: "999px", flexShrink: 0, py: 1.4 }}>{T.send}</Button>}
        </Box>
    </Box>;
}
