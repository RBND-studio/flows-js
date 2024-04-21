import { getPathname } from "../lib/location";
import { endFlow, startFlow } from "./public-methods";
import { FlowsContext } from "./flows-context";
import { getWaitMatchingByLocation } from "./wait";

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
    if ("targetElement" in step) {
      const el = document.querySelector(step.targetElement);
      if (!el) endFlow(state.flowId, { variant: "cancel" });
    }

    if (step.wait) {
      const matchingWait = getWaitMatchingByLocation({ wait: step.wait, pathname });
      if (matchingWait) state.nextStep(matchingWait.targetBranch).render();
    }
  });

  startFlowsBasedOnLocation();
};

export const startFlowsBasedOnLocation = (): void => {
  Object.values(FlowsContext.getInstance().flowsById ?? {}).forEach((flow) => {
    if (!flow.start) return;
    const matchingWait = getWaitMatchingByLocation({ wait: flow.start, pathname: getPathname() });
    if (matchingWait) startFlow(flow.id);
  });
};
