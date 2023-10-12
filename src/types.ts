export interface FlowTooltipStep {
  title: string;
  element: string;
}
export interface FlowModalStep {
  title: string;
}
export type FlowStep = FlowModalStep | FlowTooltipStep;
export interface Flow {
  id: string;
  element: string;
  steps: FlowStep[];
}

export interface FlowsOptions {
  customerId?: string;
  flows?: Flow[];
}
export interface Instance {
  element: Element;
  flowId: string;
}
export interface FlowsContext {
  customerId?: string;
  flowsById?: Record<string, Flow>;
}
