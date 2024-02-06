import type { FlowWaitStep } from "@flows/js";
import { init } from "@flows/js";

const click = new URLSearchParams(window.location.search).get("click") === "true";
const change = new URLSearchParams(window.location.search).get("change") === "true";
const multipleChange = new URLSearchParams(window.location.search).get("multipleChange") === "true";
const submit = new URLSearchParams(window.location.search).get("submit") === "true";
const location = new URLSearchParams(window.location.search).get("location") ?? undefined;
const anotherWaitWithWrongLocation =
  new URLSearchParams(window.location.search).get("anotherWaitWithWrongLocation") === "true";

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
    element: "form",
    values: [
      { element: ".input", value: "Input1" },
      { element: ".input2", value: "Input2" },
    ],
  };
if (location) wait.location = location;
if (anotherWaitWithWrongLocation) wait = [wait, { location: "^/wrong.html" }];

void init({
  flows: [
    {
      id: "flow",
      location: "/",
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
