import { expect, test } from "@playwright/test";

test("Close is visible", async ({ page }) => {
  await page.goto("/buttons/buttons.html");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-cancel")).toBeVisible();
});
test("Hides close", async ({ page }) => {
  await page.goto("/buttons/buttons.html?hideClose=true");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-cancel")).not.toBeVisible();
});

test("Next is visible", async ({ page }) => {
  await page.goto("/buttons/buttons.html");
  await expect(page.locator(".flows-next")).toBeVisible();
  await page.locator(".flows-next").click();
  await expect(page.locator(".flows-next")).not.toBeVisible();
  await expect(page.locator(".flows-finish")).toBeVisible();
});
test("Hides next", async ({ page }) => {
  await page.goto("/buttons/buttons.html?hideNext=true");
  await expect(page.locator(".flows-next")).not.toBeVisible();
});

test("Prev is visible", async ({ page }) => {
  await page.goto("/buttons/buttons.html");
  await expect(page.locator(".flows-prev")).not.toBeVisible();
  await page.locator(".flows-next").click();
  await expect(page.locator(".flows-prev")).toBeVisible();
});
test("Hides prev", async ({ page }) => {
  await page.goto("/buttons/buttons.html?hidePrev=true");
  await expect(page.locator(".flows-prev")).not.toBeVisible();
  await page.locator(".flows-next").click();
  await expect(page.locator(".flows-prev")).not.toBeVisible();
});

test("Default next text", async ({ page }) => {
  await page.goto("/buttons/buttons.html");
  await expect(page.locator(".flows-next")).toHaveText("Continue");
  await page.locator(".flows-next").click();
  await expect(page.locator(".flows-finish")).toHaveText("Finish");
});
test("Custom next text", async ({ page }) => {
  await page.goto("/buttons/buttons.html?nextLabel=Next");
  await expect(page.locator(".flows-next")).toHaveText("Next");
  await page.locator(".flows-next").click();
  await expect(page.locator(".flows-finish")).toHaveText("Next");
});

test("Default prev text", async ({ page }) => {
  await page.goto("/buttons/buttons.html");
  await page.locator(".flows-next").click();
  await expect(page.locator(".flows-prev")).toHaveText("Back");
});
test("Custom prev text", async ({ page }) => {
  await page.goto("/buttons/buttons.html?prevLabel=Previous");
  await page.locator(".flows-next").click();
  await expect(page.locator(".flows-prev")).toHaveText("Previous");
});

test("Custom link", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customLink=true&hideNext=true");
  await expect(page.locator("a.flows-primary-btn")).toHaveCount(3);
  const firstLink = page.locator("a.flows-primary-btn").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("Google");
  await expect(firstLink).toHaveAttribute("href", "https://google.com");
  await expect(firstLink).not.toHaveAttribute("target", "_blank");
});
test("Custom external link", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customExternalLink=true&hideNext=true");
  await expect(page.locator("a.flows-primary-btn")).toHaveCount(3);
  const firstLink = page.locator("a.flows-primary-btn").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("Google");
  await expect(firstLink).toHaveAttribute("href", "https://google.com");
  await expect(firstLink).toHaveAttribute("target", "_blank");
});
test("Custom action", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customAction=true&hideNext=true");
  await expect(page.locator(".flows-action")).toHaveCount(3);
  const firstLink = page.locator(".flows-action").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("Action");
  await expect(firstLink).toHaveAttribute("data-action", "0");
  await expect(firstLink).not.toHaveAttribute("href");
  await expect(firstLink).not.toHaveAttribute("target");
});
test("Custom next", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customNext=true&hideNext=true");
  await expect(page.locator(".flows-next")).toHaveCount(3);
  const firstLink = page.locator(".flows-next").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("My Next");
  await expect(firstLink).not.toHaveAttribute("href");
  await expect(firstLink).not.toHaveAttribute("target");
});
test("Custom prev", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customPrev=true&hideNext=true");
  await expect(page.locator(".flows-prev")).toHaveCount(3);
  const firstLink = page.locator(".flows-prev").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("My Prev");
  await expect(firstLink).not.toHaveAttribute("href");
  await expect(firstLink).not.toHaveAttribute("target");
});
test("Custom cancel", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customCancel=true&hideNext=true&hideClose=true");
  await expect(page.locator(".flows-cancel")).toHaveCount(3);
  const firstLink = page.locator(".flows-cancel").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("My Cancel");
  await expect(firstLink).not.toHaveAttribute("href");
  await expect(firstLink).not.toHaveAttribute("target");
  await firstLink.click();
  await expect(page.locator(".flows-tooltip")).not.toBeVisible();
});
