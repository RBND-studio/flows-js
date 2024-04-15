import { expect, test } from "@playwright/test";

test("Wait for click", async ({ page }) => {
  await page.goto("/wait/wait.html?click=true");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".target").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
test("Wait for click should work with nested elements", async ({ page }) => {
  await page.goto("/wait/wait.html?click=true");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".div-in-target").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});

test("Wait for input change", async ({ page }) => {
  await page.goto("/wait/wait.html?change=true");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Hello");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
test("Wait for multiple inputs to change", async ({ page }) => {
  await page.goto("/wait/wait.html?multipleChange=true");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Hello");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input2").fill("Hi");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input2").fill("Hi Mom!");
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
test("Wait for form submit", async ({ page }) => {
  await page.goto("/wait/wait.html?submit=true");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Hello");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input2").fill("Hi");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".submit").click();
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Input1");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input2").fill("Input2");
  await page.locator(".submit").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
test("Click with location", async ({ page }) => {
  await page.goto("/wait/wait.html?click=true&location=^/wrong.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".target").click();
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.goto("/wait/wait.html?click=true&location=/wait.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".target").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
test("Change with location", async ({ page }) => {
  await page.goto("/wait/wait.html?change=true&location=^/wrong.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Hello");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.goto("/wait/wait.html?change=true&location=/wait.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
test("Submit with location", async ({ page }) => {
  await page.goto("/wait/wait.html?submit=true&location=^/wrong.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Hello");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input2").fill("Hi");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".submit").click();
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.goto("/wait/wait.html?submit=true&location=/wait.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Input1");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input2").fill("Input2");
  await page.locator(".submit").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
test("Multiple waits should act as or", async ({ page }) => {
  await page.goto("/wait/wait.html?anotherWaitWithWrongLocation=true&change=true");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
