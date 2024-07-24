import { type FlowStepIndex, type SeenFlow } from "../types";
import { storage } from "./storage";

interface PersistentState {
  seenFlows: SeenFlow[];
  runningFlows: { flowId: string; stepHistory: FlowStepIndex[]; draft: boolean }[];
}

export const getPersistentState = (): PersistentState => {
  try {
    const data = storage("session").get<PersistentState>("flows.state");
    if (!data) throw new Error();
    return data;
  } catch {
    return { runningFlows: [], seenFlows: [] };
  }
};

export const setPersistentState = (state: PersistentState): void => {
  try {
    storage("session").set("flows.state", state);
  } catch {}
};
