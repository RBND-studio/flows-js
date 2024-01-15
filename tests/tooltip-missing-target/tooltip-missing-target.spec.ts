import { expect, test } from "@playwright/test";

test("Shows tooltip", async ({ page }) => {
  await page.goto("/tooltip-missing-target/tooltip-missing-target.html");
  await page.click(".add-target");
  await page.click(".start-flow");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});

test("Doesn't show tooltip without target", async ({ page }) => {
  await page.goto("/tooltip-missing-target/tooltip-missing-target.html");
  await page.click(".start-flow");
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
});

test("Shows tooltip after target is added", async ({ page }) => {
  await page.goto("/tooltip-missing-target/tooltip-missing-target.html");
  await page.click(".start-flow");
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
  await page.click(".add-target");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});

test("Doesn't show tooltip after target is removed", async ({ page }) => {
  await page.goto("/tooltip-missing-target/tooltip-missing-target.html");
  await page.click(".add-target");
  await page.click(".start-flow");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.click(".remove-target");
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
});

test("Shows tooltip after target is readded", async ({ page }) => {
  await page.goto("/tooltip-missing-target/tooltip-missing-target.html");
  await page.click(".add-target");
  await page.click(".start-flow");
  await page.click(".remove-target");
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
  await page.click(".add-target");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});

test("Doesn't show tooltip after location change", async ({ page }) => {
  await page.goto("/tooltip-missing-target/tooltip-missing-target.html");
  await page.click(".add-target");
  await page.click(".start-flow");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.click(".change-location");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.click(".remove-target");
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
  await page.click(".change-location");
  await page.waitForTimeout(50);
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
  await page.click(".add-target");
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
});
