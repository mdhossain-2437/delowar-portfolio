import { motion } from "framer-motion";
import {
  ListTodo,
  NotebookPen,
  Clock,
  BarChart2,
  Sparkles,
} from "lucide-react";

const workspacePanels = [
  {
    icon: ListTodo,
    title: "Tasks + Kanban",
    description:
      "Drag-and-drop triage with AI summaries, reminders, and client labels synced with the business hub.",
    stats: ["12 active sprints", "Focus timer built-in"],
  },
  {
    icon: NotebookPen,
    title: "Notes + Snippets",
    description:
      "MDX-friendly notes, code snippets with live preview, and linked bookmarks for research docs.",
    stats: ["320 reusable snippets", "9 design systems"],
  },
  {
    icon: Clock,
    title: "Time + Habits",
    description:
      "Timeboxing, Pomodoro, and habit streaks wired to proposals and invoices so every hour is billable.",
    stats: ["92% streak adherence", "30h avg deep work"],
  },
];

export default function WorkspaceShowcase() {
  return (
    <section id="dashboard" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-12 items-center glass-card rounded-[32px] border border-border/70 p-10"
        >
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
              Private workspace
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              A dashboard built for indie labs, with realtime data from every suite.
            </h2>
            <p className="text-muted-foreground">
              Tasks, notes, snippets, time tracking, and finance telemetry live in the same canvas.
              Agents summarize standups, habits sync with invoices, and the business hub inherits
              every update instantly.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                <p className="text-2xl font-semibold">+38%</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Throughput since automation
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                <p className="text-2xl font-semibold">6 workspaces</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Integrated per client
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {workspacePanels.map((panel, index) => (
              <motion.div
                key={panel.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3"
              >
                <panel.icon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold">{panel.title}</h3>
                  <p className="text-sm text-muted-foreground">{panel.description}</p>
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground flex flex-col gap-1">
                  {panel.stats.map((stat) => (
                    <span key={stat}>{stat}</span>
                  ))}
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/40 p-6 flex flex-col justify-between text-left h-full"
            >
              <div>
                <Sparkles className="h-6 w-6 text-primary mb-3" />
                <h3 className="text-2xl font-semibold mb-2">Workspace snapshots</h3>
                <p className="text-sm text-muted-foreground">
                  Export dashboards as live embeddable cards for clients or shareable status pages.
                </p>
              </div>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
                  Available via workspace API
                </p>
                <p className="text-lg font-semibold">/api/workspace/insights</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
