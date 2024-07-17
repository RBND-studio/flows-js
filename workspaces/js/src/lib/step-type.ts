import type { FlowStep, FlowTooltipStep, FlowModalStep, FlowBannerStep } from "../types";

export const isTooltipStep = (step: FlowStep): step is FlowTooltipStep =>
  "targetElement" in step && Boolean(step.targetElement);
export const isBannerStep = (step: FlowStep): step is FlowBannerStep =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- remove this ignore after we add type to other step types
  "type" in step && step.type === "banner";
export const isModalStep = (step: FlowStep): step is FlowModalStep =>
  !isTooltipStep(step) && ("title" in step || "body" in step) && !isBannerStep(step);
