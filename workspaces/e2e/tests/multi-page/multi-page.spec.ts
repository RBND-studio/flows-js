import { expect, test } from "@playwright/test";

test("Resumes flow when page is reopened within the same session", async ({ page }) => {
  await page.goto("/multi-page/multi-page.html");
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
  await page.click(".start-flow");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.click(".flows-next");
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
  await page.goto("/");
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
  await page.goto("/multi-page/multi-page.html");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});

test("Doesn't resume flow when a new session is started", async ({ page, browser }) => {
  const url = "/multi-page/multi-page.html";
  await page.goto(url);
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
  await page.click(".start-flow");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.click(".flows-next");
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
  const context = await browser.newContext();
  const newPage = await context.newPage();
  await newPage.goto(url);
  await newPage.goto(url);
  await expect(newPage.locator(".flows-tooltip")).not.toBeVisible();
});
