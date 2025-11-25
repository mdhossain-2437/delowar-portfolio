import { useAchievements } from "@/contexts/AchievementContext";
import { BinaryTitle } from "@/components/ui/BinaryTitle";
import { Trophy, Sparkles, ShieldCheck, Lock } from "lucide-react";

export default function AchievementsPanel() {
  const { achievements, unlocked, progress } = useAchievements();
  const unlockedCount = unlocked.size;
  const total = achievements.length;
  const lockedCount = total - unlockedCount;
  const percent = Math.round(progress * 100);

  const gradientCard =
    "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden";

  return (
    <section className="py-20 bg-gradient-to-br from-background via-[#0b0c14] to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              Achievement system
            </p>
            <h3 className="text-3xl md:text-5xl font-bold">
              <BinaryTitle
                text="Ship milestones, unlock secrets."
                className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              />
            </h3>
            <p className="text-muted-foreground max-w-2xl">
              Progress that mirrors the work: unlocks tied to builds, experiments, and interactions
              across the site.
            </p>
          </div>

          <div className={`${gradientCard} px-6 py-5 w-full lg:w-80`}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-lg font-semibold text-foreground">{percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${Math.max(percent, 6)}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <p className="text-xl font-semibold text-foreground">{unlockedCount}</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Unlocked
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <p className="text-xl font-semibold text-foreground">{lockedCount}</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Hidden
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <p className="text-xl font-semibold text-foreground">{total}</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const isUnlocked = unlocked.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`${gradientCard} p-5 group ${
                  isUnlocked
                    ? "border-emerald-400/50 shadow-[0_10px_50px_rgba(16,185,129,0.15)]"
                    : "border-white/10 opacity-85"
                }`}
              >
                <div className="relative flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {isUnlocked ? (
                        <>
                          <ShieldCheck className="h-4 w-4 text-emerald-400" />
                          Unlocked
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Hidden
                        </>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-foreground">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                  <span
                    className={`h-10 w-10 inline-flex items-center justify-center rounded-full border ${
                      isUnlocked
                        ? "border-emerald-300/60 bg-emerald-400/10 text-emerald-200"
                        : "border-white/15 bg-white/5 text-muted-foreground"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
