import { useEffect, useRef, useState } from "react";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import { useSiteTranslation } from "../i18n/useSiteTranslation";

// A round "back to top" button whose ring fills as the page is read.
export default function ScrollTopRing() {
    const { t } = useSiteTranslation();
    const ring = useRef<SVGCircleElement>(null);
    const [shown, setShown] = useState(false);
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
            ring.current?.style.setProperty("stroke-dashoffset", String(1 - progress));
            setShown(window.scrollY > window.innerHeight * 0.8);
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, []);
    return <button type="button" className={`clinova-top${shown ? " is-shown" : ""}`} aria-label={t("العودة إلى الأعلى")} tabIndex={shown ? 0 : -1} data-fx="magnet"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <circle cx="24" cy="24" r="21" className="clinova-top-track" />
            <circle ref={ring} cx="24" cy="24" r="21" pathLength={1} className="clinova-top-fill" />
        </svg>
        <ArrowUpwardRoundedIcon />
    </button>;
}
