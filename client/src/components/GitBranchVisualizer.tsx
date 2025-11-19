import { useQuery } from "@tanstack/react-query";
import { GitBranch } from "lucide-react";

type BranchNode = {
  name: string;
  type: "feature" | "hotfix" | "release";
  mergedInto?: string;
  aheadBy: number;
  lastCommit: string;
};

type BranchResponse = {
  updatedAt: string;
  nodes: BranchNode[];
};

const typeColors: Record<BranchNode["type"], string> = {
  feature: "text-primary",
  hotfix: "text-red-400",
  release: "text-emerald-400",
};

export default function GitBranchVisualizer() {
  const { data, isLoading, error } = useQuery<BranchResponse>({
    queryKey: ["branch-graph"],
    queryFn: async () => {
      const resp = await fetch("/api/engineering/branches");
      if (!resp.ok) throw new Error("Failed to load branches");
      return resp.json();
    },
    refetchInterval: 1000 * 60 * 10,
  });

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center gap-3">
          <GitBranch className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Git mastery
            </p>
            <h3 className="text-2xl font-semibold text-foreground">Branch strategy at a glance</h3>
          </div>
        </div>
        {isLoading && <p className="text-sm text-muted-foreground">Visualizing branches…</p>}
        {error && <p className="text-sm text-red-400">{error.message}</p>}
        {!isLoading && !error && data && (
          <div className="rounded-3xl border border-border bg-card/70 p-6 space-y-4 text-sm">
            <p className="text-xs text-muted-foreground">
              Updated {new Date(data.updatedAt).toLocaleTimeString()}
            </p>
            <div className="space-y-3">
              {data.nodes.map((node) => (
                <div
                  key={node.name}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-border/40 rounded-2xl px-4 py-3 bg-background/60"
                >
                  <div>
                    <p className={`font-semibold ${typeColors[node.type]}`}>{node.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last commit {node.lastCommit}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3">
                    {node.mergedInto ? (
                      <span>merged → {node.mergedInto}</span>
                    ) : (
                      <span>{node.aheadBy} commits ahead</span>
                    )}
                    <span className="px-2 py-1 rounded-full border border-border">
                      {node.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
