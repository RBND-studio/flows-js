window.FlowsJS?.init({
  customerId: "vanilla-demo",
  flows: [
    {
      id: "vanilla-demo-flow-1",
      element: "#start-flow-1",
      steps: [
        {
          element: "#start-flow-1",
          title: "Welcome to FlowsJS!",
          body: "This is a demo of FlowsJS. Click the button below to start the demo.",
        },
        {
          title: "This is modal",
          body: "This is a modal. It is an useful way to show larger amounts of information with detailed descriptions. For smaller amounts of information, you can use a tooltip. Click the button below to continue.",
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
    {
      id: "vanilla-demo-flow-5",
      element: "#start-flow-5",
      steps: [
        {
          element: "#start-flow-5",
          title: "Hello from Flow 5!",
        },
        {
          wait: {
            change: [
              { element: ".flow-5-email", value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
              { element: ".flow-5-password", value: /^......+$/ },
            ],
          },
        },
        {
          element: ".flow-5-submit",
          title: "Thanks for filling out the values, now you can proceed to submit.",
        },
      ],
    },
    {
      id: "vanilla-demo-flow-6",
      element: "#start-flow-6",
      steps: [
        {
          element: "#start-flow-6",
          title: "Hello from Flow 6!",
          options: [
            { text: "Variant A", action: 0 },
            { text: "Variant B", action: 1 },
          ],
        },
        [
          [{ element: ".flow-6-A-text", title: "You selected variant A" }],
          [{ element: ".flow-6-B-text", title: "You selected variant B" }],
        ],
      ],
    },
  ],
  tracking: console.log,
});

document.addEventListener("submit", (e) => {
  e.preventDefault();
});
