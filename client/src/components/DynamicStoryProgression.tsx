import { useAchievements } from "@/contexts/AchievementContext";
import { useState } from "react";

const storyBeats = [
  "2012: hacking on school PCs and fixing bikes to pay for web hosting.",
  "2016: first freelance dashboard for a logistics firm, learned to ship under pressure.",
  "2021: led a cross-border team building creator tooling, fell in love with AI ops.",
  "2024+: designing personal operating systems for founders and experimenting with spatial UX.",
];

export default function DynamicStoryProgression() {
  const [index, setIndex] = useState(1);
  const { unlock } = useAchievements();

  const revealNext = () => {
    setIndex((prev) => {
      const next = Math.min(storyBeats.length, prev + 1);
      if (next === storyBeats.length) {
        unlock("story-explorer");
      }
      return next;
    });
  };

  return (
    <section className="py-20 bg-card/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Story progression
          </p>
          <h3 className="text-3xl font-semibold text-foreground">Scroll to continue my arc</h3>
        </div>
        <div className="space-y-3">
          {storyBeats.slice(0, index).map((beat) => (
            <p key={beat} className="rounded-2xl border border-border bg-background/80 p-4">
              {beat}
            </p>
          ))}
        </div>
        {index < storyBeats.length && (
          <button
            type="button"
            onClick={revealNext}
            className="text-xs uppercase tracking-[0.3em] text-primary"
          >
            Continue story →
          </button>
        )}
      </div>
    </section>
  );
}
