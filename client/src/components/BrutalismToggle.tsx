import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAchievements } from "@/contexts/AchievementContext";

const STORAGE_KEY = "theme-mode";

export default function BrutalismToggle() {
  const [enabled, setEnabled] = useState(false);
  const { toast } = useToast();
  const { unlock, unlocked } = useAchievements();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "brutalism") {
      setEnabled(true);
      document.body.classList.add("brutalism-mode");
    }
  }, []);

  const toggleBrutalism = () => {
    setEnabled((prev) => {
      const next = !prev;
      const body = document.body;
      if (next) {
        body.classList.add("brutalism-mode");
        window.localStorage.setItem(STORAGE_KEY, "brutalism");
        toast({
          title: "Brutalism mode",
          description: "Raw HTML/CSS aesthetic enabled",
        });
        if (!unlocked.has("design-maverick")) {
          unlock("design-maverick");
        }
      } else {
        body.classList.remove("brutalism-mode");
        window.localStorage.removeItem(STORAGE_KEY);
        toast({
          title: "Brutalism mode off",
          description: "Back to crafted UI",
        });
      }
      return next;
    });
  };

  return (
    <Button
      variant={enabled ? "destructive" : "outline"}
      size="sm"
      onClick={toggleBrutalism}
      className="font-mono text-xs tracking-widest"
      data-testid="brutalism-toggle"
    >
      {enabled ? "Disable Brutalism" : "⚡ Brutalism Mode"}
    </Button>
  );
}
