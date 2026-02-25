import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "blog", label: "Blog" },
  { id: "timeline", label: "Timeline" },
  { id: "achievements", label: "Achievements" },
  { id: "stack", label: "Stack" },
  { id: "playground", label: "Playground" },
  { id: "workspace/tasks", label: "Tasks" },
  { id: "contact", label: "Contact" },
];

export default function SideSectionNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(section.id);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "-30% 0px -30% 0px",
        },
      );
      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    window.scrollTo({
      top: element.offsetTop - 80,
      behavior: "smooth",
    });
  };

  return (
    <aside className="fixed left-2 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex xl:left-6 z-30 pointer-events-none">
      <div className="group rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl px-3 py-4 text-xs text-muted-foreground shadow-lg/30 max-w-[12rem] pointer-events-auto">
        <p className="uppercase tracking-[0.4em] text-[10px] text-foreground/60 mb-4">
          Sections
        </p>
        <nav className="space-y-3">
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className="flex items-center gap-2 group/button text-left w-full"
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    isActive ? "bg-primary" : "bg-border group-hover/button:bg-primary/60"
                  }`}
                />
                <span
                  className={`text-[10px] uppercase tracking-[0.35em] transition-colors truncate ${
                    isActive ? "text-foreground" : "text-muted-foreground group-hover/button:text-foreground/80"
                  }`}
                >
                  {section.label}
                </span>
              </button>
            );
          })}
        </nav>
        <motion.span
          layoutId="sideNavPulse"
          className="pointer-events-none absolute -left-3 top-1/2 h-9 w-1 rounded-full bg-gradient-to-b from-primary/70 to-accent/70 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
        />
      </div>
    </aside>
  );
}
