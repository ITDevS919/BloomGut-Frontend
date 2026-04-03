/**
 * Applies twa-manifest.json to the Gradle project (non-interactive).
 * Runs Bubblewrap from native/android-twa (not frontend).
 *
 *   npm run android:twa:update
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runner = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "bubblewrap-runner.mjs"
);

const child = spawn(process.execPath, [runner, "update"], {
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => process.exit(code ?? 1));
