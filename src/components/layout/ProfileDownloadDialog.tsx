import { useId, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AsYouType, getCountries, getCountryCallingCode, parsePhoneNumberFromString } from "libphonenumber-js/min";
import type { CountryCode } from "libphonenumber-js/min";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { detectContactType, normalizeDigits, parseContact, profileDocument, profileFilename, submitProfileLead } from "../../config/profileLeads";

export default function ProfileDownloadDialog({ outlined, onClose }: { outlined: boolean; onClose: () => void }) {
    const { t, direction, i18n } = useSiteTranslation();
    const [value, setValue] = useState("");
    const [country, setCountry] = useState<CountryCode>("TR");
    const [consent, setConsent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<"invalid" | "save" | null>(null);
    const titleId = useId();
    const submissionRef = useRef<{ payload: string; requestId: string } | null>(null);
    const downloadRef = useRef<HTMLAnchorElement>(null);
    const language = i18n.resolvedLanguage ?? "ar";
    const type = detectContactType(value);
    const countries = useMemo(() => {
        const names = new Intl.DisplayNames([language], { type: "region" });
        return getCountries().map(code => ({ code, name: names.of(code) ?? code }))
            .sort((a, b) => a.name.localeCompare(b.name, language));
    }, [language]);
    const close = () => { if (!busy) onClose(); };
    const formatPhone = () => {
        if (type !== "phone") return;
        const input = normalizeDigits(value.trim()).replace(/^00/, "+");
        const parsed = parsePhoneNumberFromString(input, { defaultCountry: country, extract: false });
        if (input.startsWith("+") && parsed?.country) {
            setCountry(parsed.country);
            setValue(parsed.formatNational());
        } else if (!input.startsWith("+")) setValue(new AsYouType(country).input(input));
    };
    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (busy) return;
        const contact = parseContact(value, country);
        if (!contact) { setError("invalid"); return; }
        setError(null); setBusy(true);
        try {
            const lead = { contact, language, source: outlined ? "contact_cta" as const : "hero" as const, marketingConsent: consent };
            const payload = JSON.stringify(lead);
            if (submissionRef.current?.payload !== payload) submissionRef.current = { payload, requestId: crypto.randomUUID() };
            await submitProfileLead({ ...lead, requestId: submissionRef.current.requestId });
            downloadRef.current?.click();
            onClose(); setValue(""); setConsent(false);
        } catch { setError("save"); }
        finally { setBusy(false); }
    };
    return <>
        <Dialog open onClose={close} fullWidth maxWidth="xs" aria-labelledby={titleId} slotProps={{ paper: { dir: direction, sx: { borderRadius: 4 } } }}>
            <Box component="form" onSubmit={submit} noValidate data-clarity-mask="true">
                <DialogTitle id={titleId} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                    {t("تنزيل الملف التعريفي")}
                    <IconButton onClick={close} disabled={busy} aria-label={t("إغلاق القائمة")}><CloseRoundedIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.8 }}>{t("أدخل بريدك الإلكتروني أو رقم هاتفك لتنزيل الملف مباشرة.")}</Typography>
                    <Stack direction="row" dir="ltr" sx={{ gap: 1, alignItems: "flex-start" }}>
                        {type === "phone" && <TextField select value={country} disabled={busy} onChange={event => setCountry(event.target.value as CountryCode)} label={t("رمز الدولة")} sx={{ width: 112, flexShrink: 0 }} slotProps={{ select: { renderValue: () => `+${getCountryCallingCode(country)}` } }}>
                            {countries.map(item => <MenuItem key={item.code} value={item.code}>{item.name} (+{getCountryCallingCode(item.code)})</MenuItem>)}
                        </TextField>}
                        <TextField fullWidth autoFocus value={value} disabled={busy} onBlur={formatPhone} onChange={event => {
                            const input = event.target.value;
                            setValue(input); setError(null);
                            if (/^(\+|00)/.test(input.trim())) {
                                const formatter = new AsYouType();
                                formatter.input(normalizeDigits(input.trim()).replace(/^00/, "+"));
                                const detected = formatter.getCountry();
                                if (detected) setCountry(detected);
                            }
                        }} label={t("الإيميل أو رقم الهاتف")} type="text" autoComplete={type === "phone" ? "tel-national" : "email"} slotProps={{ htmlInput: { dir: "ltr", inputMode: type === "phone" ? "tel" : "text", maxLength: 254, "data-clarity-mask": "true" } }} error={error === "invalid"} />
                    </Stack>
                    {type === "phone" && <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>{t("اختر دولة الرقم المحلي، أو اكتب الرقم الدولي مع علامة +.")}</Typography>}
                    <FormControlLabel sx={{ mt: 1.5, mx: 0, alignItems: "flex-start", gap: 0.5 }} control={<Checkbox disabled={busy} checked={consent} onChange={event => setConsent(event.target.checked)} />} label={<Typography variant="body2" sx={{ pt: 1.15 }}>{t("أوافق على التواصل معي حول خدمات Clinova (اختياري).")}</Typography>} />
                    {error && <Alert severity="error" sx={{ mt: 1 }}>{error === "invalid" ? t("أدخل إيميلاً صحيحاً أو رقم هاتف صحيحاً مع رمز الدولة.") : t("تعذر حفظ بياناتك. حاول مرة أخرى.")}</Alert>}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button type="submit" variant="contained" disabled={busy} fullWidth sx={{ gap: 1 }}><FileDownloadOutlinedIcon fontSize="small" />{busy ? t("جارٍ الحفظ…") : t("تنزيل الملف الآن")}</Button>
                </DialogActions>
            </Box>
        </Dialog>
        <a ref={downloadRef} href={profileDocument} download={profileFilename} hidden aria-hidden="true" tabIndex={-1} />
    </>;
}
