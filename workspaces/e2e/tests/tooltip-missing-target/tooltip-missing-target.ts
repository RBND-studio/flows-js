import { init, startFlow } from "@flows/js/core";

const createTarget = (): void => {
  const el = document.createElement("div");
  el.classList.add("target");
  el.style.width = "20px";
  el.style.height = "20px";
  el.style.background = "grey";
  el.style.margin = "40px";
  document.body.appendChild(el);
};

void init({
  flows: [
    {
      id: "flow",
      steps: [
        {
          targetElement: ".target",
          title: "Tooltip",
        },
      ],
    },
  ],
});

document.querySelector(".remove-target")?.addEventListener("click", () => {
  document.querySelector(".target")?.remove();
});
document.querySelector(".add-target")?.addEventListener("click", () => {
  createTarget();
});

document.querySelector(".change-location")?.addEventListener("click", () => {
  const url = new URL(window.location.href);
  const counter = Number(url.searchParams.get("counter") || "0");
  url.searchParams.set("counter", String(counter + 1));
  window.history.pushState({}, "", url);
});

document.querySelector(".start-flow")?.addEventListener("click", () => {
  startFlow("flow");
});
