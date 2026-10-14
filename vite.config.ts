import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Show the review section on the live site too; placeholder cards remain explicitly labelled.
    __CLINOVA_REVIEW_SAMPLES__: true,
  },
})
