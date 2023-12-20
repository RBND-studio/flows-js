"use client";

import { useEffect } from "react";
import { init } from "@rbnd/flows";
import "@rbnd/flows/flows.css";

export const LocalFlows = () => {
  useEffect(() => {
    init({
      flows: [
        {
          id: "vanilla-demo-flow-1",
          element: "#start-flow-1",
          steps: [
            {
              element: "#start-flow-1",
              title: "Hey!",
              body: "This is a demo of FlowsJS. <br/>Click the button below to continue.",
              arrow: true,
              placement: "right-start",
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
          id: "vanilla-about-flow",
          frequency: "every-time",
          steps: [
            {
              element: ".lorem-ipsum-paragraph",
              title: "This is a paragraph",
              body: "This paragraph doesn't make sense.",
              arrow: true,
              options: [],
              wait: {
                element: ".home-nav-link",
              },
            },
            {
              wait: {
                location: "/",
              },
            },
            {
              title: "This is a paragraph",
              body: "This paragraph doesn't make sense.",
              element: "#start-flow-1",
              arrow: true,
            },
          ],
          location: "/about",
        },
      ],
    });
  });

  return null;
};
