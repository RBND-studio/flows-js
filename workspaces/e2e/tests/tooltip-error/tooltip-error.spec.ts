import { expect, test } from "@playwright/test";

test("Emits error event", async ({ page }) => {
  await page.goto("/tooltip-error/tooltip-error.html");
  await page.locator(".start-flow").click();
  await expect(page.locator("[data-type='tooltipError']")).toHaveCount(1);
  await expect(page.locator("[data-type='invalidateTooltipError']")).toHaveCount(0);
});

test("should not emit any error event if it gets invalidates quickly", async ({ page }) => {
  await page.goto("/tooltip-error/tooltip-error.html");
  await page.locator(".start-flow").click();
  await expect(page.locator("[data-type='tooltipError']")).toHaveCount(0);
  await page.locator(".add-target").click();
  await page.locator(".remove-target").click();
  await page.locator(".add-target").click();
  await expect(page.locator("[data-type='tooltipError']")).toHaveCount(0);
  await expect(page.locator("[data-type='invalidateTooltipError']")).toHaveCount(0);
});

test("should emit error and invalidate it if it gets invalidated after a while", async ({
  page,
}) => {
  await page.goto("/tooltip-error/tooltip-error.html");
  await page.locator(".start-flow").click();
  await expect(page.locator("[data-type='tooltipError']")).toHaveCount(1);
  await page.locator(".add-target").click();
  await expect(page.locator("[data-type='invalidateTooltipError']")).toHaveCount(1);
  await expect(page.locator("[data-type='invalidateTooltipError']")).toHaveAttribute(
    "data-reference-id",
    "0",
  );
});
