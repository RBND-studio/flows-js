import { expect, test } from "@playwright/test";

test("Should not continue if flow is not fully loaded", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj", async (route) => {
    const results = [
      {
        id: "flow",
        start: { location: "/" },
        steps: [{ title: "First", targetElement: ".target" }],
        _incompleteSteps: true,
      },
    ];
    await route.fulfill({ json: { results } });
  });
  await page.route("**/sdk/flows/flow?projectId=my-proj", (route) => route.abort());
  await page.goto("/async-flow/async-flow.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".flows-next").click();
  await expect(page.locator(".flows-tooltip")).toContainText("First");
});

test("Should continue if flow is fully loaded", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj", async (route) => {
    const results = [
      {
        id: "flow",
        start: { location: "/" },
        steps: [{ title: "First", targetElement: ".target" }],
        _incompleteSteps: true,
      },
    ];
    await route.fulfill({ json: { results } });
  });
  await page.route("**/sdk/flows/flow?projectId=my-proj", async (route) => {
    const json = {
      id: "flow",
      start: { location: "/" },
      steps: [
        { title: "First", targetElement: ".target" },
        { title: "Second", targetElement: ".target" },
      ],
    };
    await route.fulfill({ json });
  });
  await page.goto("/async-flow/async-flow.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".flows-next").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
