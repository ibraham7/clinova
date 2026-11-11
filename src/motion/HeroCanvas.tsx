import { useEffect, useRef } from "react";

// A quiet network of drifting points behind the hero. The points keep their distance from the pointer and link up
// near it. Pauses when the hero is off screen or the tab is hidden; not drawn with reduced motion or in the text editor.
type Point = { x: number; y: number; vx: number; vy: number; r: number };

export default function HeroCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;
        if (new URLSearchParams(window.location.search).has("edit") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let width = 0;
        let height = 0;
        let points: Point[] = [];
        let color = "#8EA8E8";
        let visible = false;
        let frame = 0;
        const pointer = { x: -999, y: -999 };
        const link = 132;

        const readColor = () => { color = getComputedStyle(document.documentElement).getPropertyValue("--clinova-color-8ea8e8").trim() || color; };
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = clamp(Math.round((width * height) / (width < 700 ? 22000 : 15000)), 18, 78);
            points = Array.from({ length: count }, () => ({
                x: Math.random() * width, y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: 0.8 + Math.random() * 1.5,
            }));
        };

        const draw = () => {
            frame = 0;
            if (!visible) return;
            context.clearRect(0, 0, width, height);
            context.fillStyle = color;
            context.strokeStyle = color;
            for (const p of points) {
                const dx = p.x - pointer.x;
                const dy = p.y - pointer.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 150 * 150 && d2 > 1) {
                    const push = (1 - Math.sqrt(d2) / 150) * 0.05;
                    p.vx += (dx / Math.sqrt(d2)) * push;
                    p.vy += (dy / Math.sqrt(d2)) * push;
                }
                p.vx *= 0.995; p.vy *= 0.995;
                p.x += p.vx; p.y += p.vy;
                if (p.x < -10) p.x = width + 10; else if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10; else if (p.y > height + 10) p.y = -10;
            }
            context.lineWidth = 1;
            for (let i = 0; i < points.length; i++) {
                const a = points[i];
                for (let j = i + 1; j < points.length; j++) {
                    const b = points[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d > link) continue;
                    context.globalAlpha = (1 - d / link) * 0.2;
                    context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
                }
                const toPointer = Math.hypot(a.x - pointer.x, a.y - pointer.y);
                if (toPointer < 190) {
                    context.globalAlpha = (1 - toPointer / 190) * 0.55;
                    context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(pointer.x, pointer.y); context.stroke();
                }
                context.globalAlpha = 0.5;
                context.beginPath(); context.arc(a.x, a.y, a.r, 0, Math.PI * 2); context.fill();
            }
            context.globalAlpha = 1;
            frame = requestAnimationFrame(draw);
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
        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", leave);
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
