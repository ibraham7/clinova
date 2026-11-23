import { useEffect, useState } from "react";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { bookingLinkProps } from "../../config/contact";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";

// Phones only: after the first screen a gold booking pill rises from the bottom edge and follows the reader. It steps aside
// where the page already shows the same call to action (the contact block and the footer), so it never stacks on top of them.
export default function StickyCta() {
    const { t } = useSiteTranslation();
    const [phone, setPhone] = useState(false);
    const [past, setPast] = useState(false);
    const [covered, setCovered] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(max-width: 899px)");
        const sync = () => setPhone(query.matches);
        sync();
        query.addEventListener("change", sync);
        return () => query.removeEventListener("change", sync);
    }, []);

    useEffect(() => {
        if (!phone) return;
        let frame = 0;
        const update = () => { frame = 0; setPast(window.scrollY > window.innerHeight * 0.9); };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", schedule, { passive: true });

        const hidden = new Set<Element>();
        const watch = new IntersectionObserver((entries) => {
            entries.forEach((entry) => { if (entry.isIntersecting) hidden.add(entry.target); else hidden.delete(entry.target); });
            setCovered(hidden.size > 0);
        });
        // Sections arrive one after another (see Deferred.tsx), so keep looking until both are found.
        const watched = new Set<Element>();
        const find = () => document.querySelectorAll("#contact-cta, footer").forEach((el) => { if (!watched.has(el)) { watched.add(el); watch.observe(el); } });
        find();
        window.addEventListener("clinova:sections", find);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("clinova:sections", find);
            watch.disconnect();
        };
    }, [phone]);

    if (!phone) return null;
    return <a {...bookingLinkProps} className={`clinova-cta-dock${past && !covered ? " is-shown" : ""}`} tabIndex={past && !covered ? 0 : -1} aria-hidden={!(past && !covered) || undefined}>
        <span className="clinova-cta-dock-ping" aria-hidden="true" />
        <PhoneRoundedIcon aria-hidden="true" />
        <span>{t("احجز مكالمة التقييم المجانية")}</span>
    </a>;
}
