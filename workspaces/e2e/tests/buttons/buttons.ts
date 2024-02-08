import type { FlowTooltipStep } from "@flows/js";
import { init } from "@flows/js/core";

const hideClose = new URLSearchParams(window.location.search).get("hideClose") === "true";
const hidePrev = new URLSearchParams(window.location.search).get("hidePrev") === "true";
const hideNext = new URLSearchParams(window.location.search).get("hideNext") === "true";
const prevLabel = new URLSearchParams(window.location.search).get("prevLabel") ?? undefined;
const nextLabel = new URLSearchParams(window.location.search).get("nextLabel") ?? undefined;
const customLink = new URLSearchParams(window.location.search).get("customLink") === "true";
const customExternalLink =
  new URLSearchParams(window.location.search).get("customExternalLink") === "true";
const customAction = new URLSearchParams(window.location.search).get("customAction") === "true";
const customNext = new URLSearchParams(window.location.search).get("customNext") === "true";
const customPrev = new URLSearchParams(window.location.search).get("customPrev") === "true";

const footerActionsArray: NonNullable<FlowTooltipStep["footerActions"]>["left"] = [];
if (customLink)
  footerActionsArray.push({
    label: "Google",
    href: "https://google.com",
  });
if (customExternalLink)
  footerActionsArray.push({
    label: "Google",
    href: "https://google.com",
    external: true,
  });
if (customAction)
  footerActionsArray.push({
    label: "Action",
    targetBranch: 0,
  });
if (customNext)
  footerActionsArray.push({
    label: "My Next",
    next: true,
  });
if (customPrev)
  footerActionsArray.push({
    label: "My Prev",
    prev: true,
  });
const footerActions = {
  left: footerActionsArray,
  center: footerActionsArray,
  right: footerActionsArray,
};

void init({
  flows: [
    {
      id: "flow",
      location: "/",
      steps: [
        {
          title: "Hello",
          targetElement: ".target",
          hideClose,
          hidePrev,
          hideNext,
          prevLabel,
          nextLabel,
          footerActions,
        },
        {
          title: "Hello 2",
          targetElement: ".target",
          hideClose,
          hidePrev,
          hideNext,
          prevLabel,
          nextLabel,
        },
      ],
    },
  ],
});
