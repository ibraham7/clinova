import { useEffect } from "react";

// Endless animations (spinning rings, travelling lights, waves) keep the processor busy even in sections nobody can see.
// One observer marks every section that is off screen with "is-offscreen"; the CSS then pauses everything inside it
// (see interactive.css). The patient journey picture pauses its own SVG (SMIL) animations.
// Restarted by App whenever more sections have appeared.
export default function OffscreenPause() {
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;
        const targets = Array.from(document.querySelectorAll<HTMLElement>("section[id], footer, .deferred-ssr"));
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                const element = entry.target as HTMLElement;
                element.classList.toggle("is-offscreen", !entry.isIntersecting);
            }
        }, { rootMargin: "120px 0px" });
        targets.forEach((target) => observer.observe(target));
        return () => {
            observer.disconnect();
            targets.forEach((target) => target.classList.remove("is-offscreen"));
        };
    }, []);
    return null;
}
