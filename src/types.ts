export interface FlowTooltipStep {
  title: string;
  element: string;
}
export interface FlowModalStep {
  title: string;
}
export interface WaitStepOptions {
  element?: string;
  form?: {
    element: string;
    values: { element: string; value: string }[];
  };
  action?: number;
}
export interface FlowWaitStep {
  wait: WaitStepOptions | WaitStepOptions[];
}
export type FlowStep = FlowModalStep | FlowTooltipStep | FlowWaitStep;
type Step = FlowStep | FlowStep[][];
export interface Flow {
  id: string;
  element: string;
  steps: Step[];
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
