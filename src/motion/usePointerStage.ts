import { useEffect, useRef } from "react";

/** True in the on-page text editor (?edit): decorative motion stays off there so texts are easy to click. */
export const isEditing = () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("edit");
export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/**
 * "Reduce motion" (on Android also switched on by battery saver) does not mean "no life at all": short fades, counting numbers,
 * bars that fill once and slow colour changes are kept, while everything that moves a lot or loops forever (spinning, parallax,
 * waves, floating, auto-advancing panels) is switched off. The CSS has the same split in its reduced-motion blocks.
 */
export const gentleMotion = prefersReducedMotion;

/**
 * Makes an element a "stage" that knows where the mouse is. While a real mouse moves over it, the element gets
 *   --px / --py   pointer position from -1 to 1 (0 in the middle), eased
 *   --mx / --my   the same position in percent, for gradients that follow the pointer
 * and the class "is-live". Everything visual is done in CSS (interactive.css). Reduced motion and the text editor get nothing, so
 * the static look stays.
 */
export function usePointerStage<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    useEffect(() => {
        const el = ref.current;
        // Mouse, finger or pen: the stage leans toward whatever touches it (a finger drags it, and it settles when lifted).
        if (!el || isEditing() || prefersReducedMotion()) return;
        let frame = 0;
        let tx = 0, ty = 0, x = 0, y = 0;
        const paint = () => {
            x += (tx - x) * 0.09;
            y += (ty - y) * 0.09;
            el.style.setProperty("--px", x.toFixed(3));
            el.style.setProperty("--py", y.toFixed(3));
            el.style.setProperty("--mx", `${((x + 1) * 50).toFixed(1)}%`);
            el.style.setProperty("--my", `${((y + 1) * 50).toFixed(1)}%`);
            frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(paint) : 0;
        };
        const move = (event: PointerEvent) => {
            const box = el.getBoundingClientRect();
            tx = ((event.clientX - box.left) / box.width) * 2 - 1;
            ty = ((event.clientY - box.top) / box.height) * 2 - 1;
            el.classList.add("is-live");
            if (!frame) frame = requestAnimationFrame(paint);
        };
        const leave = () => {
            tx = 0; ty = 0;
            el.classList.remove("is-live");
            if (!frame) frame = requestAnimationFrame(paint);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        el.addEventListener("pointerup", leave);
        el.addEventListener("pointercancel", leave);
        return () => {
            cancelAnimationFrame(frame);
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
            el.removeEventListener("pointerup", leave);
            el.removeEventListener("pointercancel", leave);
        };
    }, []);
    return ref;
}

/** Adds the class "is-offscreen" while the element is out of view, so CSS can pause its endless animations. */
export function useOffscreenPause<T extends HTMLElement>(ref: { current: T | null }) {
    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(([entry]) => el.classList.toggle("is-offscreen", !entry?.isIntersecting), { rootMargin: "120px 0px" });
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref]);
}
