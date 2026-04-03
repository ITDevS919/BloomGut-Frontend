/**
 * Open PWABuilder to validate and package this PWA for stores (uses pwabuilder.com).
 * Android packages from PWABuilder are Bubblewrap-based — same stack as android:twa:*.
 */
import { spawn } from "node:child_process";

const studio =
  process.argv.includes("--studio") || process.argv.includes("-s");

const urlArg = process.argv.find((a) => /^https:\/\//i.test(a));
const site = (
  urlArg ||
  process.env.PWA_ORIGIN?.trim() ||
  "https://bloomgut.app"
).replace(/\/+$/, "");

const target = studio
  ? "https://marketplace.visualstudio.com/items?itemName=PWABuilder.pwa-studio"
  : `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(site)}`;

function openBrowser(href) {
  const isWin = process.platform === "win32";
  if (isWin) {
    spawn("cmd.exe", ["/d", "/c", "start", "", href], {
      detached: true,
      stdio: "ignore",
      shell: false,
    }).unref();
  } else if (process.platform === "darwin") {
    spawn("open", [href], { detached: true, stdio: "ignore" }).unref();
  } else {
    spawn("xdg-open", [href], { detached: true, stdio: "ignore" }).unref();
  }
}

openBrowser(target);

if (studio) {
  console.info("Opening PWABuilder Studio (VS Code extension) in your browser.\n");
} else {
  console.info(`Opening PWABuilder report card for:\n  ${site}\n`);
  console.info(`Next: click "Package for stores" → pick a platform → Generate → Download.
Local Android (Bubblewrap) without the site: npm run android:twa:apk-debug
`);
}
