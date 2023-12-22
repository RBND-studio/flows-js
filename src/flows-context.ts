import { FlowState } from "./flow-state";
import type {
  Flow,
  FlowStep,
  FlowsInitOptions,
  TrackingEvent,
  UserProperties,
  ImmutableMap,
} from "./types";

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
  readonly #instances = new Map<string, FlowState>();
  get instances(): ImmutableMap<string, FlowState> {
    return this.#instances;
  }
  saveInstances(): this {
    try {
      window.localStorage.setItem("flows.instances", JSON.stringify([...this.#instances.keys()]));
    } catch {
      // Do nothing
    }
    return this;
  }
  addInstance(flowId: string, state: FlowState): this {
    this.#instances.set(flowId, state);
    return this.saveInstances();
  }
  deleteInstance(flowId: string): this {
    this.#instances.delete(flowId);
    return this.saveInstances();
  }
  startInstancesFromLocalStorage(): this {
    try {
      const instances = JSON.parse(
        window.localStorage.getItem("flows.instances") ?? "[]",
      ) as string[];
      instances.forEach((flowId) => {
        if (this.#instances.has(flowId) || !this.flowsById?.[flowId]) return;
        const state = new FlowState(flowId, this);
        this.#instances.set(flowId, state);
        state.render();
      });
    } catch {
      // Do nothing
    }
    return this;
  }

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
    this.startInstancesFromLocalStorage();
  }

  addFlowData(flow: Flow): this {
    if (!this.flowsById) this.flowsById = {};
    this.flowsById[flow.id] = flow;
    this.startInstancesFromLocalStorage();
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
