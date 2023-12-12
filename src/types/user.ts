export type UserProperties = Record<string, string>;

export interface IdentifyUserOptions {
  /**
   * Properties to set for the user used for targeting flows.
   */
  properties?: UserProperties;
}
