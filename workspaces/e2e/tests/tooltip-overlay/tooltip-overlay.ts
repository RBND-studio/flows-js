import { init } from "@flows/js/core";

const closeOnOverlayClick =
  new URLSearchParams(window.location.search).get("closeOnOverlayClick") === "true";

init({
  flows: [
    {
      id: "flow",
      start: { location: "/" },
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
