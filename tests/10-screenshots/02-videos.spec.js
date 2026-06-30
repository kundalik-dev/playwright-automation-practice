import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

test.describe("Handling videos", () => {
  test("Test01 handling videos", async ({ page }, testInfo) => {
    // Arrange
    await page.goto("/01-iframes/01-iframe.html");

    // Act
    const videoFilePath = await page.video().path();
    console.log("video file path is ", videoFilePath);

    await page.context().close(); // video only finalizes after context closes

    const videoPath = await page.video()?.path();
    if (videoPath) {
      const destination = path.join("videos", `${testInfo.title}.webm`);
      fs.mkdirSync("videos", { recursive: true });
      fs.copyFileSync(videoPath, destination);
    }
  });

  test("Test02 get video captured path", async ({ page }, testInfo) => {
    // Arrange
    await page.goto("/01-iframes/01-iframe.html");

    // Act
    const frame = await page.frameLocator("#login-frame");
    await frame.locator("#username").fill("admin");
    await frame.locator("#password").fill("admin123");
    await frame.locator("#login-btn").click();

    // Assert
    await expect(frame.locator("#login-message")).toHaveText(
      "Logged in successfully!",
    );

    // Capture videos
    const videoPath = await page.video()?.path();
    console.log("video file path is ", videoPath);

    await page.context().close(); // video only finalizes after context closes

    if (videoPath) {
      const destination = path.join("videos", `${testInfo.title}.webm`);
      fs.mkdirSync("videos", { recursive: true });
      fs.copyFileSync(videoPath, destination);
    }
  });
});
