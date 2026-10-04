import { lazy, Suspense, useState } from "react";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import settings from "../../config/profile-leads.json";

const ProfileDownloadDialog = lazy(() => import("./ProfileDownloadDialog"));
export default function ProfileDownloadButton({ outlined = false }: { outlined?: boolean }) {
    const { t } = useSiteTranslation();
    const [open, setOpen] = useState(false);
    const enabled = settings.endpoint.startsWith("https://");
    return <>
        <Button component="a" href="/documents/clinova-profile.pdf" download="Clinova-Company-Profile.pdf"
            onClick={event => { if (enabled) { event.preventDefault(); setOpen(true); } }}
            variant={outlined ? "outlined" : "text"} size="small"
            sx={{ gap: 1, borderRadius: "999px", fontSize: "0.8rem", minHeight: outlined ? 50 : 40, px: outlined ? 2.5 : 1.5, py: 0.75, color: "primary.main" }}
        ><FileDownloadOutlinedIcon sx={{ fontSize: 19 }} />{t("الملف التعريفي")}</Button>
        {open && <Suspense fallback={<Backdrop open sx={{ zIndex: theme => theme.zIndex.modal + 1 }}><CircularProgress color="inherit" /></Backdrop>}>
            <ProfileDownloadDialog outlined={outlined} onClose={() => setOpen(false)} />
        </Suspense>}
    </>;
}
