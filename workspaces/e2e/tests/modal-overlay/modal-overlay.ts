import { init } from "@flows/js/core";

const closeOnOverlayClick =
  new URLSearchParams(window.location.search).get("closeOnOverlayClick") === "true";
const hideOverlay = new URLSearchParams(window.location.search).get("hideOverlay") === "true";
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
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          hideOverlay,
          closeOnOverlayClick,
          disableOverlayClickLayer,
        },
      ],
    },
  ],
});

document.querySelector(".console-btn")?.addEventListener("click", () => console.log("Hello!"));
