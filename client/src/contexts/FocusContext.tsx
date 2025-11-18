import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type FocusContextValue = {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
};

const FocusContext = createContext<FocusContextValue | null>(null);
const STORAGE_KEY = "delowar-focus-mode";

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("focus-mode", isFocusMode);
    if (isFocusMode) {
      document.body.classList.remove("theme-day");
      document.body.classList.remove("theme-night");
    }
    window.localStorage.setItem(STORAGE_KEY, isFocusMode ? "1" : "0");
  }, [isFocusMode]);

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      isFocusMode,
      toggleFocusMode,
    }),
    [isFocusMode, toggleFocusMode],
  );

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

export function useFocusMode() {
  const ctx = useContext(FocusContext);
  if (!ctx) {
    throw new Error("useFocusMode must be used within FocusModeProvider");
  }
  return ctx;
}
