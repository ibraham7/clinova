// Proves the cookie consent really works (requests and cookies, not just the banner).
//
//   node scripts/verify-consent.mjs <base-url> [--live]
//
// --live  lets the real Meta Pixel / Google Ads tag / Clarity load, so the real cookies (_fbp, _ga, _gcl_*, _clck…)
//         are checked. Run it from a machine with normal internet access.
// default "stub" mode answers the three tools with tiny scripts that set the same cookie names, so it also works where
//         those hosts are blocked; it proves the gating (nothing before consent, nothing after Reject) and the cookie
//         clean-up when consent is withdrawn, but not what the real tools do.
//
// Needs Playwright (`npm i playwright`); CHROMIUM_PATH points at a Chrome/Chromium binary when the bundled one is absent.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const args = process.argv.slice(2);
const BASE = (args.find((a) => /^https?:/.test(a)) ?? process.env.BASE ?? "http://127.0.0.1:4179").replace(/\/$/, "");
const LIVE = args.includes("--live");
const TOOL_HOSTS = /(^|\.)((connect\.facebook\.net)|(facebook\.com)|(googletagmanager\.com)|(google-analytics\.com)|(googleadservices\.com)|(doubleclick\.net)|(clarity\.ms)|(bing\.com))$/;
const TRACKING_COOKIE = /^(_fbp|_fbc|_ga|_ga_.*|_gcl_.*|_gac_.*|_gid|_clck|_clsk|CLID|SM|MR|ANONCHK|MUID)$/;
const LANGS = { ar: ["قبول", "رفض"], en: ["Accept", "Decline"], tr: ["Kabul et", "Reddet"], fr: ["Accepter", "Refuser"] };

// What each tool sets in stub mode: the same cookie names the real ones use.
const STUB = [
    [/connect\.facebook\.net/, "document.cookie='_fbp=fb.1.1.1; Path=/; Max-Age=86400';"],
    [/googletagmanager\.com/, "document.cookie='_gcl_au=1.1.1.1; Path=/; Max-Age=86400'; document.cookie='_ga=GA1.1.1.1; Path=/; Max-Age=86400';"],
    [/clarity\.ms/, "document.cookie='_clck=abc|1|x; Path=/; Max-Age=86400';"],
];

const launchOptions = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const browser = await chromium.launch(launchOptions);
const results = [];
const warn = (name, detail) => console.log(`WARN  ${name} — ${detail}`);
const check = (name, ok, detail = "") => { results.push(ok); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`); };

async function session({ gpc = false, stored = null } = {}) {
    const context = await browser.newContext({ locale: "en", viewport: { width: 1280, height: 900 } });
    // Playwright announces itself as automated; the site (rightly) never tracks automated browsers, so hide that here.
    await context.addInitScript(([privacy, saved]) => {
        Object.defineProperty(navigator, "webdriver", { get: () => false });
        if (privacy) Object.defineProperty(navigator, "globalPrivacyControl", { get: () => true });
        if (saved) { try { localStorage.setItem("clinova.consent", saved); } catch { /* Storage blocked. */ } }
    }, [gpc, stored]);
    const requests = [];
    const errors = [];
    await context.route((url) => TOOL_HOSTS.test(url.hostname), async (route) => {
        const url = new URL(route.request().url());
        requests.push(url.hostname);
        if (LIVE) return route.continue();
        const stub = STUB.find(([pattern]) => pattern.test(url.hostname));
        return route.fulfill({ status: 200, contentType: "application/javascript", body: stub ? stub[1] : "" });
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    const cookies = async () => (await context.cookies()).filter((c) => TRACKING_COOKIE.test(c.name)).map((c) => c.name);
    const consent = () => page.evaluate(() => localStorage.getItem("clinova.consent"));
    const settle = (ms = 2500) => page.waitForTimeout(ms);
    return { context, page, requests, errors, cookies, consent, settle };
}
const banner = (page, lang = "en") => page.getByRole("dialog", { name: /Cookie settings|إعدادات الكوكيز|Çerez ayarları|Paramètres des cookies/ });
const click = (page, lang, which) => page.getByRole("button", { name: LANGS[lang][which], exact: true }).click();

console.log(`Target: ${BASE}\nMode:   ${LIVE ? "live (real tools and real cookies)" : "stub (tools answered locally; proves gating and clean-up)"}\n`);

// ---- the banner exists in every language ----
for (const lang of Object.keys(LANGS)) {
    const s = await session();
    await s.page.goto(`${BASE}/${lang}`, { waitUntil: "networkidle" });
    check(`banner is shown in ${lang}`, await banner(s.page).isVisible() && await s.page.getByRole("button", { name: LANGS[lang][0], exact: true }).isVisible() && await s.page.getByRole("button", { name: LANGS[lang][1], exact: true }).isVisible());
    await s.context.close();
}

// ---- 1. before any choice ----
{
    const s = await session();
    await s.page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
    await s.settle();
    check("before any choice: no request to Meta, Google or Clarity", s.requests.length === 0, s.requests.join(", "));
    check("before any choice: no tracking cookie", (await s.cookies()).length === 0, (await s.cookies()).join(", "));
    check("before any choice: nothing stored", (await s.consent()) === null);
    await s.page.goto(`${BASE}/en/blog`, { waitUntil: "networkidle" }); await s.settle(1500);
    check("browsing another page without choosing still loads nothing", s.requests.length === 0 && (await s.cookies()).length === 0);
    await s.context.close();
}

// ---- 2 + 3. accept ----
{
    const s = await session();
    await s.page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
    await click(s.page, "en", 0);
    await s.settle(4000);
    const hosts = [...new Set(s.requests)];
    check("after Accept: Meta, Google and Clarity are requested", ["connect.facebook.net", "googletagmanager.com", "clarity.ms"].every((h) => hosts.some((x) => x.endsWith(h))), hosts.join(", "));
    await s.settle(LIVE ? 4000 : 0);
    const set = await s.cookies();
    check("after Accept: Meta cookie exists (_fbp)", set.includes("_fbp"), set.join(", ") || "none");
    check("after Accept: Google cookie exists (_gcl_au or _ga)", set.some((n) => n === "_ga" || n.startsWith("_gcl_")), set.join(", ") || "none");
    if (set.includes("_clck")) check("after Accept: Clarity cookie exists (_clck)", true);
    else if (LIVE) warn("after Accept: Clarity cookie _clck not set", "Clarity skips cookies in automated browsers; confirm by hand in DevTools > Application > Cookies");
    else check("after Accept: Clarity cookie exists (_clck)", false, set.join(", ") || "none");
    check("after Accept: the choice is stored", (await s.consent()) === "granted");
    check("after Accept: banner closes", !(await banner(s.page).isVisible()));
    s.requests.length = 0;
    await s.page.reload({ waitUntil: "networkidle" }); await s.settle(4000);
    check("after reload: tools load again and the banner stays closed", s.requests.length > 0 && !(await banner(s.page).isVisible()));

    // ---- 5. change of mind ----
    await s.page.getByRole("button", { name: "Cookie settings" }).first().scrollIntoViewIfNeeded().catch(() => {});
    await s.page.getByRole("button", { name: "Cookie settings" }).first().click();
    check("\"Cookie settings\" reopens the banner", await banner(s.page).isVisible());
    await Promise.all([s.page.waitForNavigation({ waitUntil: "networkidle" }).catch(() => {}), click(s.page, "en", 1)]);
    // Whatever the old page was still sending while it unloaded does not count: only the reloaded page does.
    s.requests.length = 0;
    await s.settle(3500);
    check("withdrawing consent: the page reloads and the choice is saved as denied", (await s.consent()) === "denied");
    check("withdrawing consent: tracking cookies are deleted", (await s.cookies()).length === 0, (await s.cookies()).join(", "));
    check("withdrawing consent: no tool request after the reload", s.requests.length === 0, s.requests.join(", "));
    await s.context.close();
}

// ---- 4. reject from the start ----
{
    const s = await session();
    await s.page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
    await click(s.page, "en", 1);
    await s.settle(3500);
    check("after Reject: no request and no cookie", s.requests.length === 0 && (await s.cookies()).length === 0, s.requests.join(", "));
    check("after Reject: the choice is stored", (await s.consent()) === "denied");
    await s.page.reload({ waitUntil: "networkidle" }); await s.settle(2500);
    await s.page.goto(`${BASE}/en/blog`, { waitUntil: "networkidle" }); await s.settle(2500);
    check("after Reject: still nothing after a reload and on another page", s.requests.length === 0 && (await s.cookies()).length === 0);
    check("after Reject: the banner does not come back", !(await banner(s.page).isVisible()));
    await s.page.goto(`${BASE}/en/privacy`, { waitUntil: "networkidle" });
    check("after Reject: the site still works (privacy page opens)", (await s.page.locator("h1").innerText()).length > 0 && s.errors.length === 0, s.errors.join(" | "));
    await s.context.close();
}

// ---- 6. exclusions (consent already given in this browser, then the page is opened directly) ----
{
    const a = await session({ stored: "granted" });
    await a.page.goto(`${BASE}/admin`, { waitUntil: "networkidle" }); await a.settle(3500);
    check("admin panel: no tool loads even when consent was given", a.requests.length === 0 && (await a.cookies()).length === 0, a.requests.join(", "));
    await a.context.close();
    const g = await session({ gpc: true, stored: "granted" });
    await g.page.goto(`${BASE}/en`, { waitUntil: "networkidle" }); await g.settle(3500);
    check("Global Privacy Control: no tool loads even when consent was given", g.requests.length === 0 && (await g.cookies()).length === 0, g.requests.join(", "));
    await g.context.close();
    const ok = await session({ stored: "granted" });
    await ok.page.goto(`${BASE}/en`, { waitUntil: "networkidle" }); await ok.settle(3500);
    check("control: the same stored consent on a normal page does load the tools", ok.requests.length > 0, ok.requests.join(", ") || "nothing loaded");
    await ok.context.close();
}

await browser.close();
const failed = results.filter((ok) => !ok).length;
console.log(`\nRESULT: ${results.length - failed} passed, ${failed} failed (${LIVE ? "live" : "stub"} mode)`);
process.exit(failed ? 1 : 0);
