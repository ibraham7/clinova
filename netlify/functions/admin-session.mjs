import { isAdmin, reply, storageReady } from "../lib/admin.mjs";

// Tells the admin pages whether the visitor is signed in, and which optional services are configured.
export default async function handler(request) {
    if (!isAdmin(request)) return reply(401, { ok: false, error: "signed_out" });
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    return reply(200, {
        ok: true,
        storage: storageReady(),
        videoUpload: cloudName && uploadPreset ? { cloudName, uploadPreset } : null,
    });
}
