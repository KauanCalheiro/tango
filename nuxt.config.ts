// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vite-pwa/nuxt'
  ],

  devtools: { enabled: false },

  ssr: false,

  nitro: {
    preset: 'github-pages'
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  app: {
    head: {
      title: 'Tango',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/tango/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/tango/apple-touch-icon.png' },
        { rel: 'manifest', href: '/tango/site.webmanifest' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', content: '#000000' },
        { name: 'background-color', content: '#000000' },
      ]
    },
    baseURL: '/tango/',
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Tango',
      short_name: 'Tango',
      description: 'Tango Game Application',
      theme_color: '#000000',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/tango/',
      icons: [
        {
          src: '/tango/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/tango/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/tango/pwa-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/tango/pwa-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/tango/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    devOptions: {
      enabled: false,
      type: 'module'
    }
  }
})
