export type UserProperties = Record<string, string | number | boolean | null | Date | undefined>;

export interface IdentifyUserOptions {
  /**
   * The unique ID of the user used for frequency and flow tracking. Needed mainly when using Flows Cloud. This value is automatically when sending events to Flows Cloud.
   * @example
   * "353e72df-caeb-4897-b87a-2d9b8b7686bb"
   */
  userId?: string;
  /**
   * Properties used for targeting flows. The targeting is done on the client so Flows Cloud never receives the user properties.
   *
   * `Date` can also be supplied in ISO 8601 format to support sending dates in JSON.
   */
  userProperties?: UserProperties;
}
