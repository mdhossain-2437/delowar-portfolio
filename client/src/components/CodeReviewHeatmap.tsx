import { useQuery } from "@tanstack/react-query";

type HeatmapResponse = {
  days: Array<{
    date: string;
    comments: number;
    approvals: number;
  }>;
  summary: {
    comments: number;
    approvals: number;
  };
};

export default function CodeReviewHeatmap() {
  const { data, isLoading, error } = useQuery<HeatmapResponse>({
    queryKey: ["code-review-heatmap"],
    queryFn: async () => {
      const resp = await fetch("/api/engineering/code-reviews");
      if (!resp.ok) throw new Error("Failed to load reviews");
      return resp.json();
    },
    refetchInterval: 1000 * 60 * 10,
  });

  if (isLoading) return <Skeleton />;
  if (error || !data)
    return <HeatmapError message={error?.message ?? "Unable to load heatmap."} />;

  return (
    <section className="py-20 bg-card/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Code review heatmap
          </p>
          <h3 className="text-3xl font-semibold text-foreground">
            How often I dive into PRs
          </h3>
        </div>
        <div className="rounded-3xl border border-border bg-background/80 p-5">
          <div className="grid grid-cols-7 gap-1 text-center">
            {data.days.map((day) => {
              const intensity = Math.min(1, (day.comments + day.approvals) / 5);
              const bg =
                intensity === 0
                  ? "var(--border)"
                  : `rgba(168, 85, 247, ${0.2 + intensity * 0.8})`;
              return (
                <div
                  key={day.date}
                  className="h-10 rounded-md flex flex-col items-center justify-center text-[10px] text-background"
                  style={{ backgroundColor: bg }}
                  title={`${day.comments} comments, ${day.approvals} approvals`}
                >
                  <span>{day.comments}</span>
                  <span className="text-[8px]">{day.approvals}✔</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
            <div>
              Comments: <strong>{data.summary.comments}</strong>
            </div>
            <div>
              Approvals: <strong>{data.summary.approvals}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skeleton() {
  return (
    <div className="py-20 bg-card/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-4">
        <div className="h-5 w-48 bg-muted rounded-full" />
        <div className="rounded-3xl border border-border bg-background/80 p-5 h-40" />
      </div>
    </div>
  );
}

function HeatmapError({ message }: { message: string }) {
  return (
    <div className="py-20 bg-card/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-red-400 text-sm">
        {message}
      </div>
    </div>
  );
}
