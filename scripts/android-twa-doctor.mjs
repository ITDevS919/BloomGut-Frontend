/**
 * Pre-flight checks for Bubblewrap TWA packaging.
 *
 * Usage:
 *   npm run android:twa:doctor -- --origin=https://bloomgut.app
 *   # or:
 *   PWA_ORIGIN=https://bloomgut.app npm run android:twa:doctor
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveAndroidSdk } from "./android-sdk-resolve.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");
const twaDir = path.join(repoRoot, "native", "android-twa");

const argOrigin = process.argv.find((a) => a.startsWith("--origin="))?.split("=").slice(1).join("=") ?? "";
const origin = (argOrigin || process.env.PWA_ORIGIN || "").trim().replace(/\/+$/, "");

function hasCmd(cmd) {
  const checker = process.platform === "win32" ? "where" : "which";
  const r = spawnSync(checker, [cmd], { stdio: "ignore" });
  return r.status === 0;
}

function log(prefix, msg) {
  console.log(`${prefix} ${msg}`);
}

let ok = true;
console.log("== Android TWA Doctor ==");

if (!existsSync(twaDir)) {
  ok = false;
  log("✗", `Missing ${twaDir}`);
} else {
  log("✓", `Found ${twaDir}`);
}

const javaHome = process.env.JAVA_HOME;
if (!javaHome) {
  ok = false;
  log("✗", "JAVA_HOME is not set");
} else {
  log("✓", `JAVA_HOME=${javaHome}`);
  const keytoolPath = path.join(javaHome, "bin", process.platform === "win32" ? "keytool.exe" : "keytool");
  if (!existsSync(keytoolPath)) {
    ok = false;
    log("✗", `keytool not found at ${keytoolPath}`);
  } else {
    log("✓", "keytool present");
  }
}

const androidResolved = resolveAndroidSdk(null);
if (!androidResolved) {
  ok = false;
  log("✗", "Android SDK not found (set ANDROID_HOME, install Studio, or add adb to PATH)");
} else {
  log("✓", `Android SDK root=${androidResolved}`);
  const adb = path.join(
    androidResolved,
    "platform-tools",
    process.platform === "win32" ? "adb.exe" : "adb"
  );
  if (!existsSync(adb)) {
    ok = false;
    log("✗", `adb not found at ${adb}`);
  } else {
    log("✓", "adb present");
  }
}

if (hasCmd("java")) {
  const r = spawnSync("java", ["-version"], { encoding: "utf8" });
  // java writes version to stderr
  const out = `${r.stdout || ""}${r.stderr || ""}`.trim();
  if (out) console.log(out.split("\n").slice(0, 2).join("\n"));
} else {
  console.log("Note: `java` not found in PATH (may still be OK if JAVA_HOME is correct).");
}

if (!origin) {
  console.log("\nOrigin not provided; skipping URL reachability checks.");
  console.log("Run with: --origin=https://your-domain.com");
  process.exit(ok ? 0 : 1);
}

async function checkUrl(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { method: "GET", signal: controller.signal });
    clearTimeout(t);
    if (!res.ok) {
      ok = false;
      log("✗", `${url} returned HTTP ${res.status}`);
    } else {
      log("✓", `${url} returned HTTP ${res.status}`);
    }
  } catch (e) {
    ok = false;
    log("✗", `Failed to fetch ${url}: ${e?.name || "error"}`);
  }
}

console.log(`\nChecking production PWA files from: ${origin}`);
await checkUrl(`${origin}/manifest.webmanifest`);
await checkUrl(`${origin}/sw.js`);

console.log(`\nResult: ${ok ? "PASS" : "FAIL"}`);
process.exit(ok ? 0 : 1);

