const sections = [
  { name: "Hero", color: "#a855f7" },
  { name: "Projects", color: "#38bdf8" },
  { name: "Playground", color: "#f97316" },
  { name: "Blog", color: "#facc15" },
  { name: "Contact", color: "#4ade80" },
];

export default function IsometricSiteMap() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Isometric sitemap
        </p>
        <h3 className="text-3xl font-semibold text-foreground">
          Explore the site as a miniature city
        </h3>
        <div className="relative w-full overflow-auto py-6">
          <div className="flex gap-10 justify-center">
            {sections.map((section, index) => (
              <div
                key={section.name}
                className="w-32 h-32 text-center text-xs font-semibold text-white"
                style={{
                  transform: `skewY(-15deg) rotateX(35deg)`,
                }}
              >
                <div
                  className="w-full h-full rounded-lg shadow-2xl flex items-center justify-center"
                  style={{ background: section.color }}
                >
                  {section.name}
                </div>
                <p className="mt-3 not-italic text-muted-foreground tracking-wide">
                  Layer {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
