import { expect, test } from "@playwright/test";

test("Shouldn't show up when used doesn't match", async ({ page }) => {
  await page.goto("/targeting/targeting.html");
  await expect(page.locator(".flows-modal")).not.toBeVisible();
});

test("Should show up when used matches", async ({ page }) => {
  await page.goto("/targeting/targeting.html?john=true");
  await expect(page.locator(".flows-modal")).toBeVisible();
});

test("Should not show up with wrong location", async ({ page }) => {
  await page.goto("/targeting/targeting.html?john=true&location=^/wrong.html");
  await expect(page.locator(".flows-modal")).not.toBeVisible();
});

test("Should show up only after clicking the element", async ({ page }) => {
  await page.goto("/targeting/targeting.html?clickElement=true&john=true");
  await expect(page.locator(".flows-modal")).not.toBeVisible();
  await page.click(".click-to-start");
  await expect(page.locator(".flows-modal")).toBeVisible();
});
