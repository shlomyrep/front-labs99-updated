// vite.config.js (or vite.config.ts)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()],
optimizeDeps: {
include: ['@react-oauth/google'], // Add this line
},
})