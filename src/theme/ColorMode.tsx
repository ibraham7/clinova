import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type ColorMode = "dark" | "light";
export function readColorMode(): ColorMode {
    try { return localStorage.getItem("clinova.theme") === "light" ? "light" : "dark"; }
    catch { return "dark"; }
}
export function syncColorMode(mode: ColorMode) {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    try { localStorage.setItem("clinova.theme", mode); } catch { /* Storage is optional. */ }
}
const ColorModeContext = createContext({ mode: "dark" as ColorMode, toggle: () => {} });
export function ColorModeProvider({ children, initialMode }: { children: ReactNode; initialMode?: ColorMode }) {
    const [mode, setMode] = useState<ColorMode>(() => initialMode ?? readColorMode());
    useEffect(() => syncColorMode(mode), [mode]);
    return <ColorModeContext.Provider value={{ mode, toggle: () => setMode(current => current === "dark" ? "light" : "dark") }}>{children}</ColorModeContext.Provider>;
}
export const useColorMode = () => useContext(ColorModeContext);
