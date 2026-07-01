import { test, expect } from "@playwright/test";

test.describe("handling dropdowns", () => {
  test("Test01 Handling first dropdown", async ({ page }) => {
    // Arrange
    await page.goto("/dropdowns/");

    await page.waitForTimeout(800);

    // Act
    // By Visible text
    await page.getByTestId("country-select").selectOption("United Kingdom");
    // await page.waitForTimeout(800);

    // By Value
    await page.getByTestId("country-select").selectOption({ value: "in" });
    // await page.waitForTimeout(800);

    // By Label
    await page.getByTestId("country-select").selectOption({ label: "Germany" });
    // await page.waitForTimeout(800);

    // By Index
    await page.getByTestId("country-select").selectOption({ index: 5 });

    // Check number of options in dropdown
    const options = await page.locator("#country option");
    await expect(options).toHaveCount(6);

    // Get all options in form of array
    const allOptions = await page.$$("#country option");
    await expect(allOptions.length).toBe(6);

    // printing all options
    // for (const opt of allOptions) {
    //   console.log("all options are", await opt.textContent());
    // }

    //printing all options except at 0 index
    for (let i = 1; i < allOptions.length; i++) {
      console.log(await allOptions[i].textContent());
    }

    // check japan is selected
    await expect(page.locator("#country")).toHaveValue("jp");

    const currentSelectedVal = await page.locator("#country").inputValue();
    console.log("current selected", currentSelectedVal);

    // Presence option in dropdown
    const opts = await page.locator("#country").textContent();
    await expect(opts.includes("Japan")).toBeTruthy();

    await page.waitForTimeout(2000);
    // Assert
  });

  test("Test02 Multi select dropdown", async ({ page }) => {
    // Arrange
    await page.goto("/dropdowns");

    // Act
    await page.locator("#skills").selectOption(["JavaScript", "Python"]);
    await page.getByRole("button", { name: "Show selected skills" }).click();
    await expect(page.getByTestId("native-multi-output")).toHaveText(
      "Selected (2): JavaScript, Python",
    );
    await page.waitForTimeout(800);

    //remove selected options
    await page.locator("#skills").selectOption([]);
    await page.waitForTimeout(800);

    await page.locator("#skills").selectOption(["TypeScript", "C#"]);
    await page.getByRole("button", { name: "Show selected skills" }).click();
    await expect(page.getByTestId("native-multi-output")).toHaveText(
      "Selected (2): TypeScript, C#",
    );

    // Assert
    await page.waitForTimeout(2000);
  });
});
