import { endFlow, startFlow } from "./public-methods";
import { FlowsContext } from "./flows-context";
import { locationMatch } from "./form";
import { getPathname } from "./lib/location";

let prevPathname: string | null = null;
export const handleDocumentChange = (): void => {
  const pathname = getPathname();
  const locationChanged = prevPathname !== pathname;
  prevPathname = pathname;

  if (locationChanged) {
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
    });

    Object.values(FlowsContext.getInstance().flowsById ?? {}).forEach((flow) => {
      if (!flow.location) return;
      if (locationMatch({ location: flow.location, pathname })) startFlow(flow.id);
    });
  }

  FlowsContext.getInstance().instances.forEach((state) => {
    if (state.waitingForElement) state.render();

    const step = state.currentStep;
    if (step && "element" in step) {
      const el = document.querySelector(step.element);
      const targetChanged = state.flowElement?.target && el !== state.flowElement.target;
      if (targetChanged) state.render();
    }
  });
};
