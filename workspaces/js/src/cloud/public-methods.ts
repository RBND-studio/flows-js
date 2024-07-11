import { FlowsContext } from "../core/flows-context";
import { hash } from "../lib/hash";
import { log } from "../lib/log";
import { type IdentifyUserOptions } from "../types";
import { api } from "./api";
import { init } from "./init";
import { FlowsCloudContext } from "./options";

/**
 * Identify a user. Works in the same way as user parameters in `init()`.
 *
 * **Warning**: Use this method only if you don't have information about user at the time of calling `init()`.
 */
export const identifyUser = (options: IdentifyUserOptions): void => {
  const currentOptions = FlowsCloudContext.getInstance().options;
  if (!currentOptions) {
    log.error("Cannot identify user before Flows are initialized.");
    return;
  }
  void init({ ...currentOptions, ...options });
};

/**
 * Reset the progress of all flows for the current user
 * @returns `Promise` that resolves when all flows are reset
 */
export async function resetAllFlows(): Promise<void> {
  const projectId = FlowsContext.getInstance().projectId;
  if (!projectId) {
    log.error("Could not reset all flows: projectId is not set");
    return;
  }
  const userId = FlowsContext.getInstance().userId;
  if (!userId) {
    log.error("Could not reset all flows: userId is not set");
    return;
  }
  const userHash = await hash(userId);
  await api.resetUserProgress({
    projectId,
    userHash,
  });
  // Reinitialize Flows to load flows that have been reset
  const options = FlowsCloudContext.getInstance().options;
  if (!options) return;
  await init(options);
}

/**
 * Reset the progress of a flow for the current user
 * @param flowId - Flow Human ID found in the Flow Settings
 * @returns `Promise` that resolves when the flow is reset
 */
export async function resetFlow(flowId: string): Promise<void> {
  const projectId = FlowsContext.getInstance().projectId;
  if (!projectId) {
    log.error(`Could not reset flow ${flowId}: projectId is not set`);
    return;
  }
  const userId = FlowsContext.getInstance().userId;
  if (!userId) {
    log.error(`Could not reset flow ${flowId}: userId is not set`);
    return;
  }
  const userHash = await hash(userId);
  await api.resetUserProgress({
    projectId,
    userHash,
    flowId,
  });
  // Reinitialize Flows to load flows that have been reset
  const options = FlowsCloudContext.getInstance().options;
  if (!options) return;
  await init(options);
}
