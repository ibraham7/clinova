// Exercises the /admin functions against a fake GitHub API: sign-in, sessions, validation, saving and uploads.
import assert from "node:assert/strict";

process.env.ADMIN_PASSWORD = "correct horse battery";
process.env.GITHUB_TOKEN = "test-token";
const files = new Map([["src/content/site-content.json", { sha: "a".repeat(40), text: JSON.stringify({ texts: { ar: {}, en: {}, tr: {}, fr: {} }, videos: [], logos: [] }) }]]);
const commits = [];
globalThis.fetch = async (url, init = {}) => {
    const path = decodeURIComponent(new URL(url).pathname.replace(/^\/repos\/[^/]+\/[^/]+\/contents\//, ""));
    assert.equal(init.headers.Authorization, "Bearer test-token");
    if (!init.method) {
        const file = files.get(path);
        return file ? Response.json({ sha: file.sha, content: (file.raw ?? Buffer.from(file.text)).toString("base64") }) : new Response("{}", { status: 404 });
    }
    const body = JSON.parse(init.body);
    const current = files.get(path);
    if (current && body.sha !== current.sha) return new Response("{}", { status: 409 });
    const sha = String(commits.length + 1).padStart(40, "b");
    const raw = Buffer.from(body.content, "base64");
    files.set(path, { sha, raw, text: raw.toString("utf8") });
    commits.push({ path, message: body.message, branch: body.branch });
    return Response.json({ content: { sha } });
};

const { default: login } = await import("../netlify/functions/admin-login.mjs");
const { default: session } = await import("../netlify/functions/admin-session.mjs");
const { default: content } = await import("../netlify/functions/admin-content.mjs");
const { default: upload } = await import("../netlify/functions/admin-upload.mjs");
const { default: siteLogo } = await import("../netlify/functions/admin-site-logo.mjs");
const site = "https://clinova.test/.netlify/functions/";
const call = (handler, name, { method = "GET", body, cookie, origin = "https://clinova.test" } = {}) => handler(new Request(site + name, {
    method, headers: { ...(cookie ? { cookie } : {}), ...(origin ? { origin } : {}), "content-type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }),
}));

assert.equal((await call(session, "admin-session")).status, 401, "signed out by default");
assert.equal((await call(login, "admin-login", { method: "POST", body: { password: "wrong" } })).status, 401);
assert.equal((await call(login, "admin-login", { method: "POST", body: { password: "correct horse battery" }, origin: "https://evil.test" })).status, 403);
const signedIn = await call(login, "admin-login", { method: "POST", body: { password: "correct horse battery" } });
assert.equal(signedIn.status, 200);
const setCookie = signedIn.headers.get("set-cookie");
assert.match(setCookie, /HttpOnly; Secure; SameSite=Strict/);
const cookie = setCookie.split(";")[0];
assert.equal((await call(session, "admin-session", { cookie: cookie.replace(/.$/, (c) => (c === "0" ? "1" : "0")) })).status, 401, "tampered cookie rejected");
const status = await (await call(session, "admin-session", { cookie })).json();
assert.deepEqual(status, { ok: true, storage: true, videoUpload: null });

const loaded = await (await call(content, "admin-content", { cookie })).json();
assert.equal(loaded.sha, "a".repeat(40));
const next = structuredClone(loaded.content);
next.texts.en["احجز موعد"] = "Book now";
next.videos.push({ id: "dr-test", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Dr. Test", details: { ar: "طب الأسنان", en: "Dentistry" }, quote: {}, addedAt: "2026-10-16" });
next.logos.push({ id: "logo-1", name: "Smile Clinic", src: "/uploads/logos/smile-clinic-a1b2c3.png" });
const saved = await call(content, "admin-content", { method: "PUT", cookie, body: { content: next, sha: loaded.sha } });
assert.equal(saved.status, 200);
assert.equal(commits.at(-1).path, "src/content/site-content.json");
assert.equal(commits.at(-1).branch, "main");
assert.equal(JSON.parse(files.get("src/content/site-content.json").text).texts.en["احجز موعد"], "Book now");
assert.equal((await call(content, "admin-content", { method: "PUT", cookie, body: { content: next, sha: loaded.sha } })).status, 409, "stale sha conflicts");

// Two pages loaded the same file; each saves only its own change, and neither undoes the other
// (the bug where a second save dropped the first edit).
const pageA = (await (await call(content, "admin-content", { cookie })).json());
const pageB = structuredClone(pageA);
const editA = structuredClone(pageA.content);
editA.texts.ar["نرتقي"] = "نرتقا";
const savedA = await (await call(content, "admin-content", { method: "PUT", cookie, body: { content: editA, sha: pageA.sha, base: pageA.content } })).json();
assert.equal(savedA.content.texts.ar["نرتقي"], "نرتقا");
const editB = structuredClone(pageB.content);
editB.texts.ar["للعيادات الطبية."] = "للعيادات الطبية والتجميلية.";
editB.logos = [];
const savedB = await call(content, "admin-content", { method: "PUT", cookie, body: { content: editB, sha: pageB.sha, base: pageB.content } });
assert.equal(savedB.status, 200, "a page with an old sha still saves its own change");
const merged = JSON.parse(files.get("src/content/site-content.json").text);
assert.equal(merged.texts.ar["نرتقي"], "نرتقا", "the other page's edit is kept");
assert.equal(merged.texts.ar["للعيادات الطبية."], "للعيادات الطبية والتجميلية.");
assert.equal(merged.texts.en["احجز موعد"], "Book now");
assert.deepEqual(merged.logos, [], "a list this page changed is taken whole");
assert.equal(merged.videos.length, 1, "a list this page did not change stays as saved");
const revert = structuredClone(merged);
delete revert.texts.ar["نرتقي"];
await call(content, "admin-content", { method: "PUT", cookie, body: { content: revert, sha: "c".repeat(40), base: merged } });
assert.equal(JSON.parse(files.get("src/content/site-content.json").text).texts.ar["نرتقي"], undefined, "restoring the original text removes the key");

const bad = (change) => call(content, "admin-content", { method: "PUT", cookie, body: { content: { ...structuredClone(next), ...change }, sha: "c".repeat(40) } });
assert.equal((await bad({ texts: { ...next.texts, en: { "not a real key": "x" } } })).status, 400, "unknown text keys rejected");
assert.equal((await bad({ videos: [{ ...next.videos[0], url: "https://evil.test/video.mp4" }] })).status, 400, "unknown video hosts rejected");
assert.equal((await bad({ logos: [{ ...next.logos[0], src: "/uploads/logos/x.svg" }] })).status, 400, "svg logos rejected");
assert.equal((await bad({ extra: true })).status, 400, "unknown fields rejected");
assert.equal((await call(content, "admin-content", { method: "PUT", body: { content: next, sha: "c".repeat(40) } })).status, 401, "writes need a session");
assert.equal((await call(content, "admin-content", { method: "PUT", cookie, origin: "https://evil.test", body: { content: next, sha: "c".repeat(40) } })).status, 403);

const png = Buffer.from("89504e470d0a1a0a0000000d49484452", "hex");
const uploaded = await (await call(upload, "admin-upload", { method: "POST", cookie, body: { name: "Smile Clinic", data: png.toString("base64") } })).json();
assert.match(uploaded.src, /^\/uploads\/logos\/smile-clinic-[a-f0-9]{6}\.png$/);
assert.ok(files.has(`public${uploaded.src}`));
const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
assert.equal((await call(upload, "admin-upload", { method: "POST", cookie, body: { name: "x", data: svg.toString("base64") } })).status, 415, "svg uploads refused");
assert.equal((await call(upload, "admin-upload", { method: "POST", cookie, body: { name: "x", data: Buffer.alloc(1_100_000, 1).toString("base64") } })).status, 413);

// The site logo: replacing keeps the original once, restoring brings it back, and only PNGs are taken.
const pngHeader = Buffer.from("89504e470d0a1a0a", "hex");
const firstLogo = Buffer.concat([pngHeader, Buffer.from("original logo")]);
files.set("public/logo/logo.png", { sha: "d".repeat(40), raw: firstLogo });
const fileBytes = (path) => files.get(path).raw;
const newLogo = Buffer.concat([pngHeader, Buffer.from("new logo")]);
assert.equal((await call(siteLogo, "admin-site-logo", { method: "POST", body: { data: newLogo.toString("base64") } })).status, 401, "needs a session");
assert.equal((await call(siteLogo, "admin-site-logo", { method: "POST", cookie, body: { data: Buffer.from("\xff\xd8\xff jpeg").toString("base64") } })).status, 415, "only PNG replaces the logo");
assert.equal((await call(siteLogo, "admin-site-logo", { method: "POST", cookie, body: { data: newLogo.toString("base64") } })).status, 200);
assert.deepEqual(fileBytes("public/logo/logo.png"), newLogo);
assert.deepEqual(fileBytes("public/logo/logo-original.png"), firstLogo, "the first logo is kept");
const newer = Buffer.concat([pngHeader, Buffer.from("newer logo")]);
await call(siteLogo, "admin-site-logo", { method: "POST", cookie, body: { data: newer.toString("base64") } });
assert.deepEqual(fileBytes("public/logo/logo-original.png"), firstLogo, "a later replacement does not overwrite the original");
assert.equal((await call(siteLogo, "admin-site-logo", { method: "POST", cookie, body: { restore: true } })).status, 200);
assert.deepEqual(fileBytes("public/logo/logo.png"), firstLogo, "restore brings the original back");

const signedOut = await call(login, "admin-login", { method: "DELETE", cookie });
assert.match(signedOut.headers.get("set-cookie"), /Max-Age=0/);
console.log("Admin sign-in, sessions, content validation, conflict detection, GitHub commits, logo uploads and the site logo passed (mock GitHub)");
