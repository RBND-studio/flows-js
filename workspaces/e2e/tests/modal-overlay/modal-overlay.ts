import { init } from "@flows/js/core";

const closeOnOverlayClick =
  new URLSearchParams(window.location.search).get("closeOnOverlayClick") === "true";
const hideOverlay = new URLSearchParams(window.location.search).get("hideOverlay") === "true";

init({
  flows: [
    {
      id: "flow",
      location: "/",
      steps: [
        {
          title: "Hello",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          hideOverlay,
          closeOnOverlayClick,
        },
      ],
    },
  ],
});

document.querySelector("button")?.addEventListener("click", () => console.log("Hello!"));
