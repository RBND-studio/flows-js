import type { Flow, FlowStep, FlowsOptions, TrackingEvent } from "./types";

export class FlowsContext {
  seenFlowIds: string[] = [];

  customerId?: string;
  userId?: string;
  flowsById?: Record<string, Flow>;
  onNextStep?: (step: FlowStep) => void;
  onPrevStep?: (step: FlowStep) => void;
  tracking?: (event: TrackingEvent) => void;
  onSeenFlowIdsChange?: (seenFlowIds: string[]) => void;

  updateFromOptions(options: FlowsOptions): void {
    this.customerId = options.customerId;
    this.onNextStep = options.onNextStep;
    this.onPrevStep = options.onPrevStep;
    this.tracking = options.tracking;
    this.seenFlowIds = [...(options.seenFlowIds ?? [])];
    this.onSeenFlowIdsChange = options.onSeenFlowIdsChange;
    this.flowsById = {
      ...this.flowsById,
      ...options.flows?.reduce(
        (acc, flow) => {
          acc[flow.id] = flow;
          return acc;
        },
        {} as Record<string, Flow>,
      ),
    };
  }

  track(props: TrackingEvent): this {
    if (!this.tracking) return this;
    this.tracking({
      userId: this.userId,
      customerId: this.customerId,
      ...props,
    });
    return this;
  }

  flowSeen(flowId: string): this {
    if (this.seenFlowIds.includes(flowId)) return this;
    this.seenFlowIds.push(flowId);
    if (this.onSeenFlowIdsChange) this.onSeenFlowIdsChange([...this.seenFlowIds]);
    return this;
  }
}
