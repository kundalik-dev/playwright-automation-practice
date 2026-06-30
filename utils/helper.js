import path from "node:path";
import fs from "node:fs";

const SCREENSHOT_DIR = "screenshots";

// e.g. 2026-06-30_14-05-09
export function dateSuffix() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  return `${date}_${time}`;
}

export function screenshotDir() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  return SCREENSHOT_DIR;
}

export function screenshotName(imgName) {
  return path.join(screenshotDir(), `${imgName}-${dateSuffix()}.png`);
}
