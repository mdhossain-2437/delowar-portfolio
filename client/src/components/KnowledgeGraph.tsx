const nodes = [
  { id: "React", type: "skill" },
  { id: "Three.js", type: "skill" },
  { id: "AI agents", type: "skill" },
  { id: "Portfolio", type: "project" },
  { id: "Creator OS", type: "project" },
  { id: "Motion Lab", type: "project" },
];

const links = [
  ["React", "Portfolio"],
  ["React", "Creator OS"],
  ["Three.js", "Motion Lab"],
  ["AI agents", "Creator OS"],
  ["AI agents", "Motion Lab"],
];

export default function KnowledgeGraph() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Knowledge graph
        </p>
        <h3 className="text-3xl font-semibold text-foreground">
          Connecting skills to live projects
        </h3>
        <div className="relative h-72 rounded-3xl border border-border bg-card/70 overflow-hidden">
          {nodes.map((node, index) => {
            const angle = (index / nodes.length) * Math.PI * 2;
            const radius = node.type === "skill" ? 110 : 60;
            const x = 200 + radius * Math.cos(angle);
            const y = 150 + radius * Math.sin(angle);
            return (
              <div
                key={node.id}
                className={`absolute px-3 py-1 rounded-full text-xs font-semibold ${
                  node.type === "skill" ? "bg-primary/70 text-white" : "bg-emerald-500/70 text-white"
                }`}
                style={{ left: x, top: y }}
              >
                {node.id}
              </div>
            );
          })}
          {links.map(([from, to]) => {
            const start = positionFor(from);
            const end = positionFor(to);
            if (!start || !end) return null;
            return (
              <svg key={`${from}-${to}`} className="absolute inset-0 pointer-events-none">
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="rgba(59,130,246,0.4)"
                  strokeWidth="2"
                />
              </svg>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function positionFor(id: string) {
  const index = nodes.findIndex((node) => node.id === id);
  if (index === -1) return null;
  const node = nodes[index];
  const angle = (index / nodes.length) * Math.PI * 2;
  const radius = node.type === "skill" ? 110 : 60;
  return {
    x: 200 + radius * Math.cos(angle) + 40,
    y: 150 + radius * Math.sin(angle) + 16,
  };
}
