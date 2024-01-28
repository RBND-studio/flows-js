import { FlowState } from "./flow-state";
import { getPathname } from "./lib/location";
import type {
  Flow,
  FlowStep,
  FlowsInitOptions,
  TrackingEvent,
  UserProperties,
  ImmutableMap,
  FlowStepIndex,
} from "./types";

interface PersistentState {
  expiresAt: string | null;
  instances: { flowId: string; stepHistory: FlowStepIndex[] }[];
}

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
  get persistentState(): PersistentState {
    try {
      const data = JSON.parse(window.localStorage.getItem("flows.state") ?? "") as unknown;
      if (typeof data !== "object" || !data) throw new Error();
      const state = data as PersistentState;
      if (state.expiresAt && new Date(state.expiresAt) < new Date()) throw new Error();
      return state;
    } catch {
      return { expiresAt: "", instances: [] };
    }
  }
  savePersistentState(): this {
    try {
      const nowPlus15Min = Date.now() + 1000 * 60 * 15;
      const state: PersistentState = {
        expiresAt: new Date(nowPlus15Min).toISOString(),
        instances: Array.from(this.#instances.values()).map((i) => ({
          flowId: i.flowId,
          stepHistory: i.stepHistory,
        })),
      };
      window.localStorage.setItem("flows.state", JSON.stringify(state));
    } catch {}
    return this;
  }

  addInstance(flowId: string, state: FlowState): this {
    this.#instances.set(flowId, state);
    return this.savePersistentState();
  }
  deleteInstance(flowId: string): this {
    this.#instances.delete(flowId);
    return this.savePersistentState();
  }
  startInstancesFromLocalStorage(): this {
    this.persistentState.instances.forEach((instance) => {
      if (this.#instances.has(instance.flowId) || !this.flowsById?.[instance.flowId]) return;
      const state = new FlowState(instance.flowId, this);
      this.#instances.set(instance.flowId, state);
      state.render();
    });
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
  onIncompleteFlowStart?: (flowId: string, context: FlowsContext) => void;

  updateFromOptions(options: FlowsInitOptions): void {
    if (options.projectId) this.projectId = options.projectId;
    this.onNextStep = options.onNextStep;
    this.onPrevStep = options.onPrevStep;
    this.tracking = options.tracking;
    this.seenFlowIds = [...(options.seenFlowIds ?? [])];
    this.onSeenFlowIdsChange = options.onSeenFlowIdsChange;
    this.onLocationChange = options.onLocationChange;
    this.onIncompleteFlowStart = options.onIncompleteFlowStart;
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
