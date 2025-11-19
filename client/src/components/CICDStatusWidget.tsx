import { useQuery } from "@tanstack/react-query";
import { GitMerge, RefreshCw } from "lucide-react";

type WorkflowRun = {
  id: string;
  name: string;
  status: string;
  conclusion: string | null;
  commit: string;
  url: string;
  startedAt: string;
  durationSeconds: number;
};

type CIResponse = {
  provider: string;
  repo: string;
  branch: string;
  runs: WorkflowRun[];
  live: boolean;
  fetchedAt: string;
  error?: string;
};

const statusIndicator = (run: WorkflowRun) => {
  if (run.status === "in_progress" || run.status === "queued") {
    return "text-amber-400";
  }
  if (run.conclusion === "success") {
    return "text-emerald-400";
  }
  if (run.conclusion === "failure" || run.conclusion === "cancelled") {
    return "text-red-400";
  }
  return "text-muted-foreground";
};

export default function CICDStatusWidget() {
  const { data, isLoading, error } = useQuery<CIResponse>({
    queryKey: ["ci-status"],
    queryFn: async () => {
      const resp = await fetch("/api/metrics/cicd");
      if (!resp.ok) {
        throw new Error("Failed to load CI/CD status");
      }
      return resp.json();
    },
    refetchInterval: 1000 * 60 * 5,
  });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">
              CI/CD pipeline
            </h3>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            <span>
              {new Date(data?.fetchedAt ?? Date.now()).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading workflow runs…</p>}
        {error && <p className="text-sm text-red-400">{error.message}</p>}

        {!isLoading && !error && data && (
          <>
            <div className="text-xs text-muted-foreground mb-4">
              {data.repo}@{data.branch} ·{" "}
              {data.live ? "live GitHub data" : "demo snapshot"}
              {data.error ? ` (${data.error})` : ""}
            </div>
            <div className="space-y-3">
              {data.runs.map((run) => (
                <a
                  key={run.id}
                  href={run.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-2xl border border-border bg-background/60 px-4 py-3 hover:border-accent transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{run.name}</p>
                    <p className="text-xs text-muted-foreground">
                      commit {run.commit} ·{" "}
                      {new Date(run.startedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-semibold ${statusIndicator(run)}`}>
                      {run.conclusion ?? run.status}
                    </span>
                    <span className="text-muted-foreground">
                      {run.durationSeconds}s
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
