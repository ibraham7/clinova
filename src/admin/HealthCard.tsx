import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { api, type HealthCheck } from "./api";

const T = {
    title: "حالة الربط",
    intro: "فحص مباشر لكل خدمة يعتمد عليها الموقع ولوحة الإدارة.",
    refresh: "إعادة الفحص",
    failed: "تعذر تشغيل الفحص.",
    names: {
        password: ["كلمة سر الإدارة", "ADMIN_PASSWORD"],
        github: ["حفظ التعديلات على الموقع (GitHub)", "GITHUB_TOKEN"],
        supabase: ["قاعدة بيانات التقارير (Supabase)", "SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY"],
        gemini: ["سيرينا (Google Gemini)", "GEMINI_API_KEY"],
        sheets: ["الاستبيان وتحميل البروفايل (Google Sheets)", "src/config/profile-leads.json"],
        cloudinary: ["رفع ملفات الفيديو (Cloudinary، اختياري)", "CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET"],
    } as Record<HealthCheck["id"], [string, string]>,
};

/** Live status of every integration, so the admin sees at a glance what works and what to fix. */
export default function HealthCard() {
    const [checks, setChecks] = useState<HealthCheck[] | null>(null);
    const [error, setError] = useState(false);
    const [run, setRun] = useState(0);
    useEffect(() => {
        let live = true;
        const timer = window.setTimeout(() => {
            setChecks(null);
            setError(false);
            void api.health().then((result) => {
                if (!live) return;
                if (result.status === 200) setChecks(result.data.checks);
                else setError(true);
            });
        }, 0);
        return () => { live = false; window.clearTimeout(timer); };
    }, [run]);

    return <Box sx={{ p: 3, borderRadius: "20px", border: "1px solid rgba(142,168,232,0.18)", backgroundColor: "rgba(142,168,232,0.05)", maxWidth: 820 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
            <Typography component="h2" sx={{ fontSize: "1.1rem", fontWeight: 700 }}>{T.title}</Typography>
            <Button size="small" startIcon={<RefreshRoundedIcon />} onClick={() => setRun((count) => count + 1)} disabled={!checks && !error}>{T.refresh}</Button>
        </Stack>
        <Typography sx={{ fontSize: "0.82rem", color: "rgba(245,247,250,0.62)", mb: 2 }}>{T.intro}</Typography>
        {error && <Typography sx={{ color: "#F28B82" }}>{T.failed}</Typography>}
        {!checks && !error && <CircularProgress size={22} />}
        {checks && <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25 }}>
            {checks.map((item) => {
                const [name, setting] = T.names[item.id];
                const Icon = item.ok ? CheckCircleRoundedIcon : item.optional ? InfoRoundedIcon : ErrorRoundedIcon;
                return <Box component="li" key={item.id} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <Icon sx={{ mt: 0.25, color: item.ok ? "#7DD3A8" : item.optional ? "#E8B86E" : "#F28B82" }} />
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: "0.92rem", fontWeight: 600 }}>{name}</Typography>
                        <Typography dir="ltr" sx={{ fontSize: "0.75rem", color: "rgba(245,247,250,0.6)", textAlign: "right", wordBreak: "break-word" }}>{setting}{item.detail ? ` — ${item.detail}` : ""}</Typography>
                    </Box>
                </Box>;
            })}
        </Box>}
    </Box>;
}
