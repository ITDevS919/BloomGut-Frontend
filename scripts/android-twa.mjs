/**
 * Local Android TWA project via Google Bubblewrap (avoids PWABuilder cloud timeouts).
 *
 * Prerequisites: JDK 17+, Android SDK, ANDROID_HOME set, `npx` on PATH.
 *
 * Usage:
 *   npm run android:twa:init -- https://bloomgut.app
 *   # or: PWA_ORIGIN=https://bloomgut.app npm run android:twa:init
 *
 * Then (from repo root):
 *   cd native/android-twa && npx bubblewrap build
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");
const outDir = path.join(repoRoot, "native", "android-twa");

const raw =
  process.argv.slice(2).find((a) => /^https:\/\//i.test(a)) ||
  process.env.PWA_ORIGIN?.trim();

if (!raw) {
  console.error(`
android:twa:init — missing HTTPS origin.

  npm run android:twa:init -- https://your-production-domain.com

Or set PWA_ORIGIN in the environment.

Deploy your PWA first; Bubblewrap reads /manifest.webmanifest from that host.
`);
  process.exit(1);
}

const base = raw.replace(/\/+$/, "");
const manifestUrl = `${base}/manifest.webmanifest`;

console.info(`Manifest: ${manifestUrl}`);
console.info(`Output:   ${outDir}\n`);

const args = [
  "--yes",
  "@bubblewrap/cli",
  "init",
  `--manifest=${manifestUrl}`,
  `--directory=${outDir}`,
];

const child = spawn("npx", args, {
  stdio: "inherit",
  shell: true,
  cwd: path.join(__dirname, ".."),
  env: process.env,
});

child.on("exit", (code) => {
  if (code === 0) {
    console.info(`
Next: cd native/android-twa
      npx bubblewrap build

Never commit *.keystore. See native/.gitignore`);
  }
  process.exit(code ?? 1);
});
