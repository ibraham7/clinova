import { useEffect, useRef } from "react";

// A thin bar across the top of the page that fills as the visitor scrolls.
export default function ScrollProgress() {
    const bar = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            if (bar.current) bar.current.style.transform = `scaleX(${scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0})`;
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, []);
    return <div className="clinova-scroll-progress" aria-hidden="true"><div ref={bar} /></div>;
}
