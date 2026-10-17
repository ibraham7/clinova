// Shared helpers for the /admin functions: password sessions, GitHub storage and content validation.
import crypto from "node:crypto";
import baseTexts from "../../src/i18n/locales/ar.json" with { type: "json" };

export const contentPath = "src/content/site-content.json";
const languages = ["ar", "en", "tr", "fr"];
const sessionHours = 12;
const cookieName = "clinova_admin";

export const reply = (status, data, headers = {}) => Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });

function secret() {
    const password = process.env.ADMIN_PASSWORD;
    if (!password || password.length < 10) return null;
    // Changing the password (or the optional extra secret) signs everyone out.
    return `${password}:${process.env.ADMIN_SESSION_SECRET ?? ""}`;
}

const sign = (data, key) => crypto.createHmac("sha256", key).update(data).digest("hex");

export function passwordMatches(candidate) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password || typeof candidate !== "string") return false;
    const a = crypto.createHash("sha256").update(candidate).digest();
    const b = crypto.createHash("sha256").update(password).digest();
    return crypto.timingSafeEqual(a, b);
}

// Path=/ so the Serena endpoint (/api/serena, an edge function) receives the session too.
export function sessionCookie() {
    const key = secret();
    const expires = Date.now() + sessionHours * 3600 * 1000;
    const token = `${expires}.${sign(`clinova-admin:${expires}`, key)}`;
    return `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${sessionHours * 3600}`;
}

export const clearedCookie = `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export function isAdmin(request) {
    const key = secret();
    if (!key) return false;
    const cookie = request.headers.get("cookie") ?? "";
    const token = cookie.split(/;\s*/).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
    const [expires, signature] = (token ?? "").split(".");
    if (!expires || !signature || Number(expires) < Date.now()) return false;
    const expected = sign(`clinova-admin:${expires}`, key);
    return expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/** Rejects cross-site writes; browsers always send Origin on POST/PUT. */
export function sameOrigin(request) {
    const origin = request.headers.get("origin");
    return !origin || origin === new URL(request.url).origin;
}

export async function readJson(request, limit) {
    if (Number(request.headers.get("content-length")) > limit) throw new Error("too_large");
    const body = await request.text();
    if (Buffer.byteLength(body) > limit) throw new Error("too_large");
    return JSON.parse(body);
}

// ---- GitHub storage -------------------------------------------------------------------------

function github(path, init = {}) {
    const repo = process.env.GITHUB_REPO || "ibraham7/clinova";
    return fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        ...init,
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "clinova-admin",
            ...(init.body ? { "Content-Type": "application/json" } : {}),
        },
    });
}

export const branch = () => process.env.GITHUB_BRANCH || "main";
export const storageReady = () => Boolean(process.env.GITHUB_TOKEN);

export async function readContent() {
    // A unique query so a cached copy from a save moments ago is never returned.
    const response = await github(`${contentPath}?ref=${encodeURIComponent(branch())}&t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`github_read_${response.status}`);
    const file = await response.json();
    return { content: JSON.parse(Buffer.from(file.content, "base64").toString("utf8")), sha: file.sha };
}

/**
 * Proves the token may write, without changing the site: GitHub stores a tiny unreferenced blob (cleaned up
 * by GitHub later). A read-only token is refused here, while reading the content file still works.
 */
export async function checkWriteAccess() {
    const repo = process.env.GITHUB_REPO || "ibraham7/clinova";
    const response = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
        method: "POST",
        headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "clinova-admin", "Content-Type": "application/json" },
        body: JSON.stringify({ content: "clinova admin write check", encoding: "utf-8" }),
    });
    if (!response.ok) throw new Error(`github_write_${response.status}`);
}

/** The admin-facing error for a failed GitHub call: a bad token and a token that may only read get their own message. */
export function storageError(error) {
    const status = Number(String(error?.message ?? "").match(/^github_(?:read|write)_(\d+)$/)?.[1]);
    return status === 401 ? "github_token_invalid" : status === 403 || status === 404 ? "github_no_write" : "storage_failed";
}

/** Commits a file to the site repository; Netlify rebuilds the site from the new commit. */
export async function writeFile(path, buffer, message, sha) {
    const response = await github(path, {
        method: "PUT",
        body: JSON.stringify({ message, content: buffer.toString("base64"), branch: branch(), ...(sha ? { sha } : {}) }),
    });
    if (response.status === 409 || response.status === 422) return { conflict: true };
    if (!response.ok) throw new Error(`github_write_${response.status}`);
    const result = await response.json();
    return { sha: result.content?.sha };
}

/**
 * Three-way merge of a save: only what this admin changed since they loaded `base` is applied to `latest`
 * (the file as it is now), so a stale page or a second tab never undoes someone else's saved edits.
 * Texts merge key by key; the video and logo lists are taken whole when this admin changed them.
 */
export function mergeContent(latest, base, next) {
    const texts = {};
    for (const lang of Object.keys(next.texts ?? {})) {
        const result = { ...(latest.texts?.[lang] ?? {}) };
        const before = base.texts?.[lang] ?? {};
        const after = next.texts[lang] ?? {};
        for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
            if (after[key] === before[key]) continue;
            if (after[key] === undefined) delete result[key];
            else result[key] = after[key];
        }
        texts[lang] = result;
    }
    const pick = (field) => JSON.stringify(next[field]) !== JSON.stringify(base[field]) ? next[field] : latest[field] ?? next[field];
    return { ...latest, ...next, texts, videos: pick("videos"), logos: pick("logos") };
}

// ---- Validation -----------------------------------------------------------------------------

const videoHosts = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "res.cloudinary.com"];
const posterHosts = ["res.cloudinary.com", "i.ytimg.com"];

function httpsUrl(value, hosts) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" && hosts.includes(url.hostname) && value.length <= 500;
    } catch {
        return false;
    }
}

const isText = (value, max) => typeof value === "string" && value.length <= max;
const isLocalized = (value, max) => value && typeof value === "object" && !Array.isArray(value)
    && Object.entries(value).every(([lang, text]) => languages.includes(lang) && isText(text, max));

/** Returns an error code, or null when the content can be saved. */
export function validateContent(content) {
    if (!content || typeof content !== "object") return "invalid_content";
    const { texts, videos, logos } = content;
    if (!texts || typeof texts !== "object" || !languages.every((lang) => texts[lang] && typeof texts[lang] === "object")) return "invalid_texts";
    for (const lang of languages) {
        for (const [key, value] of Object.entries(texts[lang])) {
            if (!(key in baseTexts) || !isText(value, 4000)) return "invalid_texts";
        }
    }
    if (!Array.isArray(videos) || videos.length > 60) return "invalid_videos";
    for (const video of videos) {
        if (!/^[a-z0-9-]{4,40}$/.test(video?.id ?? "") || !httpsUrl(video.url, videoHosts)) return "invalid_videos";
        if (video.poster !== undefined && !httpsUrl(video.poster, posterHosts)) return "invalid_videos";
        if (!isText(video.name, 120) || !video.name.trim() || !isLocalized(video.details, 200) || !isLocalized(video.quote, 600)) return "invalid_videos";
        if (!/^\d{4}-\d{2}-\d{2}$/.test(video.addedAt ?? "")) return "invalid_videos";
    }
    if (!Array.isArray(logos) || logos.length > 80) return "invalid_logos";
    for (const logo of logos) {
        if (!/^[a-z0-9-]{4,40}$/.test(logo?.id ?? "") || !isText(logo.name, 80) || !logo.name.trim()) return "invalid_logos";
        if (!/^\/uploads\/logos\/[a-z0-9-]{1,60}\.(png|jpe?g|webp)$/.test(logo.src ?? "")) return "invalid_logos";
    }
    const extra = Object.keys(content).filter((key) => !["texts", "videos", "logos"].includes(key));
    return extra.length ? "invalid_content" : null;
}

/** Image type from its first bytes; SVG is refused because it can carry scripts. */
export function imageType(buffer) {
    if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
    if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
    return null;
}
