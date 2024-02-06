import { expect, test } from "@playwright/test";

test("should show up only once by default", async ({ page }) => {
  await page.goto("/frequency/frequency.html");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.locator(".flows-finish").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
});
test("should show up only once with frequency once", async ({ page }) => {
  await page.goto("/frequency/frequency.html?frequency=once");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.locator(".flows-finish").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
});
test("should show up multiple times when frequency is every time", async ({ page }) => {
  await page.goto("/frequency/frequency.html?frequency=every-time");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.locator(".flows-finish").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("should show up again when page is reloaded", async ({ page }) => {
  await page.goto("/frequency/frequency.html");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.locator(".flows-finish").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.reload();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("should not show up again when seenFlows are saved to localStorage", async ({ page }) => {
  await page.goto("/frequency/frequency.html?saveSeenFlows=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.locator(".flows-finish").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.reload();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
});
