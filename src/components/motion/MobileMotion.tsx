import { useEffect } from "react";

// Touch-screen version of the laptop's pointer effects. A finger has no hover, so the same lights and leaning happen under the
// finger instead: the card you press lights up under your fingertip and leans a little toward it, the buttons give a short tap
// buzz (where the phone supports it). Everything is driven by one set of listeners on the page, only custom properties on the
// touched card are written, and everything is undone on release. Nothing runs with reduced motion or in the text editor (?edit).
export default function MobileMotion() {
    useEffect(() => {
        if (new URLSearchParams(window.location.search).has("edit")) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!window.matchMedia("(max-width: 899px), (pointer: coarse)").matches) return;

        const root = document.documentElement;
        root.classList.add("fx-touch");
        let card: HTMLElement | null = null;
        let tilt: HTMLElement | null = null;
        let release = 0;

        const ensureSpot = (el: HTMLElement) => {
            if (el.querySelector(":scope > .fx-spot")) return;
            const glow = document.createElement("span");
            glow.className = "fx-spot";
            glow.setAttribute("aria-hidden", "true");
            el.prepend(glow);
            requestAnimationFrame(() => requestAnimationFrame(() => glow.classList.add("is-live")));
        };

        const aim = (event: PointerEvent) => {
            if (card) {
                const rect = card.getBoundingClientRect();
                card.style.setProperty("--fx-mx", `${(event.clientX - rect.left).toFixed(0)}px`);
                card.style.setProperty("--fx-my", `${(event.clientY - rect.top).toFixed(0)}px`);
            }
            if (tilt) {
                const rect = tilt.getBoundingClientRect();
                tilt.style.setProperty("--fx-ry", `${(((event.clientX - rect.left) / rect.width - 0.5) * 7).toFixed(2)}deg`);
                tilt.style.setProperty("--fx-rx", `${(-((event.clientY - rect.top) / rect.height - 0.5) * 6).toFixed(2)}deg`);
            }
        };

        const down = (event: PointerEvent) => {
            if (event.pointerType === "mouse") return;
            window.clearTimeout(release);
            const target = event.target instanceof Element ? event.target : null;
            const button = target?.closest(".clinova-shine, .MuiButton-root, .clinova-top");
            if (button && "vibrate" in navigator) { try { navigator.vibrate(8); } catch { /* not allowed: fine */ } }
            card = target?.closest<HTMLElement>('[data-fx~="spot"]') ?? null;
            tilt = target?.closest<HTMLElement>('[data-fx~="tilt"]') ?? null;
            if (card) { ensureSpot(card); card.classList.add("is-touched"); }
            if (tilt) tilt.classList.add("is-touched");
            aim(event);
        };
        const move = (event: PointerEvent) => { if (event.pointerType !== "mouse" && (card || tilt)) aim(event); };
        const up = () => {
            const [a, b] = [card, tilt];
            card = tilt = null;
            // The light stays a moment after the finger lifts, then fades with the card settling back.
            window.clearTimeout(release);
            release = window.setTimeout(() => {
                a?.classList.remove("is-touched");
                if (b) { b.classList.remove("is-touched"); b.style.removeProperty("--fx-rx"); b.style.removeProperty("--fx-ry"); }
            }, 450);
        };

        window.addEventListener("pointerdown", down, { passive: true });
        window.addEventListener("pointermove", move, { passive: true });
        window.addEventListener("pointerup", up, { passive: true });
        window.addEventListener("pointercancel", up, { passive: true });
        return () => {
            window.clearTimeout(release);
            window.removeEventListener("pointerdown", down);
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            window.removeEventListener("pointercancel", up);
            root.classList.remove("fx-touch");
        };
    }, []);
    return null;
}
