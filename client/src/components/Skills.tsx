import { motion } from "framer-motion";
import { BinaryTitle } from "@/components/ui/BinaryTitle";

type SkillGroup = {
  title: string;
  subtitle: string;
  items: string[];
};

const skillGroups: SkillGroup[] = [
  {
    title: "Core UI / Frontend",
    subtitle: "React, animations, accessibility-first design systems.",
    items: ["React + TypeScript", "Tailwind / shadcn", "Framer Motion", "Responsive UX / A11y"],
  },
  {
    title: "Backend / Infra",
    subtitle: "Ship reliably with clean APIs and observability.",
    items: ["Node.js / Express", "Postgres / Drizzle", "Auth / RBAC", "Testing + CI/CD"],
  },
  {
    title: "AI / Automation",
    subtitle: "Voice, agents, and workflow automation for teams.",
    items: ["Voice navigation", "LangChain patterns", "Playwright QA + agents", "Prompt systems"],
  },
  {
    title: "Product / Ops",
    subtitle: "Client-ready delivery: docs, metrics, and rollout plans.",
    items: ["Case-study storytelling", "Feature flags + rollout", "Observability dashboards", "Performance budgets"],
  },
];

const highlightBadges = [
  "Design systems + tokens",
  "Cinematic yet fast UI",
  "AI-first workflows",
  "Shipping discipline",
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-24 bg-gradient-to-b from-background via-[#0d1221] to-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.08),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.08),transparent_50%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Design systems, product, and AI tooling
            </p>
            <h2 className="text-3xl md:text-5xl font-bold">
              <BinaryTitle
                text="Skills & Tech Stack"
                className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              />
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A single, curated stack: expressive UI, reliable backends, and automation that feels
              invisible—built like an engineer, delivered like a designer.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {highlightBadges.map((badge) => (
              <span
                key={badge}
                className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-foreground"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {skillGroups.map((group, idx) => (
              <motion.div
                key={group.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-2 hover:border-primary/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-accent/12 opacity-80" />
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground">{group.title}</h3>
                    <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{group.subtitle}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
