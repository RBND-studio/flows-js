import { endFlow, startFlow } from "./public-methods";
import { FlowsContext } from "./flows-context";
import { getPathname } from "./lib/location";
import { locationMatch } from "./form";

// We're not setting default to avoid accessing window on the server
let prevPathname: string | null = null;

export const handleLocationChange = (): void => {
  const pathname = getPathname();
  const locationChanged = prevPathname !== null && prevPathname !== pathname;
  prevPathname = pathname;

  if (!locationChanged) return;
  FlowsContext.getInstance().onLocationChange?.(pathname, FlowsContext.getInstance());

  FlowsContext.getInstance().instances.forEach((state) => {
    const step = state.currentStep;
    if (!step) return;
    if ("element" in step) {
      const el = document.querySelector(step.element);
      if (!el) endFlow(state.flowId, { variant: "cancel" });
    }

    if (step.wait) {
      const waitOptions = Array.isArray(step.wait) ? step.wait : [step.wait];
      const matchingWait = waitOptions.find((wait) => {
        const waitOptionMatchers = Object.entries(wait)
          .filter(([_, value]) => Boolean(value))
          .filter(([key]) => key !== "action");
        const onlyLocationMatch =
          waitOptionMatchers.at(0)?.[0] === "location" && waitOptionMatchers.length === 1;
        if (wait.location && onlyLocationMatch)
          return locationMatch({ location: wait.location, pathname });
        return false;
      });
      if (matchingWait) state.nextStep(matchingWait.action).render();
    }

    startFlowsBasedOnLocation();
  });
};

export const startFlowsBasedOnLocation = (): void => {
  Object.values(FlowsContext.getInstance().flowsById ?? {}).forEach((flow) => {
    if (!flow.location) return;
    if (locationMatch({ location: flow.location, pathname: getPathname() })) startFlow(flow.id);
  });
};
