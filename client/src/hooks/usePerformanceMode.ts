import { useEffect } from "react";

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

const shouldEnablePerfLite = () => {
  if (typeof window === "undefined") return false;
  const connection = getConnection();
  const saveData = Boolean(connection?.saveData);
  const lowBandwidth =
    typeof connection?.effectiveType === "string" &&
    ["slow-2g", "2g"].includes(connection.effectiveType);
  const lowMemory = (getDeviceMemory() ?? Infinity) <= 4;
  const limitedThreads = (getHardwareThreads() ?? Infinity) <= 4;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return saveData || lowBandwidth || lowMemory || limitedThreads || prefersReducedMotion;
};

export function usePerformanceMode() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    const apply = () => {
      const enable = shouldEnablePerfLite();
      body.classList.toggle("perf-lite", enable);
    };

    apply();
    const connection = getConnection();
    const handler = () => apply();
    connection?.addEventListener?.("change", handler);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionHandler = () => apply();
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", motionHandler);
    } else {
      motionQuery.addListener(motionHandler);
    }

    return () => {
      connection?.removeEventListener?.("change", handler);
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", motionHandler);
      } else {
        motionQuery.removeListener(motionHandler);
      }
    };
  }, []);
}
