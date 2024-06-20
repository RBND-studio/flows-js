import { expect, test } from "@playwright/test";

test("should show overlay without close on click by default", async ({ page }) => {
  await page.goto("/tooltip-overlay/tooltip-overlay.html");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-tooltip-overlay")).toBeVisible();
  await page.locator(".flows-tooltip-overlay-click-layer").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});

test("should close overlay on click", async ({ page }) => {
  await page.goto("/tooltip-overlay/tooltip-overlay.html?closeOnOverlayClick=true");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-tooltip-overlay")).toBeVisible();
  await page.locator(".flows-tooltip-overlay-click-layer").click();
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
});

test("should match screenshot", async ({ page }) => {
  await page.goto("/tooltip-overlay/tooltip-overlay.html");
  await expect(page).toHaveScreenshot({ scale: "css" });
});

test("should disable overlay click layer", async ({ page }) => {
  await page.goto("/tooltip-overlay/tooltip-overlay.html?disableOverlayClickLayer=true");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-tooltip-overlay-click-layer")).toBeHidden();
  const msgPromise = page.waitForEvent("console");
  await page.locator(".console-btn").click();
  const msg = await msgPromise;
  await expect(msg.text()).toBe("Hello!");
});
