import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAchievements } from "@/contexts/AchievementContext";

type EstimateResponse = {
  brief: string;
  estimate: {
    timelineWeeks: number;
    budgetUSD: number;
    confidence: number;
    tags: string[];
    rationale: string;
  };
  generatedAt: string;
};

export default function AIQuickEstimate() {
  const [brief, setBrief] = useState("");
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { unlock, unlocked } = useAchievements();

  const submit = async () => {
    if (!brief.trim()) {
      setError("Please describe your project first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).message ?? "Estimation failed");
      }
      const data: EstimateResponse = await response.json();
      setResult(data);
      if (!unlocked.has("ai-consultant")) {
        unlock("ai-consultant");
      }
    } catch (err: any) {
      setError(err.message ?? "Failed to run estimate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-card/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
            AI Quick Estimate
          </p>
          <h3 className="text-3xl font-semibold text-foreground">
            Drop a brief, get a ballpark in seconds
          </h3>
        </div>
        <textarea
          value={brief}
          onChange={(event) => setBrief(event.target.value)}
          rows={5}
          className="w-full rounded-3xl border border-border bg-background/70 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Example: Build a React + Firebase booking system with admin dashboards and voice search…"
        />
        <div className="flex items-center gap-3">
          <Button onClick={submit} disabled={loading}>
            {loading ? "Estimating…" : "Generate estimate"}
          </Button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
        {result && (
        <div
          className="rounded-3xl border border-border bg-background/80 p-5 space-y-3"
          data-testid="estimate-result"
        >
            <p className="text-sm text-muted-foreground">
              Generated {new Date(result.generatedAt).toLocaleTimeString()} · tags{" "}
              {result.estimate.tags.join(", ")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <EstimateCard label="Timeline" value={`${result.estimate.timelineWeeks} weeks`} />
              <EstimateCard
                label="Budget"
                value={`$${result.estimate.budgetUSD.toLocaleString()}`}
              />
              <EstimateCard
                label="Confidence"
                value={`${Math.round(result.estimate.confidence * 100)}%`}
              />
            </div>
            <p className="text-sm text-muted-foreground">{result.estimate.rationale}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function EstimateCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-popover/70 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
