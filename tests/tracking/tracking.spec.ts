import { expect, test } from "@playwright/test";

test("Emits correct events", async ({ page }) => {
  await page.goto("/tracking/tracking.html");
  await page.locator(".start").click();
  await page.locator(".flows-continue").click();
  await page.locator(".flows-back").click();
  await page.locator(".flows-cancel").click();
  await page.locator(".start").click();
  await page.locator(".flows-continue").click();
  await page.locator(".flows-finish").click();
  await expect(page).toHaveScreenshot({ scale: "css" });
});
