import { Flow } from "@flows/js";

export const validFlow: Flow = {
  id: "valid-flow",
  start: { location: "/" },
  steps: [
    {
      title: "Hello",
      targetElement: ".target",
    },
  ],
};

export const invalidFlow: Flow = {
  id: "invalid-flow",
  start: { location: "/" },
  steps: [
    {
      title: "Hello",
      targetElement: ".target",
      // @ts-ignore
      invalidOption: "invalid",
    },
  ],
};
