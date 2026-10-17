import { useEffect, useState } from "react";
import { Box, Button, ButtonBase, CircularProgress, Stack, Typography } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { api } from "./api";
import type { Report } from "./reportTypes";

const T = {
    periods: [[1, "اليوم"], [7, "7 أيام"], [30, "30 يومًا"], [90, "90 يومًا"]] as [number, string][],
    title: { 1: "اليوم", 7: "آخر 7 أيام", 30: "آخر 30 يومًا", 90: "آخر 90 يومًا" } as Record<number, string>,
    intro: { 1: "مقارنة بالأمس.", 7: "مقارنة بالأيام السبعة التي قبلها.", 30: "مقارنة بالثلاثين يومًا التي قبلها.", 90: "مقارنة بالتسعين يومًا التي قبلها." } as Record<number, string>,
    more: "التفاصيل الكاملة وسيرينا في صفحة التقارير.",
    visitors: "زوار",
    today: "زوار اليوم",
    avgSeconds: "متوسط مدة الزيارة",
    leads: "تركوا بياناتهم",
    conversion: "نسبة التحويل",
    latestLeads: "آخر من ترك بياناته",
    latestChanges: "آخر التعديلات على الموقع",
    noLeads: "لا أحد بعد في هذه الفترة.",
    noChanges: "لا تعديلات بعد.",
    open: "فتح التقارير",
    since: "التتبع بدأ في {date}",
    purpose: { company_profile_download: "تحميل البروفايل", trial_survey: "طلب التجربة المجانية" } as Record<string, string>,
};

const istanbulDay = (offset = 0) => new Date(Date.now() + 3 * 3600_000 - offset * 86_400_000).toISOString().slice(0, 10);
const dateTime = (ts: string) => new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(new Date(ts));
const countryName = (() => { try { const names = new Intl.DisplayNames(["ar"], { type: "region" }); return (code: string | null) => (code ? names.of(code) ?? code : ""); } catch { return (code: string | null) => code ?? ""; } })();
const number = (value: number) => new Intl.NumberFormat("ar").format(value);

const storageKey = "clinova.admin.overviewDays";
function savedDays() {
    try { const days = Number(localStorage.getItem(storageKey)); return [1, 7, 30, 90].includes(days) ? days : 7; } catch { return 7; }
}

/** The home page's quick look: visitors and leads for a chosen period against the one before, and what happened last. */
export default function OverviewCard({ openReports }: { openReports: () => void }) {
    const [report, setReport] = useState<Report | null>(null);
    const [state, setState] = useState<"loading" | "ready" | "off">("loading");
    const [days, setDays] = useState(savedDays);
    const choose = (value: number) => {
        setDays(value);
        setReport(null);
        try { localStorage.setItem(storageKey, String(value)); } catch { /* Remembering is optional. */ }
    };

    useEffect(() => {
        let live = true;
        void api.reports({ from: istanbulDay(days - 1), to: istanbulDay(0) }).then((result) => {
            if (!live) return;
            // Reports not configured (or failing): the status card below says why, so this card simply stays away.
            if (result.status !== 200) { setState("off"); return; }
            setReport(result.data.report);
            setState("ready");
        });
        return () => { live = false; };
    }, [days]);

    if (state === "off") return null;
    const box = { p: { xs: 2, md: 3 }, mb: 4, borderRadius: "20px", border: "1px solid rgba(142,168,232,0.16)", backgroundColor: "rgba(142,168,232,0.04)" };
    const header = <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Box>
            <Typography component="h2" sx={{ fontSize: "1.15rem", fontWeight: 700 }}>{T.title[days]}</Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "rgba(245,247,250,0.6)", mt: 0.5 }}>
                {T.intro[days]} {T.more}{report?.trackingSince && report.trackingSince > report.range.from ? ` ${T.since.replace("{date}", dateTime(report.trackingSince))}.` : ""}
            </Typography>
        </Box>
        <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Stack direction="row" role="group" sx={{ gap: 0.5, p: 0.5, borderRadius: "999px", border: "1px solid rgba(142,168,232,0.2)" }}>
                {T.periods.map(([value, label]) => <ButtonBase key={value} onClick={() => choose(value)} aria-pressed={days === value} sx={{
                    px: 1.5, py: 0.6, borderRadius: "999px", fontSize: "0.8rem", fontWeight: days === value ? 700 : 400,
                    color: days === value ? "#F5F7FA" : "rgba(245,247,250,0.65)", backgroundColor: days === value ? "rgba(142,168,232,0.22)" : "transparent",
                    transition: "background-color 300ms ease, color 300ms ease",
                }}>{label}</ButtonBase>)}
            </Stack>
            <Button size="small" startIcon={<InsightsRoundedIcon />} onClick={openReports}>{T.open}</Button>
        </Stack>
    </Stack>;
    if (!report) return <Box sx={box}>{header}<Box sx={{ display: "grid", placeItems: "center", minHeight: 120 }}><CircularProgress size={26} /></Box></Box>;

    const { summary, previous } = report;
    const change = (now: number, before: number) => {
        if (!before) return null;
        const percent = Math.round(((now - before) / before) * 100);
        const up = percent >= 0;
        return <Stack direction="row" sx={{ alignItems: "center", gap: 0.25, fontSize: "0.75rem", color: up ? "#7FD6A4" : "#F29C9C" }}>
            {up ? <ArrowUpwardRoundedIcon sx={{ fontSize: 14 }} /> : <ArrowDownwardRoundedIcon sx={{ fontSize: 14 }} />}{number(Math.abs(percent))}%
        </Stack>;
    };
    const tiles: [string, string, ReturnType<typeof change>][] = [
        [T.visitors, number(summary.visitors), change(summary.visitors, previous.visitors)],
        days === 1 ? [T.avgSeconds, `${number(summary.avgSeconds)} ث`, change(summary.avgSeconds, previous.avgSeconds)] : [T.today, number(report.daily.at(-1)?.visitors ?? 0), null],
        [T.leads, number(summary.leads), change(summary.leads, previous.leads)],
        [T.conversion, `${number(summary.conversionRate)}%`, null],
    ];
    const leads = report.leads.slice(0, 3);
    const changes = report.changes.slice(-3).reverse();
    const list = { fontSize: "0.82rem", py: 1, borderTop: "1px solid rgba(142,168,232,0.1)" };

    return <Box sx={box}>
        {header}
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, mb: 3 }}>
            {tiles.map(([label, value, delta]) => <Box key={label} sx={{ p: 2, borderRadius: "14px", backgroundColor: "rgba(142,168,232,0.06)" }}>
                <Stack direction="row" sx={{ alignItems: "baseline", gap: 1 }}>
                    <Typography sx={{ fontSize: "1.6rem", fontWeight: 700 }}>{value}</Typography>{delta}
                </Stack>
                <Typography sx={{ fontSize: "0.8rem", color: "rgba(245,247,250,0.65)" }}>{label}</Typography>
            </Box>)}
        </Box>
        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
            <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, mb: 1 }}>{T.latestLeads}</Typography>
                {leads.length ? leads.map((lead) => <Box key={lead.ts + lead.contact} sx={list}>
                    <Typography sx={{ fontSize: "0.85rem" }}>{T.purpose[lead.purpose] ?? lead.purpose}{lead.country ? ` · ${countryName(lead.country)}` : ""}</Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "rgba(245,247,250,0.55)" }}>{dateTime(lead.ts)}{lead.source ? ` · ${lead.source}` : ""}</Typography>
                </Box>) : <Typography sx={{ ...list, color: "rgba(245,247,250,0.55)" }}>{T.noLeads}</Typography>}
            </Box>
            <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, mb: 1 }}>{T.latestChanges}</Typography>
                {changes.length ? changes.map((change) => <Box key={change.ts + change.summary} sx={list}>
                    <Typography sx={{ fontSize: "0.85rem" }} noWrap>{change.summary}</Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "rgba(245,247,250,0.55)" }}>{dateTime(change.ts)}</Typography>
                </Box>) : <Typography sx={{ ...list, color: "rgba(245,247,250,0.55)" }}>{T.noChanges}</Typography>}
            </Box>
        </Box>
    </Box>;
}
