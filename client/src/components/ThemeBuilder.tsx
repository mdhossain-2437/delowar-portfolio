import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type ThemeConfig = {
  background: string;
  foreground: string;
  primary: string;
  accent: string;
};

const STORAGE_KEY = "custom-theme-config";
const vars: Array<keyof ThemeConfig> = ["background", "foreground", "primary", "accent"];

export default function ThemeBuilder() {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage?.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return {
      background: "#05030f",
      foreground: "#f8fafc",
      primary: "#a855f7",
      accent: "#38bdf8",
    };
  });
  const initialVars = useRef<Record<string, string>>({});

  useEffect(() => {
    const doc = document.documentElement;
    vars.forEach((key) => {
      if (!initialVars.current[key]) {
        initialVars.current[key] = getComputedStyle(doc).getPropertyValue(`--${key}`);
      }
    });
  }, []);

  useEffect(() => {
    const doc = document.documentElement;
    vars.forEach((key) => doc.style.setProperty(`--${key}`, config[key]));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const reset = () => {
    const doc = document.documentElement;
    vars.forEach((key) => {
      doc.style.setProperty(`--${key}`, initialVars.current[key]);
    });
    window.localStorage.removeItem(STORAGE_KEY);
    setConfig({
      background: initialVars.current.background?.trim() ?? "#05030f",
      foreground: initialVars.current.foreground?.trim() ?? "#f8fafc",
      primary: initialVars.current.primary?.trim() ?? "#a855f7",
      accent: initialVars.current.accent?.trim() ?? "#38bdf8",
    });
  };

  const downloadTheme = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "delowar-theme.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Custom theme builder
          </p>
          <h3 className="text-3xl font-semibold text-foreground">
            Pick your colors, export your vibe
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vars.map((key) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-2xl border border-border bg-card/70 px-4 py-3 text-sm font-semibold text-foreground"
            >
              <span className="capitalize">{key}</span>
              <input
                type="color"
                value={config[key]}
                onChange={(event) =>
                  setConfig((prev) => ({ ...prev, [key]: event.target.value }))
                }
                className="w-14 h-8 rounded-md border border-border cursor-pointer"
              />
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={downloadTheme} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download JSON
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset to default
          </Button>
        </div>
      </div>
    </section>
  );
}
