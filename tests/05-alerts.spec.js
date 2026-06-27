import { test, expect } from "@playwright/test";

test.describe("handle dialog", () => {
  test("handle simple alert", async ({ page }) => {
    await page.goto("/alerts/");

    page.on("dialog", async (dialog) => {
      const t = await dialog.type();
      console.log("alert type is ", t);
      const m = await dialog.message();
      console.log("m message is", m);
      await dialog.page();

      //delay alert
      const mm = await dialog.message();
      console.log("mm is", mm);
      await dialog.accept();
    });

    await page.getByRole("button", { name: "Show Simple Alert" }).click();

    await page.getByTestId("delayed-alert").click();

    await page.waitForTimeout(2500);
  });

  test("handle two alert", async ({ page }) => {
    await page.goto("/alerts/");

    const simpleDialog = page.waitForEvent("dialog");

    await page.locator("#simple-alert-btn").click();
    const dialog = await simpleDialog;
    await dialog.accept();
  });

  test("", async ({ page }) => {
    await page.goto("/alerts");
  });
});
