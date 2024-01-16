import { init } from "../../dist";

void init({
  flows: [
    {
      id: "flow",
      location: "/",
      steps: [
        {
          title: "Hello",
          element: ".target",
          placement: new URLSearchParams(window.location.search).get(
            "placement",
          ) as unknown as "top",
          hideArrow: new URLSearchParams(window.location.search).get("hideArrow") === "true",
        },
      ],
    },
  ],
});
