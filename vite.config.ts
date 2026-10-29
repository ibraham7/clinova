import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Show the review section on the live site too; placeholder cards remain explicitly labelled.
    __CLINOVA_REVIEW_SAMPLES__: true,
    // Clinova's Meta ad pixel (see src/analytics/pixel.ts). Public by nature: it appears in every page's source.
    // VITE_META_PIXEL_ID in Netlify replaces it; setting it to "off" turns the pixel off.
    __META_PIXEL_ID__: JSON.stringify(process.env.VITE_META_PIXEL_ID ?? '3376997799146777'),
    // Clinova's Google Ads tag (see src/analytics/gtag.ts). VITE_GOOGLE_ADS_ID in Netlify replaces it; "off" turns it off.
    __GOOGLE_ADS_ID__: JSON.stringify(process.env.VITE_GOOGLE_ADS_ID ?? 'AW-18502054674'),
    // Articles dated after this day stay unpublished (see src/blog/articles.ts). Defaults to the day of the build, so a
    // scheduled rebuild (netlify/functions/publish-scheduled.mjs) publishes whatever has come due. PUBLISH_UNTIL overrides it.
    __PUBLISH_UNTIL__: JSON.stringify(process.env.PUBLISH_UNTIL || new Date().toISOString().slice(0, 10)),
  },
})
