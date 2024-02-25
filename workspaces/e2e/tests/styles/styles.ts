import { init } from "@flows/js/core";

void init({
  flows: [
    {
      id: "flow",
      location: "/",
      steps: [
        {
          title: "Hello",
          body: "With its flexible approach, Flows unlocks the potential of your product by providing the tools to build seamless onboarding experiences for your users. It is the tool of choice for modern SaaS companies.",
          targetElement: ".target",
        },
        {
          title: "World",
          body: "With its flexible approach, Flows unlocks the potential of your product by providing the tools to build seamless onboarding experiences for your users. It is the tool of choice for modern SaaS companies.",
        },
      ],
    },
  ],
});
