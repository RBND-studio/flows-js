import { expect, test } from "@playwright/test";

test("Start by element", async ({ page }) => {
  await page.goto("/wait/wait.html?element=true&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".add-element").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("Start by click", async ({ page }) => {
  await page.goto("/wait/wait.html?click=true&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".target").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("Start by click with nested elements", async ({ page }) => {
  await page.goto("/wait/wait.html?click=true&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".div-in-target").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("start by click with duplicate target", async ({ page }) => {
  await page.goto("/wait/wait.html?click=true&duplicateTarget=true&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".target").nth(1).click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("start by click with duplicate target and nested elements", async ({ page }) => {
  await page.goto("/wait/wait.html?click=true&waitForStart=true&duplicateTarget=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".div-in-target").nth(1).click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("Start by input change", async ({ page }) => {
  await page.goto("/wait/wait.html?change=true&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Hello");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("Start by multiple inputs change", async ({ page }) => {
  await page.goto("/wait/wait.html?multipleChange=true&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Hello");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input2").fill("Hi");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input2").fill("Hi Mom!");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("Start by form submit", async ({ page }) => {
  await page.goto("/wait/wait.html?submit=true&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Hello");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input2").fill("Hi");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".submit").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Input1");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input2").fill("Input2");
  await page.locator(".submit").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("Start by element with location", async ({ page }) => {
  await page.goto("/wait/wait.html?element=true&location=^/wrong.html&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".add-element").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.goto("/wait/wait.html?element=true&location=/wait.html&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".add-element").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("Start by click and location", async ({ page }) => {
  await page.goto("/wait/wait.html?click=true&location=^/wrong.html&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".target").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.goto("/wait/wait.html?click=true&location=/wait.html&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".target").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("Start by change with location", async ({ page }) => {
  await page.goto("/wait/wait.html?change=true&location=^/wrong.html&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.goto("/wait/wait.html?change=true&location=/wait.html&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("Start by submit with location", async ({ page }) => {
  await page.goto("/wait/wait.html?submit=true&location=^/wrong.html&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Hello");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input2").fill("Hi");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".submit").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.goto("/wait/wait.html?submit=true&location=/wait.html&waitForStart=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Input1");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input2").fill("Input2");
  await page.locator(".submit").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
test("Start multiple options should act as or", async ({ page }) => {
  await page.goto(
    "/wait/wait.html?anotherWaitWithWrongLocation=true&change=true&waitForStart=true",
  );
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});

test("Wait for element", async ({ page }) => {
  await page.goto("/wait/wait.html?element=true");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".add-element").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
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
test("Element with location", async ({ page }) => {
  await page.goto("/wait/wait.html?element=true&location=^/wrong.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".add-element").click();
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.goto("/wait/wait.html?element=true&location=/wait.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".add-element").click();
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
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.goto("/wait/wait.html?change=true&location=/wait.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Hello World");
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
test("Submit with location", async ({ page }) => {
  await page.goto("/wait/wait.html?submit=true&location=^/wrong.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input").fill("Input1");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".input2").fill("Input2");
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
