import { test, expect, chromium } from "@playwright/test";

test.describe("handle windows and tab @tab @windows", () => {
  test("test01 open two different website tabs", async () => {
    // page handler
    const browser = await chromium.launch();
    const context = await browser.newContext();

    //creating new pages
    const page = await context.newPage();
    const page1 = await context.newPage();

    await page.goto("/tabs-windows/");
    await page1.goto("/tabs-windows/new-tab.html");

    const text = await page.locator("//h1").textContent();
    console.log(`page one text is - ${text}`);

    const text1 = await page1.locator("//h1").textContent();
    console.log(`Page two text is - ${text1}`);

    // Counting Number of pages
    const allPages = context.pages();
    const pages = allPages.length;

    console.log(`Number of pages - ${pages}`);

    await page.waitForTimeout(1500);
    await page1.waitForTimeout(1500);
  });

  test("test 02 handle new tab using pagePromise", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/tabs-windows/");

    // Start waiting for the new page BEFORE the click that triggers it
    const pagePromise = context.waitForEvent("page");

    await page
      .getByRole("link", { name: "Open product details in a new tab" })
      .click();

    const newPage = await pagePromise;
    await newPage.waitForLoadState();

    const pageHeading = await newPage.locator("//h1").textContent();
    console.log(`page headings - ${pageHeading}`);

    await browser.close();
  });

  test("test3 handle new page using Promise.all with page event", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/tabs-windows/");

    // Start waiting for the new page BEFORE the click that triggers it
    const link = page.getByRole("link", {
      name: "Open product details in a new tab",
    });

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      link.click(),
    ]);

    await newPage.waitForLoadState();

    const pageHeading = await newPage.locator("//h1").textContent();
    console.log(`page headings - ${pageHeading}`);

    await browser.close();
  });

  test("test4 handling new page using Promise.all with popup event", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/tabs-windows");

    const link = await page.locator("#btn-basic-popup");

    const [newTabs] = await Promise.all([
      page.waitForEvent("popup"),
      link.click(),
    ]);

    // Wait for new popup to open
    await newTabs.waitForLoadState();

    // Interact with second page popup
    const pageHeading = await newTabs.locator("//h1").textContent();
    const title = await newTabs.title();
    const url = await newTabs.url();

    console.log(
      `New tabs details are page heading - ${pageHeading}, title is ${title} and url is ${url}`,
    );

    //enter text into inputs
    await newTabs.locator("#popup-input").fill("kundalik popup details");
    await newTabs.click("#popup-submit-btn");

    await page.waitForTimeout(1500);

    await expect(newTabs.locator("#popup-result")).toContainText(
      'Submitted: "kundalik popup details"',
    );

    await newTabs.getByTestId("reply-input").fill("return reply");
    await newTabs.getByTestId("send-reply-btn").click();

    await newTabs.close();

    await page.waitForTimeout(1500);
  });
});
