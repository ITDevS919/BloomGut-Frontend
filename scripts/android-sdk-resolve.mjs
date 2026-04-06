import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

const isWin = process.platform === "win32";

/** True if this looks like an Android SDK root (has platform-tools). */
function looksLikeSdkRoot(p) {
  if (!p || !existsSync(p)) return false;
  return existsSync(path.join(p, "platform-tools"));
}

/**
 * If `adb` is on PATH, SDK root is parent of platform-tools.
 * Helps when ANDROID_HOME was never set but Android Studio added platform-tools to PATH.
 */
function findSdkFromAdbOnPath() {
  const cmd = isWin ? "where.exe" : "which";
  const r = spawnSync(cmd, ["adb"], { encoding: "utf8", shell: false });
  if (r.error || r.status !== 0 || !r.stdout) return null;
  const line = r.stdout
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find(Boolean);
  if (!line || !existsSync(line)) return null;
  const platformTools = path.dirname(line);
  const sdk = path.dirname(platformTools);
  return looksLikeSdkRoot(sdk) ? path.resolve(sdk) : null;
}

/** Default install locations; order matters. */
function defaultSdkCandidates() {
  const out = [];
  if (isWin) {
    if (process.env.LOCALAPPDATA) {
      out.push(path.join(process.env.LOCALAPPDATA, "Android", "Sdk"));
    }
    const home = os.homedir();
    if (home) {
      out.push(path.join(home, "AppData", "Local", "Android", "Sdk"));
    }
    const up = process.env.USERPROFILE;
    if (up) {
      out.push(path.join(up, "AppData", "Local", "Android", "Sdk"));
    }
  } else if (process.platform === "darwin") {
    out.push(path.join(os.homedir(), "Library", "Android", "sdk"));
  } else {
    out.push(path.join(os.homedir(), "Android", "Sdk"));
  }
  return [...new Set(out.map((p) => path.normalize(p)))];
}

/** Legacy Android SDK Tools registry entry (still written by some Studio installs). */
function windowsSdkFromRegistry() {
  if (!isWin) return null;
  const keys = [
    String.raw`HKLM\SOFTWARE\Android SDK Tools`,
    String.raw`HKLM\SOFTWARE\WOW6432Node\Android SDK Tools`,
  ];
  for (const key of keys) {
    const r = spawnSync("reg", ["query", key, "/v", "Path"], {
      encoding: "utf8",
      shell: false,
    });
    if (r.status !== 0 || !r.stdout) continue;
    const m = /Path\s+REG_\w+\s+(.+)/.exec(r.stdout);
    if (!m) continue;
    const p = m[1].trim();
    if (looksLikeSdkRoot(p)) return path.resolve(p);
  }
  return null;
}

/**
 * Resolves Android SDK root: --sdk arg, env vars, adb on PATH, defaults, then Windows registry.
 * @param {string | null} sdkFromArg
 * @returns {string | null} absolute path or null
 */
export function resolveAndroidSdk(sdkFromArg) {
  if (sdkFromArg) {
    const resolved = path.resolve(sdkFromArg.trim());
    if (existsSync(resolved)) return resolved;
    return null;
  }
  for (const v of [process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT]) {
    if (v && String(v).trim()) {
      const resolved = path.resolve(v.trim());
      if (existsSync(resolved)) return resolved;
    }
  }

  const viaAdb = findSdkFromAdbOnPath();
  if (viaAdb) return viaAdb;

  for (const p of defaultSdkCandidates()) {
    if (looksLikeSdkRoot(p)) return path.resolve(p);
  }

  const viaReg = windowsSdkFromRegistry();
  if (viaReg) return viaReg;

  return null;
}

/** For error messages: show which default paths were considered. */
export function formatDefaultSdkSearchHints() {
  const lines = defaultSdkCandidates().map((p) => `  - ${p}`);
  return lines.join("\n");
}
