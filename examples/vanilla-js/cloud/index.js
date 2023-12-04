window.FlowsJS?.init({
  projectId: "rbnd-test",
  customApiUrl: "http://localhost:3005",
  userId: "rbnd-test-user",
  flows: [
    {
      id: "vanilla-demo-flow-2",
      element: "#start-flow-2",
      steps: [
        {
          element: "#start-flow-2",
          title: "Hello from Flow 2!",
          body: "In this demo you can see how to point to elements and how to wait for actions.",
        },
        {
          element: ".flow-2-text",
          title: "This is a text element",
          body: "The tooltip is pointing to a text element with a class flow-2-text. To continue after this step click on the Continue button below the text.",
        },
        {
          wait: {
            element: "#continue-flow-2",
          },
        },
        {
          element: "#continue-flow-2",
          title: "This is the last step",
          body: "This step waited for you to click on the Continue button below the text.",
        },
      ],
    },
  ],
});
