import { useEffect, useRef } from "react";

// A quiet network of drifting points behind the hero. The points keep their distance from the pointer and link up
// near it. Light by design: few points, 30 frames a second, no per-frame gradients or masks, paused when the hero is off
// screen or the tab is hidden, and not drawn at all with reduced motion or in the text editor.
type Point = { x: number; y: number; vx: number; vy: number; r: number; fade: number };

export default function HeroCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;
        if (new URLSearchParams(window.location.search).has("edit") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const touch = window.matchMedia("(pointer: coarse)").matches;
        let width = 0;
        let height = 0;
        let points: Point[] = [];
        let color = "#8EA8E8";
        let visible = false;
        let frame = 0;
        let lastDraw = 0;
        const pointer = { x: -999, y: -999 };
        const link = touch ? 110 : 128;
        const interval = touch ? 1000 / 24 : 1000 / 30;

        const readColor = () => { color = getComputedStyle(document.documentElement).getPropertyValue("--clinova-color-8ea8e8").trim() || color; };
        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width;
            canvas.height = height;
            const count = clamp(Math.round((width * height) / (touch ? 42000 : 30000)), 12, touch ? 22 : 44);
            points = Array.from({ length: count }, () => {
                const x = Math.random() * width;
                const y = Math.random() * height;
                // Points fade toward the edges so the network needs no mask.
                const fade = clamp(1.25 - Math.hypot((x - width / 2) / (width * 0.62), (y - height * 0.45) / (height * 0.62)), 0.15, 1);
                return { x, y, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: 0.8 + Math.random() * 1.4, fade };
            });
        };

        const draw = (now: number) => {
            frame = 0;
            if (!visible) return;
            frame = requestAnimationFrame(draw);
            if (now - lastDraw < interval) return;
            lastDraw = now;
            context.clearRect(0, 0, width, height);
            context.fillStyle = color;
            context.strokeStyle = color;
            context.lineWidth = 1;
            const reach = 150 * 150;
            for (const p of points) {
                const dx = p.x - pointer.x;
                const dy = p.y - pointer.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < reach && d2 > 1) {
                    const d = Math.sqrt(d2);
                    const push = (1 - d / 150) * 0.06;
                    p.vx += (dx / d) * push;
                    p.vy += (dy / d) * push;
                }
                p.vx *= 0.994; p.vy *= 0.994;
                p.x += p.vx; p.y += p.vy;
                if (p.x < -10) p.x = width + 10; else if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10; else if (p.y > height + 10) p.y = -10;
            }
            const linkSquared = link * link;
            for (let i = 0; i < points.length; i++) {
                const a = points[i];
                for (let j = i + 1; j < points.length; j++) {
                    const b = points[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 > linkSquared) continue;
                    context.globalAlpha = (1 - Math.sqrt(d2) / link) * 0.22 * a.fade * b.fade;
                    context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
                }
                const toPointer = Math.hypot(a.x - pointer.x, a.y - pointer.y);
                if (toPointer < 190) {
                    context.globalAlpha = (1 - toPointer / 190) * 0.5;
                    context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(pointer.x, pointer.y); context.stroke();
                }
                context.globalAlpha = 0.55 * a.fade;
                context.fillRect(a.x - a.r, a.y - a.r, a.r * 2, a.r * 2);
            }
            context.globalAlpha = 1;
        };
        const start = () => { if (!frame && visible && document.visibilityState === "visible") frame = requestAnimationFrame(draw); };

        const move = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            const rect = canvas.getBoundingClientRect();
            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top;
        };
        const leave = () => { pointer.x = pointer.y = -999; };

        readColor();
        resize();
        const observer = new IntersectionObserver(([entry]) => { visible = Boolean(entry?.isIntersecting); start(); });
        observer.observe(canvas);
        const sizes = new ResizeObserver(resize);
        sizes.observe(canvas);
        const themes = new MutationObserver(readColor);
        themes.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        document.addEventListener("visibilitychange", start);
        if (!touch) {
            window.addEventListener("pointermove", move, { passive: true });
            document.documentElement.addEventListener("pointerleave", leave);
        }
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect(); sizes.disconnect(); themes.disconnect();
            document.removeEventListener("visibilitychange", start);
            window.removeEventListener("pointermove", move);
            document.documentElement.removeEventListener("pointerleave", leave);
        };
    }, []);
    return <canvas ref={ref} aria-hidden="true" className="clinova-hero-canvas" />;
}

function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
