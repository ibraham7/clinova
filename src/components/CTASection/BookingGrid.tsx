import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { isEditing, prefersReducedMotion } from "../../motion/usePointerStage";

const cellCount = 168;

/**
 * "Let's fill your appointment book": the panel's background is an appointment book whose slots get booked one by one.
 * When most of it is full the page turns (the slots clear in a wave) and it starts again. A mouse passing over a free slot
 * books it on the spot. Decoration only: hidden from screen readers, off in the text editor, still with reduced motion.
 */
export default function BookingGrid() {
    const grid = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const element = grid.current;
        if (!element || isEditing()) return;
        const cells = Array.from(element.children) as HTMLElement[];
        // Only the slots that fit in the panel take part (the rest are clipped).
        const shown = () => cells.filter((cell) => cell.offsetTop + cell.offsetHeight <= element.clientHeight + 2);
        if (prefersReducedMotion()) {
            shown().forEach((cell, index) => { if (index % 4 === 1 || index % 7 === 3) cell.classList.add("is-booked"); });
            return;
        }

        let timer = 0;
        const timers: number[] = [];
        const step = () => {
            const pool = shown();
            const free = pool.filter((cell) => !cell.classList.contains("is-booked"));
            if (free.length <= pool.length * 0.3) {
                // The book is full: turn the page.
                pool.forEach((cell, index) => timers.push(window.setTimeout(() => cell.classList.remove("is-booked", "is-mine"), index * 9)));
                timer = window.setTimeout(step, pool.length * 9 + 1500);
                return;
            }
            free[Math.floor(Math.random() * free.length)]?.classList.add("is-booked");
            timer = window.setTimeout(step, 240 + Math.random() * 380);
        };
        const visible = new IntersectionObserver(([entry]) => {
            window.clearTimeout(timer);
            if (entry?.isIntersecting) timer = window.setTimeout(step, 500);
        }, { threshold: 0.15 });
        visible.observe(element);

        const book = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            const cell = (event.target as HTMLElement).closest<HTMLElement>(".book-cell");
            if (cell && !cell.classList.contains("is-mine")) cell.classList.add("is-booked", "is-mine");
        };
        element.addEventListener("pointerover", book);
        return () => {
            window.clearTimeout(timer);
            timers.forEach((id) => window.clearTimeout(id));
            visible.disconnect();
            element.removeEventListener("pointerover", book);
        };
    }, []);

    return <Box ref={grid} aria-hidden="true" className="book-grid">
        {Array.from({ length: cellCount }, (_, index) => <span key={index} className="book-cell">
            <svg viewBox="0 0 24 24" focusable="false"><path d="M6 12.5l4 4 8-9" /></svg>
        </span>)}
    </Box>;
}
