import { test, expect } from "@playwright/test";

test.describe("handle dialog", () => {
  test.skip("handle simple alert", async ({ page }) => {
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

  test.skip("handle two alert", async ({ page }) => {
    await page.goto("/alerts/");

    const simpleDialog = page.waitForEvent("dialog");
    // await page.locator("#simple-alert-btn").click();
    page.locator("#simple-alert-btn").click();
    const dialog = await simpleDialog;
    await dialog.accept();
  });

  test.skip("handling two simple alerts inside one test", async ({ page }) => {
    await page.goto("/alerts");
    page.once("dialog", (dialog) => {
      expect(dialog.type()).toContain("alert");
      expect(dialog.message()).toContain("Hello! This is a simple alert.");
      console.log(
        `alert type is - ${dialog.type()} and alert message is - ${dialog.message()}`,
      );
      dialog.accept();
    });

    await page.click("#simple-alert-btn");

    page.once("dialog", (d) => {
      expect(d.type()).toContain("alert");
      expect(d.message()).toContain("Delayed alert after 1.5s");
      page.waitForTimeout(2000);
      console.log(
        `alert type is - ${d.type()} and alert message is - ${d.message()}`,
      );
      d.accept();
    });

    await page.click("#delayed-alert-btn");
  });

  test.skip("handlings", async ({ page }) => {
    await page.goto("/alerts");

    // First alert
    const dialog1Promise = page.waitForEvent("dialog");
    page.click("#simple-alert-btn");
    const dialog1 = await dialog1Promise;
    expect(dialog1.type()).toContain("alert");
    expect(dialog1.message()).toContain("Hello! This is a simple alert.");
    await dialog1.accept();

    // Delayed alert — waitForEvent waits up to the timeout for the dialog to appear
    const dialog2Promise = page.waitForEvent("dialog");
    page.click("#delayed-alert-btn");
    const dialog2 = await dialog2Promise; // resolves after 1.5s when dialog fires
    expect(dialog2.type()).toContain("alert");
    expect(dialog2.message()).toContain("Delayed alert after 1.5s");
    await dialog2.accept();
  });

  test.skip("handling 3 two simple alerts inside one test", async ({
    page,
  }) => {
    await page.goto("/alerts");

    // First alert - immediate, click and listen concurrently
    const [dialog1] = await Promise.all([
      page.waitForEvent("dialog"),
      page.click("#simple-alert-btn"),
    ]);
    expect(dialog1.type()).toContain("alert");
    expect(dialog1.message()).toContain("Hello! This is a simple alert.");
    await dialog1.accept();

    // Delayed alert - same pattern, waitForEvent waits up to timeout
    const [dialog2] = await Promise.all([
      page.waitForEvent("dialog"),
      page.click("#delayed-alert-btn"),
    ]);
    expect(dialog2.type()).toContain("alert");
    expect(dialog2.message()).toContain("Delayed alert after 1.5s");
    await dialog2.accept();
  });

  test.only("handling 4 two simple alerts inside one test", async ({
    page,
  }) => {
    await page.goto("/alerts");

    // --- First Alert ---
    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toContain("alert");
      expect(dialog.message()).toContain("Hello! This is a simple alert.");
      console.log(
        `First alert type: ${dialog.type()} | message: ${dialog.message()}`,
      );
      await dialog.accept();
    });

    await page.click("#simple-alert-btn");

    // --- Second Delayed Alert ---
    // 1. Register the listener FIRST. It will wait actively for the dialog to appear.
    page.once("dialog", async (d) => {
      expect(d.type()).toContain("alert");
      expect(d.message()).toContain("Delayed alert after 1.5s");
      console.log(`Second alert type: ${d.type()} | message: ${d.message()}`);
      await d.accept(); // Properly awaited
    });

    // 2. Trigger the action that starts the 1.5s delay timer
    await page.click("#delayed-alert-btn");

    // 3. Pause the test execution here to let the 1.5s finish and dialog clear
    await page.waitForTimeout(2000);
  });
});
