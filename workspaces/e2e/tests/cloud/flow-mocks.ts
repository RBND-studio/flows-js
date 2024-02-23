import { Flow } from "@flows/js";

export const validFlow: Flow = {
  id: "valid-local-flow",
  location: "/",
  steps: [
    {
      title: "Hello",
      targetElement: ".target",
    },
  ],
};

export const invalidFlow: Flow = {
  id: "invalid-local-flow",
  location: "/",
  steps: [
    {
      title: "Hello",
      targetElement: ".target",
      // @ts-ignore
      invalidOption: "invalid",
    },
  ],
};
