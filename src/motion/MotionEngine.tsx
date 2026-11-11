import { useEffect } from "react";

// One small engine behind the landing page's "alive" feel. Components only add attributes; this file does the work:
//   data-fx="tilt"    card leans toward the pointer (3D)             data-fx="spot"   soft light that follows the pointer
//   data-fx="magnet"  button drifts toward the pointer               data-fill        text fills in line by line while scrolling
// It also drifts the background glows with the scroll, fades the hero as it leaves, skews the ticker with scroll speed,
// and draws a trailing cursor ring. Nothing runs in the text editor (?edit); with reduced motion only the static look stays.
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const hotSelector = "a[href], button, [role=button], [role=tab], input, textarea, select, summary, [data-fx]";

type Lean = { el: HTMLElement; tx: number; ty: number; x: number; y: number; hover: boolean; magnet: boolean };

export default function MotionEngine() {
    useEffect(() => {
        if (new URLSearchParams(window.location.search).has("edit")) return;
        const root = document.documentElement;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const undo: (() => void)[] = [];

        /* ---------- Scroll: parallax glows, hero fade, ticker skew, text fill ---------- */
        const hero = document.getElementById("home");
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
        const scrollTick = () => {
            frame = 0;
            const y = window.scrollY;
            const vh = window.innerHeight;
            velocity += (clamp((y - lastY) / 40, -1, 1) - velocity) * 0.18;
            lastY = y;
            root.style.setProperty("--clinova-vel", velocity.toFixed(3));
            // The header slips away while reading downward and returns on the first move back up.
            if (Math.abs(y - headerY) > 8) {
                const menuOpen = document.body.classList.contains("MuiModal-open") || document.body.style.overflow === "hidden";
                root.dataset.header = y > 220 && y > headerY && !menuOpen ? "hide" : "show";
                headerY = y;
            }
            for (const glow of glows) {
                const rect = glow.section.getBoundingClientRect();
                if (rect.bottom < -200 || rect.top > vh + 200) continue;
                glow.el.style.translate = `0 ${((rect.top + rect.height / 2 - vh / 2) * glow.speed).toFixed(1)}px`;
            }
            if (hero) hero.style.setProperty("--clinova-hero", clamp(y / (hero.offsetHeight * 0.8), 0, 1).toFixed(3));
            for (const el of fills) {
                const rect = el.getBoundingClientRect();
                if (rect.bottom < 0) { el.style.setProperty("--fx-fill", "1"); continue; }
                if (rect.top > vh) { el.style.setProperty("--fx-fill", "0"); continue; }
                el.style.setProperty("--fx-fill", clamp((vh * 0.88 - rect.top) / (rect.height + vh * 0.32), 0, 1).toFixed(3));
            }
            if (Math.abs(velocity) > 0.01) frame = requestAnimationFrame(scrollTick);
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
                delete root.dataset.header;
            });
        }

        /* ---------- Pointer: cursor ring, tilt, spotlight, magnetic buttons ---------- */
        if (fine && !reduce) {
            root.classList.add("fx-hover");
            const ring = document.createElement("div");
            const dot = document.createElement("div");
            ring.className = "fx-cursor";
            dot.className = "fx-cursor-dot";
            ring.setAttribute("aria-hidden", "true");
            dot.setAttribute("aria-hidden", "true");
            document.body.append(ring, dot);

            let px = -200, py = -200, rx = -200, ry = -200;
            let seen = false;
            const leans = new Map<HTMLElement, Lean>();
            let running = 0;

            const loop = () => {
                running = 0;
                rx += (px - rx) * 0.2;
                ry += (py - ry) * 0.2;
                ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
                dot.style.transform = `translate3d(${px}px, ${py}px, 0)`;
                let busy = Math.abs(px - rx) + Math.abs(py - ry) > 0.4;
                for (const lean of leans.values()) {
                    lean.x += (lean.tx - lean.x) * 0.14;
                    lean.y += (lean.ty - lean.y) * 0.14;
                    if (lean.magnet) lean.el.style.translate = `${lean.x.toFixed(2)}px ${lean.y.toFixed(2)}px`;
                    else {
                        lean.el.style.setProperty("--fx-rx", `${lean.y.toFixed(2)}deg`);
                        lean.el.style.setProperty("--fx-ry", `${lean.x.toFixed(2)}deg`);
                    }
                    if (!lean.hover && Math.abs(lean.x) + Math.abs(lean.y) < 0.02) {
                        if (lean.magnet) lean.el.style.translate = "";
                        else ["--fx-rx", "--fx-ry", "--fx-lift"].forEach((name) => lean.el.style.removeProperty(name));
                        leans.delete(lean.el);
                    } else busy = true;
                }
                if (busy) running = requestAnimationFrame(loop);
            };
            const kick = () => { if (!running) running = requestAnimationFrame(loop); };

            const lean = (el: HTMLElement, magnet: boolean) => {
                let entry = leans.get(el);
                if (!entry) { entry = { el, tx: 0, ty: 0, x: 0, y: 0, hover: true, magnet }; leans.set(el, entry); }
                entry.hover = true;
                return entry;
            };
            const spotlight = (el: HTMLElement, event: PointerEvent, rect: DOMRect) => {
                if (!el.querySelector(":scope > .fx-spot")) {
                    const spot = document.createElement("span");
                    spot.className = "fx-spot";
                    spot.setAttribute("aria-hidden", "true");
                    el.prepend(spot);
                }
                el.style.setProperty("--fx-mx", `${(event.clientX - rect.left).toFixed(0)}px`);
                el.style.setProperty("--fx-my", `${(event.clientY - rect.top).toFixed(0)}px`);
            };

            let hovered = new Set<HTMLElement>();
            const move = (event: PointerEvent) => {
                if (event.pointerType !== "mouse") return;
                px = event.clientX;
                py = event.clientY;
                if (!seen) { seen = true; rx = px; ry = py; ring.classList.add("is-on"); dot.classList.add("is-on"); }
                const target = event.target instanceof Element ? event.target : null;
                ring.classList.toggle("is-hot", Boolean(target?.closest(hotSelector)));
                const now = new Set<HTMLElement>();
                const tilt = target?.closest<HTMLElement>('[data-fx~="tilt"]');
                const spot = target?.closest<HTMLElement>('[data-fx~="spot"]');
                const magnet = target?.closest<HTMLElement>('[data-fx~="magnet"], .clinova-shine');
                const mega = target?.closest<HTMLElement>(".clinova-mega");
                if (mega) {
                    const rect = mega.getBoundingClientRect();
                    mega.style.setProperty("--fx-mx", `${(event.clientX - rect.left).toFixed(0)}px`);
                    mega.style.setProperty("--fx-my", `${(event.clientY - rect.top).toFixed(0)}px`);
                }
                if (tilt) {
                    const rect = tilt.getBoundingClientRect();
                    const entry = lean(tilt, false);
                    entry.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
                    entry.ty = -((event.clientY - rect.top) / rect.height - 0.5) * 7;
                    tilt.style.setProperty("--fx-lift", "-5px");
                    now.add(tilt);
                }
                if (spot) { spotlight(spot, event, spot.getBoundingClientRect()); now.add(spot); }
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
                    if (entry) { entry.hover = false; entry.tx = 0; entry.ty = 0; }
                    el.style.removeProperty("--fx-lift");
                }
                hovered = now;
                kick();
            };
            const hide = () => {
                ring.classList.remove("is-on");
                dot.classList.remove("is-on");
                seen = false;
                for (const entry of leans.values()) { entry.hover = false; entry.tx = 0; entry.ty = 0; }
                hovered.clear();
                kick();
            };
            const press = (down: boolean) => () => ring.classList.toggle("is-down", down);
            const down = press(true);
            const up = press(false);
            window.addEventListener("pointermove", move, { passive: true });
            window.addEventListener("pointerdown", down, { passive: true });
            window.addEventListener("pointerup", up, { passive: true });
            root.addEventListener("pointerleave", hide);
            window.addEventListener("blur", hide);
            undo.push(() => {
                cancelAnimationFrame(running);
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerdown", down);
                window.removeEventListener("pointerup", up);
                root.removeEventListener("pointerleave", hide);
                window.removeEventListener("blur", hide);
                root.classList.remove("fx-hover");
                ring.remove();
                dot.remove();
                for (const entry of leans.values()) { entry.el.style.translate = ""; entry.el.style.removeProperty("--fx-rx"); entry.el.style.removeProperty("--fx-ry"); }
            });
        }

        return () => undo.forEach((fn) => fn());
    }, []);
    return null;
}
