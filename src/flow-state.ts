import type { FlowsContext } from "./flows-context";
import { render } from "./render";
import type { Flow, FlowStep, FlowStepIndex, TrackingEvent } from "./types";
import { hash, isModalStep, isTooltipStep } from "./utils";

interface InterfaceFlowState {
  flowId: string;
  flowElement?: { element: HTMLElement; cleanup?: () => void };
}

const getStep = ({ flow, step }: { flow: Flow; step: FlowStepIndex }): FlowStep | undefined => {
  if (!Array.isArray(step)) return flow.steps[step] as FlowStep | undefined;

  // eslint-disable-next-line -- this reduce is really hard to type
  return step.reduce<any>((acc, index) => acc?.[index], flow.steps ?? []) as FlowStep | undefined;
};

export class FlowState implements InterfaceFlowState {
  flowId: string;
  stepHistory: FlowStepIndex[] = [0];
  flowElement?: { element: HTMLElement; cleanup?: () => void };
  waitingForElement = false;

  flowsContext: FlowsContext;

  constructor(data: InterfaceFlowState, context: FlowsContext) {
    this.flowId = data.flowId;
    this.flowElement = data.flowElement;
    this.flowsContext = context;
    this.track({ type: "startFlow" });
  }

  get step(): FlowStepIndex {
    return this.stepHistory.at(-1) ?? 0;
  }

  get currentStep(): FlowStep | undefined {
    if (!this.flow) return undefined;
    return getStep({ flow: this.flow, step: this.step });
  }

  track(props: Pick<TrackingEvent, "type">): this {
    if (this.flow?.draft) return this;

    void (async () => {
      if (!this.flow) return;
      this.flowsContext.track({
        flowId: this.flowId,
        stepIndex: this.step,
        stepHash: this.currentStep ? await hash(JSON.stringify(this.currentStep)) : undefined,
        flowHash: await hash(JSON.stringify(this.flow)),
        ...props,
      });
    })();

    return this;
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

    if (this.currentStep) this.flowsContext.onNextStep?.(this.currentStep);
    this.track({ type: "nextStep" });
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
    while (
      this.stepHistory.length &&
      this.currentStep &&
      !(isTooltipStep(this.currentStep) || isModalStep(this.currentStep))
    )
      this.stepHistory = this.stepHistory.slice(0, -1);
    if (this.currentStep) this.flowsContext.onPrevStep?.(this.currentStep);
    this.track({ type: "prevStep" });
    return this;
  }
  get hasPrevStep(): boolean {
    return this.stepHistory.length > 1;
  }

  get flow(): Flow | undefined {
    return this.flowsContext.flowsById?.[this.flowId];
  }

  render(): this {
    const step = this.currentStep;
    if (step && isTooltipStep(step) && step.scrollElement) {
      const scrollEl = document.querySelector(step.scrollElement);
      scrollEl?.scrollIntoView({ behavior: "smooth" });
    }

    render(this);
    return this;
  }

  cancel(): this {
    this.track({ type: "cancelFlow" });
    this.flowsContext.flowSeen(this.flowId);
    this.cleanup();
    return this;
  }

  finish(): this {
    this.track({ type: "finishFlow" });
    this.flowsContext.flowSeen(this.flowId);
    this.cleanup();
    return this;
  }

  cleanup(): this {
    if (!this.flowElement) return this;
    this.flowElement.cleanup?.();
    this.flowElement.element.remove();
    return this;
  }
}
