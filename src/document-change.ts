import { endFlow, startFlow } from "./public-methods";
import { FlowsContext } from "./flows-context";
import { locationMatch } from "./form";

let prevPathname: string | null = null;
export const handleDocumentChange = (): void => {
  const pathname = window.location.pathname + window.location.search;
  const locationChanged = prevPathname !== pathname;
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
        if (Array.isArray(step.wait)) {
          const matchingWait = step.wait.find((wait) => {
            if (wait.location) return locationMatch({ location: wait.location, pathname });
            return false;
          });
          if (matchingWait) state.nextStep(matchingWait.action).render();
        } else if (
          step.wait.location &&
          locationMatch({ location: step.wait.location, pathname })
        ) {
          state.nextStep().render();
        }
      }
    });

    Object.values(FlowsContext.getInstance().flowsById ?? {}).forEach((flow) => {
      if (!flow.location) return;
      if (locationMatch({ location: flow.location, pathname })) startFlow(flow.id);
    });
  }
  prevPathname = pathname;

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
