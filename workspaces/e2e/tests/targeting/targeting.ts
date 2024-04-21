import { init } from "@flows/js/core";

const john = new URLSearchParams(window.location.search).get("john") === "true";
const clickElement = new URLSearchParams(window.location.search).get("clickElement") === "true";
const location = new URLSearchParams(window.location.search).get("location") ?? "/";

void init({
  flows: [
    {
      id: "flow",
      start: {
        location: location,
        clickElement: clickElement ? ".click-to-start" : undefined,
      },
      frequency: "every-time",
      userProperties: [{ key: "name", eq: "John Doe" }],
      steps: [{ title: "Hello" }],
    },
  ],
  userProperties: {
    name: john ? "John Doe" : undefined,
  },
});
