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
  await expect(page.locator(".flows-continue")).toBeVisible();
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-continue")).not.toBeVisible();
  await expect(page.locator(".flows-finish")).toBeVisible();
});
test("Hides next", async ({ page }) => {
  await page.goto("/buttons/buttons.html?hideNext=true");
  await expect(page.locator(".flows-continue")).not.toBeVisible();
});

test("Prev is visible", async ({ page }) => {
  await page.goto("/buttons/buttons.html");
  await expect(page.locator(".flows-back")).not.toBeVisible();
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-back")).toBeVisible();
});
test("Hides prev", async ({ page }) => {
  await page.goto("/buttons/buttons.html?hidePrev=true");
  await expect(page.locator(".flows-back")).not.toBeVisible();
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-back")).not.toBeVisible();
});

test("Default next text", async ({ page }) => {
  await page.goto("/buttons/buttons.html");
  await expect(page.locator(".flows-continue")).toHaveText("Continue");
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-finish")).toHaveText("Finish");
});
test("Custom next text", async ({ page }) => {
  await page.goto("/buttons/buttons.html?nextText=Next");
  await expect(page.locator(".flows-continue")).toHaveText("Next");
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-finish")).toHaveText("Next");
});

test("Default prev text", async ({ page }) => {
  await page.goto("/buttons/buttons.html");
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-back")).toHaveText("Back");
});
test("Custom prev text", async ({ page }) => {
  await page.goto("/buttons/buttons.html?prevText=Previous");
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-back")).toHaveText("Previous");
});

test("Custom link", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customLink=true&hideNext=true");
  await expect(page.locator(".flows-option")).toHaveCount(3);
  const firstLink = page.locator(".flows-option").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("Google");
  await expect(firstLink).toHaveAttribute("href", "https://google.com");
  await expect(firstLink).not.toHaveAttribute("target", "_blank");
});
test("Custom external link", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customExternalLink=true&hideNext=true");
  await expect(page.locator(".flows-option")).toHaveCount(3);
  const firstLink = page.locator(".flows-option").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("Google");
  await expect(firstLink).toHaveAttribute("href", "https://google.com");
  await expect(firstLink).toHaveAttribute("target", "_blank");
});
test("Custom action", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customAction=true&hideNext=true");
  await expect(page.locator(".flows-option")).toHaveCount(3);
  const firstLink = page.locator(".flows-option").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("Action");
  await expect(firstLink).toHaveAttribute("data-action", "0");
  await expect(firstLink).not.toHaveAttribute("href");
  await expect(firstLink).not.toHaveAttribute("target");
});
test("Custom next", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customNext=true&hideNext=true");
  await expect(page.locator(".flows-continue")).toHaveCount(3);
  const firstLink = page.locator(".flows-continue").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("My Next");
  await expect(firstLink).not.toHaveAttribute("href");
  await expect(firstLink).not.toHaveAttribute("target");
});
// TODO: discuss if prev button should be visible when there is no previous step
test("Custom prev", async ({ page }) => {
  await page.goto("/buttons/buttons.html?customPrev=true&hideNext=true");
  await expect(page.locator(".flows-back")).toHaveCount(3);
  const firstLink = page.locator(".flows-back").first();
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveText("My Prev");
  await expect(firstLink).not.toHaveAttribute("href");
  await expect(firstLink).not.toHaveAttribute("target");
});
