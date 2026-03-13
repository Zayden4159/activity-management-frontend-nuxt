// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: false },
  css: ['./app/assets/css/style.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@pinia/nuxt', '@nuxt/ui'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8000'
    }
  },

  nitro: {
    preset: 'cloudflare_pages'
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['node']
      }
    }
  }
})