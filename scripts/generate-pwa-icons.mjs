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
const BLACK_CUTOFF = 28;

async function removeNearBlackBackground(inputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= BLACK_CUTOFF && g <= BLACK_CUTOFF && b <= BLACK_CUTOFF) {
      data[i + 3] = 0;
    }
  }
  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  }).png().toBuffer();
}

async function squareIcon(cleanBuffer, size, outName) {
  await sharp(cleanBuffer)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(publicDir, outName));
}

await mkdir(publicDir, { recursive: true });
const cleanLogo = await removeNearBlackBackground(logoPath);
await squareIcon(cleanLogo, 512, "pwa-512x512.png");
await squareIcon(cleanLogo, 192, "pwa-192x192.png");
await squareIcon(cleanLogo, 180, "apple-touch-icon.png");
console.log("Wrote public/pwa-512x512.png, pwa-192x192.png, apple-touch-icon.png");
