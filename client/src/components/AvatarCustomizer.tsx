import { useAchievements } from "@/contexts/AchievementContext";
import { useEffect, useState } from "react";

type AvatarState = {
  glasses: boolean;
  hat: boolean;
  background: string;
};

const STORAGE_KEY = "avatar-style";

export default function AvatarCustomizer() {
  const [state, setState] = useState<AvatarState>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return { glasses: false, hat: false, background: "#0f172a" };
  });
  const { unlock, unlocked } = useAchievements();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if ((state.glasses || state.hat) && !unlocked.has("avatar-stylist")) {
      unlock("avatar-stylist");
    }
  }, [state, unlock, unlocked]);

  return (
    <section className="py-20 bg-card/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Avatar customization
          </p>
          <h3 className="text-3xl font-semibold text-foreground">
            Dress the hero that welcomes recruiters
          </h3>
        </div>
        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          <div
            className="rounded-3xl border border-border flex items-center justify-center p-6"
            style={{ background: state.background }}
          >
            <div className="relative">
              <div className="h-40 w-32 bg-white rounded-full shadow-inner" />
              {state.hat && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-10 bg-black rounded-t-2xl" />
              )}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-foreground opacity-80" />
                <div className="h-8 w-8 rounded-full bg-foreground opacity-80" />
              </div>
              {state.glasses && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  <div className="h-10 w-10 border-2 border-black rounded-full bg-transparent" />
                  <div className="h-10 w-10 border-2 border-black rounded-full bg-transparent" />
                </div>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-background/80 p-6 space-y-4">
            <label className="flex items-center justify-between text-sm">
              Glasses
              <input
                type="checkbox"
                checked={state.glasses}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, glasses: event.target.checked }))
                }
              />
            </label>
            <label className="flex items-center justify-between text-sm">
              Hat
              <input
                type="checkbox"
                checked={state.hat}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, hat: event.target.checked }))
                }
              />
            </label>
            <label className="flex items-center justify-between text-sm">
              Background
              <input
                type="color"
                value={state.background}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, background: event.target.value }))
                }
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
