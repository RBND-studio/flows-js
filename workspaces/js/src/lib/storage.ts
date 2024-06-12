type StorageType = "local" | "session";

const isServer = (): boolean => typeof window === "undefined";

const getStorage = (type: StorageType): Storage =>
  type === "local" ? window.localStorage : window.sessionStorage;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- useful for inferred type
export const storage = (type: StorageType) => {
  return {
    set: <T>(key: string, value: T) => {
      if (isServer()) return;

      getStorage(type).setItem(key, JSON.stringify(value));
    },
    get: <T>(key: string): T | null => {
      if (isServer()) return null;

      const value = getStorage(type).getItem(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    },
    remove: (key: string) => {
      if (isServer()) return;

      getStorage(type).removeItem(key);
    },
  };
};
