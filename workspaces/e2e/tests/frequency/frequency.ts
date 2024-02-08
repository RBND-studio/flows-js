import { Flow, FlowsOptions, init } from "@flows/js/core";

const frequency = new URLSearchParams(window.location.search).get("frequency") as Flow["frequency"];
const saveSeenFlows = new URLSearchParams(window.location.search).get("saveSeenFlows") === "true";

const flow: Flow = {
  clickElement: ".start-flow",
  id: "flow",

  steps: [
    {
      targetElement: ".target",
      title: "Hello",
    },
  ],
};
if (frequency) flow.frequency = frequency as Flow["frequency"];

const options: FlowsOptions = {
  flows: [flow],
};

if (saveSeenFlows) {
  options.seenFlows = JSON.parse(localStorage.getItem("flows-seen-flows") ?? "[]");
  options.onSeenFlowsChange = (seenFlows) =>
    localStorage.setItem("flows-seen-flows", JSON.stringify(seenFlows));
}

init(options);
