import type { FlowState } from "./flow-state";
import type { Flow, FlowStep, FlowsInitOptions, TrackingEvent, UserProperties } from "./types";

export class FlowsContext {
  private static instance: FlowsContext | undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- needed for singleton
  private constructor() {}
  public static getInstance(): FlowsContext {
    if (!FlowsContext.instance) {
      FlowsContext.instance = new FlowsContext();
    }
    return FlowsContext.instance;
  }

  seenFlowIds: string[] = [];
  readonly instances = new Map<string, FlowState>();

  projectId = "";
  userId?: string;
  userProperties?: UserProperties;
  flowsById?: Record<string, Flow>;
  onNextStep?: (step: FlowStep) => void;
  onPrevStep?: (step: FlowStep) => void;
  tracking?: (event: TrackingEvent) => void;
  onSeenFlowIdsChange?: (seenFlowIds: string[]) => void;
  rootElement?: string;

  updateFromOptions(options: FlowsInitOptions): void {
    if (options.projectId) this.projectId = options.projectId;
    this.onNextStep = options.onNextStep;
    this.onPrevStep = options.onPrevStep;
    this.tracking = options.tracking;
    this.seenFlowIds = [...(options.seenFlowIds ?? [])];
    this.onSeenFlowIdsChange = options.onSeenFlowIdsChange;
    this.rootElement = options.rootElement;
    this.userId = options.userId;
    this.userProperties = this.userProperties ?? options.userProperties;
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

  addFlow(flow: Flow): this {
    if (!this.flowsById) this.flowsById = {};
    this.flowsById[flow.id] = flow;
    return this;
  }

  track(props: Omit<TrackingEvent, "userId" | "projectId">): this {
    if (!this.tracking) return this;
    this.tracking({
      userId: this.userId,
      projectId: this.projectId,
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
