import { useEffect, useState } from "react";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { isEditing } from "../../motion/usePointerStage";

// The page's sections in order, named with the same words the header menu uses.
const stops: { id: string; label: string }[] = [
    { id: "home", label: "الرئيسية" },
    { id: "about", label: "من نحن" },
    { id: "story", label: "قصتنا" },
    { id: "reach", label: "لماذا Clinova؟" },
    { id: "contact-system", label: "رحلة المريض" },
    { id: "services", label: "خدماتنا" },
    { id: "specialties", label: "تخصصاتنا" },
    { id: "case-studies", label: "قصص النجاح" },
    { id: "partners", label: "شركاؤنا" },
    { id: "faq", label: "الأسئلة الشائعة" },
    { id: "contact-cta", label: "تواصل معنا" },
];

/**
 * A slim rail at the side of wide screens: one mark per section, the current one lit, names appearing under the mouse,
 * a click travels to that section. It mirrors the header menu, so it is hidden from screen readers and from the keyboard.
 * Not shown on phones and tablets, in the text editor, or before the visitor has left the top of the page.
 */
export default function SectionRail() {
    const { t, direction } = useSiteTranslation();
    const [current, setCurrent] = useState("home");
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (isEditing() || typeof IntersectionObserver === "undefined") return;
        setReady(true);
        const sections = stops.map((stop) => document.getElementById(stop.id)).filter((el): el is HTMLElement => !!el);
        // The section crossing the middle of the screen is the current one.
        const observer = new IntersectionObserver((entries) => {
            const hit = entries.filter((entry) => entry.isIntersecting).pop();
            if (hit) setCurrent(hit.target.id);
        }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);
    if (!ready) return null;
    const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    const index = stops.findIndex((stop) => stop.id === current);
    return <div aria-hidden="true" className={`section-rail${current === "home" ? " is-top" : ""}`} dir={direction}>
        <span className="section-rail-line"><i style={{ height: `${(index / (stops.length - 1)) * 100}%` }} /></span>
        {stops.map((stop, position) => <button key={stop.id} type="button" tabIndex={-1} onClick={() => go(stop.id)}
            className={stop.id === current ? "is-current" : position < index ? "is-passed" : undefined}>
            <b />
            <span>{t(stop.label)}</span>
        </button>)}
    </div>;
}
