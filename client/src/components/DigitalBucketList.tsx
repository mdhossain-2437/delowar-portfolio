const goals = [
  { title: "Learn Rust by 2026", progress: 40 },
  { title: "Ship a multiplayer design tool", progress: 70 },
  { title: "Visit Japan for a dev conference", progress: 10 },
  { title: "Mentor 25 engineers remotely", progress: 60 },
];

export default function DigitalBucketList() {
  return (
    <section className="py-20 bg-card/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Digital bucket list
        </p>
        <h3 className="text-3xl font-semibold text-foreground">
          Motivation board for recruiters & collaborators
        </h3>
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.title} className="rounded-2xl border border-border bg-background/80 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{goal.title}</span>
                <span className="text-muted-foreground">{goal.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted mt-2">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
