import { init, startFlow } from "@flows/js";

init({
  flows: [
    {
      id: "flow",
      steps: [
        {
          title: "First",
          element: ".target",
        },
        {
          title: "Second",
          element: ".target",
        },
      ],
    },
  ],
});

document.querySelector(".start-flow")?.addEventListener("click", () => {
  startFlow("flow");
});
