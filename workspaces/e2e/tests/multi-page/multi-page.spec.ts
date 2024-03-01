import { expect, test } from "@playwright/test";

test("Resumes flow when page is reopened", async ({ page }) => {
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

test("Doesn't resume flow when page is reopened after timeout", async ({ page }) => {
  await page.goto("/multi-page/multi-page.html");
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
  await page.click(".start-flow");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.click(".flows-next");
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
  await page.evaluate(() =>
    localStorage.setItem(
      "flows.state",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("flows.state")!),
        expiresAt: new Date(),
      }),
    ),
  );
  await page.goto("/");
  await page.goto("/multi-page/multi-page.html");
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
});
