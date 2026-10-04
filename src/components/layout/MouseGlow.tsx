import { useEffect, useRef } from "react";

// No state updates on pointer movement; one transform per animation frame.
export default function MouseGlow() {
    const glow = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const media = window.matchMedia("(hover: hover) and (pointer: fine)");
        let frame = 0;
        let x = 0;
        let y = 0;
        const hide = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            if (glow.current) glow.current.style.opacity = "0";
        };
        const move = (event: PointerEvent) => {
            if (!media.matches || event.pointerType !== "mouse") return;
            x = event.clientX; y = event.clientY;
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                if (!glow.current) return;
                glow.current.style.transform = `translate3d(${x - 110}px, ${y - 110}px, 0)`;
                glow.current.style.opacity = "1";
            });
        };
        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", hide);
        window.addEventListener("blur", hide);
        media.addEventListener("change", hide);
        return () => {
            hide();
            window.removeEventListener("pointermove", move);
            document.documentElement.removeEventListener("pointerleave", hide);
            window.removeEventListener("blur", hide);
            media.removeEventListener("change", hide);
        };
    }, []);
    return <div ref={glow} className="clinova-mouse-glow" aria-hidden="true" />;
}
