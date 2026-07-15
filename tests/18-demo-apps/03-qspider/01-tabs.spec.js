import { test, expect, chromium } from "@playwright/test";

test.describe("handling window and tabs on qspider", () => {
  test("test01 handling tabs", async ({ page, context }) => {
    // Arrange
    await page.goto("https://demoapps.qspiders.com/ui/browser?sublist=0");

    // Act
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.locator("button").filter({ hasText: "view more" }).first().click(),
    ]);

    console.log(await page.title());
    console.log(await newPage.title());

    // To know how many pages are present
    const allPages = await context.pages();
    console.log(`Number of pages are - ${allPages.length}`);

    // Assert
    await expect(
      newPage.getByRole("heading", { level: 1, name: "Luxury Watch" }),
    ).toHaveText("Luxury Watch");
  });
});
