import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/useTranslation";

type StatsPayload = {
  commits: number;
  yearsOfExperience: number;
  coffeesConsumed: number;
  uptimeDays: number;
};

const statKeys: Array<{ key: keyof StatsPayload; translationKey: string }> = [
  { key: "commits", translationKey: "stats.commits" },
  { key: "yearsOfExperience", translationKey: "stats.years" },
  { key: "coffeesConsumed", translationKey: "stats.coffee" },
  { key: "uptimeDays", translationKey: "stats.uptime" },
];

const fetchStats = async (): Promise<StatsPayload> => {
  const response = await fetch("/api/stats");
  if (!response.ok) throw new Error("Failed to load stats");
  return response.json() as Promise<StatsPayload>;
};

export default function StatsDashboard() {
  const { data } = useQuery({
    queryKey: ["site-stats"],
    queryFn: fetchStats,
    staleTime: 60_000,
  });
  const t = useTranslation();

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            {t("stats.title")}
          </p>
          <p className="text-muted-foreground">{t("stats.subtitle")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {statKeys.map((entry, index) => (
            <motion.div
              key={entry.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur"
            >
              <p className="text-3xl font-bold text-white">
                {data ? data[entry.key].toLocaleString() : "—"}
              </p>
              <p className="text-sm text-muted-foreground">{t(entry.translationKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
