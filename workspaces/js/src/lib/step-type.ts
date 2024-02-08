import type { FlowStep, FlowTooltipStep, FlowModalStep } from "../types";

export const isTooltipStep = (step: FlowStep): step is FlowTooltipStep =>
  "targetElement" in step && Boolean(step.targetElement);
export const isModalStep = (step: FlowStep): step is FlowModalStep =>
  !isTooltipStep(step) && ("title" in step || "body" in step);
