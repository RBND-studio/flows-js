import { Flow, FlowsOptions, init } from "@flows/js/core";

const frequency = new URLSearchParams(window.location.search).get("frequency") as Flow["frequency"];

const flow: Flow = {
  start: { clickElement: ".start-flow" },
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

init(options);
