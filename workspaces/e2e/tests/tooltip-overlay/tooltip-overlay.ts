import { init } from "@flows/js";

const closeOnOverlayClick =
  new URLSearchParams(window.location.search).get("closeOnOverlayClick") === "true";

init({
  flows: [
    {
      id: "flow",
      location: "/",
      steps: [
        {
          title: "Hello",
          targetElement: ".target",
          overlay: true,
          closeOnOverlayClick,
        },
        {
          title: "World",
          targetElement: ".target",
        },
      ],
    },
  ],
});
