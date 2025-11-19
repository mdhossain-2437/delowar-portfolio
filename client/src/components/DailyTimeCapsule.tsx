const techStack = ["React", "Drizzle", "Vite", "Three.js", "Next.js", "Firebase"];

const trafficHighlights = [
  "50 visitors from Dhaka",
  "3 recruiters from NYC",
  "12 returning clients",
  "250 GitHub profile hits",
  "5 newsletter signups",
];

export default function DailyTimeCapsule() {
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const stack = techStack[Math.floor(Math.random() * techStack.length)];
  const traffic = trafficHighlights[Math.floor(Math.random() * trafficHighlights.length)];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl border border-border bg-card/80 p-6 space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Daily developer time capsule
        </p>
        <h3 className="text-2xl font-semibold text-foreground">Snapshot · {date}</h3>
        <p className="text-sm text-muted-foreground">
          Each day logs what stack I touched and who visited. It’s a living journal for clients.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Today’s focus
            </p>
            <p className="text-lg font-semibold text-foreground">{stack}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Visitors</p>
            <p className="text-lg font-semibold text-foreground">{traffic}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Next up
            </p>
            <p className="text-lg font-semibold text-foreground">
              Ship brutalist toggle QA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
