import { endFlow, init } from "@flows/js/core";

const endOnPrev = new URLSearchParams(location.search).get("endOnPrev") === "true";

void init({
  flows: [
    {
      id: "flow",
      start: { clickElement: ".start" },
      frequency: "every-time",
      steps: [
        {
          title: "Step 1",
        },
        {
          title: "Step 2",
        },
      ],
    },
  ],
  tracking: (e) => {
    const p = document.createElement("p");
    p.classList.add("log-item");
    p.dataset.type = e.type;
    p.innerText = JSON.stringify(e);
    document.querySelector(".log")?.appendChild(p);
  },
  onFlowUpdate: (flow) => {
    if (endOnPrev && flow.eventType === "prevStep") {
      endFlow(flow.flowId);
    }
  },
});
