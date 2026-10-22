import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Show the review section on the live site too; placeholder cards remain explicitly labelled.
    __CLINOVA_REVIEW_SAMPLES__: true,
    // The Meta ad pixel ID from the Netlify environment (see src/analytics/pixel.ts); empty turns the pixel off.
    __META_PIXEL_ID__: JSON.stringify(process.env.VITE_META_PIXEL_ID ?? ''),
  },
})
