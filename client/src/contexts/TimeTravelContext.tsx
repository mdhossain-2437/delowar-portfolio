import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Era = "2025" | "2024" | "2023" | "2022";

type TimeTravelValue = {
  era: Era;
  setEra: (era: Era) => void;
};

const TimeTravelContext = createContext<TimeTravelValue | null>(null);
const STORAGE_KEY = "delowar-era";

export function TimeTravelProvider({ children }: { children: ReactNode }) {
  const [era, setEraState] = useState<Era>(() => {
    if (typeof window === "undefined") return "2025";
    const stored = window.localStorage.getItem(STORAGE_KEY) as Era | null;
    return stored ?? "2025";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.dataset.era = era;
    window.localStorage.setItem(STORAGE_KEY, era);
  }, [era]);

  const value = useMemo(
    () => ({
      era,
      setEra: setEraState,
    }),
    [era],
  );

  return <TimeTravelContext.Provider value={value}>{children}</TimeTravelContext.Provider>;
}

export function useTimeTravel() {
  const ctx = useContext(TimeTravelContext);
  if (!ctx) throw new Error("useTimeTravel must be used within TimeTravelProvider");
  return ctx;
}
