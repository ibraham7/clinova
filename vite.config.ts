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
  },
})
