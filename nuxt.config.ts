// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-09-06',
  srcDir: 'app',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  runtimeConfig: {
    public: {
      // ENV is read at build-time; exposed to client as appEnv
      appEnv: process.env.ENV || ''
    }
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
        },
      ],
      script: [
        {
          src: 'https://telegram.org/js/telegram-web-app.js?58'
        }
      ]
    },
  },
  pages: true,
  router: {
    options: {
      // Use history mode so Telegram's #tgWebAppData is preserved as a URL hash
      hashMode: false
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false,
    },
  },
 // Additional SPA configuration
  experimental: {
    payloadExtraction: false
  },
  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],
  modules: ['@nuxt/icon', '@nuxtjs/tailwindcss', '@nuxt/eslint'],
})