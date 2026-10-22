// Shared by the site statistics (./track) and the ad pixel (./pixel).
/**
 * Whether this visit may be measured (by these statistics and by the ad pixel): not the admin, not the text editor,
 * not automated browsers, not visitors who opt out with Global Privacy Control, and not browsers that opened the
 * admin panel (the team's own).
 */
export function visitorTrackingAllowed() {
    if (typeof window === "undefined") return false;
    let teamBrowser = false;
    try { teamBrowser = localStorage.getItem("clinova.notrack") === "1"; } catch { /* Storage blocked: count the visit. */ }
    return !(teamBrowser || window.location.pathname.startsWith("/admin") || new URLSearchParams(window.location.search).has("edit")
        || navigator.webdriver || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
}
