window.FlowsJS?.init({
  projectId: "e7d8eb63-7670-4da1-b0e0-d2d3331d108b",
  flows: [
    {
      id: "local-flow",
      clickElement: "#start-local",
      steps: [
        {
          targetElement: "#start-local",
          title: "Welcome to FlowsJS!",
          body: "This is a demo of FlowsJS. Click the button below to continue.",
        },
        {
          title: "This is a modal",
          body: "This is a modal. It is an useful way to show larger amounts of information with detailed descriptions. For smaller amounts of information, you can use a tooltip. Click the button below to continue.",
        },
      ],
    },
  ],
});
