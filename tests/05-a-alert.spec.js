import { test, expect } from "@playwright/test";

test.describe("alert, confirm, prompt", () => {
  test("handle confirm alert", async ({ page }) => {
    await page.goto("/alerts");

    page.on("dialog", async (d) => {
      expect(d.type()).toContain("confirm");
      expect(d.message()).toContain("");
      d.accept();
    });

    await page.locator("#confirm-btn").click();

    await expect(page.locator("#confirm-result")).toHaveText(
      "Account deleted (you clicked OK).",
    );
  });

  test("confirm with cancel", async ({ page }) => {
    await page.goto("/alerts");

    page.once("dialog", async (d) => {
      console.log(await d.type());
      expect(d.type()).toBe("confirm");
      expect(d.message()).toBe(
        "Are you sure you want to delete your account? This cannot be undone.",
      );
      await d.dismiss();
    });

    await page.click("#confirm-btn");
    await expect(page.getByTestId("confirm-result")).toHaveText(
      "Deletion cancelled (you clicked Cancel).",
    );
  });

  test("handle prompt alert", async ({ page }) => {
    await page.goto("/alerts");
    page.on("dialog", async (d) => {
      console.log(d.type());
      const defVale = await d.defaultValue();
      console.log(`Default value is - ${defVale}`);
      expect(d.type()).toContain("prompt");
      expect(d.message()).toContain("What is your name?");
      await d.accept("Kundalik");
    });

    await page.click("#prompt-btn");

    await expect(page.locator("#prompt-result")).toHaveText(
      "Hello, Kundalik! Welcome aboard.",
    );
  });

  test("leave screen pop up", async ({ page }) => {
    await page.goto("/alerts");

    page.on("dialog", async (d) => {
      console.log(`type  is ${d.type()}`);
      //   const defVale = await d.defaultValue();
      //   console.log(`Default value is - ${defVale}`);
      await d.accept();
    });

    await page.getByPlaceholder("Type to make the page 'dirty'…").click();
    await page
      .locator("#draft-input")
      .pressSequentially("kundalik", { delay: 90 });
    await page.reload();
  });

  test("handle dialog html ", async ({ page }) => {
    await page.goto("/alerts");

    await page.getByText("Open Modal Dialog").click();
    await page.getByTestId("html-dialog-confirm").click();

    await expect(page.locator("#html-dialog-result")).toHaveText(
      'Dialog closed. returnValue = "confirm"',
    );
    await page.waitForTimeout(1200);
  });

  test("handle custome modal", async ({ page }) => {
    await page.goto("/alerts");

    await page.locator("#open-custom-modal").click();

    await expect(page.locator("div[role='dialog'] p")).toContainText(
      "This modal lives in the DOM. Try closing via the ✕, the Cancel button, clicking the dark overlay, or pressing",
    );
    //close modal

    // await page.getByTestId("custom-modal-close").click();
    // await page.keyboard.press("Escape");
    await page.getByTestId("custom-modal-confirm").click();

    // await expect(page.locator("#custom-modal-result")).toContainText("escape");
    await expect(page.locator("#custom-modal-result")).toContainText("confirm");
  });

  test("handle toast", async ({ page }) => {
    await page.goto("/alerts");
    await page.getByTestId("toast-success").click();
    await expect(page.getByTestId("toast")).toContainText(
      "Saved successfully!",
    );

    await page.getByTestId("toast-error").click({ delay: 3000 });
    await expect(page.getByTestId("toast")).toContainText(
      "Something went wrong.",
    );
  });
});
