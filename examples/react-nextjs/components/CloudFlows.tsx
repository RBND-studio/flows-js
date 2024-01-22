"use client";

import { useEffect } from "react";
import { init } from "@flows/js/cloud";
import "@flows/js/flows.css";

export const CloudFlows = () => {
  useEffect(() => {
    init({
      customApiUrl: "https://api.stage.flows-cloud.com",
      // customApiUrl: "http://localhost:3005",
      projectId: "993b3bc3-ebce-4a3e-ba8e-44ca62e3fc9e",
      userProperties: {
        email: "bob@gmail.com",
        role: "admin",
      },
      flows: [
        {
          id: "vanilla-demo-flow-1",
          element: "#start-flow-1",
          steps: [
            {
              element: "#start-flow-1",
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
  }, []);

  return null;
};
