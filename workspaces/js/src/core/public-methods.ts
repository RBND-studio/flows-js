import { FlowsContext } from "./flows-context";

const flowsController = FlowsContext.getInstance().flowsController;

/**
 * Start a Flow.
 */
export const startFlow = flowsController.startFlow.bind(flowsController);

/**
 * Stop a Flow.
 */
export const endFlow = flowsController.endFlow.bind(flowsController);

/**
 * Identify a user. Works in the same way as user parameters in `init()`.
 */
export const identifyUser = flowsController.identifyUser.bind(flowsController);

/**
 * Get the current step of a running Flow. Returns `null` if the Flow is not running.
 */
export const getCurrentStep = flowsController.getCurrentStep.bind(flowsController);
/**
 * Go to the next step of a running Flow.
 */
export const nextStep = flowsController.nextStep.bind(flowsController);
