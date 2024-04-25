"use client";

import { useEffect } from "react";
import { init } from "@flows/js";

export const Flows = () => {
  useEffect(() => {
    init({
      projectId: "e7d8eb63-7670-4da1-b0e0-d2d3331d108b",
      flows: [
        {
          id: "local-flow",
          start: { clickElement: "#start-local" },
          frequency: "every-time",
          steps: [
            {
              title: "Welcome to Flows!",
              body: "This is a demo of a local flow loaded from the codebase. Flows offer cloud flows as well, which can be updated without needing code changes.",
            },
            {
              title: "This is a tooltip",
              body: "It can have an overlay...",
              targetElement: "#file1",
              overlay: true,
            },
            {
              title: "...or not",
              body: "You can customize the tooltip to your liking.",
              targetElement: "#file1",
            },
            {
              title: "You can also wait for a click",
              body: "Just like this! Click the button to continue.",
              targetElement: "#upload",
              overlay: true,
              wait: {
                clickElement: "#upload",
              },
              hideNext: true,
            },
            {
              title: "Or you can branch out with forks",
              body: "Click on one of the files to continue.",
              targetElement: ".app-files",
              overlay: true,
              wait: [
                {
                  clickElement: "#file1",
                  targetBranch: 0,
                },
                {
                  clickElement: "#file2",
                  targetBranch: 1,
                },
                {
                  clickElement: "#file3",
                  targetBranch: 2,
                },
                {
                  clickElement: "#file4",
                  targetBranch: 3,
                },
              ],
              hideNext: true,
            },
            [
              [
                {
                  title: "You clicked on FunnyCat.jpg",
                  body: "With forks, you can create multiple branches to tailor the onboarding to user actions.",
                  targetElement: "#file1",
                  overlay: true,
                },
              ],
              [
                {
                  title: "You clicked on ImportantDoc.pdf",
                  body: "With forks, you can create multiple branches to tailor the onboarding to user actions.",
                  targetElement: "#file2",
                  overlay: true,
                },
              ],
              [
                {
                  title: "You clicked on CoolVideo.mp4",
                  body: "With forks, you can create multiple branches to tailor the onboarding to user actions.",
                  targetElement: "#file3",
                  overlay: true,
                },
              ],
              [
                {
                  title: "You clicked on DankMeme.png",
                  body: "With forks, you can create multiple branches to tailor the onboarding to user actions.",
                  targetElement: "#file4",
                  overlay: true,
                },
              ],
            ],
            {
              title: "That was the basics of Flows!",
              body: "You can create complex onboarding flows with Flows or a simple tour. If you liked what you saw, sign up and start creating your own flows.",
              hideNext: true,
              hidePrev: true,
              footerActions: {
                center: [
                  {
                    label: "Learn more",
                    external: true,
                    href: "https://flows.sh/docs",
                    variant: "secondary",
                  },
                  {
                    label: "Sign up",
                    external: true,
                    href: "https://app.flows.sh/signup",
                  },
                ],
              },
            },
          ],
        },
      ],
    });
  }, []);

  return null;
};
