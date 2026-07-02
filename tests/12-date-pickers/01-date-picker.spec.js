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
});
