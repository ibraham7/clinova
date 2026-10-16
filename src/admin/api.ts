import type { SiteContent } from "../content/siteContent";
import type { Report, ReportFilters } from "./reportTypes";

export type VideoUploadConfig = { cloudName: string; uploadPreset: string };
export type Session = { ok: true; storage: boolean; videoUpload: VideoUploadConfig | null };

async function call<T = Record<string, unknown>>(name: string, init: RequestInit = {}) {
    const response = await fetch(`/.netlify/functions/${name}`, {
        credentials: "same-origin",
        ...init,
        headers: { "Content-Type": "application/json", ...init.headers },
    });
    const data = (await response.json().catch(() => ({}))) as T & { error?: string };
    return { status: response.status, data };
}

export const api = {
    session: () => call<Session>("admin-session"),
    login: (password: string) => call("admin-login", { method: "POST", body: JSON.stringify({ password }) }),
    logout: () => call("admin-login", { method: "DELETE" }),
    load: () => call<{ content: SiteContent; sha: string }>("admin-content"),
    save: (content: SiteContent, sha: string) => call<{ sha: string }>("admin-content", { method: "PUT", body: JSON.stringify({ content, sha }) }),
    uploadLogo: (name: string, data: string) => call<{ src: string }>("admin-upload", { method: "POST", body: JSON.stringify({ name, data }) }),
    reports: (filters: ReportFilters) => call<{ report: Report }>(`admin-reports?${new URLSearchParams(Object.entries(filters).filter(([, value]) => value) as [string, string][])}`),
};

export type SerenaChunk = { type: "text"; text: string } | { type: "status"; input: ReportFilters } | { type: "error"; error: string } | { type: "done" };

/** Streams Serena's answer; each line of the response is one JSON chunk. */
export async function askSerena(messages: { role: "user" | "assistant"; content: string }[], view: ReportFilters, onChunk: (chunk: SerenaChunk) => void, signal?: AbortSignal) {
    const response = await fetch("/api/serena", { method: "POST", credentials: "same-origin", signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages, view }) });
    if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        onChunk({ type: "error", error: data.error ?? "failed" });
        return;
    }
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) if (line.trim()) onChunk(JSON.parse(line) as SerenaChunk);
    }
}

// Admin messages are Arabic only; the admin panel is not translated.
export const errorMessages: Record<string, string> = {
    wrong_password: "كلمة السر غير صحيحة.",
    not_configured: "لوحة الإدارة غير مفعّلة بعد: أضف ADMIN_PASSWORD في إعدادات Netlify.",
    storage_not_configured: "الحفظ غير مفعّل بعد: أضف GITHUB_TOKEN في إعدادات Netlify.",
    conflict: "تم حفظ تعديلات أخرى في نفس الوقت. حدّث الصفحة ثم أعد المحاولة.",
    signed_out: "انتهت الجلسة. سجّل الدخول من جديد.",
    too_large: "الملف أكبر من المسموح.",
    unsupported_type: "نوع الملف غير مدعوم. استخدم PNG أو JPG أو WebP.",
    invalid_videos: "تحقق من بيانات الفيديو: الرابط يجب أن يكون من YouTube أو من الرفع المباشر، والاسم مطلوب.",
    invalid_logos: "تحقق من بيانات الشعار: الاسم والصورة مطلوبان.",
    invalid_texts: "أحد النصوص غير صالح أو طويل جدًا.",
    storage_failed: "تعذر الحفظ على GitHub. تحقق من GITHUB_TOKEN ثم أعد المحاولة.",
    analytics_not_configured: "التقارير غير مفعّلة بعد: أضف SUPABASE_URL وSUPABASE_SERVICE_ROLE_KEY في إعدادات Netlify (راجع docs/reports-and-serena.md).",
    analytics_failed: "تعذرت قراءة البيانات من Supabase. تحقق من المفاتيح ومن تشغيل supabase/schema.sql.",
    invalid_range: "نطاق التاريخ غير صالح (الحد الأقصى 400 يوم).",
    serena_not_configured: "سيرينا غير مفعّلة بعد: أضف GEMINI_API_KEY (مفتاح Google) في إعدادات Netlify.",
    refusal: "اعتذرت سيرينا عن الإجابة على هذا الطلب. جرّب صياغة أخرى.",
    too_long: "الإجابة أطول من المسموح، اطلب ملخصًا أقصر.",
    too_many_steps: "احتاجت سيرينا خطوات كثيرة. جرّب سؤالًا أكثر تحديدًا.",
    rate_limited: "تم تجاوز حد الاستخدام المجاني من Google مؤقتًا. حاول بعد دقيقة.",
    bad_key: "مفتاح GEMINI_API_KEY غير صحيح أو الموديل غير متاح.",
    failed: "تعذر الاتصال بسيرينا. أعد المحاولة.",
};

export const messageFor = (error?: string) => (error && errorMessages[error]) || "حدث خطأ غير متوقع. أعد المحاولة.";

export const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

export function fileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

/** Uploads a video straight from the browser to Cloudinary (unsigned preset), reporting progress 0..1. */
export function uploadVideo(file: File, config: VideoUploadConfig, onProgress: (value: number) => void) {
    return new Promise<{ url: string; poster: string }>((resolve, reject) => {
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", config.uploadPreset);
        const request = new XMLHttpRequest();
        request.open("POST", `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/video/upload`);
        request.upload.onprogress = (event) => { if (event.lengthComputable) onProgress(event.loaded / event.total); };
        request.onload = () => {
            try {
                const result = JSON.parse(request.responseText) as { secure_url?: string };
                if (request.status >= 300 || !result.secure_url) throw new Error("upload failed");
                // Cloudinary serves a still frame when the extension is swapped to .jpg.
                resolve({ url: result.secure_url, poster: result.secure_url.replace(/\.[a-z0-9]+$/i, ".jpg") });
            } catch (error) { reject(error); }
        };
        request.onerror = () => reject(new Error("network"));
        request.send(form);
    });
}
