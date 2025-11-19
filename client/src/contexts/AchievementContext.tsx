import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Achievement = {
  id: string;
  title: string;
  description: string;
  secret?: boolean;
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "design-maverick",
    title: "Design Maverick",
    description: "Toggled brutalism mode to inspect the raw HTML aesthetic.",
  },
  {
    id: "sonic-vibes",
    title: "Sonic Vibes",
    description: "Booted the audio reactive canvas.",
  },
  {
    id: "ai-consultant",
    title: "AI Consultant",
    description: "Requested an AI project estimate.",
  },
  {
    id: "story-explorer",
    title: "Story Explorer",
    description: "Unlocked the full About narrative.",
  },
  {
    id: "avatar-stylist",
    title: "Avatar Stylist",
    description: "Customized the avatar with new gear.",
  },
  {
    id: "bug-hunter",
    title: "Bug Hunter",
    description: "Defeated the code bug in the developer battle.",
  },
];

type AchievementContextValue = {
  achievements: Achievement[];
  unlocked: Set<string>;
  unlock: (id: string) => void;
  progress: number;
};

const AchievementContext = createContext<AchievementContextValue | undefined>(undefined);
const STORAGE_KEY = "delowar-achievements";

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return new Set(JSON.parse(stored) as string[]);
      }
    } catch {
      // ignore
    }
    return new Set();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(unlocked)));
  }, [unlocked]);

  const unlock = useCallback((id: string) => {
    setUnlocked((prev) => {
      if (prev.has(id)) return prev;
      const updated = new Set(prev);
      updated.add(id);
      return updated;
    });
  }, []);

  const progress = useMemo(() => unlocked.size / ACHIEVEMENTS.length, [unlocked.size]);

  const value = useMemo(
    () => ({
      achievements: ACHIEVEMENTS,
      unlocked,
      unlock,
      progress,
    }),
    [unlocked, unlock, progress],
  );

  return (
    <AchievementContext.Provider value={value}>{children}</AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievements must be used within AchievementProvider");
  }
  return context;
}
