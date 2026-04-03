/**
 * Generates square PWA icons from src/assets/logo.png for PWABuilder / store packaging.
 * Run: node scripts/generate-pwa-icons.mjs
 */
import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const logoPath = path.join(root, "src", "assets", "logo.png");
const publicDir = path.join(root, "public");
// theme_color from vite PWA config
const bg = { r: 21, g: 128, b: 61, alpha: 1 };

async function squareIcon(size, outName) {
  const inner = Math.max(32, size - Math.round(size * 0.18));
  const resized = await sharp(logoPath)
    .resize(inner, inner, { fit: "inside" })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, outName));
}

await mkdir(publicDir, { recursive: true });
await squareIcon(512, "pwa-512x512.png");
await squareIcon(192, "pwa-192x192.png");
await squareIcon(180, "apple-touch-icon.png");
console.log("Wrote public/pwa-512x512.png, pwa-192x192.png, apple-touch-icon.png");
