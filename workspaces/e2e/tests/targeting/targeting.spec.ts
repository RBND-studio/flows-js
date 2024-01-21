import { expect, test } from "@playwright/test";

test("Shouldn't show up when used doesn't match", async ({ page }) => {
  await page.goto("/targeting/targeting.html");
  await expect(page.locator(".flows-modal")).not.toBeVisible();
});

test("Should show up when used matches", async ({ page }) => {
  await page.goto("/targeting/targeting.html?john=true");
  await expect(page.locator(".flows-modal")).toBeVisible();
});
