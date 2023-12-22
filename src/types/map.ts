export interface ImmutableMap<K, V> {
  get: (key: K) => V | undefined;
  has: (key: K) => boolean;
  forEach: (callbackfn: (value: V, key: K, map: Map<K, V>) => void) => void;
  values: () => IterableIterator<V>;
}
