import { useEffect, useState, useMemo } from "react";

type NavSection = { id: string; label: string };

export default function SideNavRail({ sections }: { sections: NavSection[] }) {
  const [activeId, setActiveId] = useState<string>("home");

  const orderedSections = useMemo(
    () => sections.filter((s, idx, arr) => arr.findIndex((p) => p.id === s.id) === idx),
    [sections],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -35% 0px" },
    );

    orderedSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [orderedSections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (orderedSections.length === 0) return null;

  return (
    <div className="pointer-events-none fixed left-4 top-28 z-[900] hidden md:flex">
      <div className="pointer-events-auto rounded-3xl border border-white/10 bg-background/30 backdrop-blur-xl shadow-lg px-3 py-4">
        <div className="flex flex-col gap-1">
          {orderedSections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "true" : "false"}
              >
                <span className="relative flex items-center">
                  <span className="h-10 w-[2px] rounded-full bg-white/10 group-hover:bg-white/30 transition-colors" />
                  <span
                    className={`absolute left-0 h-3 w-3 rounded-full border border-white/30 bg-white/10 transition-transform ${
                      isActive ? "scale-110 bg-primary shadow-[0_0_0_6px_rgba(59,130,246,0.25)]" : ""
                    }`}
                  />
                </span>
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
