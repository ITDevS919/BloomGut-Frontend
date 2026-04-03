/**
 * Runs Bubblewrap with cwd = repo/native/android-twa (where twa-manifest.json lives).
 * Do not run `npx @bubblewrap/cli` from `frontend/` — it will look for frontend/twa-manifest.json and fail.
 *
 * Usage:
 *   node scripts/bubblewrap-runner.mjs update
 *   node scripts/bubblewrap-runner.mjs build
 *   npm run android:bubblewrap -- doctor
 */
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");
const twaDir = path.join(repoRoot, "native", "android-twa");
const isWin = process.platform === "win32";

const bubbleArgs = process.argv.slice(2);

if (!existsSync(twaDir)) {
  console.error(`
Bubblewrap project missing: ${twaDir}

Create it with:
  npm run android:twa:init -- https://your-production-domain.com
`);
  process.exit(1);
}

if (bubbleArgs.length === 0) {
  console.error(`Usage: npm run android:bubblewrap -- <command> [options]

Examples:
  npm run android:bubblewrap -- update
  npm run android:bubblewrap -- build
  npm run android:bubblewrap -- doctor
`);
  process.exit(1);
}

const npxArgs = ["--yes", "@bubblewrap/cli", ...bubbleArgs];
const pipeYes = bubbleArgs[0] === "update" || bubbleArgs[0] === "build";

const child = isWin
  ? spawn("cmd.exe", ["/d", "/s", "/c", "npx", ...npxArgs], {
      cwd: twaDir,
      env: process.env,
      shell: false,
      stdio: pipeYes ? ["pipe", "inherit", "inherit"] : "inherit",
    })
  : spawn("npx", npxArgs, {
      cwd: twaDir,
      env: process.env,
      shell: false,
      stdio: pipeYes ? ["pipe", "inherit", "inherit"] : "inherit",
    });

if (pipeYes && child.stdin) {
  child.stdin.write("y\n");
  child.stdin.end();
}

child.on("exit", (code) => process.exit(code ?? 1));
