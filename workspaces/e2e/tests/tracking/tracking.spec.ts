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
  const logs = page.locator(".log-item");
  await expect(logs.nth(0)).toHaveAttribute("data-type", "startFlow");
  await expect(logs.nth(1)).toHaveAttribute("data-type", "nextStep");
  await expect(logs.nth(2)).toHaveAttribute("data-type", "prevStep");
  await expect(logs.nth(3)).toHaveAttribute("data-type", "cancelFlow");
  await expect(logs.nth(4)).toHaveAttribute("data-type", "startFlow");
  await expect(logs.nth(5)).toHaveAttribute("data-type", "nextStep");
  await expect(logs.nth(6)).toHaveAttribute("data-type", "finishFlow");
});
