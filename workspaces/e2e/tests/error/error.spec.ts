import { expect, test } from "@playwright/test";

test("Emits error event", async ({ page }) => {
  await page.goto("/error/error.html");
  await page.locator(".start-flow").click();
  await expect(page.locator("[data-type='tooltipError']")).toHaveCount(1);
  await expect(page.locator("[data-type='invalidateTooltipError']")).toHaveCount(0);
});

test("should invalidate error without issues", async ({ page }) => {
  await page.goto("/error/error.html");
  await page.locator(".start-flow").click();
  await expect(page.locator("[data-type='tooltipError']")).toHaveCount(1);
  await page.locator(".add-target").click();
  await page.locator(".remove-target").click();
  await page.locator(".add-target").click();
  await expect(page.locator("[data-type='tooltipError']")).toHaveCount(1);
  await expect(page.locator("[data-type='invalidateTooltipError']")).toHaveAttribute(
    "data-reference-id",
    "0",
  );
  await expect(page.locator("[data-type='invalidateTooltipError']")).toHaveCount(1);
});
