import type { FlowTooltipStep } from "../../dist";
import { init } from "../../dist";

const hideClose = new URLSearchParams(window.location.search).get("hideClose") === "true";
const hidePrev = new URLSearchParams(window.location.search).get("hidePrev") === "true";
const hideNext = new URLSearchParams(window.location.search).get("hideNext") === "true";
const prevText = new URLSearchParams(window.location.search).get("prevText") ?? undefined;
const nextText = new URLSearchParams(window.location.search).get("nextText") ?? undefined;
const customLink = new URLSearchParams(window.location.search).get("customLink") === "true";
const customExternalLink =
  new URLSearchParams(window.location.search).get("customExternalLink") === "true";
const customAction = new URLSearchParams(window.location.search).get("customAction") === "true";
const customNext = new URLSearchParams(window.location.search).get("customNext") === "true";
const customPrev = new URLSearchParams(window.location.search).get("customPrev") === "true";

const footerActionsArray: NonNullable<FlowTooltipStep["footerActions"]>["left"] = [];
if (customLink)
  footerActionsArray.push({
    text: "Google",
    href: "https://google.com",
  });
if (customExternalLink)
  footerActionsArray.push({
    text: "Google",
    href: "https://google.com",
    external: true,
  });
if (customAction)
  footerActionsArray.push({
    text: "Action",
    action: 0,
  });
if (customNext)
  footerActionsArray.push({
    text: "My Next",
    next: true,
  });
if (customPrev)
  footerActionsArray.push({
    text: "My Prev",
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
          element: ".target",
          hideClose,
          hidePrev,
          hideNext,
          prevText,
          nextText,
          footerActions,
        },
        {
          title: "Hello 2",
          element: ".target",
          hideClose,
          hidePrev,
          hideNext,
          prevText,
          nextText,
        },
      ],
    },
  ],
});
