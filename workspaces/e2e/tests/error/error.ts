import { init, startFlow } from "@flows/js";

let counter = 0;

init({
  flows: [
    {
      id: "flow",
      steps: [
        {
          targetElement: ".target",
          title: "Hello",
        },
      ],
    },
  ],
  _debug: async (e) => {
    const p = document.createElement("p");
    p.classList.add("log-item");
    p.dataset.type = e.type;
    p.dataset.referenceId = e.referenceId;
    p.innerText = JSON.stringify(e);
    document.querySelector(".log")?.appendChild(p);
    const referenceId = counter.toString();
    counter = counter + 1;
    return { referenceId };
  },
});

const createTarget = (): void => {
  const el = document.createElement("div");
  el.classList.add("target");
  el.style.width = "20px";
  el.style.height = "20px";
  el.style.background = "grey";
  el.style.margin = "40px";
  document.body.appendChild(el);
};
document.querySelector(".add-target")?.addEventListener("click", () => {
  createTarget();
});
document.querySelector(".remove-target")?.addEventListener("click", () => {
  document.querySelector(".target")?.remove();
});

document.querySelector(".start-flow")?.addEventListener("click", () => {
  startFlow("flow");
});
