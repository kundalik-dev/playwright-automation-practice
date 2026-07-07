import { test, expect } from "@playwright/test";

test.describe("Handling Date Pickers", () => {
  test("Test01 handle date picker", async ({ page }) => {
    // Arrange
    await page.goto("/10-datepickers/");

    const myDate = "1996-05-20";

    // Act
    await page.getByRole("textbox", { name: "Date of Birth" }).fill(myDate);
    await page.getByTestId("appointment-input").fill(myDate);
    await page
      .getByRole("button", {
        name: "Read Dates",
      })
      .click();
    const actualDatesText = await page.getByTestId("native-date-output");

    await expect(actualDatesText).toHaveText(
      `DOB: ${myDate} | Appointment: ${myDate}`,
    );

    // Assert
    await page.waitForTimeout(1500);
  });

  test("test 02 date picker max min validations", async ({ page }) => {
    // Arrange
    await page.goto("/10-datepickers/");

    const minDate = "2026-05-20";
    const maxDate = "2026-09-20";

    // Act
    // Min Date
    await page.getByTestId("future-date-input").fill(minDate);
    await expect(page.getByTestId("constraint-output")).toHaveText(
      `Future Date: ${minDate}`,
    );

    //max date
    await page.getByTestId("past-date-input").fill(maxDate);
    await expect(page.getByTestId("constraint-output")).toHaveText(
      `Past Date: ${maxDate}`,
    );

    await page.waitForTimeout(1500);
  });

  test("test 03 validate future dates only accepted", async ({ page }) => {
    // Arrange
    await page.goto("/10-datepickers");

    const todayStr = new Date().toISOString().split("T")[0];
    const futureDate = "2026-09-13";

    // Act
    const futureDateInput = page.locator("#future-date");
    await futureDateInput.fill(futureDate);

    // Assert min date attribute is set to todays date
    await expect(page.getByTestId("future-date-input")).toHaveAttribute(
      "min",
      todayStr,
    );

    // evaluate
    const isUnderflowed = await futureDateInput.evaluate(
      (el) => el.validity.rangeUnderflow,
    );
    expect(isUnderflowed).toBe(false);

    const isValid = await futureDateInput.evaluate((el) => el.validity.valid);
    expect(isValid).toBe(true);
    // Assert
  });

  test("test03 only past dates are accepted", async ({ page }) => {
    // Arrange
    await page.goto("/10-datepickers");

    const pastDate = "2025-03-23";
    const todayStr = new Date().toISOString().split("T")[0];

    // Act
    const pastDateInput = page.getByTestId("past-date-input");
    await expect(pastDateInput).toHaveAttribute("max", todayStr);

    await pastDateInput.fill(pastDate);

    const isOverFlow = await pastDateInput.evaluate(
      (el) => el.validity.rangeOverflow,
    );
    expect(isOverFlow).toBe(false);

    const isValid = await pastDateInput.evaluate((el) => el.validity.valid);
    expect(isValid).toBe(true);

    // Assert
    await page.waitForTimeout(1500);
  });
});
