import { useEffect } from "react";

// Sections and their content animate into view as the visitor scrolls. Content stays
// visible when motion is reduced or IntersectionObserver is missing.
const contentTargets = [
    "#home .MuiContainer-root > * > *",
    "section[id]:not(#home) .MuiContainer-root > *",
    "[data-reveal-group] > *",
].join(", ");
const headingTargets = "section[id] h1, section[id] h2";

// Grid and flex rows reveal piece by piece: two columns slide in from their own side,
// longer rows rise in card by card.
function expand(element: HTMLElement): HTMLElement[] {
    const display = getComputedStyle(element).display;
    const children = Array.from(element.children) as HTMLElement[];
    if (!/grid|flex/.test(display) || children.length < 2 || children.length > 12) return [element];
    children.forEach((child, index) => {
        child.dataset.revealVariant = children.length === 2 ? (index === 0 ? "start" : "end") : "card";
    });
    return children;
}

// Accent lines inside headings (the coloured second line) get a slow light sweep.
function markAccents() {
    document.querySelectorAll<HTMLElement>("section[id] h1 > span, section[id] h2 > span").forEach((span) => {
        const heading = span.parentElement;
        if (heading && getComputedStyle(span).color !== getComputedStyle(heading).color) span.dataset.accent = "";
    });
}

export default function ScrollReveal() {
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        markAccents();

        const show = (entries: IntersectionObserverEntry[], observer: IntersectionObserver, key: "reveal" | "section") => {
            entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
                const element = entry.target as HTMLElement;
                element.style.setProperty("--clinova-reveal-delay", `${Math.min(index, 6) * 90}ms`);
                element.dataset[key] = "shown";
                observer.unobserve(element);
            });
        };
        const sectionObserver = new IntersectionObserver((entries) => show(entries, sectionObserver, "section"), { rootMargin: "0px 0px -4% 0px", threshold: 0 });
        const contentObserver = new IntersectionObserver((entries) => show(entries, contentObserver, "reveal"), { rootMargin: "0px 0px -10% 0px", threshold: 0 });

        const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]:not(#home)"))
            .filter((section) => !section.dataset.section);
        sections.forEach((section) => {
            section.dataset.section = "hidden";
            sectionObserver.observe(section);
        });

        const headings = Array.from(document.querySelectorAll<HTMLElement>(headingTargets));
        headings.forEach((heading) => { heading.dataset.revealVariant = "heading"; });
        const elements = [...Array.from(document.querySelectorAll<HTMLElement>(contentTargets)).flatMap(expand), ...headings]
            .filter((element) => !element.dataset.reveal);
        elements.forEach((element) => {
            element.dataset.reveal = "hidden";
            contentObserver.observe(element);
        });

        return () => {
            sectionObserver.disconnect();
            contentObserver.disconnect();
            sections.forEach((section) => { if (section.dataset.section === "hidden") delete section.dataset.section; });
            elements.forEach((element) => { if (element.dataset.reveal === "hidden") delete element.dataset.reveal; });
        };
    }, []);

    return null;
}
