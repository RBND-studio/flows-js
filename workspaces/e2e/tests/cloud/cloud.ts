import { init } from "@flows/js";
import { invalidFlow, validFlow } from "./flow-mocks";

const validLocalFlow = new URLSearchParams(window.location.search).get("validLocalFlow") === "true";
const invalidLocalFlow =
  new URLSearchParams(window.location.search).get("invalidLocalFlow") === "true";

const flows = [];
if (validLocalFlow) flows.push(validFlow);
if (invalidLocalFlow) flows.push(invalidFlow);

init({
  // For testing purposes
  projectId: "6b44bfd5-0192-463f-9201-115a6016d8a5",
  customApiUrl: "https://api.stage.flows-cloud.com",

  // TODO: uncomment when the panel is ready
  // projectId: "my-proj",
  flows,
});
