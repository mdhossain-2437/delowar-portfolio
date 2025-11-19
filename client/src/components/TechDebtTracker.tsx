const debtSlices = [
  { label: "Legacy CSS", value: 32, color: "#a855f7" },
  { label: "Type coverage", value: 24, color: "#38bdf8" },
  { label: "Test gaps", value: 18, color: "#fbbf24" },
  { label: "Docs backlog", value: 12, color: "#fb7185" },
  { label: "Tooling", value: 14, color: "#34d399" },
];

export default function TechDebtTracker() {
  const total = debtSlices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <section className="py-20 bg-card/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[300px,1fr] gap-8 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Technical debt tracker
          </p>
          <h3 className="text-3xl font-semibold text-foreground mb-3">
            Honest about my backlog
          </h3>
          <p className="text-sm text-muted-foreground">
            I score debt every week so stakeholders see where polish is needed before shipping.
            Below is today’s snapshot aggregated from lint, coverage and doc audits.
          </p>
        </div>
        <div className="bg-background/80 rounded-3xl border border-border p-6">
          <div className="relative w-64 h-64 mx-auto">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              {(() => {
                let cumulative = 0;
                return debtSlices.map((slice) => {
                  const dash = (slice.value / total) * 100;
                  const gap = 100 - dash;
                  const rotation = (cumulative / total) * 360;
                  cumulative += slice.value;
                  return (
                    <circle
                      key={slice.label}
                      cx="18"
                      cy="18"
                      r="16"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="3"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset="25"
                      transform={`rotate(${rotation} 18 18)`}
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-bold text-foreground">100%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-[0.3em]">
                tracked
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {debtSlices.map((slice) => (
              <div key={slice.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-foreground">{slice.label}</span>
                </div>
                <span className="text-muted-foreground">{slice.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
