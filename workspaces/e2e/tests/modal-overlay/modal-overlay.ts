import { init } from "@flows/js/core";

const closeOnOverlayClick =
  new URLSearchParams(window.location.search).get("closeOnOverlayClick") === "true";
const hideOverlay = new URLSearchParams(window.location.search).get("hideOverlay") === "true";
const disableOverlayClickLayer =
  new URLSearchParams(window.location.search).get("disableOverlayClickLayer") === "true";
const appModal = new URLSearchParams(window.location.search).get("appModal") === "true";
const zIndex = new URLSearchParams(window.location.search).get("zIndex") ?? undefined;

init({
  flows: [
    {
      id: "flow",
      start: { location: "/" },
      steps: [
        {
          title: "Hello",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          zIndex,
          hideOverlay,
          closeOnOverlayClick,
          disableOverlayClickLayer,
        },
      ],
    },
  ],
});

document.querySelector(".console-btn")?.addEventListener("click", () => console.log("Hello!"));

if (appModal) {
  const modal = document.createElement("div");
  modal.classList.add("app-modal");
  modal.style.position = "fixed";
  modal.style.zIndex = "5100";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(100, 0, 0, 0.5)";
  document.body.appendChild(modal);
}
