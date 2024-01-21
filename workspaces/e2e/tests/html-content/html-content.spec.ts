import { expect, test } from "@playwright/test";

test("HTML content in tooltip", async ({ page }) => {
  await page.goto("/html-content/html-content.html?tooltip=true");
  await expect(page.locator(".flows-tooltip .span-in-title")).toHaveText("span in title");
  await expect(page.locator(".flows-tooltip .span-in-body")).toHaveText("span in body");
});

test("HTML content in modal", async ({ page }) => {
  await page.goto("/html-content/html-content.html");
  await expect(page.locator(".flows-modal .span-in-title")).toHaveText("span in title");
  await expect(page.locator(".flows-modal .span-in-body")).toHaveText("span in body");
});
