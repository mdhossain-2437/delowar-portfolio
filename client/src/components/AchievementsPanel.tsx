import { useAchievements } from "@/contexts/AchievementContext";
import { Trophy } from "lucide-react";

export default function AchievementsPanel() {
  const { achievements, unlocked, progress } = useAchievements();

  return (
    <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Achievement system
            </p>
            <h3 className="text-2xl font-semibold text-white">
              You’ve unlocked {(progress * 100).toFixed(0)}% of available secrets
            </h3>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const isUnlocked = unlocked.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`rounded-2xl border px-4 py-3 ${
                  isUnlocked
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : "border-white/10 bg-black/20 opacity-70"
                }`}
              >
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  {achievement.title}
                  {isUnlocked && (
                    <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-300">
                      unlocked
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
