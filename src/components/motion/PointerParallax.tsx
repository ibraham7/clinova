import { useEffect } from "react";

// Shares the pointer position as --clinova-px / --clinova-py (-1..1) so decorative
// layers marked .clinova-parallax can drift gently with the mouse.
export default function PointerParallax() {
    useEffect(() => {
        const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
        const root = document.documentElement;
        let frame = 0;
        let x = 0;
        let y = 0;
        const move = (event: PointerEvent) => {
            if (!media.matches || event.pointerType !== "mouse") return;
            x = (event.clientX / window.innerWidth) * 2 - 1;
            y = (event.clientY / window.innerHeight) * 2 - 1;
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                root.style.setProperty("--clinova-px", x.toFixed(3));
                root.style.setProperty("--clinova-py", y.toFixed(3));
            });
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", move);
        };
    }, []);
    return null;
}
