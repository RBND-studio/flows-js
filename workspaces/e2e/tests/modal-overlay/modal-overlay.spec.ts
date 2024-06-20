import { expect, test } from "@playwright/test";

test("should show overlay without close on click by default", async ({ page }) => {
  await page.goto("/modal-overlay/modal-overlay.html");
  await expect(page.locator(".flows-modal")).toBeVisible();
  await page.locator(".flows-modal-overlay").click({ position: { x: 100, y: 100 } });
  await expect(page.locator(".flows-modal")).toBeVisible();
});

test("should close overlay on click", async ({ page }) => {
  await page.goto("/modal-overlay/modal-overlay.html?closeOnOverlayClick=true");
  await expect(page.locator(".flows-modal")).toBeVisible();
  await page.locator(".flows-modal-overlay").click({ position: { x: 100, y: 100 } });
  await expect(page.locator(".flows-modal")).toBeHidden();
});

test("should hide overlay", async ({ page }) => {
  await page.goto("/modal-overlay/modal-overlay.html?hideOverlay=true");
  await expect(page.locator(".flows-modal")).toBeVisible();
  await expect(page.locator(".flows-modal-overlay")).toBeHidden();
});

test("should disable overlay click layer", async ({ page }) => {
  await page.goto("/modal-overlay/modal-overlay.html?disableOverlayClickLayer=true");
  await expect(page.locator(".flows-modal")).toBeVisible();
  const msgPromise = page.waitForEvent("console");
  await page.locator(".console-btn").click();
  const msg = await msgPromise;
  await expect(msg.text()).toBe("Hello!");
});
