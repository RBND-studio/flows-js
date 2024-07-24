import { type FlowsCloudOptions } from "../types";

export class FlowsCloudContext {
  private static instance: FlowsCloudContext | undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- needed for singleton
  private constructor() {}
  public static getInstance(): FlowsCloudContext {
    if (!FlowsCloudContext.instance) {
      FlowsCloudContext.instance = new FlowsCloudContext();
    }
    return FlowsCloudContext.instance;
  }

  options: FlowsCloudOptions | null = null;
}
