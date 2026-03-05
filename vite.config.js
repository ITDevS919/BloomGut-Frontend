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
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist"
  },
  base: "/", // MUST be '/'

});
