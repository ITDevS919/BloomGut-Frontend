/**
 * Local Android TWA project via Google Bubblewrap (avoids PWABuilder cloud timeouts).
 *
 * Prerequisites: JDK 17+, Android SDK, ANDROID_HOME set, `npx` on PATH.
 *
 * Usage:
 *   npm run android:twa:init -- https://bloomgut.app
 *   # or: PWA_ORIGIN=https://bloomgut.app npm run android:twa:init
 *
 * Then from frontend/ (do not run raw `npx @bubblewrap/cli` there — wrong cwd):
 *   npm run android:twa:update
 *   npm run android:twa:build
 *   # or: npm run android:bubblewrap -- build
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");
const outDir = path.join(repoRoot, "native", "android-twa");
const isWin = process.platform === "win32";

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
mkdirSync(path.dirname(outDir), { recursive: true });

console.info(`Manifest: ${manifestUrl}`);
console.info(`Output:   ${outDir}\n`);

const args = [
  "--yes",
  "@bubblewrap/cli",
  "init",
  `--manifest=${manifestUrl}`,
  `--directory=${outDir}`,
];

const child = isWin
  ? spawn("cmd.exe", ["/d", "/s", "/c", "npx", ...args], {
      stdio: "inherit",
      shell: false,
      cwd: path.join(__dirname, ".."),
      env: process.env,
    })
  : spawn("npx", args, {
      stdio: "inherit",
      shell: false,
      cwd: path.join(__dirname, ".."),
      env: process.env,
    });

child.on("exit", (code) => {
  if (code === 0) {
    if (!existsSync(outDir)) {
      console.error(`\nBubblewrap finished, but ${outDir} was not created.`);
      console.error("Check for path quoting issues and rerun android:twa:init.");
      process.exit(1);
    }
    console.info(`
Project directory:
  ${outDir}

Next:
  npm run android:twa:build

Never commit *.keystore. See native/.gitignore`);
  }
  process.exit(code ?? 1);
});
