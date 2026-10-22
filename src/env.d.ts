/** True on Netlify deploy previews and local builds, false on the production site (see vite.config.ts). */
declare const __CLINOVA_REVIEW_SAMPLES__: boolean;
/** The Meta Pixel ID from VITE_META_PIXEL_ID at build time, or "" (see vite.config.ts and src/analytics/pixel.ts). */
declare const __META_PIXEL_ID__: string;
