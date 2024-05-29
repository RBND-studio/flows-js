import type { FlowWaitStep } from "@flows/js";
import { init } from "@flows/js/core";

const click = new URLSearchParams(window.location.search).get("click") === "true";
const change = new URLSearchParams(window.location.search).get("change") === "true";
const multipleChange = new URLSearchParams(window.location.search).get("multipleChange") === "true";
const submit = new URLSearchParams(window.location.search).get("submit") === "true";
const element = new URLSearchParams(window.location.search).get("element") === "true";
const location = new URLSearchParams(window.location.search).get("location") ?? undefined;
const anotherWaitWithWrongLocation =
  new URLSearchParams(window.location.search).get("anotherWaitWithWrongLocation") === "true";
const waitForStart = new URLSearchParams(window.location.search).get("waitForStart") === "true";

let wait: FlowWaitStep["wait"] = {};
if (click) wait.clickElement = ".target";
if (change) wait.change = [{ element: ".input", value: "Hello World" }];
if (multipleChange)
  wait.change = [
    { element: ".input", value: "Hello World" },
    { element: ".input2", value: "Hi Mom!" },
  ];
if (submit)
  wait.form = {
    formElement: "form",
    values: [
      { element: ".input", value: "Input1" },
      { element: ".input2", value: "Input2" },
    ],
  };
if (element) wait.element = ".new-el";
if (location) wait.location = location;
if (anotherWaitWithWrongLocation) wait = [wait, { location: "^/wrong.html" }];

void init({
  flows: [
    {
      id: "flow",
      start: waitForStart ? wait : { location: "/" },
      steps: [
        {
          title: "First",
          targetElement: ".target",
          wait,
          hideNext: true,
        },
        {
          title: "Second",
          targetElement: ".target",
        },
      ],
    },
  ],
});

document.addEventListener("submit", (e) => {
  e.preventDefault();
});

document.querySelector(".add-element")?.addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("new-el");
  div.textContent = "New Element";
  document.body.appendChild(div);
});
