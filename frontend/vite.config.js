import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server:{
    host:'0.0.0.0',
    strictPort:true,
    port:4000,
    cors:true
  }
})
