/**
 * Builds a debug APK (installable for testing) without your release keystore.
 *
 * Prerequisites:
 *   - Android SDK (Android Studio), ANDROID_HOME set, or pass --sdk <path>
 *
 * Output:
 *   native/android-twa/app/build/outputs/apk/debug/app-debug.apk
 *
 * Usage:
 *   npm run android:twa:apk-debug
 *   npm run android:twa:apk-debug -- --sdk "C:\\Users\\You\\AppData\\Local\\Android\\Sdk"
 */
import { existsSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  resolveAndroidSdk,
  formatDefaultSdkSearchHints,
} from "./android-sdk-resolve.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");
const twaDir = path.join(repoRoot, "native", "android-twa");
const isWin = process.platform === "win32";

const sdkIdx = process.argv.indexOf("--sdk");
const sdkFromArg = sdkIdx >= 0 ? process.argv[sdkIdx + 1] : null;
const androidHome = resolveAndroidSdk(sdkFromArg);

if (!existsSync(twaDir)) {
  console.error("Missing native/android-twa.");
  process.exit(1);
}

if (!androidHome) {
  console.error(`
android:twa:apk-debug — Android SDK not found.

1. Install Android Studio → SDK Manager → install "Android SDK" (includes platform-tools).
2. This script checks (in order): --sdk, ANDROID_HOME, ANDROID_SDK_ROOT, adb on PATH
   (parent of platform-tools), default folders, then Windows registry (Android SDK Tools).

   Default folders tried on this machine:
${formatDefaultSdkSearchHints()}

3. Or pass the SDK path explicitly:
   npm run android:twa:apk-debug -- --sdk "C:\\Users\\YOU\\AppData\\Local\\Android\\Sdk"
`);
  process.exit(1);
}

const sdkDir = path.resolve(androidHome).replace(/\\/g, "/");
const localProps = path.join(twaDir, "local.properties");
writeFileSync(localProps, `sdk.dir=${sdkDir}\n`, "utf8");

const child = isWin
  ? spawn(
      "cmd.exe",
      ["/d", "/s", "/c", "gradlew.bat", "assembleDebug", "--no-daemon"],
      {
        cwd: twaDir,
        env: { ...process.env, ANDROID_HOME: path.resolve(androidHome) },
        stdio: "inherit",
        shell: false,
      }
    )
  : spawn("./gradlew", ["assembleDebug", "--no-daemon"], {
      cwd: twaDir,
      env: { ...process.env, ANDROID_HOME: path.resolve(androidHome) },
      stdio: "inherit",
      shell: false,
    });

child.on("exit", (code) => {
  if (code === 0) {
    const apk = path.join(
      twaDir,
      "app",
      "build",
      "outputs",
      "apk",
      "debug",
      "app-debug.apk"
    );
    console.info(`\nAPK: ${apk}\n`);
  }
  process.exit(code ?? 1);
});
