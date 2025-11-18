import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const storySlices = [
  {
    id: "zero-to-one",
    title: "Zero → One Systems",
    description:
      "Kick-off sprints start with customer interviews and rapid technical spikes. Each artifact is synced back to Notion + Linear so nothing gets lost in the shuffle.",
    statLabel: "Discovery hours saved",
    statValue: "32%",
    accent: "rgba(124, 58, 237, 0.35)",
  },
  {
    id: "scale",
    title: "Scale With Confidence",
    description:
      "Infrastructure blueprints rely on serverless Postgres, edge caching, and streaming data hydrations so dashboards stay real-time without melting the browser.",
    statLabel: "Cold start reduced",
    statValue: "420ms",
    accent: "rgba(14, 165, 233, 0.35)",
  },
  {
    id: "launch",
    title: "Launch & Learn",
    description:
      "Feature flags, experiment frameworks, and observability hooks mean every release is measurable. Clients get a live narrative of what changed and why it matters.",
    statLabel: "Experiments shipped per quarter",
    statValue: "18",
    accent: "rgba(16, 185, 129, 0.35)",
  },
];

export default function ScrollStory() {
  const containerRef = useRef<HTMLElement | null>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      panelRefs.current.forEach((panel) => {
        if (!panel) return;
        gsap.fromTo(
          panel,
          { opacity: 0.2, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const index = Math.min(
            storySlices.length - 1,
            Math.round(self.progress * (storySlices.length - 1)),
          );
          const accent = storySlices[index]?.accent ?? "rgba(124,58,237,0.35)";
          containerRef.current?.style.setProperty("--scroll-story-accent", accent);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const setPanelRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      panelRefs.current[index] = el;
    }
  };

  return (
    <section
      ref={containerRef}
      className="scroll-story relative overflow-hidden"
      aria-labelledby="scroll-story-heading"
    >
      <div className="pointer-events-none absolute inset-0 scroll-story-noise" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.p
            className="text-sm uppercase tracking-[0.45em] text-muted-foreground mb-4"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Scrolltold narrative
          </motion.p>
          <motion.h2
            id="scroll-story-heading"
            className="text-3xl md:text-5xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Every scroll reveals another decision
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Scrollytelling brings context to complex builds. Follow the trail of design systems,
            product bets, and reliability plays that power this portfolio.
          </motion.p>
        </div>

        <div className="space-y-12">
          {storySlices.map((slice, index) => (
            <motion.div
              key={slice.id}
              ref={(el) => setPanelRef(el, index)}
              className="scroll-story-panel rounded-3xl border border-white/10 p-8 md:p-10 backdrop-blur"
              initial={{ opacity: 0.4, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-accent/80">
                    chapter {index + 1}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white">{slice.title}</h3>
                  <p className="text-muted-foreground">{slice.description}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center min-w-[180px]">
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">
                    {slice.statLabel}
                  </p>
                  <p className="text-3xl font-bold text-white">{slice.statValue}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
