import { getPathname } from "../lib/location";
import type {
  Flow,
  FlowStep,
  FlowsInitOptions,
  TrackingEvent,
  UserProperties,
  ImmutableMap,
  FlowStepIndex,
  Tracking,
  Debug,
  DebugEvent,
  IdentifyUserOptions,
  SeenFlow,
} from "../types";
import { log } from "../lib/log";
import { storage } from "../lib/storage";
import { FlowState } from "./flow-state";
import { validateFlow } from "./validation";
import { type PreviewPanel } from "./preview-panel";

interface PersistentState {
  seenFlows: SeenFlow[];
  runningFlows: { flowId: string; stepHistory: FlowStepIndex[] }[];
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

  seenFlows: SeenFlow[] = this.persistentState.seenFlows;
  readonly #instances = new Map<string, FlowState>();
  get instances(): ImmutableMap<string, FlowState> {
    return this.#instances;
  }
  previewPanel: PreviewPanel | null = null;
  get persistentState(): PersistentState {
    try {
      const data = storage("session").get<PersistentState>("flows.state");
      if (!data) throw new Error();
      return data;
    } catch {
      return { runningFlows: [], seenFlows: [] };
    }
  }
  savePersistentState(): this {
    try {
      const state: PersistentState = {
        runningFlows: Array.from(this.#instances.values()).map((i) => ({
          flowId: i.flowId,
          stepHistory: i.stepHistory,
        })),
        seenFlows: this.seenFlows,
      };
      storage("session").set("flows.state", state);
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
    this.persistentState.runningFlows.forEach((instance) => {
      if (!this.flowsById?.[instance.flowId]) return;
      const runningInstance = this.#instances.get(instance.flowId);
      if (runningInstance) return runningInstance.render();
      const state = new FlowState(instance.flowId, this);
      this.#instances.set(instance.flowId, state);
      state.render();
    });
    return this;
  }

  projectId?: string;
  userId?: string;
  userProperties?: UserProperties;
  flowsById?: Record<string, Flow>;
  onNextStep?: (step: FlowStep) => void;
  onPrevStep?: (step: FlowStep) => void;
  tracking?: Tracking;
  debug?: Debug;
  onSeenFlowsChange?: (seenFlows: SeenFlow[]) => void;
  rootElement?: string;
  onLocationChange?: (pathname: string, context: FlowsContext) => void;
  onIncompleteFlowStart?: (flowId: string, context: FlowsContext) => void;

  updateFromOptions(options: FlowsInitOptions): void {
    this.projectId = options.projectId;
    this.onNextStep = options.onNextStep;
    this.onPrevStep = options.onPrevStep;
    this.tracking = options.tracking;
    this.debug = options._debug;
    this.seenFlows = options.seenFlows ? [...options.seenFlows] : this.seenFlows;
    this.onSeenFlowsChange = options.onSeenFlowsChange;
    this.onLocationChange = options.onLocationChange;
    this.onIncompleteFlowStart = options.onIncompleteFlowStart;
    this.rootElement = options.rootElement;
    this.flowsById = {
      ...options.flows?.reduce(
        (acc, flow) => {
          acc[flow.id] = flow;
          return acc;
        },
        {} as Record<string, Flow>,
      ),
    };
    this.updateUser(options);
    this.startInstancesFromLocalStorage();
  }

  updateUser = (options: IdentifyUserOptions): this => {
    this.userId = options.userId;
    this.userProperties = options.userProperties;
    return this;
  };

  addFlowData(flow: Flow, { validate = true }: { validate?: boolean } = {}): this {
    if (validate) {
      const validationResult = validateFlow(flow);
      if (validationResult.error)
        log.error(
          `Error validating flow at: flow.${validationResult.error.path.join(".")} with value:`,
          validationResult.error.value,
        );
      if (!validationResult.valid) return this;
    }

    if (!this.flowsById) this.flowsById = {};
    this.flowsById[flow.id] = flow;
    this.startInstancesFromLocalStorage();
    return this;
  }

  track(props: Omit<TrackingEvent, "userId" | "projectId" | "location">): void {
    if (!this.tracking) return;
    const event: TrackingEvent = {
      userId: this.userId,
      location: getPathname(),
      ...props,
    };
    if (this.projectId) event.projectId = this.projectId;
    this.tracking(event);
  }
  handleDebug(
    props: Omit<DebugEvent, "userId" | "projectId" | "location">,
  ): undefined | ReturnType<Debug> {
    if (!this.debug) return;
    const event: DebugEvent = {
      userId: this.userId,
      location: getPathname(),
      ...props,
    };
    if (this.projectId) event.projectId = this.projectId;
    return this.debug(event);
  }

  flowSeen(flowId: string): this {
    this.seenFlows = this.seenFlows.filter((seenFlow) => seenFlow.flowId !== flowId);
    this.seenFlows.push({ flowId, seenAt: new Date().toISOString() });
    this.savePersistentState();
    this.onSeenFlowsChange?.([...this.seenFlows]);
    return this;
  }
}
