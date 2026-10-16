import type { SiteContent } from "../content/siteContent";

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
};

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
