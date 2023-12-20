"use client";

import { useEffect } from "react";
import { init } from "@rbnd/flows/cloud";
import "@rbnd/flows/flows.css";

export const CloudFlows = () => {
  useEffect(() => {
    init({
      customApiUrl: "https://api.stage.flows-cloud.com",
      projectId: "My-proj",
      userProperties: {
        email: "bob@gmail.com",
        role: "admin",
      },
    });
  }, []);

  return null;
};
