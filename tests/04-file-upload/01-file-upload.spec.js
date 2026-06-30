import { test, expect } from "@playwright/test";

test.describe("file upload @upload", () => {
  test("handle single file upload", async ({ page }) => {
    await page.goto("https://qaplayground.com/practice/file-upload");
    await page.locator("#file-upload").setInputFiles(["data/testing.md"]);

    await expect(page.locator("#file-path-display")).toContainText(
      "testing.md",
    );

    await page.waitForTimeout(2000);
  });

  test("handle single file upload 2", async ({ page }) => {
    await page.goto("https://demoqa.com/upload-download");
    await page.locator("#uploadFile").setInputFiles(["data/testing.md"]);

    await expect(page.locator("#uploadedFilePath")).toContainText(
      "C:\\fakepath\\testing.md",
    );

    await page.waitForTimeout(2000);
  });
  test("handle single file upload 3", async ({ page }) => {
    await page.goto("https://davidwalsh.name/demo/multiple-file-upload.php");
    await page
      .locator("#filesToUpload")
      .setInputFiles(["data/testing.md", "data/testing2.md"]);

    const listItems = await page.locator("#fileList li").all();

    for (const item of listItems) {
      console.log("file text value", await item.textContent());
    }

    const listItems2 = page.locator("#fileList li");
    await expect(listItems2).toHaveText(["testing.md", "testing2.md"]);

    const listItems3 = await page.locator("#fileList li").allTextContents();
    console.log(listItems3); // Output => ["testing.md","testing2.md"]

    await page.locator("#filesToUpload").setInputFiles([]);
    await page.waitForTimeout(1000);
  });
});
