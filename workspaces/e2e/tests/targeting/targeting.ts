import { init } from "@flows/js/core";

const john = new URLSearchParams(window.location.search).get("john") === "true";

void init({
  flows: [
    {
      id: "flow",
      location: "/",
      userProperties: [{ key: "name", eq: "John Doe" }],
      steps: [{ title: "Hello" }],
    },
  ],
  userProperties: {
    name: john ? "John Doe" : undefined,
  },
});
