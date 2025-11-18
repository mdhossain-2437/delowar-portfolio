import { useEffect, useState } from "react";

type NavigatorConnection = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

const getConnection = (): NavigatorConnection | undefined =>
  typeof navigator !== "undefined"
    ? ((navigator as any).connection as NavigatorConnection | undefined)
    : undefined;

const getDeviceMemory = () =>
  typeof navigator !== "undefined" &&
  typeof (navigator as any).deviceMemory === "number"
    ? ((navigator as any).deviceMemory as number)
    : undefined;

const getHardwareThreads = () =>
  typeof navigator !== "undefined" &&
  typeof navigator.hardwareConcurrency === "number"
    ? navigator.hardwareConcurrency
    : undefined;

const getInitialState = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isCompactScreen = window.matchMedia("(max-width: 768px)").matches;
  const connection = getConnection();
  const saveData = Boolean(connection?.saveData);
  const lowBandwidth =
    typeof connection?.effectiveType === "string" &&
    ["slow-2g", "2g"].includes(connection.effectiveType);
  const lowMemory = (getDeviceMemory() ?? Infinity) <= 4;
  const limitedThreads = (getHardwareThreads() ?? Infinity) <= 4;

  return !(
    prefersReducedMotion ||
    isCompactScreen ||
    saveData ||
    lowBandwidth ||
    lowMemory ||
    limitedThreads
  );
};

export function useShouldRenderHeroCanvas() {
  const [shouldRender, setShouldRender] = useState(getInitialState);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const screenQuery = window.matchMedia("(max-width: 768px)");
    const connection = getConnection();

    const recompute = () => {
      const saveData = Boolean(connection?.saveData);
      const lowBandwidth =
        typeof connection?.effectiveType === "string" &&
        ["slow-2g", "2g"].includes(connection.effectiveType);
      const lowMemory = (getDeviceMemory() ?? Infinity) <= 4;
      const limitedThreads = (getHardwareThreads() ?? Infinity) <= 4;

      setShouldRender(
        !(
          motionQuery.matches ||
          screenQuery.matches ||
          saveData ||
          lowBandwidth ||
          lowMemory ||
          limitedThreads
        ),
      );
    };

    recompute();

    const subscribe = (query: MediaQueryList) => {
      const handler = () => recompute();
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", handler);
        return () => query.removeEventListener?.("change", handler);
      }

      query.addListener(handler);
      return () => query.removeListener(handler);
    };

    const unsubMotion = subscribe(motionQuery);
    const unsubScreen = subscribe(screenQuery);

    const connectionHandler = () => recompute();
    connection?.addEventListener?.("change", connectionHandler);

    return () => {
      unsubMotion();
      unsubScreen();
      connection?.removeEventListener?.("change", connectionHandler);
    };
  }, []);

  return shouldRender;
}
