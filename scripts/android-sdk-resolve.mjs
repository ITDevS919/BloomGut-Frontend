import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

/**
 * Resolves Android SDK root: --sdk arg, env vars, then default install paths.
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
  if (process.platform === "win32" && process.env.LOCALAPPDATA) {
    const p = path.join(process.env.LOCALAPPDATA, "Android", "Sdk");
    if (existsSync(p)) return p;
  }
  if (process.platform === "darwin") {
    const p = path.join(os.homedir(), "Library", "Android", "sdk");
    if (existsSync(p)) return p;
  }
  const linuxDefault = path.join(os.homedir(), "Android", "Sdk");
  if (existsSync(linuxDefault)) return linuxDefault;
  return null;
}
