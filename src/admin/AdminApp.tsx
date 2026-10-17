import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Alert, Box, Button, ButtonBase, CircularProgress, GlobalStyles, Stack, TextField, Typography } from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import clinovaLogo from "../../public/logo/logo.png";
import { api, messageFor, type Session } from "./api";
import { useAdminContent } from "./useAdminContent";
import TextsPage from "./TextsPage";
import VideosPage from "./VideosPage";
import LogosPage from "./LogosPage";
import ReportsPage from "./ReportsPage";
import HealthCard from "./HealthCard";

type Page = "home" | "reports" | "texts" | "videos" | "logos";
const T = {
    title: "لوحة إدارة Clinova",
    password: "كلمة السر",
    signIn: "تسجيل الدخول",
    signingIn: "جارٍ الدخول…",
    nav: { home: "الرئيسية", reports: "التقارير وسيرينا", texts: "تعديل نصوص الموقع", videos: "فيديوهات العملاء", logos: "الشعارات" } as Record<Page, string>,
    view: "عرض الموقع",
    logout: "تسجيل الخروج",
    welcome: "أهلًا بك في لوحة الإدارة",
    intro: "من هنا تتابع تقارير الزوار وتسأل سيرينا، وتعدّل نصوص الموقع وتضيف فيديوهات العملاء وشعاراتهم. كل حفظ يُنشر على الموقع تلقائيًا خلال دقيقة أو دقيقتين، ويبقى محفوظًا في سجل GitHub ويمكن استرجاعه.",
    stats: { texts: "نصوص معدّلة", videos: "فيديوهات", logos: "شعارات" },
    noStorage: "الحفظ غير مفعّل بعد. أضف GITHUB_TOKEN في إعدادات Netlify (راجع docs/admin-panel.md).",
    notTracked: "زياراتك للموقع من هذا المتصفح لا تُحسب في التقارير، حتى لا تختلط أرقامك بأرقام الزوار.",
};

function Login({ onDone }: { onDone: () => void }) {
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setBusy(true);
        const result = await api.login(password);
        setBusy(false);
        if (result.status === 200) onDone();
        else setError(messageFor(result.data.error));
    };
    return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2, background: "radial-gradient(circle at 50% 0%, rgba(142,168,232,0.18), transparent 50%), #0B111B" }}>
        <Box component="form" onSubmit={submit} sx={{ width: "min(400px, 100%)", p: 4, borderRadius: "24px", border: "1px solid rgba(142,168,232,0.22)", backgroundColor: "#111B2A" }}>
            <Box component="img" src={clinovaLogo} alt="Clinova" sx={{ width: 140, display: "block", mx: "auto", mb: 2 }} />
            <Typography component="h1" sx={{ textAlign: "center", fontSize: "1.2rem", fontWeight: 700, mb: 3 }}>{T.title}</Typography>
            <TextField type="password" label={T.password} value={password} onChange={(event) => { setPassword(event.target.value); setError(null); }} fullWidth autoFocus autoComplete="current-password" />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button type="submit" variant="contained" fullWidth disabled={busy || !password} sx={{ mt: 3, borderRadius: "999px", py: 1.2 }}>{busy ? T.signingIn : T.signIn}</Button>
        </Box>
    </Box>;
}

function NavItem({ icon, label, active, onClick, href }: { icon: ReactNode; label: string; active?: boolean; onClick?: () => void; href?: string }) {
    return <ButtonBase {...(href ? { href, target: "_blank", rel: "noopener" } : { onClick })} sx={{
        width: "100%", justifyContent: "flex-start", gap: 1.5, px: 2, py: 1.4, borderRadius: "14px", fontSize: "0.92rem", textAlign: "start",
        color: active ? "#F5F7FA" : "rgba(245,247,250,0.7)", backgroundColor: active ? "rgba(142,168,232,0.16)" : "transparent",
        transition: "background-color 400ms ease, color 400ms ease", "&:hover": { backgroundColor: "rgba(142,168,232,0.1)", color: "#F5F7FA" },
    }}>{icon}{label}</ButtonBase>;
}

/** /admin: password sign-in, then a dashboard with a menu on the right (the panel is Arabic, right to left). */
export default function AdminApp() {
    const [session, setSession] = useState<Session | null | "loading">("loading");
    const [page, setPage] = useState<Page>("home");
    const check = async () => {
        const result = await api.session();
        setSession(result.status === 200 ? result.data : null);
    };
    useEffect(() => {
        document.title = T.title;
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ar";
        let live = true;
        void api.session().then((result) => { if (live) setSession(result.status === 200 ? result.data : null); });
        return () => { live = false; };
    }, []);

    // MUI's icon spacing is physical (left/right); flip it for the right-to-left admin panel.
    const rtlIcons = <GlobalStyles styles={{
        ".MuiButton-startIcon": { marginLeft: "8px !important", marginRight: "-4px !important" },
        ".MuiButton-endIcon": { marginRight: "8px !important", marginLeft: "-4px !important" },
    }} />;
    if (session === "loading") return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", backgroundColor: "#0B111B" }}><CircularProgress /></Box>;
    if (!session) return <Box dir="rtl">{rtlIcons}<Login onDone={check} /></Box>;
    return <>{rtlIcons}<Dashboard session={session} page={page} setPage={setPage} onLogout={async () => { await api.logout(); setSession(null); }} /></>;
}

function Dashboard({ session, page, setPage, onLogout }: { session: Session; page: Page; setPage: (page: Page) => void; onLogout: () => void }) {
    const admin = useAdminContent();
    // This browser belongs to an admin: the site's visitor statistics leave it out (see src/analytics/track.ts).
    useEffect(() => { try { localStorage.setItem("clinova.notrack", "1"); } catch { /* Private mode. */ } }, []);
    const icons: Record<Page, ReactNode> = { home: <DashboardRoundedIcon />, reports: <InsightsRoundedIcon />, texts: <EditNoteRoundedIcon />, videos: <VideoLibraryRoundedIcon />, logos: <WorkspacesRoundedIcon /> };
    const edited = admin.content ? Object.values(admin.content.texts).reduce((sum, texts) => sum + Object.keys(texts).length, 0) : 0;
    return <Box dir="rtl" sx={{ minHeight: "100vh", display: "flex", flexDirection: { xs: "column", md: "row" }, backgroundColor: "#0B111B", color: "#F5F7FA" }}>
        <Box component="nav" sx={{
            width: { md: 270 }, flexShrink: 0, p: 2, display: "flex", flexDirection: { xs: "row", md: "column" }, gap: 0.5, overflowX: "auto",
            borderInlineEnd: { md: "1px solid rgba(142,168,232,0.14)" }, borderBottom: { xs: "1px solid rgba(142,168,232,0.14)", md: "none" }, backgroundColor: "#0E1622",
            position: { md: "sticky" }, top: 0, height: { md: "100vh" },
        }}>
            <Box component="img" src={clinovaLogo} alt="Clinova" sx={{ width: 120, mx: 2, my: 2, display: { xs: "none", md: "block" } }} />
            {(Object.keys(T.nav) as Page[]).map((key) => <NavItem key={key} icon={icons[key]} label={T.nav[key]} active={page === key} onClick={() => setPage(key)} />)}
            <Box sx={{ flex: { md: 1 } }} />
            <NavItem icon={<OpenInNewRoundedIcon />} label={T.view} href="/ar" />
            <NavItem icon={<LogoutRoundedIcon />} label={T.logout} onClick={onLogout} />
        </Box>
        <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 4 } }}>
            {!session.storage && <Alert severity="warning" sx={{ mb: 3 }}>{T.noStorage}</Alert>}
            {admin.error && session.storage && <Alert severity="error" sx={{ mb: 3 }}>{admin.error}</Alert>}
            {page === "home" && <Box>
                <Typography component="h1" sx={{ fontSize: "1.6rem", fontWeight: 700, mb: 1 }}>{T.welcome}</Typography>
                <Typography sx={{ color: "rgba(245,247,250,0.7)", lineHeight: 1.9, maxWidth: 720, mb: 4 }}>{T.intro}</Typography>
                <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: 2 }}>
                    {([["texts", edited], ["videos", admin.content?.videos.length ?? 0], ["logos", admin.content?.logos.length ?? 0]] as [keyof typeof T.stats, number][]).map(([key, value]) =>
                        <ButtonBase key={key} onClick={() => setPage(key)} sx={{ flex: 1, flexDirection: "column", alignItems: "flex-start", p: 3, borderRadius: "20px", border: "1px solid rgba(142,168,232,0.18)", backgroundColor: "rgba(142,168,232,0.05)", transition: "background-color 400ms ease", "&:hover": { backgroundColor: "rgba(142,168,232,0.1)" } }}>
                            <Typography sx={{ fontSize: "2rem", fontWeight: 700 }}>{value}</Typography>
                            <Typography sx={{ color: "rgba(245,247,250,0.7)" }}>{T.stats[key]}</Typography>
                        </ButtonBase>)}
                </Stack>
                <Typography sx={{ color: "rgba(245,247,250,0.55)", fontSize: "0.8rem", mt: 2, mb: 4 }}>{T.notTracked}</Typography>
                <HealthCard />
            </Box>}
            {page === "reports" && <ReportsPage />}
            {page === "texts" && <TextsPage />}
            {page === "videos" && <VideosPage admin={admin} upload={session.videoUpload} />}
            {page === "logos" && <LogosPage admin={admin} />}
        </Box>
    </Box>;
}
