import type { SiteLanguage } from "../i18n";
import content from "./site-content.json";

// Edited from /admin and committed to GitHub; every save triggers a fresh Netlify build.
export type Localized = Partial<Record<SiteLanguage, string>>;
export type ClientVideo = {
    id: string;
    /** A YouTube link or an uploaded (Cloudinary) video URL. */
    url: string;
    poster?: string;
    name: string;
    details: Localized;
    quote: Localized;
    addedAt: string;
};
export type ClientLogo = { id: string; name: string; src: string };
export type SiteContent = {
    texts: Record<SiteLanguage, Record<string, string>>;
    videos: ClientVideo[];
    logos: ClientLogo[];
};

export const siteContent = content as SiteContent;

export function localized(value: Localized, lang: string) {
    return value[lang as SiteLanguage] || value.ar || "";
}

export function youtubeId(url: string) {
    const match = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/.exec(url);
    return match?.[1];
}

export function videoPoster(video: ClientVideo) {
    const id = youtubeId(video.url);
    return video.poster || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined);
}
