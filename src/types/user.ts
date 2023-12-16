export type UserProperties = Record<string, string | number | boolean | null | Date>;

export interface IdentifyUserOptions {
  /**
   * Properties to set for the user used for targeting flows.
   *
   * `Date` can also be supplied in ISO 8601 format to support sending dates in JSON.
   */
  properties?: UserProperties;
}
