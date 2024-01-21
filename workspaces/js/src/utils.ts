import type { FlowStep, FlowTooltipStep, FlowModalStep } from "./types";

export const isTooltipStep = (step: FlowStep): step is FlowTooltipStep =>
  "element" in step && Boolean(step.element);
export const isModalStep = (step: FlowStep): step is FlowModalStep =>
  !isTooltipStep(step) && ("title" in step || "body" in step);

export const hash = async (text: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-384", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};
