import type {
  CompareValue,
  PrimitiveValue,
  UserProperties,
  UserPropertyMatch,
  UserPropertyMatchGroup,
} from "../types";

export const $regex = (value?: unknown, regex?: string): boolean => {
  if (!regex) return true;
  if (typeof value !== "string") return false;
  return new RegExp(regex).test(value);
};
export const $eq = (value?: unknown, expected?: PrimitiveValue | PrimitiveValue[]): boolean => {
  if (Array.isArray(expected)) return expected.some((v) => $eq(value, v));
  return value === expected;
};
export const $ne = (value?: unknown, expected?: PrimitiveValue | PrimitiveValue[]): boolean => {
  if (Array.isArray(expected)) return expected.every((v) => $ne(value, v));
  return value !== expected;
};
export const $gt = (value?: unknown, expected?: CompareValue): boolean => {
  if (!expected) return true;
  if (typeof value === "number" && typeof expected === "number") return value > expected;
  if (typeof value === "string" && typeof expected === "string") return value > expected;
  if (value instanceof Date && expected instanceof Date) return value > expected;
  return false;
};
export const $gte = (value?: unknown, expected?: CompareValue): boolean => {
  if (!expected) return true;
  if (typeof value === "number" && typeof expected === "number") return value >= expected;
  if (typeof value === "string" && typeof expected === "string") return value >= expected;
  if (value instanceof Date && expected instanceof Date) return value >= expected;
  return false;
};
export const $lt = (value?: unknown, expected?: CompareValue): boolean => {
  if (!expected) return true;
  if (typeof value === "number" && typeof expected === "number") return value < expected;
  if (typeof value === "string" && typeof expected === "string") return value < expected;
  if (value instanceof Date && expected instanceof Date) return value < expected;
  return false;
};
export const $lte = (value?: unknown, expected?: CompareValue): boolean => {
  if (!expected) return true;
  if (typeof value === "number" && typeof expected === "number") return value <= expected;
  if (typeof value === "string" && typeof expected === "string") return value <= expected;
  if (value instanceof Date && expected instanceof Date) return value <= expected;
  return false;
};
export const $contains = (value?: unknown, expected?: string | string[]): boolean => {
  if (!expected) return true;
  if (Array.isArray(expected)) return expected.some((v) => $contains(value, v));
  if (typeof value !== "string") return false;
  return value.includes(expected);
};
export const $notContains = (value?: unknown, expected?: string | string[]): boolean => {
  if (!expected) return true;
  if (Array.isArray(expected)) return expected.every((v) => $notContains(value, v));
  if (typeof value !== "string") return false;
  return !value.includes(expected);
};

const isArrayOfMatchGroups = (
  value: UserPropertyMatchGroup | UserPropertyMatchGroup[],
): value is UserPropertyMatchGroup[] => Array.isArray(value[0]);

export const flowUserPropertyGroupMatch = (
  userProperties: UserProperties = {},
  flowUserProperties?: UserPropertyMatchGroup | UserPropertyMatchGroup[],
): boolean => {
  if (!flowUserProperties) return true;
  if (isArrayOfMatchGroups(flowUserProperties))
    return flowUserProperties.some((group) => flowUserPropertyGroupMatch(userProperties, group));

  return flowUserProperties.every(({ key: propertyKey, ...flowPropertyMatch }) => {
    if (!(propertyKey in userProperties)) return false;
    const userProperty = userProperties[propertyKey];

    return Object.keys(flowPropertyMatch).every((_matchKey) => {
      const matchKey = _matchKey as keyof Omit<UserPropertyMatch, "key">;
      if (matchKey === "regex") {
        return $regex(userProperty, flowPropertyMatch[matchKey]);
      }
      if (matchKey === "eq") {
        const matchValue = flowPropertyMatch[matchKey];
        return $eq(userProperty, matchValue);
      }
      if (matchKey === "ne") {
        const matchValue = flowPropertyMatch[matchKey];
        return $ne(userProperty, matchValue);
      }
      if (matchKey === "gt") {
        const matchValue = flowPropertyMatch[matchKey];
        return $gt(userProperty, matchValue);
      }
      if (matchKey === "gte") {
        const matchValue = flowPropertyMatch[matchKey];
        return $gte(userProperty, matchValue);
      }
      if (matchKey === "lt") {
        const matchValue = flowPropertyMatch[matchKey];
        return $lt(userProperty, matchValue);
      }
      if (matchKey === "lte") {
        const matchValue = flowPropertyMatch[matchKey];
        return $lte(userProperty, matchValue);
      }
      if (matchKey === "contains") {
        const matchValue = flowPropertyMatch[matchKey];
        return $contains(userProperty, matchValue);
      }
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
      if (matchKey === "notContains") {
        const matchValue = flowPropertyMatch[matchKey];
        return $notContains(userProperty, matchValue);
      }

      return true;
    });
  });
};
