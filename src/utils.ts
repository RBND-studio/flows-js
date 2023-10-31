import type { FlowStep, FlowTooltipStep, FlowModalStep } from "./types";

export const isTooltipStep = (step: FlowStep): step is FlowTooltipStep => "element" in step;
export const isModalStep = (step: FlowStep): step is FlowModalStep =>
  !isTooltipStep(step) && ("title" in step || "body" in step);
