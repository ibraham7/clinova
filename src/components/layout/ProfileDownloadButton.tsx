import { Button } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";

export default function ProfileDownloadButton({ outlined = false }: { outlined?: boolean }) {
    const { t } = useSiteTranslation();
    return <Button
        component="a"
        href="/documents/clinova-profile.pdf"
        download="Clinova-Company-Profile.pdf"
        variant={outlined ? "outlined" : "text"}
        size="small"
        sx={{ gap: 1, borderRadius: "999px", fontSize: "0.8rem", minHeight: outlined ? 50 : 40, px: outlined ? 2.5 : 1.5, py: 0.75, color: "primary.main" }}
    >
        <FileDownloadOutlinedIcon sx={{ fontSize: 19 }} />
        {t("تنزيل الملف التعريفي")}
    </Button>;
}
