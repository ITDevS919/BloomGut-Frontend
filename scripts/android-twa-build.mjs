/**
 * Builds a previously initialized Android TWA project.
 *
 * Usage:
 *   npm run android:twa:build
 *   npm run android:twa:build -- --skipPwaValidation
 */
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");
const twaDir = path.join(repoRoot, "native", "android-twa");

if (!existsSync(twaDir)) {
  console.error(`
android:twa:build — missing native/android-twa.

Run init first:
  npm run android:twa:init -- https://your-production-domain.com
`);
  process.exit(1);
}

const extraArgs = process.argv.slice(2);
const args = ["--yes", "@bubblewrap/cli", "build", ...extraArgs];

const child = spawn("npx", args, {
  stdio: "inherit",
  shell: true,
  cwd: twaDir,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 1));
