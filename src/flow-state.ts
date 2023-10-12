import { render } from "./render";
import type { Flow, FlowsContext } from "./types";

interface InterfaceFlowState {
  flowId: string;
  flowElement?: { element: HTMLElement; cleanup: () => void };
}
export type FlowStepIndex = number;

export class FlowState implements InterfaceFlowState {
  flowId: string;
  step: FlowStepIndex;
  flowElement?: { element: HTMLElement; cleanup: () => void };

  flowsContext: FlowsContext;

  constructor(data: InterfaceFlowState, context: FlowsContext) {
    this.flowId = data.flowId;
    this.step = 0;
    this.flowElement = data.flowElement;
    this.flowsContext = context;
  }

  setState(stateUpdates: Partial<InterfaceFlowState>): this {
    this.flowId = stateUpdates.flowId ?? this.flowId;
    this.flowElement = stateUpdates.flowElement ?? this.flowElement;
    this.render();
    return this;
  }

  nextStep(): this {
    this.step += 1;
    return this;
  }
  prevStep(): this {
    this.step -= 1;
    return this;
  }

  get flow(): Flow | undefined {
    return this.flowsContext.flowsById?.[this.flowId];
  }

  get hasNextStep(): boolean {
    if (!this.flow) return false;
    return this.step < this.flow.steps.length - 1;
  }

  render(): void {
    render({ context: this.flowsContext, state: this });
  }

  cleanup(): void {
    if (!this.flowElement) return;
    this.flowElement.cleanup();
    this.flowElement.element.remove();
  }
}
