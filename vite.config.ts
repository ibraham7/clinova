import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Netlify sets CONTEXT=production for the live site; previews and local builds show sample reviews.
    __CLINOVA_REVIEW_SAMPLES__: JSON.stringify(process.env.CONTEXT !== 'production'),
  },
})
