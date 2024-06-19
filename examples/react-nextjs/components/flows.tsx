"use client";

import { useEffect } from "react";
import { init } from "@flows/js";

export const Flows = () => {
  useEffect(() => {
    init({
      projectId: "e7d8eb63-7670-4da1-b0e0-d2d3331d108b",
    });
  }, []);

  return null;
};
