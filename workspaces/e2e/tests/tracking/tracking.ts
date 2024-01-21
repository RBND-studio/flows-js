import { init } from "@flows/js";

void init({
  flows: [
    {
      id: "flow",
      element: ".start",
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
    p.innerText = JSON.stringify(e);
    document.querySelector(".log")?.appendChild(p);
  },
});
