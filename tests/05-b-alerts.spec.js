import { test, expect } from "@playwright/test";

const appUrl = "/alerts/02-hard-scenarios.html";

test.describe("alerts hard scenarios", () => {
  test("handle three alert in single time", async ({ page }) => {
    await page.goto("/alerts/02-hard-scenarios.html");

    page.on("dialog", async (d) => {
      console.log(`Dialog type is -: ${d.type()}`);
      if (d.type() === "alert") {
        expect(d.type()).toContain("alert");
        expect(d.message()).toContain("Step 1 of 3: Your cart is ready.");
        await d.accept();
      }

      if (d.type() === "confirm") {
        expect(d.type()).toContain("confirm");
        expect(d.message()).toContain("Step 2 of 3: Proceed to payment?");
        await d.accept();
        // await d.dismiss();
      }

      if (d.type() === "prompt") {
        expect(d.type()).toContain("prompt");
        expect(d.message()).toContain(
          "Step 3 of 3: Enter a coupon code (or leave blank):",
        );

        await d.accept("kundalik");
      }
    });
    await page.getByTestId("chain-dialogs").click();

    // await expect
    //   .soft(page.locator("#chain-result"))
    //   .toContainText("Checkout cancelled at payment step.");

    await expect(page.locator("#chain-result")).toContainText(
      'Order placed with coupon "kundalik".',
    );
  });

  test("handle new otp", async ({ page }) => {
    await page.goto(appUrl);

    page.once("dialog", async (d) => {
      expect(d.type()).toContain("prompt");
      const otpNum = d.message().match(/\d{6}/);
      console.log(`Otp number is ${otpNum}`);
      await d.accept(`${otpNum}`);
    });

    await page.getByTestId("otp-verify").click();
    await expect(page.getByTestId("otp-result")).toContainText("Verified!");
  });
});
