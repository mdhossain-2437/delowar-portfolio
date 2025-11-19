import { useQuery } from "@tanstack/react-query";

type FunctionStat = {
  name: string;
  invocations: number;
  errors: number;
  avgDuration: number;
  p95Duration: number;
  region?: string;
};

type ServerlessMetrics = {
  provider: string;
  windowHours: number;
  updatedAt: string;
  totals: {
    invocations: number;
    errors: number;
    avgDuration: number;
  };
  functions: FunctionStat[];
  live: boolean;
  error?: string;
};

export default function ServerlessMetricsPanel() {
  const { data, isLoading, error } = useQuery<ServerlessMetrics>({
    queryKey: ["serverless-metrics"],
    queryFn: async () => {
      const res = await fetch("/api/metrics/serverless");
      if (!res.ok) throw new Error("Failed to fetch serverless metrics");
      return res.json();
    },
    refetchInterval: 1000 * 60 * 5,
  });

  const totals = data?.totals;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Serverless observability
            </p>
            <h3 className="text-2xl font-semibold text-white">
              {data?.provider ?? "serverless"} functions · last {data?.windowHours ?? 24}h
            </h3>
            <p className="text-xs text-muted-foreground">
              Updated {new Date(data?.updatedAt ?? Date.now()).toLocaleTimeString()}
            </p>
          </div>
          {data?.error && (
            <span className="text-xs text-red-400">{data.error}</span>
          )}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Collecting metrics…</p>}
        {error && <p className="text-sm text-red-400">{error.message}</p>}

        {!isLoading && !error && data && totals && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <MetricCard
                label="Invocations"
                value={totals.invocations.toLocaleString()}
                dataTestId="serverless-invocations"
              />
              <MetricCard label="Average duration" value={`${totals.avgDuration} ms`} />
              <MetricCard label="Errors" value={totals.errors.toLocaleString()} />
            </div>

            <div className="space-y-4">
              {data.functions.map((fn) => (
                <div
                  key={fn.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{fn.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {fn.region ?? data.provider} · p95 {fn.p95Duration}ms
                      </p>
                    </div>
                    <div className="text-right text-white">
                      <p className="text-sm font-medium">{fn.invocations} calls</p>
                      <p className="text-xs text-muted-foreground">
                        {fn.errors} errors
                      </p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        fn.errors > 0 ? "bg-red-400" : "bg-emerald-400"
                      }`}
                      style={{
                        width: `${Math.min(100, (fn.invocations / totals.invocations) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>Avg {fn.avgDuration} ms</span>
                    <span>
                      Share {((fn.invocations / totals.invocations) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  dataTestId,
}: {
  label: string;
  value: string;
  dataTestId?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4" data-testid={dataTestId}>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {label}
      </p>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
