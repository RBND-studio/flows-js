import { init } from "@flows/js";

void init({
  flows: [
    {
      id: "flow",
      location: "/",
      steps: [
        {
          title: "Hello",
          targetElement: ".target",
          placement: new URLSearchParams(window.location.search).get(
            "placement",
          ) as unknown as "top",
          hideArrow: new URLSearchParams(window.location.search).get("hideArrow") === "true",
        },
      ],
    },
  ],
});
