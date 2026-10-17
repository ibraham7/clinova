import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Alert, Box, Button, ButtonBase, CircularProgress, FormControlLabel, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import survey from "../config/survey.json";
import { api, messageFor } from "./api";
import type { Report, ReportFilters, Summary } from "./reportTypes";
import { BarList, DailyChart, HourChart } from "./charts";
import { chart, formatNumber } from "./chartTheme";
import type { Marker } from "./charts";
import SerenaPanel from "./SerenaPanel";

const sectionNames: Record<string, string> = {
    home: "الواجهة الرئيسية", about: "من نحن", story: "قصتنا", reach: "لماذا Clinova؟", services: "خدماتنا", "contact-system": "رحلة المريض", specialties: "تخصصاتنا",
    "case-studies": "قصص النجاح", reviews: "التقييمات", testimonials: "آراء العملاء", "client-videos": "فيديوهات العملاء", partners: "شركاؤنا",
    faq: "الأسئلة الشائعة", "contact-cta": "تواصل معنا", ticker: "الشريط المتحرك",
};
const channelNames: Record<string, string> = { search: "محركات البحث", ai: "مساعدات الذكاء الاصطناعي", social: "التواصل الاجتماعي", direct: "مباشر", referral: "مواقع أخرى", campaign: "حملات", email: "البريد" };
const deviceNames: Record<string, string> = { mobile: "جوال", tablet: "تابلت", desktop: "كمبيوتر" };
const langNames: Record<string, string> = { ar: "العربية", en: "English", tr: "Türkçe", fr: "Français" };
const purposeNames: Record<string, string> = { company_profile_download: "تحميل البروفايل", trial_survey: "الاستبيان (7 أيام مجانية)" };
const actionNames: Record<string, string> = { texts: "نصوص", videos: "فيديوهات", logos: "شعارات", logo_upload: "رفع شعار" };
const eventNames: Record<string, string> = { page_view: "فتح صفحة", section: "شاهد قسمًا", scroll: "تمرير", page_end: "غادر/أخفى الصفحة", click: "نقر", survey: "الاستبيان" };
const surveyTargets: Record<string, string> = { shown: "ظهر الاستبيان", step: "وصل للخطوة", dismissed: "أغلق الاستبيان", completed: "أكمل الاستبيان" };

const T = {
    title: "التقارير",
    intro: "كل ما يحدث على الموقع: من أين يأتي الزوار، ماذا يشاهدون، أين يتوقفون، ومن ترك بياناته. البيانات مجهولة الهوية ولا تُحفظ عناوين IP.",
    presets: [["7", "آخر 7 أيام"], ["30", "آخر 30 يومًا"], ["90", "آخر 90 يومًا"]] as const,
    from: "من", to: "إلى",
    country: "الدولة", device: "الجهاز", channel: "نوع المصدر", source: "المصدر", all: "الكل",
    refresh: "تحديث", clear: "مسح الفلاتر",
    kpis: { visitors: "زوار", pageViews: "مشاهدات صفحات", avgSeconds: "متوسط مدة الزيارة (ث)", avgScroll: "متوسط عمق التمرير %", engagedRate: "زوار متفاعلون %", leads: "تركوا بياناتهم", conversionRate: "نسبة التحويل %", surveyLeads: "أكملوا الاستبيان" } as Partial<Record<keyof Summary, string>>,
    vsPrevious: "مقارنة بالفترة السابقة",
    daily: "الزيارات يومًا بيوم", dailyNote: "الخطوط البرتقالية: نشر مقالة أو تعديل على الموقع. مرّر الفأرة لترى التفاصيل.",
    metrics: { visitors: "زوار", pageViews: "مشاهدات", leads: "بيانات تواصل" } as const,
    sections: "الأقسام الأكثر اهتمامًا", sectionsNote: "نسبة الزوار الذين شاهدوا القسم ثانية على الأقل، ومتوسط المدة.",
    exits: "أين يتوقف الزوار", exitsNote: "آخر قسم شاهده الزائر قبل أن يغادر.",
    clicks: "على ماذا ينقرون", sources: "من أين يأتون", channels: "أنواع المصادر", countries: "الدول", cities: "المدن",
    devices: "الأجهزة", browsers: "المتصفحات", os: "أنظمة التشغيل", languages: "لغة الصفحة", pages: "الصفحات", hours: "ساعات الزيارة (بتوقيت إسطنبول)", hoursLabel: "زوار",
    scroll: "عمق التمرير", campaigns: "الحملات (UTM)",
    survey: "نتائج الاستبيان", funnel: "مسار الاستبيان", wishes: "ماذا كتبوا في السؤال المفتوح",
    surveyShown: "ظهر لـ", surveyDismissed: "أغلقوه", surveyCompleted: "أكملوه", step: "وصلوا للسؤال",
    leads: "من ترك بياناته", exportCsv: "تنزيل CSV", noLeads: "لا يوجد بعد من ترك بياناته في هذه الفترة.",
    columns: { date: "التاريخ", contact: "التواصل", purpose: "النموذج", place: "الدولة / المدينة", source: "المصدر", consent: "موافقة تسويق", lang: "اللغة" },
    yes: "نعم", no: "لا",
    articles: "مقالات المدونة", published: "نُشرت", views: "مشاهدة",
    changes: "سجل التعديلات على الموقع", noChanges: "لا توجد تعديلات مسجّلة بعد.",
    recent: "آخر النشاطات", empty: "لا توجد بيانات بعد في هذه الفترة.",
    truncated: "البيانات كثيرة جدًا، عُرض أول 150 ألف حدث فقط. اختر فترة أقصر.",
    demo: "بيانات تجريبية",
    demoNote: "أنت تشاهد بيانات تجريبية مصنوعة لاختبار التقارير وسيرينا، وليست زوارًا حقيقيين. فيها قصة مخفية: مقالة طب الأسنان قبل 30 يومًا، حملة إنستغرام قبل 20 إلى 13 يومًا، وتعديل نصوص قبل 14 يومًا. اسأل سيرينا ولاحظ هل تكتشفها. أطفئ المفتاح للعودة إلى البيانات الحقيقية.",
    trackingSince: "تتبّع الزوار بدأ في {date}، فالأيام قبله بلا بيانات (وليس بلا زوار).",
    privacy: "عن الأعمار والجنس: الموقع لا يعرف أعمار الزوار، ولا توجد طريقة دقيقة لمعرفتها دون حساب Google Analytics مع موافقة الزائر على ملفات الارتباط. الدولة والمدينة تقريبية من الشبكة.",
};

const dayString = (date: Date) => new Date(date.getTime() + 3 * 3600_000).toISOString().slice(0, 10);
const daysAgo = (days: number) => dayString(new Date(Date.now() - days * 86_400_000));
const regionNames = (() => { try { return new Intl.DisplayNames(["ar"], { type: "region" }); } catch { return null; } })();
const countryName = (code: string | null, fallback?: string) => (code && code !== "??" && regionNames?.of(code)) || fallback || "غير معروف";
const clickName = (target: string) => {
    if (target === "whatsapp") return "زر واتساب";
    if (target === "phone_call") return "اتصال هاتفي";
    if (target === "email_link") return "رابط الإيميل";
    const [kind, ...rest] = target.split(":");
    const value = rest.join(":");
    if (kind === "nav") return `انتقال إلى: ${sectionNames[value] ?? value}`;
    if (kind === "link") return `رابط: ${value}`;
    if (kind === "out") return `موقع خارجي: ${value}`;
    if (kind === "file") return `ملف: ${value}`;
    if (kind === "button") return `زر: ${value}`;
    return target;
};
const dateTime = (ts: string) => new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(new Date(ts));

function Card({ title, note, children, action }: { title: string; note?: string; children: ReactNode; action?: ReactNode }) {
    return <Box component="section" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: "20px", border: "1px solid rgba(142,168,232,0.16)", backgroundColor: "rgba(142,168,232,0.04)", minWidth: 0 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: note ? 0.5 : 2 }}>
            <Typography component="h3" sx={{ fontSize: "1rem", fontWeight: 700 }}>{title}</Typography>
            {action}
        </Stack>
        {note && <Typography sx={{ fontSize: "0.78rem", color: chart.muted, mb: 2 }}>{note}</Typography>}
        {children}
    </Box>;
}

function Kpi({ label, value, previous }: { label: string; value: number; previous: number }) {
    const change = previous ? ((value - previous) / previous) * 100 : null;
    const up = change !== null && change > 0;
    return <Box sx={{ p: 2, borderRadius: "18px", border: "1px solid rgba(142,168,232,0.16)", backgroundColor: "rgba(142,168,232,0.05)" }}>
        <Typography sx={{ fontSize: "1.7rem", fontWeight: 700, lineHeight: 1.2 }}>{formatNumber(value)}</Typography>
        <Typography sx={{ fontSize: "0.8rem", color: chart.muted, mb: 0.75 }}>{label}</Typography>
        <Stack direction="row" title={T.vsPrevious} sx={{ alignItems: "center", gap: 0.5, fontSize: "0.75rem", color: chart.muted }}>
            {change === null ? <span>— {formatNumber(previous)}</span> : <>
                {up ? <ArrowUpwardRoundedIcon sx={{ fontSize: 14 }} /> : <ArrowDownwardRoundedIcon sx={{ fontSize: 14 }} />}
                <span>{formatNumber(Math.abs(change))}% ({formatNumber(previous)})</span>
            </>}
        </Stack>
    </Box>;
}

function downloadCsv(report: Report) {
    const header = ["date", "purpose", "contact_type", "contact", "phone_country", "lang", "form", "consent", "country", "city", "source", ...survey.questions.map((question) => question.id)];
    const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = report.leads.map((lead) => [lead.ts, lead.purpose, lead.contactType, lead.contact, lead.phoneCountry, lead.lang, lead.form, lead.consent, lead.country, lead.city, lead.source, ...survey.questions.map((question) => lead.answers?.[question.id])].map(escape).join(","));
    const blob = new Blob([`﻿${[header.join(","), ...rows].join("\n")}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `clinova-leads-${report.range.fromDay}-${report.range.toDay}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

const tableSx = { width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", "& th": { textAlign: "start", color: chart.muted, fontWeight: 500, pb: 1, whiteSpace: "nowrap" }, "& td": { py: 1, borderTop: "1px solid rgba(142,168,232,0.1)", verticalAlign: "top" }, "& th + th, & td + td": { ps: 2 } } as const;

export default function ReportsPage() {
    const [filters, setFilters] = useState<ReportFilters>({ from: daysAgo(29), to: daysAgo(0) });
    const [report, setReport] = useState<Report | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(0);
    const [metric, setMetric] = useState<keyof typeof T.metrics>("visitors");

    useEffect(() => {
        let live = true;
        const timer = window.setTimeout(() => {
            setLoading(true);
            void api.reports(filters).then((result) => {
                if (!live) return;
                setLoading(false);
                if (result.status === 200) { setReport(result.data.report); setError(null); }
                else setError(messageFor(result.data.error));
            });
        }, 0);
        return () => { live = false; window.clearTimeout(timer); };
    }, [filters, reload]);

    const set = (key: keyof ReportFilters, value: string) => setFilters((current) => ({ ...current, [key]: value || undefined }));
    // A start after the end (or the reverse) moves the other date along, so the range is never empty.
    const setDay = (key: "from" | "to", value: string) => {
        if (!value) return;
        const day = value > daysAgo(0) ? daysAgo(0) : value;
        setFilters((current) => key === "from"
            ? { ...current, from: day, to: day > current.to ? day : current.to }
            : { ...current, to: day, from: day < current.from ? day : current.from });
    };
    const preset = (days: number) => setFilters((current) => ({ ...current, from: daysAgo(days - 1), to: daysAgo(0) }));
    const markers = useMemo<Marker[]>(() => report ? [
        ...report.articles.map((article) => ({ date: article.date, label: `مقالة: ${article.title}` })),
        ...report.changes.map((change) => ({ date: change.date, label: `تعديل: ${change.summary}` })),
    ] : [], [report]);
    // Choices come from the data itself, so every option has visitors behind it.
    const options = {
        country: report?.countries.filter((row) => row.code !== "??").map((row) => [row.code, countryName(row.code, row.name)]) ?? [],
        device: Object.entries(deviceNames),
        source: report?.sources.map((row) => [row.source, row.source]) ?? [],
    };
    const ready = Boolean(report);

    return <Box sx={{ display: "grid", gap: 3 }}>
        <Box>
            <Typography component="h1" sx={{ fontSize: "1.6rem", fontWeight: 700, mb: 1 }}>{T.title}</Typography>
            <Typography sx={{ color: chart.muted, lineHeight: 1.9, maxWidth: 820 }}>{T.intro}</Typography>
        </Box>

        {/* Filters: one row above everything they scope. */}
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
            {T.presets.map(([days, label]) => {
                const active = filters.to === daysAgo(0) && filters.from === daysAgo(Number(days) - 1);
                return <ButtonBase key={days} onClick={() => preset(Number(days))} sx={{ px: 1.75, py: 0.9, borderRadius: "999px", fontSize: "0.82rem", border: "1px solid rgba(142,168,232,0.25)", backgroundColor: active ? "rgba(142,168,232,0.2)" : "transparent", fontWeight: active ? 700 : 400 }}>{label}</ButtonBase>;
            })}
            <TextField type="date" size="small" label={T.from} value={filters.from} onChange={(event) => setDay("from", event.target.value)} slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: daysAgo(0) } }} />
            <TextField type="date" size="small" label={T.to} value={filters.to} onChange={(event) => setDay("to", event.target.value)} slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: daysAgo(0) } }} />
            {(["country", "device", "source"] as const).map((key) => <TextField key={key} select size="small" label={T[key]} value={filters[key] ?? ""} onChange={(event) => set(key, event.target.value)} sx={{ minWidth: 130 }}>
                <MenuItem value="">{T.all}</MenuItem>
                {options[key].map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
                {filters[key] && !options[key].some(([value]) => value === filters[key]) && <MenuItem value={filters[key]}>{filters[key]}</MenuItem>}
            </TextField>)}
            <Button size="small" onClick={() => setReload((count) => count + 1)} startIcon={loading ? <CircularProgress size={14} /> : <RefreshRoundedIcon />}>{T.refresh}</Button>
            {(["country", "device", "lang", "channel", "source", "path"] as const).some((key) => filters[key]) && <Button size="small" onClick={() => setFilters({ from: filters.from, to: filters.to, demo: filters.demo })}>{T.clear}</Button>}
            <FormControlLabel control={<Switch size="small" checked={filters.demo === "1"} onChange={(event) => set("demo", event.target.checked ? "1" : "")} />} label={T.demo} sx={{ ms: "auto", "& .MuiFormControlLabel-label": { fontSize: "0.85rem" } }} />
        </Stack>

        {error && <Alert severity={report ? "error" : "warning"}>{error}</Alert>}
        {report?.demo && <Alert severity="warning">{T.demoNote}</Alert>}
        {report?.truncated && <Alert severity="info">{T.truncated}</Alert>}
        {report?.trackingSince && report.trackingSince > report.range.from && <Alert severity="info">{T.trackingSince.replace("{date}", dateTime(report.trackingSince))}</Alert>}
        {!report && loading && <Box sx={{ display: "grid", placeItems: "center", py: 6 }}><CircularProgress /></Box>}

        {report && <Box sx={{ display: "grid", gap: 3, opacity: loading ? 0.55 : 1, transition: "opacity 300ms ease" }}>
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" } }}>
                {(Object.keys(T.kpis) as (keyof Summary)[]).map((key) => <Kpi key={key} label={T.kpis[key]!} value={report.summary[key]} previous={report.previous[key]} />)}
            </Box>

            <SerenaPanel key={filters.demo ?? "live"} view={filters} ready={ready} />

            <Card title={T.daily} note={T.dailyNote} action={<Stack direction="row" sx={{ gap: 0.5 }}>
                {(Object.keys(T.metrics) as (keyof typeof T.metrics)[]).map((key) => <ButtonBase key={key} onClick={() => setMetric(key)} sx={{ px: 1.25, py: 0.5, borderRadius: "999px", fontSize: "0.75rem", backgroundColor: metric === key ? "rgba(142,168,232,0.2)" : "transparent", fontWeight: metric === key ? 700 : 400 }}>{T.metrics[key]}</ButtonBase>)}
            </Stack>}>
                <DailyChart data={report.daily.map((day) => ({ date: day.date, value: day[metric] }))} label={T.metrics[metric]} markers={markers} />
            </Card>

            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" } }}>
                <Card title={T.sections} note={T.sectionsNote}>
                    <BarList empty={T.empty} max={100} rows={report.sections.filter((row) => row.visitors).map((row) => ({ key: row.id, label: sectionNames[row.id] ?? row.id, value: row.reach, display: `${formatNumber(row.reach)}%`, note: `${formatNumber(row.avgSeconds)} ث` }))} />
                </Card>
                <Card title={T.exits} note={T.exitsNote}>
                    <BarList empty={T.empty} rows={report.sections.filter((row) => row.exits).sort((a, b) => b.exits - a.exits).map((row) => ({ key: row.id, label: sectionNames[row.id] ?? row.id, value: row.exits }))} />
                </Card>
                <Card title={T.clicks}>
                    <BarList empty={T.empty} rows={report.clicks.slice(0, 15).map((row) => ({ key: row.target, label: clickName(row.target), value: row.count, note: row.section ? sectionNames[row.section] ?? row.section : undefined }))} />
                </Card>
                <Card title={T.sources}>
                    <BarList empty={T.empty} rows={report.sources.slice(0, 12).map((row) => ({ key: row.source, label: `${row.source} · ${channelNames[row.channel] ?? row.channel}`, value: row.visitors, note: row.leads ? `${formatNumber(row.leads)} تركوا بياناتهم` : undefined }))} />
                </Card>
                <Card title={T.countries}>
                    <BarList empty={T.empty} rows={report.countries.slice(0, 12).map((row) => ({ key: row.code, label: countryName(row.code, row.name), value: row.visitors, note: row.leads ? `${formatNumber(row.leads)} تركوا بياناتهم` : `${formatNumber(row.share)}%` }))} />
                </Card>
                <Card title={T.cities}>
                    <BarList empty={T.empty} rows={report.cities.slice(0, 12).map((row) => ({ key: `${row.city}-${row.country}`, label: `${row.city} · ${countryName(row.country)}`, value: row.visitors }))} />
                </Card>
                <Card title={T.channels}>
                    <BarList empty={T.empty} rows={report.channels.map((row) => ({ key: row.channel, label: channelNames[row.channel] ?? row.channel, value: row.visitors, note: `${formatNumber(row.share)}%` }))} />
                </Card>
                <Card title={T.pages}>
                    <BarList empty={T.empty} rows={report.pages.slice(0, 12).map((row) => ({ key: row.path, label: row.path, value: row.views, note: `${formatNumber(row.visitors)} زائر` }))} />
                </Card>
                <Card title={T.devices}>
                    <BarList empty={T.empty} rows={report.devices.map((row) => ({ key: row.device, label: deviceNames[row.device] ?? row.device, value: row.visitors, note: `${formatNumber(row.share)}%` }))} />
                    <Box sx={{ mt: 3 }}><Typography sx={{ fontSize: "0.85rem", fontWeight: 600, mb: 1.5 }}>{T.languages}</Typography>
                        <BarList empty={T.empty} rows={report.languages.map((row) => ({ key: row.lang, label: langNames[row.lang] ?? row.lang, value: row.visitors, note: `${formatNumber(row.share)}%` }))} /></Box>
                </Card>
                <Card title={T.browsers}>
                    <BarList empty={T.empty} rows={report.browsers.map((row) => ({ key: row.browser, label: row.browser, value: row.visitors, note: `${formatNumber(row.share)}%` }))} />
                    <Box sx={{ mt: 3 }}><Typography sx={{ fontSize: "0.85rem", fontWeight: 600, mb: 1.5 }}>{T.os}</Typography>
                        <BarList empty={T.empty} rows={report.os.map((row) => ({ key: row.os, label: row.os, value: row.visitors, note: `${formatNumber(row.share)}%` }))} /></Box>
                </Card>
                <Card title={T.hours}>
                    <HourChart data={report.hours} label={T.hoursLabel} />
                </Card>
                <Card title={T.scroll}>
                    <BarList empty={T.empty} max={100} rows={report.scroll.map((row) => ({ key: String(row.depth), label: `وصلوا إلى ${row.depth}% من الصفحة`, value: row.share, display: `${formatNumber(row.share)}%`, note: `${formatNumber(row.visitors)} زائر` }))} />
                </Card>
            </Box>

            {report.campaigns.length > 0 && <Card title={T.campaigns}>
                <BarList empty={T.empty} rows={report.campaigns.map((row) => ({ key: row.campaign, label: `${row.campaign} · ${row.source ?? ""} ${row.medium ?? ""}`, value: row.visitors }))} />
            </Card>}

            <Card title={T.survey}>
                <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" } }}>
                    <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, mb: 1.5 }}>{T.funnel}</Typography>
                        <BarList empty={T.empty} max={Math.max(1, report.survey.shown)} rows={[
                            { key: "shown", label: T.surveyShown, value: report.survey.shown },
                            ...report.survey.steps.filter((row) => row.visitors).map((row) => ({ key: `step-${row.step}`, label: row.step < survey.questions.length ? `${T.step} ${row.step + 1}` : "خطوة إدخال التواصل", value: row.visitors })),
                            { key: "completed", label: T.surveyCompleted, value: report.survey.completed },
                            { key: "dismissed", label: T.surveyDismissed, value: report.survey.dismissed },
                        ]} />
                    </Box>
                    <Box sx={{ display: "grid", gap: 2.5 }}>
                        {survey.questions.filter((question) => question.type === "choice").map((question) => {
                            const counts = report.survey.answers[question.id] ?? {};
                            return <Box key={question.id}>
                                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, mb: 1.5 }}>{question.title}</Typography>
                                <BarList empty={T.empty} rows={(question.options ?? []).map((option) => ({ key: option, label: option, value: counts[option] ?? 0 })).filter((row) => row.value)} />
                            </Box>;
                        })}
                    </Box>
                </Box>
                {report.survey.wishes.length > 0 && <Box sx={{ mt: 3 }}>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, mb: 1 }}>{T.wishes}</Typography>
                    <Box component="ul" sx={{ m: 0, ps: 3, display: "grid", gap: 0.75, fontSize: "0.86rem", lineHeight: 1.8 }}>{report.survey.wishes.map((wish, index) => <li key={index}>{wish}</li>)}</Box>
                </Box>}
            </Card>

            <Card title={`${T.leads} (${formatNumber(report.leads.length)})`} action={report.leads.length > 0 && <Button size="small" startIcon={<DownloadRoundedIcon />} onClick={() => downloadCsv(report)}>{T.exportCsv}</Button>}>
                {report.leads.length ? <Box sx={{ overflowX: "auto" }}><Box component="table" sx={tableSx}>
                    <thead><tr>{Object.values(T.columns).map((label) => <th key={label}>{label}</th>)}</tr></thead>
                    <tbody>{report.leads.map((lead, index) => <tr key={`${lead.ts}-${index}`}>
                        <td style={{ whiteSpace: "nowrap" }}>{dateTime(lead.ts)}</td>
                        <td dir="ltr" style={{ textAlign: "right" }}>{lead.contact}</td>
                        <td>{purposeNames[lead.purpose] ?? lead.purpose}{lead.answers && <Box sx={{ color: chart.muted, fontSize: "0.75rem", mt: 0.5 }}>{survey.questions.map((question) => lead.answers?.[question.id]).filter(Boolean).join(" · ")}</Box>}</td>
                        <td>{countryName(lead.country)}{lead.city ? ` / ${lead.city}` : ""}</td>
                        <td>{lead.source ?? "—"}</td>
                        <td>{lead.consent ? T.yes : T.no}</td>
                        <td>{langNames[lead.lang] ?? lead.lang}</td>
                    </tr>)}</tbody>
                </Box></Box> : <Typography sx={{ color: chart.muted, fontSize: "0.85rem" }}>{T.noLeads}</Typography>}
            </Card>

            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" } }}>
                <Card title={T.articles}>
                    {report.articles.length ? <Box component="table" sx={tableSx}><tbody>{report.articles.map((article) => <tr key={article.slug}>
                        <td>{article.title}<Box sx={{ color: chart.muted, fontSize: "0.75rem" }}>{T.published} {article.date}</Box></td>
                        <td style={{ whiteSpace: "nowrap" }}>{formatNumber(article.views)} {T.views}</td>
                    </tr>)}</tbody></Box> : <Typography sx={{ color: chart.muted, fontSize: "0.85rem" }}>{T.empty}</Typography>}
                </Card>
                <Card title={T.changes}>
                    {report.changes.length ? <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25, maxHeight: 420, overflowY: "auto" }}>
                        {report.changes.slice().reverse().map((change, index) => <Box component="li" key={index} sx={{ fontSize: "0.84rem", lineHeight: 1.7 }}>
                            <Box component="span" sx={{ color: chart.event }}>{actionNames[change.action] ?? change.action}</Box> · {change.summary}
                            <Box sx={{ color: chart.muted, fontSize: "0.75rem" }}>{dateTime(change.ts)}</Box>
                        </Box>)}
                    </Box> : <Typography sx={{ color: chart.muted, fontSize: "0.85rem" }}>{T.noChanges}</Typography>}
                </Card>
            </Box>

            <Card title={T.recent}>
                {report.recent.length ? <Box sx={{ overflowX: "auto", maxHeight: 460, overflowY: "auto" }}><Box component="table" sx={tableSx}><tbody>
                    {report.recent.map((event, index) => <tr key={index}>
                        <td style={{ whiteSpace: "nowrap" }}>{dateTime(event.ts)}</td>
                        <td>{event.type === "survey" ? `${surveyTargets[event.target ?? ""] ?? event.target}${event.target === "step" ? ` ${(event.value ?? 0) + 1}` : ""}`
                            : event.type === "click" ? `${eventNames.click}: ${clickName(event.target ?? "")}`
                            : event.type === "section" ? `${eventNames.section}: ${sectionNames[event.section ?? ""] ?? event.section} (${formatNumber((event.value ?? 0) / 1000)} ث)`
                            : event.type === "scroll" ? `${eventNames.scroll} ${event.value}%`
                            : event.type === "page_end" ? `${eventNames.page_end} بعد ${formatNumber((event.value ?? 0) / 1000)} ث${event.section ? ` عند ${sectionNames[event.section] ?? event.section}` : ""}`
                            : `${eventNames[event.type] ?? event.type}: ${event.path}`}</td>
                        <td>{countryName(event.country)}{event.city ? ` / ${event.city}` : ""}</td>
                        <td>{deviceNames[event.device ?? ""] ?? event.device}</td>
                        <td>{event.source}</td>
                    </tr>)}
                </tbody></Box></Box> : <Typography sx={{ color: chart.muted, fontSize: "0.85rem" }}>{T.empty}</Typography>}
            </Card>

            <Alert severity="info" variant="outlined">{T.privacy}</Alert>
        </Box>}
    </Box>;
}
