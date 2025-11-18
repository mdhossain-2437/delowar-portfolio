import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, BrainCircuit, Cpu, Rocket, Workflow } from "lucide-react";

const modeConfigs = {
  build: {
    label: "Build sprint",
    description:
      "Story-driven feature weeks where we tighten UX, ship experiments, and measure signals in real time.",
    highlights: [
      { label: "Prototype velocity", value: "2 / week", delta: "+1" },
      { label: "MRR uplift", value: "+12%", delta: "30d rolling" },
      { label: "Canvas scenes", value: "3D hero, AR overlay" },
    ],
    rituals: ["Daily async stand-up", "Figma playback on Friday", "Automated QA gates"],
  },
  advisory: {
    label: "Advisory & Ops",
    description:
      "Fractional product strategy: roadmap shaping, workflow automation, and stack decisions for distributed teams.",
    highlights: [
      { label: "Roadmaps aligned", value: "5 active", delta: "across 3 orgs" },
      { label: "Automation coverage", value: "78%", delta: "Toggle OS metrics" },
      { label: "Stakeholder loops", value: "<12h async SLA" },
    ],
    rituals: ["Weekly OKR sync", "Guardrail dashboards", "Decision memos"],
  },
};

const capabilityGrid = [
  {
    label: "AI copilots",
    description: "LLM-assisted status boards, PR summaries, and bespoke dashboards.",
    icon: BrainCircuit,
  },
  {
    label: "Workflow automation",
    description: "Linear ↔ Notion ↔ Slack bridges keep everyone unblocked.",
    icon: Workflow,
  },
  {
    label: "Creative R&D",
    description: "Three.js canvases, WebGL shaders, and tactile UI systems.",
    icon: Rocket,
  },
  {
    label: "Systems engineering",
    description: "Edge-ready API layers, Postgres + Drizzle, and telemetry packs.",
    icon: Cpu,
  },
];

const signalTimeline = [
  {
    title: "Playground lab drop",
    detail: "Canvas hero + physics-based orbit ready for user testing.",
    status: "done",
  },
  {
    title: "Creator OS automation",
    detail: "Finance + task boards unified with human-in-the-loop checks.",
    status: "progress",
  },
  {
    title: "Advisory portal",
    detail: "New client workspace provisioning with theme presets.",
    status: "queued",
  },
];

export default function MissionControl() {
  const [mode, setMode] = useState<keyof typeof modeConfigs>("build");
  const current = modeConfigs[mode];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
              Mission control
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Toggle between build sprints and advisory ops.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Product isn’t linear. This dashboard shows how I orchestrate immersive builds,
              workflow automation, and AI copilots without losing narrative control.
            </p>
          </div>
          <div className="flex gap-3">
            {(
              Object.keys(modeConfigs) as Array<keyof typeof modeConfigs>
            ).map((key) => (
              <Button
                key={key}
                onClick={() => setMode(key)}
                variant={mode === key ? "default" : "outline"}
                className={`rounded-2xl px-6 py-2 font-semibold ${
                  mode === key
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    : "border-border"
                }`}
              >
                {modeConfigs[key].label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[32px] border border-border/70 bg-card/80 p-8 backdrop-blur"
          >
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <Activity className="h-4 w-4 text-primary" />
              <span>{current.label}</span>
            </div>
            <p className="text-lg text-foreground mb-6">{current.description}</p>
            <div className="grid gap-4 md:grid-cols-3">
              {current.highlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="rounded-2xl border border-border/60 bg-background/40 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {highlight.label}
                  </p>
                  <p className="text-2xl font-semibold text-foreground">{highlight.value}</p>
                  {highlight.delta && (
                    <p className="text-xs text-muted-foreground">{highlight.delta}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {current.rituals.map((ritual) => (
                <Badge key={ritual} variant="secondary">
                  {ritual}
                </Badge>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4">
            {capabilityGrid.map((capability) => {
              const Icon = capability.icon;
              return (
                <motion.div
                  key={capability.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-border/60 bg-background/60 p-5 flex gap-4"
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {capability.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {capability.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] border border-border/70 bg-card/60 p-8">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground mb-4">
            Ops timeline
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {signalTimeline.map((signal) => (
              <div key={signal.title} className="space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      signal.status === "done"
                        ? "bg-emerald-400"
                        : signal.status === "progress"
                          ? "bg-primary"
                          : "bg-muted-foreground"
                    }`}
                  />
                  {signal.status}
                </div>
                <p className="text-lg font-semibold text-foreground">{signal.title}</p>
                <p className="text-sm text-muted-foreground">{signal.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
