# File Download in Playwright

In Playwright for file download scenario we

- Validate the file dowanload by intercepting the browser's `download` event rather than waiting for an OS dialog.
- To verify file name we use `download.suggestedFilename()` method

## Methods present on `dowanload` event

- saveAs(path)
- suggestedFilename()
- cancel()
- failure()

```js
import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test("Validate file download lifecycle", async ({ page }) => {
  // 1. Set up the listener before triggering the download
  const downloadPromise = page.waitForEvent("download");

  // 2. Click the element that initiates the download
  await page.locator("#download-invoice-btn").click();

  // 3. Wait for the download process to complete
  const download = await downloadPromise;

  // 4. Validate the suggested filename
  const fileName = download.suggestedFilename();
  expect(fileName).toBe("invoice_2026.pdf");

  // 5. Save the file to a permanent local directory
  const savePath = path.join(__dirname, "../downloads/", fileName);
  await download.saveAs(savePath);

  // 6. Verify the file actually exists on the hard drive
  expect(fs.existsSync(savePath)).toBeTruthy();
});
```

## Critical Interview Points to Highlight

- Why page.waitForEvent('download') must come first => else we could miss the download event
- Temporary vs. Permanent Storage => `download.saveAs(path)` to save downloaded file else browser will delete once it close
- Bypassing Large Downloads => we use`download.cancel()` method once file name is validated to reduce newtork bandwidth

## Interview Questions

Q1: What happens if a download fails due to a network drop? How do you catch that?

Answer:
You check for errors using the download.failure() method. If the download completes successfully, it returns null. If it fails, it returns a string describing the network or server error.

```js
const failureReason = await download.failure();
if (failureReason) {
  console.log(`Download failed because: ${failureReason}`);
}
```

Q2: How do you verify the internal text content of a downloaded PDF or CSV file?

Answer:
Playwright handles the browser mechanics, but checking the inside of files requires regular Node.js packages. Once saved via download.saveAs(), you use standard npm packages like csv-parse for CSV files or pdf-parse for PDFs to read the file contents directly from the hard drive and pass them to standard assertions.
