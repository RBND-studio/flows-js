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
        {
          title: "This is modal",
        },
      ],
    },
    {
      id: "vanilla-demo-flow-2",
      element: "#start-flow-2",
      steps: [
        {
          element: "#start-flow-2",
          title: "Hello from Flow 2!",
        },
        {
          element: ".flow-2-text",
          title: "This is a text element",
        },
        {
          wait: {
            element: "#continue-flow-2",
          },
        },
        {
          element: "#continue-flow-2",
          title: "This is the last step",
        },
      ],
    },
    {
      id: "vanilla-demo-flow-3",
      element: "#start-flow-3",
      steps: [
        {
          element: "#start-flow-3",
          title: "Hello from Flow 3!",
        },
        {
          wait: [
            { element: "#flow-3-A", action: 0 },
            { element: "#flow-3-B", action: 1 },
          ],
        },
        [
          [{ element: ".flow-3-A-text", title: "You selected variant A" }],
          [{ element: ".flow-3-B-text", title: "You selected variant B" }],
        ],
        { element: ".flow-3-final", title: "Goodbye" },
      ],
    },
    {
      id: "vanilla-demo-flow-4",
      element: "#start-flow-4",
      steps: [
        {
          element: "#start-flow-4",
          title: "Hello from Flow 4!",
        },
        {
          wait: [
            {
              form: {
                element: ".flow-4-form",
                values: [{ element: ".flow-4-select", value: "1" }],
              },
              action: 0,
            },
            {
              form: {
                element: ".flow-4-form",
                values: [{ element: ".flow-4-select", value: "2" }],
              },
              action: 1,
            },
          ],
        },
        [
          [{ element: ".flow-4-form button", title: "You selected Option 1" }],
          [{ element: ".flow-4-form button", title: "You selected Option 2" }],
        ],
      ],
    },
  ],
  tracking: console.log,
});

document.addEventListener("submit", (e) => {
  e.preventDefault();
});
