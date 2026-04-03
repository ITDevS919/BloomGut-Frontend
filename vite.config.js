// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
import path from "path";

// // https://vite.dev/config/
// export default defineConfig({
//   server: {
//     // host: "::",
//     host: "0.0.0.0",
//     port: 3000,
//   },
//   plugins: [react(),tailwindcss()],
// resolve: {
//   alias: {
//     "@": path.resolve(__dirname, "./src"),
//   },
// },
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "Bloomgut",
        short_name: "Bloomgut",
        description: "Bloomgut health tracking",
        theme_color: "#15803d",
        background_color: "#f8fafc",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2,woff,ttf}"],
        navigateFallbackDenylist: [/^\/api\//],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["www.bloomgut.app", "bloomgut.app", "unstabilising-corpulently-sherwood.ngrok-free.dev"],
    // hmr: {
    //   protocol: ["ws", "wss"],
    // }
  },
  build: {
    outDir: "dist"
  },
  base: "/", // MUST be '/'

});