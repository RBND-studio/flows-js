import { init, startFlow } from "@flows/js/core";

init({
  flows: [
    {
      id: "flow",
      steps: [
        {
          title: "First",
          targetElement: ".target",
        },
        {
          title: "Second",
          targetElement: ".target",
        },
      ],
    },
  ],
});

document.querySelector(".start-flow")?.addEventListener("click", () => {
  startFlow("flow");
});
