import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      // Extra assets to include in precache beyond the default build output
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],

      manifest: {
        name: 'vibebug',
        short_name: 'vibebug',
        description: "Entraîne-toi au debugging avec l'IA",
        theme_color: '#534AB7',
        background_color: '#0F0F0F',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      workbox: {
        // Precache all JS/CSS/HTML/icons — exclude PDFs (too heavy)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        globIgnores: ['**/pdfs/**'],

        // SPA fallback: serve index.html for all navigation requests
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [
          /^\/pdfs\//,
          /^\/api\//,
        ],

        cleanupOutdatedCaches: true,

        runtimeCaching: [
          // NetworkFirst for HTML navigation (always try to get the latest)
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 10,
            },
          },
          // CacheFirst for content-hashed JS/CSS bundles (immutable)
          {
            urlPattern: /\.(?:js|css|woff2?)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          // CacheFirst for images and icons
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
})
