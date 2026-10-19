import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

const TraquidContext = createContext(null);

export function TraquidProvider({ value, children }) {
  const store = useRef(null);
  if (!store.current) {
    const listeners = new Set();
    store.current = {
      value,
      subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      notify() {
        listeners.forEach((listener) => listener());
      },
    };
  }
  store.current.value = value;
  useLayoutEffect(() => {
    store.current.notify();
  }, [value]);
  return (
    <TraquidContext.Provider value={store.current}>
      {children}
    </TraquidContext.Provider>
  );
}

export function useTraquid(keys) {
  const store = useContext(TraquidContext);
  if (!store) throw new Error("useTraquid necesita TraquidProvider");
  const cached = useRef(null);
  const signature = keys.join("|");
  const getSnapshot = useMemo(
    () => () => {
      const previous = cached.current;
      if (
        previous?.signature === signature &&
        keys.every((key) => Object.is(previous.snapshot[key], store.value[key]))
      )
        return previous.snapshot;
      const snapshot = Object.fromEntries(
        keys.map((key) => [key, store.value[key]]),
      );
      cached.current = { signature, snapshot };
      return snapshot;
    },
    [store, signature],
  );
  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
