import { useCallback, useMemo, useSyncExternalStore } from "react";

// SSR-safe media-query subscription. `serverDefault` controls what the server
// (and the first client render before hydration commits) sees — set it so the
// SSR output matches what mobile-first users should see if they're on a slow
// device that hasn't hydrated yet.
export function useMediaQuery(query: string, serverDefault = false): boolean {
  const mq = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia(query) : null),
    [query],
  );

  const subscribe = useCallback(
    (cb: () => void) => {
      mq?.addEventListener("change", cb);
      return () => mq?.removeEventListener("change", cb);
    },
    [mq],
  );

  const getSnapshot = useCallback(
    () => mq?.matches ?? serverDefault,
    [mq, serverDefault],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => serverDefault);
}
