import { FlowState } from "./flow-state";
import { getPathname } from "./lib/location";
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
  onLocationChange?: (pathname: string, context: FlowsContext) => void;

  updateFromOptions(options: FlowsInitOptions): void {
    if (options.projectId) this.projectId = options.projectId;
    this.onNextStep = options.onNextStep;
    this.onPrevStep = options.onPrevStep;
    this.tracking = options.tracking;
    this.seenFlowIds = [...(options.seenFlowIds ?? [])];
    this.onSeenFlowIdsChange = options.onSeenFlowIdsChange;
    this.onLocationChange = options.onLocationChange;
    this.rootElement = options.rootElement;
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
    this.updateUser(options.userId, options.userProperties);
    this.startInstancesFromLocalStorage();
  }

  updateUser = (userId?: string, userProperties?: UserProperties): this => {
    this.userId = userId ?? this.userId;
    this.userProperties = userProperties ?? this.userProperties;
    return this;
  };

  addFlowData(flow: Flow): this {
    if (!this.flowsById) this.flowsById = {};
    this.flowsById[flow.id] = flow;
    this.startInstancesFromLocalStorage();
    return this;
  }

  track(props: Omit<TrackingEvent, "userId" | "projectId" | "location">): this {
    if (!this.tracking) return this;
    const event: TrackingEvent = {
      userId: this.userId,
      location: getPathname(),
      ...props,
    };
    if (this.projectId) event.projectId = this.projectId;
    this.tracking(event);
    return this;
  }

  flowSeen(flowId: string): this {
    if (this.seenFlowIds.includes(flowId)) return this;
    this.seenFlowIds.push(flowId);
    if (this.onSeenFlowIdsChange) this.onSeenFlowIdsChange([...this.seenFlowIds]);
    return this;
  }
}
