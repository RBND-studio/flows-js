import { init } from "@flows/js/core";

void init({
  flows: [
    {
      id: "flow",
      start: { location: "/" },
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
