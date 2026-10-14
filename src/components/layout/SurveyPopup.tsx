import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Alert, Box, Button, ButtonBase, Checkbox, Dialog, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { parseContact, submitSurveyLead } from "../../config/profileLeads";
import survey from "../../config/survey.json";

const storageKey = "clinova.survey";
const openAfterMs = 60_000;
const snoozeMs = 3 * 24 * 60 * 60 * 1000;
const questions = survey.questions;
const contactStep = questions.length;
const doneStep = questions.length + 1;

// Offer the survey once; after a dismissal wait a few days, after a submission never again.
function shouldOffer() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null") as { state: string; at: number } | null;
        if (!saved) return true;
        return saved.state !== "done" && Date.now() - saved.at > snoozeMs;
    } catch {
        return true;
    }
}

function remember(state: "dismissed" | "done") {
    try { localStorage.setItem(storageKey, JSON.stringify({ state, at: Date.now() })); } catch { /* Storage is optional. */ }
}

// Opens after one minute of visible browsing. `?survey` in the URL opens it right away for review.
function useSurveyTimer(onDue: () => void) {
    useEffect(() => {
        const forced = new URLSearchParams(window.location.search).has("survey");
        if (!forced && !shouldOffer()) return;
        let visibleMs = forced ? openAfterMs - 1500 : 0;
        const timer = window.setInterval(() => {
            if (document.visibilityState !== "visible") return;
            visibleMs += 500;
            if (visibleMs < openAfterMs) return;
            window.clearInterval(timer);
            onDue();
        }, 500);
        return () => window.clearInterval(timer);
    }, [onDue]);
}

export default function SurveyPopup() {
    const { t, direction, isRtl, i18n } = useSiteTranslation();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [contact, setContact] = useState("");
    const [consent, setConsent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<"invalid" | "save" | null>(null);
    const requestId = useRef<string | null>(null);
    const advance = useRef<number>(0);
    const titleId = useId();
    const show = useCallback(() => setOpen(true), []);
    useSurveyTimer(show);
    useEffect(() => () => window.clearTimeout(advance.current), []);

    const close = () => {
        if (busy) return;
        if (step !== doneStep) remember("dismissed");
        setOpen(false);
    };
    const choose = (id: string, option: string) => {
        setAnswers((current) => ({ ...current, [id]: option }));
        window.clearTimeout(advance.current);
        advance.current = window.setTimeout(() => setStep((current) => current + 1), 320);
    };
    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (busy) return;
        const parsed = parseContact(contact, "TR");
        if (!parsed) { setError("invalid"); return; }
        setError(null); setBusy(true);
        try {
            requestId.current ??= crypto.randomUUID();
            const wish = answers.wish?.trim();
            await submitSurveyLead({
                contact: parsed, language: i18n.resolvedLanguage ?? "ar", marketingConsent: consent, requestId: requestId.current,
                answers: { ...answers, wish: wish || undefined } as Record<string, string>,
            });
            remember("done");
            setStep(doneStep);
        } catch { setError("save"); }
        finally { setBusy(false); }
    };

    const question = questions[step];
    const BackIcon = isRtl ? ArrowForwardRoundedIcon : ArrowBackRoundedIcon;
    const NextIcon = isRtl ? ArrowBackRoundedIcon : ArrowForwardRoundedIcon;
    const progress = Math.min(step, questions.length) / questions.length;

    return <Dialog open={open} onClose={close} aria-labelledby={titleId} className="clinova-survey" slotProps={{
        backdrop: { sx: { backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", backgroundColor: "var(--clinova-rgba-11-17-27-0_45)" } },
        paper: { dir: direction, sx: {
            position: "relative", width: "min(440px, calc(100% - 32px))", m: 2, p: { xs: 2.5, sm: 3 }, pt: { xs: 3, sm: 3.5 }, borderRadius: "26px", overflow: "hidden",
            border: "1px solid var(--clinova-rgba-142-168-232-0_22)",
            background: "radial-gradient(circle at 85% 0%, var(--clinova-rgba-142-168-232-0_16), transparent 45%), var(--clinova-color-111b2a)",
            boxShadow: "0 30px 80px var(--clinova-rgba-0-0-0-0_4)",
        } },
    }}>
        <IconButton onClick={close} disabled={busy} aria-label={t("إغلاق الاستبيان")} sx={{
            position: "absolute", top: 12, insetInlineEnd: 12, width: 34, height: 34, color: "#fff", backgroundColor: "#E5484D",
            boxShadow: "0 6px 16px rgba(229, 72, 77, 0.4)", "&:hover": { backgroundColor: "#C93A3F" },
        }}><CloseRoundedIcon sx={{ fontSize: 20 }} /></IconButton>

        <Box sx={{ pe: 5 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.25, py: 0.5, mb: 1.5, borderRadius: "999px", color: "primary.light", backgroundColor: "var(--clinova-rgba-142-168-232-0_12)", border: "1px solid var(--clinova-rgba-142-168-232-0_22)" }}>
                <CardGiftcardRoundedIcon className="clinova-survey-gift" sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 600 }}>{t("فحص Clinova السريع")}</Typography>
            </Box>
            <Typography id={titleId} component="h2" sx={{ fontSize: { xs: "1.15rem", sm: "1.3rem" }, fontWeight: 700, lineHeight: 1.45, color: "var(--clinova-color-f5f7fa)" }}>
                {t("أجب عن 5 أسئلة واحصل على 7 أيام تجربة مجانية")}
            </Typography>
        </Box>

        {step < doneStep && <Box sx={{ mt: 2 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.75 }}>
                <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
                    {step < contactStep ? t("السؤال {{current}} من {{total}}", { current: step + 1, total: questions.length }) : t("الخطوة الأخيرة")}
                </Typography>
                {step > 0 && <ButtonBase onClick={() => { setError(null); setStep(step - 1); }} disabled={busy} sx={{ gap: 0.5, fontSize: "0.7rem", color: "text.secondary", borderRadius: 1, px: 0.5, "&:hover": { color: "primary.light" } }}>
                    <BackIcon sx={{ fontSize: 14 }} />{t("رجوع")}
                </ButtonBase>}
            </Stack>
            <Box sx={{ height: 4, borderRadius: 4, backgroundColor: "var(--clinova-rgba-142-168-232-0_12)", overflow: "hidden" }}>
                <Box sx={{ height: "100%", width: `${Math.max(progress, 0.04) * 100}%`, borderRadius: 4, background: "linear-gradient(90deg, var(--clinova-color-7894d2), var(--clinova-color-b8c8ef))", transition: "width 600ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
            </Box>
        </Box>}

        <Box key={step} className="clinova-survey-step" sx={{ mt: 2.5 }}>
            {question?.type === "choice" && <>
                <Typography sx={{ mb: 1.5, fontSize: "0.95rem", fontWeight: 600, color: "var(--clinova-color-f5f7fa)" }}>{t(question.title)}</Typography>
                <Stack sx={{ gap: 1 }} role="radiogroup" aria-label={t(question.title)}>
                    {question.options?.map((option, index) => {
                        const selected = answers[question.id] === option;
                        return <ButtonBase key={option} role="radio" aria-checked={selected} onClick={() => choose(question.id, option)} className="clinova-survey-option" style={{ animationDelay: `${80 + index * 60}ms` }} sx={{
                            justifyContent: "space-between", gap: 1.5, px: 1.75, py: 1.25, borderRadius: "14px", textAlign: "start", fontSize: "0.86rem",
                            color: selected ? "var(--clinova-color-f5f7fa)" : "var(--clinova-rgba-245-247-250-0_72)",
                            border: `1px solid ${selected ? "var(--clinova-color-8ea8e8)" : "var(--clinova-rgba-142-168-232-0_16)"}`,
                            backgroundColor: selected ? "var(--clinova-rgba-142-168-232-0_16)" : "var(--clinova-rgba-142-168-232-0_04)",
                            transition: "background-color 450ms ease, border-color 450ms ease, color 450ms ease",
                            "&:hover, &.Mui-focusVisible": { borderColor: "var(--clinova-rgba-142-168-232-0_45)", backgroundColor: "var(--clinova-rgba-142-168-232-0_09)", color: "var(--clinova-color-f5f7fa)" },
                        }}>
                            {t(option)}
                            <Box component="span" sx={{ width: 20, height: 20, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: "50%", border: "1px solid var(--clinova-rgba-142-168-232-0_35)", backgroundColor: selected ? "primary.main" : "transparent", transition: "background-color 400ms ease" }}>
                                {selected && <CheckRoundedIcon className="clinova-survey-check" sx={{ fontSize: 14, color: "var(--clinova-color-0b111b)" }} />}
                            </Box>
                        </ButtonBase>;
                    })}
                </Stack>
            </>}

            {question?.type === "text" && <>
                <Typography sx={{ mb: 0.5, fontSize: "0.95rem", fontWeight: 600, color: "var(--clinova-color-f5f7fa)" }}>{t(question.title)}</Typography>
                <Typography sx={{ mb: 1.5, fontSize: "0.72rem", color: "text.secondary" }}>{t("اختياري، اكتب ما يخطر ببالك أو تخطَّ السؤال.")}</Typography>
                <TextField fullWidth multiline minRows={3} autoFocus value={answers[question.id] ?? ""} placeholder={t("مثال: الاستفسارات كثيرة لكن الحجوزات قليلة…")}
                    onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                    slotProps={{ htmlInput: { maxLength: question.maxLength, "aria-label": t(question.title) } }} />
                <Button fullWidth variant="contained" onClick={() => setStep(contactStep)} endIcon={<NextIcon />} sx={{ mt: 2, borderRadius: "999px", py: 1.1 }}>
                    {answers[question.id]?.trim() ? t("التالي") : t("تخطَّ وتابع")}
                </Button>
            </>}

            {step === contactStep && <Box component="form" onSubmit={submit} noValidate data-clarity-mask="true">
                <Typography sx={{ mb: 0.5, fontSize: "0.95rem", fontWeight: 600, color: "var(--clinova-color-f5f7fa)" }}>{t("أين نرسل لك تفعيل التجربة المجانية؟")}</Typography>
                <Typography sx={{ mb: 1.5, fontSize: "0.72rem", color: "text.secondary" }}>{t("اكتب إيميلك أو رقم هاتفك مع رمز الدولة.")}</Typography>
                <TextField fullWidth autoFocus value={contact} disabled={busy} error={error === "invalid"} label={t("الإيميل أو رقم الهاتف")}
                    onChange={(event) => { setContact(event.target.value); setError(null); }}
                    slotProps={{ htmlInput: { dir: "ltr", maxLength: 254, "data-clarity-mask": "true" } }} />
                <FormControlLabel sx={{ mt: 1, mx: 0, alignItems: "flex-start", gap: 0.5 }} control={<Checkbox size="small" disabled={busy} checked={consent} onChange={(event) => setConsent(event.target.checked)} />}
                    label={<Typography variant="body2" sx={{ pt: 0.9, fontSize: "0.78rem" }}>{t("أوافق على التواصل معي حول خدمات Clinova (اختياري).")}</Typography>} />
                {error && <Alert severity="error" sx={{ mt: 1 }}>{error === "invalid" ? t("أدخل إيميلاً صحيحاً أو رقم هاتف صحيحاً مع رمز الدولة.") : t("تعذر حفظ بياناتك. حاول مرة أخرى.")}</Alert>}
                <Button type="submit" fullWidth variant="contained" disabled={busy} startIcon={<CardGiftcardRoundedIcon />} className="clinova-shine" sx={{ mt: 2, borderRadius: "999px", py: 1.2, fontWeight: 700 }}>
                    {busy ? t("جارٍ الحفظ…") : t("احصل على 7 أيام مجانية")}
                </Button>
            </Box>}

            {step === doneStep && <Stack sx={{ alignItems: "center", textAlign: "center", py: 1 }}>
                <Box className="clinova-survey-done" sx={{ width: 64, height: 64, display: "grid", placeItems: "center", borderRadius: "50%", mb: 2, color: "var(--clinova-color-0b111b)", background: "linear-gradient(135deg, var(--clinova-color-b8c8ef), var(--clinova-color-7894d2))", boxShadow: "0 0 30px var(--clinova-rgba-142-168-232-0_45)" }}>
                    <CheckRoundedIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "var(--clinova-color-f5f7fa)" }}>{t("شكرًا لك!")}</Typography>
                <Typography sx={{ mt: 1, fontSize: "0.84rem", lineHeight: 1.9, color: "text.secondary" }}>{t("سيتواصل معك فريقنا قريبًا لتفعيل تجربتك المجانية لمدة 7 أيام.")}</Typography>
                <Button onClick={close} variant="outlined" sx={{ mt: 2.5, borderRadius: "999px", px: 4 }}>{t("إغلاق")}</Button>
            </Stack>}
        </Box>
    </Dialog>;
}
