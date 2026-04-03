/**
 * Builds a release-signed APK via Gradle (no interactive Bubblewrap prompts).
 *
 * Signing credentials (pick one):
 *   A) Env vars (recommended for CI — nothing committed):
 *        ANDROID_KEYSTORE_PATH   optional, default: native/android-twa/android.keystore
 *        ANDROID_KEYSTORE_PASSWORD
 *        ANDROID_KEY_PASSWORD    optional, defaults to ANDROID_KEYSTORE_PASSWORD
 *        ANDROID_KEY_ALIAS       optional, default: android
 *
 *   B) File native/android-twa/keystore.properties (gitignored), e.g.:
 *        storeFile=android.keystore
 *        storePassword=...
 *        keyAlias=android
 *        keyPassword=...
 *
 * Prerequisites: Android SDK, ANDROID_HOME or --sdk <path>
 *
 * Output:
 *   native/android-twa/app/build/outputs/apk/release/app-release.apk
 *
 * Usage:
 *   npm run android:twa:apk-release
 *   npm run android:twa:apk-release -- --sdk "C:\\Users\\You\\AppData\\Local\\Android\\Sdk"
 */
import { existsSync, writeFileSync, unlinkSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveAndroidSdk } from "./android-sdk-resolve.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");
const twaDir = path.join(repoRoot, "native", "android-twa");
const isWin = process.platform === "win32";

const sdkIdx = process.argv.indexOf("--sdk");
const sdkFromArg = sdkIdx >= 0 ? process.argv[sdkIdx + 1] : null;
const androidHome = resolveAndroidSdk(sdkFromArg);

const propsPath = path.join(twaDir, "keystore.properties");
const fromEnv =
  Boolean(process.env.ANDROID_KEYSTORE_PASSWORD) ||
  Boolean(process.env.ANDROID_KEY_PASSWORD);

function writePropsFromEnv() {
  const storePath =
    process.env.ANDROID_KEYSTORE_PATH ||
    path.join(twaDir, "android.keystore");
  const resolved = path.resolve(storePath);
  if (!existsSync(resolved)) {
    console.error(`Keystore not found: ${resolved}`);
    console.error("Set ANDROID_KEYSTORE_PATH or place android.keystore in native/android-twa/");
    process.exit(1);
  }
  const rel = path.relative(twaDir, resolved).replace(/\\/g, "/");
  const storePassword = process.env.ANDROID_KEYSTORE_PASSWORD || "";
  const keyPassword =
    process.env.ANDROID_KEY_PASSWORD || storePassword || "";
  const keyAlias = process.env.ANDROID_KEY_ALIAS || "android";
  if (!storePassword) {
    console.error("ANDROID_KEYSTORE_PASSWORD is required when using env-based signing.");
    process.exit(1);
  }
  const body =
    `storeFile=${rel}\n` +
    `storePassword=${storePassword}\n` +
    `keyAlias=${keyAlias}\n` +
    `keyPassword=${keyPassword}\n`;
  writeFileSync(propsPath, body, "utf8");
  return true;
}

if (!existsSync(twaDir)) {
  console.error("Missing native/android-twa.");
  process.exit(1);
}

if (!androidHome) {
  console.error(`
android:twa:apk-release — Android SDK not found.

Install Android Studio / SDK, or set ANDROID_HOME, or run:
  npm run android:twa:apk-release -- --sdk "C:\\Users\\YOU\\AppData\\Local\\Android\\Sdk"
`);
  process.exit(1);
}

let wrotePropsFromEnv = false;
if (existsSync(propsPath)) {
  console.info(`Using signing: ${propsPath}`);
} else if (fromEnv || process.env.ANDROID_KEYSTORE_PATH) {
  wrotePropsFromEnv = writePropsFromEnv();
  console.info(`Wrote ${propsPath} from environment (file is gitignored).`);
} else {
  console.error(`
android:twa:apk-release — no signing configuration.

Either:
  1) Create ${propsPath}
     (copy keystore.properties.example and fill in passwords), or
  2) Export ANDROID_KEYSTORE_PASSWORD and optionally ANDROID_KEYSTORE_PATH,
     ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD before running this script.
`);
  process.exit(1);
}

const sdkDir = path.resolve(androidHome).replace(/\\/g, "/");
const localProps = path.join(twaDir, "local.properties");
writeFileSync(localProps, `sdk.dir=${sdkDir}\n`, "utf8");

const child = isWin
  ? spawn(
      "cmd.exe",
      ["/d", "/s", "/c", "gradlew.bat", "assembleRelease", "--no-daemon"],
      {
        cwd: twaDir,
        env: { ...process.env, ANDROID_HOME: path.resolve(androidHome) },
        stdio: "inherit",
        shell: false,
      }
    )
  : spawn("./gradlew", ["assembleRelease", "--no-daemon"], {
      cwd: twaDir,
      env: { ...process.env, ANDROID_HOME: path.resolve(androidHome) },
      stdio: "inherit",
      shell: false,
    });

child.on("exit", (code) => {
  if (wrotePropsFromEnv && existsSync(propsPath)) {
    try {
      unlinkSync(propsPath);
      console.info("Removed temporary keystore.properties (was created from env).");
    } catch {
      /* ignore */
    }
  }
  if (code === 0) {
    const apk = path.join(
      twaDir,
      "app",
      "build",
      "outputs",
      "apk",
      "release",
      "app-release.apk"
    );
    console.info(`\nRelease APK: ${apk}\n`);
  }
  process.exit(code ?? 1);
});
