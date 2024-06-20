import { init } from "@flows/js/core";

const closeOnOverlayClick =
  new URLSearchParams(window.location.search).get("closeOnOverlayClick") === "true";
const disableOverlayClickLayer =
  new URLSearchParams(window.location.search).get("disableOverlayClickLayer") === "true";

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
          disableOverlayClickLayer,
        },
        {
          title: "World",
          targetElement: ".target",
        },
      ],
    },
  ],
});

document.querySelector(".console-btn")?.addEventListener("click", () => console.log("Hello!"));
