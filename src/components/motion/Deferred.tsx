import { startTransition, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ComponentType } from "react";

// The page is one long list of sections, but a phone should not have to download, parse and build all of them before it can
// show the first screen. Header, hero, ticker and About come first; every other section is its own JavaScript file and
// mounts one after another in idle time right after the first paint (not only when scrolled to, so search engines and
// visitors who jump straight down still get everything).
//   - Until a section's code arrives, the page keeps showing that section's prerendered HTML (captured before React replaces it),
//     so nothing is ever an empty gap.
//   - A jump link (#faq) or a #hash in the address first mounts everything above it, then scrolls.
//   - Effects that scan the page (reveals, scroll motion, the section rail) are restarted when sections arrive: see useSectionsEpoch.
// On the server (prerender) the real components are rendered directly, so the HTML for search engines is complete.

type Loader = () => Promise<{ default: ComponentType }>;
type Mounter = { id: string; mount: () => Promise<void>; done: () => boolean };

const staticSections = import.meta.env.SSR ? (await import("./staticSections")).staticSections : undefined;

const prerendered = new Map<string, string>();
const mounters: Mounter[] = [];
const listeners = new Set<() => void>();
let epoch = 0;
let bumpTimer = 0;

const bump = () => {
    window.clearTimeout(bumpTimer);
    // Several sections often arrive within a moment of each other: one restart is enough.
    bumpTimer = window.setTimeout(() => { epoch += 1; listeners.forEach((listener) => listener()); window.dispatchEvent(new Event("clinova:sections")); }, 250);
};

/** Changes whenever more sections have appeared; use it as a React `key` to restart effects that scan the whole page. */
export function useSectionsEpoch() {
    return useSyncExternalStore((listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => epoch, () => 0);
}

/** Call once before React renders: remembers the prerendered HTML of each deferred section. */
export function capturePrerendered(selectors: Record<string, string>) {
    for (const [id, selector] of Object.entries(selectors)) {
        const element = document.querySelector(selector);
        if (element) prerendered.set(id, element.outerHTML);
    }
}

const idle = (callback: () => void, timeout: number) => {
    const request = (window as Window & { requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number }).requestIdleCallback;
    if (request) request.call(window, callback, { timeout });
    else window.setTimeout(callback, 60);
};

/** Mounts every deferred section, in page order, one idle moment apart. */
export function startProgressiveMount() {
    let index = 0;
    const next = () => {
        while (index < mounters.length && mounters[index].done()) index += 1;
        const mounter = mounters[index];
        if (!mounter) return;
        index += 1;
        mounter.mount().finally(() => idle(next, 400));
    };
    idle(next, 1200);
}

/** Mounts everything (a jump link needs the page above its target to have its real height). */
export function mountAllNow() {
    return Promise.all(mounters.map((mounter) => mounter.mount()));
}

let jumpsReady = false;
function installJumpLinks() {
    if (jumpsReady || typeof document === "undefined") return;
    jumpsReady = true;
    const go = (hash: string, smooth: boolean) => {
        if (!hash || hash === "#") return;
        void mountAllNow().then(() => {
            // Let the new sections lay out before measuring where the target is.
            requestAnimationFrame(() => requestAnimationFrame(() => {
                const target = document.getElementById(decodeURIComponent(hash.slice(1)));
                target?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
            }));
        });
    };
    document.addEventListener("click", (event) => {
        const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!link || event.defaultPrevented || mounters.every((mounter) => mounter.done())) return;
        const hash = link.getAttribute("href") ?? "";
        const target = document.getElementById(hash.slice(1));
        // The target already exists as real, mounted content: the browser's own jump is fine.
        if (target && !target.closest(".deferred-ssr") && !target.classList.contains("deferred")) return;
        event.preventDefault();
        history.pushState(null, "", hash);
        go(hash, true);
    }, true);
    if (window.location.hash) go(window.location.hash, false);
}

/**
 * One deferred section. `selector` finds its prerendered HTML in the page before React starts; `height` is only a fallback
 * for pages without prerendered HTML (the dev server).
 */
export default function Deferred({ id, load, height = 600 }: { id: string; load: Loader; height?: number }) {
    const [Component, setComponent] = useState<ComponentType | null>(null);
    const placeholder = useRef<HTMLDivElement>(null);
    const started = useRef<Promise<void> | null>(null);
    const mounted = useRef(false);
    const mount = useCallback(() => {
        if (!started.current) {
            started.current = load().then((module) => { startTransition(() => { setComponent(() => module.default); mounted.current = true; }); });
        }
        return started.current;
    }, [load]);

    useEffect(() => {
        const mounter: Mounter = { id, mount, done: () => mounted.current };
        mounters.push(mounter);
        installJumpLinks();
        // Nearly in view: no reason to wait for the idle queue.
        const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) void mount(); }, { rootMargin: "1400px 0px" });
        if (placeholder.current) observer?.observe(placeholder.current);
        return () => {
            observer?.disconnect();
            const at = mounters.indexOf(mounter);
            if (at >= 0) mounters.splice(at, 1);
        };
    }, [id, mount]);

    useEffect(() => { if (Component) bump(); }, [Component]);

    if (staticSections) {
        const Static = staticSections[id];
        return Static ? <Static /> : null;
    }
    if (Component) return <Component />;
    const html = prerendered.get(id);
    return html
        ? <div ref={placeholder} className="deferred-ssr" dangerouslySetInnerHTML={{ __html: html }} />
        : <div ref={placeholder} id={id} className="deferred" style={{ minHeight: height }} />;
}
