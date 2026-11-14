import { useEffect } from "react";

// Sections and their content animate into view as the visitor scrolls. With reduced
// motion the CSS turns every reveal into a plain fade; without IntersectionObserver
// content simply stays visible.
// The hero is left out: it has its own entrance that waits for the opening animation (see motion.css).
const contentTargets = [
    "section[id]:not(#home) .MuiContainer-root > *",
    "[data-reveal-group] > *",
].join(", ");
const headingTargets = "section[id]:not(#home) h1, section[id]:not(#home) h2";

// Grid and flex rows reveal piece by piece: two columns slide in from their own side,
// longer rows rise in card by card. Styles are read for all rows first and the attributes written afterwards: reading a style
// between writes forces the browser to recalculate every style once per row, which is slow on a phone.
function expandAll(elements: HTMLElement[]): HTMLElement[] {
    const displays = elements.map((element) => getComputedStyle(element).display);
    const out: HTMLElement[] = [];
    elements.forEach((element, at) => {
        const children = Array.from(element.children) as HTMLElement[];
        if (!/grid|flex/.test(displays[at]) || children.length < 2 || children.length > 12) { out.push(element); return; }
        children.forEach((child, index) => {
            child.dataset.revealVariant = children.length === 2 ? (index === 0 ? "start" : "end") : "card";
        });
        out.push(...children);
    });
    return out;
}

// Accent lines inside headings (the coloured second line) get a slow light sweep.
function markAccents(spans: HTMLElement[]) {
    const colors = spans.map((span) => [getComputedStyle(span).color, span.parentElement ? getComputedStyle(span.parentElement).color : ""]);
    spans.forEach((span, at) => { if (colors[at][0] !== colors[at][1]) span.dataset.accent = ""; });
}

export default function ScrollReveal() {
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;

        const show = (entries: IntersectionObserverEntry[], observer: IntersectionObserver, key: "reveal" | "section") => {
            // Anything already scrolled past (a jump link, a restored scroll position) is shown too.
            entries.filter((entry) => entry.isIntersecting || entry.boundingClientRect.bottom < 0).forEach((entry, index) => {
                const element = entry.target as HTMLElement;
                element.style.setProperty("--clinova-reveal-delay", `${Math.min(index, 6) * 90}ms`);
                element.dataset[key] = "shown";
                observer.unobserve(element);
            });
        };
        const sectionObserver = new IntersectionObserver((entries) => show(entries, sectionObserver, "section"), { rootMargin: "0px 0px -4% 0px", threshold: 0 });
        const contentObserver = new IntersectionObserver((entries) => show(entries, contentObserver, "reveal"), { rootMargin: "0px 0px -10% 0px", threshold: 0 });
        const seen = new WeakSet<Element>();
        const mine: HTMLElement[] = [];

        // Finds what is new on the page (sections arrive one after another, see Deferred.tsx) and starts watching it.
        const scan = () => {
            const fresh = (list: Element[]) => (list as HTMLElement[]).filter((element) => !seen.has(element) && !element.closest(".deferred-ssr"));
            const sections = fresh(Array.from(document.querySelectorAll("section[id]:not(#home)"))).filter((section) => !section.dataset.section);
            const headings = fresh(Array.from(document.querySelectorAll(headingTargets)));
            const targets = fresh(Array.from(document.querySelectorAll(contentTargets)));
            [...sections, ...headings, ...targets].forEach((element) => seen.add(element));
            const spans = fresh(Array.from(document.querySelectorAll("section[id] h1 > span, section[id] h2 > span")));
            spans.forEach((element) => seen.add(element));

            const items = [...expandAll(targets), ...headings].filter((element) => !element.dataset.reveal);
            markAccents(spans);
            sections.forEach((section) => { section.dataset.section = "hidden"; sectionObserver.observe(section); mine.push(section); });
            headings.forEach((heading) => { heading.dataset.revealVariant = "heading"; });
            items.forEach((element) => { element.dataset.reveal = "hidden"; contentObserver.observe(element); mine.push(element); });
        };
        scan();
        window.addEventListener("clinova:sections", scan);

        return () => {
            window.removeEventListener("clinova:sections", scan);
            sectionObserver.disconnect();
            contentObserver.disconnect();
            mine.forEach((element) => {
                if (element.dataset.section === "hidden") delete element.dataset.section;
                if (element.dataset.reveal === "hidden") delete element.dataset.reveal;
            });
        };
    }, []);

    return null;
}
