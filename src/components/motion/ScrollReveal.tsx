import { useEffect } from "react";

// Section content rises into view as the visitor scrolls. Content stays visible
// when motion is reduced or IntersectionObserver is missing.
const targets = [
    "#home .MuiContainer-root > * > *",
    "section[id]:not(#home) .MuiContainer-root > *",
    "[data-reveal-group] > *",
].join(", ");

// Grid and flex rows reveal card by card instead of as one block.
function expand(element: HTMLElement): HTMLElement[] {
    const display = getComputedStyle(element).display;
    const children = Array.from(element.children) as HTMLElement[];
    if (/grid|flex/.test(display) && children.length > 1 && children.length <= 12) return children;
    return [element];
}

export default function ScrollReveal() {
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const observer = new IntersectionObserver((entries) => {
            entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
                const element = entry.target as HTMLElement;
                element.style.setProperty("--clinova-reveal-delay", `${Math.min(index, 6) * 90}ms`);
                element.dataset.reveal = "shown";
                observer.unobserve(element);
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });

        const elements = Array.from(document.querySelectorAll<HTMLElement>(targets)).flatMap(expand)
            .filter((element) => !element.dataset.reveal);
        elements.forEach((element) => {
            element.dataset.reveal = "hidden";
            observer.observe(element);
        });

        return () => {
            observer.disconnect();
            elements.forEach((element) => { if (element.dataset.reveal === "hidden") delete element.dataset.reveal; });
        };
    }, []);

    return null;
}
