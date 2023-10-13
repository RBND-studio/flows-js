import { render } from "./render";
import type { Flow, FlowStep, FlowsContext } from "./types";

interface InterfaceFlowState {
  flowId: string;
  flowElement?: { element: HTMLElement; cleanup: () => void };
}
export type FlowStepIndex = number | number[];

const getStep = ({ flow, step }: { flow: Flow; step: FlowStepIndex }): FlowStep | undefined => {
  if (!Array.isArray(step)) return flow.steps[step] as FlowStep | undefined;

  // eslint-disable-next-line -- this reduce is really hard to type
  return step.reduce<any>((acc, index) => acc?.[index], flow.steps ?? []) as FlowStep | undefined;
};

export class FlowState implements InterfaceFlowState {
  flowId: string;
  stepHistory: FlowStepIndex[] = [0];
  flowElement?: { element: HTMLElement; cleanup: () => void };

  flowsContext: FlowsContext;

  constructor(data: InterfaceFlowState, context: FlowsContext) {
    this.flowId = data.flowId;
    this.flowElement = data.flowElement;
    this.flowsContext = context;
  }

  setState(stateUpdates: Partial<InterfaceFlowState>): this {
    this.flowId = stateUpdates.flowId ?? this.flowId;
    this.flowElement = stateUpdates.flowElement ?? this.flowElement;
    this.render();
    return this;
  }

  get step(): FlowStepIndex {
    return this.stepHistory.at(-1) ?? 0;
  }

  get currentStep(): FlowStep | undefined {
    if (!this.flow) return undefined;
    return getStep({ flow: this.flow, step: this.step });
  }

  nextStep(branch?: number): this {
    if (!this.flow) return this;

    let newStepIndex = Array.isArray(this.step) ? [...this.step] : this.step;

    if (Array.isArray(newStepIndex)) {
      const parentStep = getStep({ flow: this.flow, step: newStepIndex.slice(0, -1) }) as
        | FlowStep[]
        | undefined;
      if (parentStep && parentStep.length - 1 <= (newStepIndex.at(-1) ?? 0)) {
        newStepIndex = [...newStepIndex.slice(0, -3), (newStepIndex.at(-3) ?? 0) + 1];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- first element is always defined
        if (newStepIndex.length === 1) newStepIndex = newStepIndex[0]!;
      } else newStepIndex = [...newStepIndex.slice(0, -1), (newStepIndex.at(-1) ?? 0) + 1];
    } else if (typeof newStepIndex === "number") {
      newStepIndex += 1;
    }

    if (branch !== undefined) {
      newStepIndex = [...(Array.isArray(newStepIndex) ? newStepIndex : [newStepIndex]), branch, 0];
    }

    this.stepHistory = [...this.stepHistory, newStepIndex];

    return this;
  }
  get hasNextStep(): boolean {
    if (!this.flow) return false;
    if (Array.isArray(this.step)) {
      const parentStep = getStep({ flow: this.flow, step: this.step.slice(0, -1) }) as
        | FlowStep[]
        | undefined;
      if (parentStep && parentStep.length - 1 > (this.step.at(-1) ?? 0)) return true;

      const grandparentStep = getStep({ flow: this.flow, step: this.step.slice(0, -3) }) as
        | FlowStep[]
        | undefined;
      if (grandparentStep && grandparentStep.length - 1 > (this.step.at(-3) ?? 0)) return true;
    }
    if (typeof this.step === "number") return this.step < this.flow.steps.length - 1;
    return false;
  }

  prevStep(): this {
    this.stepHistory = this.stepHistory.slice(0, -1);
    while (this.currentStep && "wait" in this.currentStep)
      this.stepHistory = this.stepHistory.slice(0, -1);
    return this;
  }
  get hasPrevStep(): boolean {
    return this.stepHistory.length > 1;
  }

  get flow(): Flow | undefined {
    return this.flowsContext.flowsById?.[this.flowId];
  }

  render(): void {
    render(this);
  }

  cleanup(): void {
    if (!this.flowElement) return;
    this.flowElement.cleanup();
    this.flowElement.element.remove();
  }
}
