import type { DebugEvent, Flow, FlowStep, FlowStepIndex, TrackingEvent } from "../types";
import { hash } from "../lib/hash";
import { isModalStep, isTooltipStep } from "../lib/step-type";
import { log } from "../lib/log";
import { render } from "./render";
import type { FlowsContext } from "./flows-context";

const getStep = ({ flow, step }: { flow: Flow; step: FlowStepIndex }): FlowStep | undefined => {
  if (!Array.isArray(step)) return flow.steps[step] as FlowStep | undefined;

  // eslint-disable-next-line -- this reduce is really hard to type
  return step.reduce<any>((acc, index) => acc?.[index], flow.steps ?? []) as FlowStep | undefined;
};

export class FlowState {
  flowId: string;
  flowElement?: { element: HTMLElement; cleanup?: () => void; target?: Element };
  waitingForElement = false;
  tooltipErrorPromise?: number | Promise<{ referenceId: string } | undefined> | null;

  flowsContext: FlowsContext;

  _stepHistory: FlowStepIndex[];
  get stepHistory(): FlowStepIndex[] {
    return this._stepHistory;
  }
  set stepHistory(value: FlowStepIndex[]) {
    this._stepHistory = value;
    this.enterStep();
    this.flowsContext.savePersistentState();
  }

  constructor(flowId: string, context: FlowsContext) {
    this.flowId = flowId;
    this.flowsContext = context;
    this._stepHistory = this.flowsContext.persistentState.runningFlows.find(
      (i) => i.flowId === flowId,
    )?.stepHistory ?? [0];
    if (this.flow?._incompleteSteps)
      this.flowsContext.onIncompleteFlowStart?.(this.flowId, this.flowsContext);
    const flowAlreadyRunning = this.flowsContext.persistentState.runningFlows.some(
      (i) => i.flowId === flowId,
    );
    if (!flowAlreadyRunning) void this.track({ type: "startFlow" });
    this.enterStep();
  }

  get step(): FlowStepIndex {
    return this.stepHistory.at(-1) ?? 0;
  }

  get currentStep(): FlowStep | undefined {
    if (!this.flow) return undefined;
    return getStep({ flow: this.flow, step: this.step });
  }

  async track(props: Pick<TrackingEvent, "type">): Promise<void> {
    if (!this.flow || this.flow.draft) return;

    this.flowsContext.track({
      flowId: this.flowId,
      stepIndex: this.step,
      stepHash: this.currentStep ? await hash(JSON.stringify(this.currentStep)) : undefined,
      flowHash: await hash(JSON.stringify(this.flow)),
      ...props,
    });
  }
  async debug(
    props: Pick<DebugEvent, "type" | "referenceId" | "targetElement">,
  ): Promise<{ referenceId: string } | undefined> {
    if (!this.flow || this.flow.draft) return;

    return this.flowsContext.handleDebug({
      flowId: this.flowId,
      stepIndex: this.step,
      stepHash: this.currentStep ? await hash(JSON.stringify(this.currentStep)) : undefined,
      flowHash: await hash(JSON.stringify(this.flow)),
      ...props,
    });
  }

  /**
   * Called when entering a step or when the flow is started or recreated from local storage.
   */
  enterStep(): this {
    const step = this.currentStep;
    if (step && isTooltipStep(step) && !this.tooltipErrorPromise)
      this.tooltipErrorPromise = window.setTimeout(() => {
        this.tooltipErrorPromise = this.debug({
          type: "tooltipError",
          targetElement: step.targetElement,
        });
      }, 2000);

    const isFork = Array.isArray(step);
    if (isFork) {
      log.error("Stopping flow: entered invalid step, make sure to use targetBranch");
      void this.debug({ type: "invalidStepError" });
      this.destroy();
    }
    const isOutOfBoundStep = !step && this.flow?._incompleteSteps !== true;
    if (isOutOfBoundStep) {
      log.error("Stopping flow: entered out of bound step");
      void this.debug({ type: "invalidStepError" });
      this.destroy();
    }

    return this;
  }

  nextStep(branch?: number): this {
    if (!this.flow || this.flow._incompleteSteps) return this;

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
    void this.track({ type: "nextStep" });
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
    if (typeof this.step === "number") {
      if (this.step === 0 && this.flow._incompleteSteps) return true;
      return this.step < this.flow.steps.length - 1;
    }
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
    void this.track({ type: "prevStep" });
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

    if (
      step &&
      isTooltipStep(step) &&
      !this.waitingForElement &&
      this.tooltipErrorPromise !== null
    ) {
      const tooltipErrorPromise = this.tooltipErrorPromise;
      this.tooltipErrorPromise = null;
      if (typeof tooltipErrorPromise === "number") window.clearTimeout(tooltipErrorPromise);
      if (tooltipErrorPromise instanceof Promise)
        void tooltipErrorPromise.then((res) =>
          this.debug({ type: "invalidateTooltipError", referenceId: res?.referenceId }),
        );
    }

    return this;
  }

  cancel(): this {
    void this.track({ type: "cancelFlow" });
    this.flowsContext.flowSeen(this.flowId);
    this.unmount();
    return this;
  }

  finish(): this {
    void this.track({ type: "finishFlow" });
    this.flowsContext.flowSeen(this.flowId);
    this.unmount();
    return this;
  }

  /**
   * Remove the flow element from the DOM. Used before rendering next step and when flow is finished.
   */
  unmount(): this {
    this.waitingForElement = false;
    if (!this.flowElement) return this;
    this.flowElement.cleanup?.();
    this.flowElement.element.remove();
    return this;
  }

  destroy(): this {
    this.unmount();
    this.flowsContext.deleteInstance(this.flowId);
    return this;
  }
}
