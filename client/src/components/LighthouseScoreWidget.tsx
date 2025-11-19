import { useQuery } from "@tanstack/react-query";
import { Gauge } from "lucide-react";

type LighthouseMetrics = {
  performance: number;
  updatedAt: string;
};

export default function LighthouseScoreWidget() {
  const { data, isLoading, error } = useQuery<LighthouseMetrics>({
    queryKey: ["lighthouse-score"],
    queryFn: async () => {
      const response = await fetch("/api/metrics/lighthouse");
      if (!response.ok) {
        throw new Error("Failed to load Lighthouse score");
      }
      return response.json();
    },
    refetchInterval: 1000 * 60 * 10,
  });

  const score = data?.performance ?? 0;
  const label = isLoading
    ? "Auditing Lighthouse…"
    : error
      ? "Unable to fetch Lighthouse score"
      : `Lighthouse performance`;

  const gaugeColor =
    score >= 90 ? "text-emerald-400" : score >= 70 ? "text-amber-400" : "text-red-400";

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background/90 backdrop-blur-lg px-4 py-3 shadow-xl w-60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className={`h-4 w-4 ${gaugeColor}`} />
            <span className="text-xs font-semibold text-foreground">{label}</span>
          </div>
          {!isLoading && !error && (
            <span className="text-[10px] text-muted-foreground">
              {new Date(data?.updatedAt ?? Date.now()).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${gaugeColor}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
        {error && <p className="text-xs text-red-400">{error.message}</p>}
        {isLoading && (
          <p className="text-xs text-muted-foreground animate-pulse">Collecting data…</p>
        )}
      </div>
    </div>
  );
}
