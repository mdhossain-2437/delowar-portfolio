import { createContext, useContext, type ReactNode } from "react";
import { useEnvironmentContext } from "@/hooks/useEnvironmentContext";

type EnvironmentValue = ReturnType<typeof useEnvironmentContext>;

const EnvironmentContext = createContext<EnvironmentValue | null>(null);

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const value = useEnvironmentContext();
  return <EnvironmentContext.Provider value={value}>{children}</EnvironmentContext.Provider>;
}

export function useEnvironment() {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) {
    throw new Error("useEnvironment must be used within EnvironmentProvider");
  }
  return ctx;
}
