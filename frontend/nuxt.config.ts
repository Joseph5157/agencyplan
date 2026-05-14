export default defineNuxtConfig({
  compatibilityDate: "2025-08-01",
  devtools: { enabled: true },
  srcDir: "app/",
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000/api",
    },
  },
  app: {
    head: {
      title: "School Platform",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
  tailwindcss: {
    configPath: "tailwind.config.ts",
    cssPath: "~/assets/css/main.css",
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
