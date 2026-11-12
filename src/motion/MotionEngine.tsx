import { useEffect } from "react";

// One small engine behind the landing page's "alive" feel. Components only add attributes; this file does the work:
//   data-fx="tilt"    card leans toward the pointer (3D)             data-fx="spot"   soft light that follows the pointer
//   data-fx="magnet"  button drifts toward the pointer               data-fill        text fills in line by line while scrolling
// It also drifts the background glows with the scroll, eases the hero out as it leaves, skews the ticker with scroll speed,
// and hides the header while reading downward. The mouse pointer itself is left alone. Nothing runs in the text editor (?edit);
// with reduced motion only the static look stays.
//
// Kept cheap on purpose: one animation frame per scroll or pointer burst, all measuring first and writing after (no layout
// thrash), only what is on screen is touched, and no custom property is written on :root (that would restyle the whole page).
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type Lean = { el: HTMLElement; tx: number; ty: number; x: number; y: number; lt: number; l: number; hover: boolean; magnet: boolean };

export default function MotionEngine() {
    useEffect(() => {
        if (new URLSearchParams(window.location.search).has("edit")) return;
        const root = document.documentElement;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const undo: (() => void)[] = [];

        /* ---------- Scroll ---------- */
        const hero = document.getElementById("home");
        const heroBox = hero?.querySelector<HTMLElement>(":scope > .MuiContainer-root") ?? null;
        const ticker = document.querySelector<HTMLElement>(".clinova-ticker-wrap");
        const glows = Array.from(document.querySelectorAll<HTMLElement>("section[id] > div")).filter((el) => {
            const style = getComputedStyle(el);
            return style.position === "absolute" && style.pointerEvents === "none";
        }).map((el, index) => ({ el, section: el.parentElement as HTMLElement, speed: (index % 2 ? 1 : -1) * (0.05 + (index % 4) * 0.025) }));
        const fills = Array.from(document.querySelectorAll<HTMLElement>("[data-fill]"));
        const paintFills = () => fills.forEach((el) => {
            el.classList.remove("fx-fill");
            el.style.setProperty("--fx-fill-on", getComputedStyle(el).color);
            el.classList.add("fx-fill");
        });
        if (!reduce) {
            paintFills();
            const themes = new MutationObserver(paintFills);
            themes.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
            undo.push(() => { themes.disconnect(); fills.forEach((el) => el.classList.remove("fx-fill")); });
        }

        let lastY = window.scrollY;
        let headerY = window.scrollY;
        let velocity = 0;
        let frame = 0;
        let lastSkew = "";
        const scrollTick = () => {
            frame = 0;
            const y = window.scrollY;
            const vh = window.innerHeight;
            velocity += (clamp((y - lastY) / 40, -1, 1) - velocity) * 0.18;
            lastY = y;

            // Measure everything first ...
            const glowRects = glows.map((glow) => glow.section.getBoundingClientRect());
            const fillRects = fills.map((el) => el.getBoundingClientRect());
            const heroHeight = hero ? hero.offsetHeight : 0;

            // ... then write.
            if (ticker) {
                const skew = velocity.toFixed(2);
                if (skew !== lastSkew) { ticker.style.setProperty("--clinova-vel", skew); lastSkew = skew; }
            }
            if (Math.abs(y - headerY) > 8) {
                const menuOpen = document.body.classList.contains("MuiModal-open") || document.body.style.overflow === "hidden";
                root.dataset.header = y > 220 && y > headerY && !menuOpen ? "hide" : "show";
                headerY = y;
            }
            glows.forEach((glow, index) => {
                const rect = glowRects[index];
                if (rect.bottom < -200 || rect.top > vh + 200) return;
                glow.el.style.translate = `0 ${((rect.top + rect.height / 2 - vh / 2) * glow.speed).toFixed(0)}px`;
            });
            if (heroBox && heroHeight && y < heroHeight) heroBox.style.translate = `0 ${(clamp(y / (heroHeight * 0.8), 0, 1) * 60).toFixed(0)}px`;
            fills.forEach((el, index) => {
                const rect = fillRects[index];
                const value = rect.bottom < 0 ? 1 : rect.top > vh ? 0 : clamp((vh * 0.88 - rect.top) / (rect.height + vh * 0.32), 0, 1);
                const text = value.toFixed(2);
                if (el.dataset.fillValue !== text) { el.dataset.fillValue = text; el.style.setProperty("--fx-fill", text); }
            });
            if (Math.abs(velocity) > 0.02) frame = requestAnimationFrame(scrollTick);
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(scrollTick); };
        if (!reduce) {
            scrollTick();
            window.addEventListener("scroll", schedule, { passive: true });
            window.addEventListener("resize", schedule);
            undo.push(() => {
                cancelAnimationFrame(frame);
                window.removeEventListener("scroll", schedule);
                window.removeEventListener("resize", schedule);
                glows.forEach(({ el }) => { el.style.translate = ""; });
                if (heroBox) heroBox.style.translate = "";
                delete root.dataset.header;
            });
        }

        /* ---------- Pointer: tilt, spotlight, magnetic buttons ---------- */
        if (fine && !reduce) {
            root.classList.add("fx-hover");
            let pending: PointerEvent | null = null;
            let hovered = new Set<HTMLElement>();
            const leans = new Map<HTMLElement, Lean>();
            let running = 0;

            const lean = (el: HTMLElement, magnet: boolean) => {
                let entry = leans.get(el);
                if (!entry) { entry = { el, tx: 0, ty: 0, x: 0, y: 0, lt: 0, l: 0, hover: true, magnet }; leans.set(el, entry); }
                entry.hover = true;
                return entry;
            };

            // The pointer is only looked at once per frame, however many events arrived.
            const handle = (event: PointerEvent) => {
                const target = event.target instanceof Element ? event.target : null;
                const now = new Set<HTMLElement>();
                const tilt = target?.closest<HTMLElement>('[data-fx~="tilt"]') ?? null;
                const spot = target?.closest<HTMLElement>('[data-fx~="spot"]') ?? null;
                const magnet = target?.closest<HTMLElement>('[data-fx~="magnet"], .clinova-shine') ?? null;
                const mega = target?.closest<HTMLElement>(".clinova-mega") ?? null;
                if (mega) {
                    const rect = mega.getBoundingClientRect();
                    mega.style.setProperty("--fx-mx", `${(event.clientX - rect.left).toFixed(0)}px`);
                    mega.style.setProperty("--fx-my", `${(event.clientY - rect.top).toFixed(0)}px`);
                }
                if (tilt) {
                    const rect = tilt.getBoundingClientRect();
                    const entry = lean(tilt, false);
                    entry.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
                    entry.ty = -((event.clientY - rect.top) / rect.height - 0.5) * 5;
                    entry.lt = -4;
                    now.add(tilt);
                }
                if (spot) {
                    const rect = spot.getBoundingClientRect();
                    if (!spot.querySelector(":scope > .fx-spot")) {
                        const glow = document.createElement("span");
                        glow.className = "fx-spot";
                        glow.setAttribute("aria-hidden", "true");
                        spot.prepend(glow);
                        // Switched on one frame later, so the first hover fades in like every other one.
                        requestAnimationFrame(() => requestAnimationFrame(() => glow.classList.add("is-live")));
                    }
                    spot.style.setProperty("--fx-mx", `${(event.clientX - rect.left).toFixed(0)}px`);
                    spot.style.setProperty("--fx-my", `${(event.clientY - rect.top).toFixed(0)}px`);
                    now.add(spot);
                }
                if (magnet) {
                    const rect = magnet.getBoundingClientRect();
                    const entry = lean(magnet, true);
                    entry.tx = (event.clientX - rect.left - rect.width / 2) * 0.22;
                    entry.ty = (event.clientY - rect.top - rect.height / 2) * 0.3;
                    now.add(magnet);
                }
                for (const el of hovered) {
                    if (now.has(el)) continue;
                    const entry = leans.get(el);
                    if (entry) { entry.hover = false; entry.tx = 0; entry.ty = 0; entry.lt = 0; }
                }
                hovered = now;
            };

            const loop = () => {
                running = 0;
                if (pending) { handle(pending); pending = null; }
                let busy = false;
                for (const entry of leans.values()) {
                    // Slow, springy easing: the card rises and leans gradually instead of jumping.
                    entry.x += (entry.tx - entry.x) * 0.08;
                    entry.y += (entry.ty - entry.y) * 0.08;
                    entry.l += (entry.lt - entry.l) * 0.07;
                    if (entry.magnet) entry.el.style.translate = `${entry.x.toFixed(2)}px ${entry.y.toFixed(2)}px`;
                    else {
                        entry.el.style.setProperty("--fx-rx", `${entry.y.toFixed(2)}deg`);
                        entry.el.style.setProperty("--fx-ry", `${entry.x.toFixed(2)}deg`);
                        entry.el.style.setProperty("--fx-lift", `${entry.l.toFixed(2)}px`);
                    }
                    if (!entry.hover && Math.abs(entry.x) + Math.abs(entry.y) + Math.abs(entry.l) < 0.03) {
                        if (entry.magnet) entry.el.style.translate = "";
                        else ["--fx-rx", "--fx-ry", "--fx-lift"].forEach((name) => entry.el.style.removeProperty(name));
                        leans.delete(entry.el);
                    } else busy = true;
                }
                if (busy) running = requestAnimationFrame(loop);
            };
            const kick = () => { if (!running) running = requestAnimationFrame(loop); };

            const move = (event: PointerEvent) => {
                if (event.pointerType !== "mouse") return;
                pending = event;
                kick();
            };
            const hide = () => {
                pending = null;
                for (const entry of leans.values()) { entry.hover = false; entry.tx = 0; entry.ty = 0; entry.lt = 0; }
                hovered.clear();
                kick();
            };
            window.addEventListener("pointermove", move, { passive: true });
            root.addEventListener("pointerleave", hide);
            window.addEventListener("blur", hide);
            undo.push(() => {
                cancelAnimationFrame(running);
                window.removeEventListener("pointermove", move);
                root.removeEventListener("pointerleave", hide);
                window.removeEventListener("blur", hide);
                root.classList.remove("fx-hover");
                for (const entry of leans.values()) { entry.el.style.translate = ""; entry.el.style.removeProperty("--fx-rx"); entry.el.style.removeProperty("--fx-ry"); }
            });
        }

        return () => undo.forEach((fn) => fn());
    }, []);
    return null;
}
