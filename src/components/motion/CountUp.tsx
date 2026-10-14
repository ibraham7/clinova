import { useEffect, useRef, useState } from "react";

const numberPattern = /^(.*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s;

function format(value: number, template: string) {
    const decimals = template.split(".")[1]?.length ?? 0;
    const fixed = value.toFixed(decimals);
    if (!template.includes(",")) return fixed;
    const [whole, fraction] = fixed.split(".");
    return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (fraction ? `.${fraction}` : "");
}

function canAnimate() {
    return typeof window !== "undefined" && typeof IntersectionObserver !== "undefined"
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Counter({ value, duration }: { value: string; duration: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [match] = useState(() => (canAnimate() ? numberPattern.exec(value) : null));
    const [display, setDisplay] = useState(() => (match ? `${match[1]}${format(0, match[2])}${match[3]}` : value));

    useEffect(() => {
        const element = ref.current;
        if (!match || !element) return;
        const [, prefix, digits, suffix] = match;
        const target = Number(digits.replace(/,/g, ""));
        let frame = 0;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry?.isIntersecting) return;
            observer.disconnect();
            const start = performance.now();
            const tick = (now: number) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setDisplay(progress < 1 ? `${prefix}${format(target * eased, digits)}${suffix}` : value);
                if (progress < 1) frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
        }, { threshold: 0.4 });
        observer.observe(element);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [match, value, duration]);

    return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{display}</span>;
}

// Counts the first number inside a label ("385K", "AED 475", "6.4×") up from zero once it scrolls into view.
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
    return <Counter key={value} value={value} duration={duration} />;
}
