window.FlowsJS?.init({
  customerId: "vanilla-demo",
  flows: [
    {
      id: "vanilla-demo-flow-1",
      element: "#start-flow-1",
      steps: [
        {
          element: "#start-flow-1",
          title: "Hey!",
        },
      ],
    },
  ],
});
