import { init, resetAllFlows, resetFlow } from "@flows/js";
import { invalidFlow, validFlow } from "./flow-mocks";

const validLocalFlow = new URLSearchParams(window.location.search).get("validLocalFlow") === "true";
const invalidLocalFlow =
  new URLSearchParams(window.location.search).get("invalidLocalFlow") === "true";

const flows = [];
if (validLocalFlow) flows.push(validFlow);
if (invalidLocalFlow) flows.push(invalidFlow);

init({
  projectId: "my-proj",
  userId: "user-123",
  flows,
});

document.querySelector(".reset-all")?.addEventListener("click", () => {
  resetAllFlows();
});

document.querySelector(".reset-my-flow")?.addEventListener("click", () => {
  resetFlow("my-flow");
});
