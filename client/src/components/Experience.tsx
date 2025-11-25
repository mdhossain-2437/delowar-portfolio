import { motion } from "framer-motion";

export default function Experience() {
  const timelineItems = [
    {
      year: "2019",
      title: "Started Coding Journey",
      description:
        "Began self-learning programming outside traditional CSE education. Started with basic HTML, CSS, and JavaScript fundamentals.",
      color: "primary",
    },
    {
      year: "2021",
      title: "First Portfolio & Projects",
      description:
        "Created my first portfolio website and started working on small projects. Gained experience with responsive design and basic JavaScript frameworks.",
      color: "accent",
    },
    {
      year: "2023",
      title: "Full-Stack Development",
      description:
        "Mastered React, Node.js, and MongoDB stack. Built comprehensive web applications like WebDevWarrior and Kothopokothon Messenger with advanced features.",
      color: "primary",
    },
    {
      year: "2025",
      title: "AI & Advanced Development",
      description:
        "Currently exploring AI/ML technologies, building intelligent developer agents, and working on next-generation web applications with LangChain and LLMs.",
      color: "accent",
      current: true,
    },
  ];

  return (
    <section
      id="experience"
      className="py-24 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(139,92,246,0.08),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(34,211,238,0.08),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              My Journey
            </span>
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500"></div>

              {/* Timeline items */}
              <div className="space-y-12">
                {timelineItems.map((item, index) => (
                  <motion.div
                    key={item.year}
                    className="relative flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    data-testid={`timeline-item-${item.year}`}
                  >
                    <div
                      className={`absolute left-6 w-4 h-4 ${
                        item.color === "primary"
                          ? "bg-purple-500"
                          : "bg-cyan-500"
                      } rounded-full border-4 border-slate-950 ${
                        item.current ? "animate-pulse" : ""
                      }`}
                    ></div>

                    <div
                      className={`ml-16 bg-slate-900/50 border border-slate-700/60 backdrop-blur-sm p-6 rounded-lg ${
                        item.current
                          ? "border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                        <span
                          className={`text-sm ${
                            item.color === "primary"
                              ? "text-purple-300 bg-purple-500/10 border border-purple-500/20"
                              : "text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
                          } px-3 py-1 rounded-full`}
                        >
                          {item.year}
                        </span>
                      </div>
                      <p className="text-slate-400">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Career Objective */}
          <motion.div
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div
              className="bg-slate-900/50 border border-slate-700/60 backdrop-blur-sm p-8 rounded-lg border-l-4 border-purple-500"
              data-testid="career-objective"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-400">
                Career Objective
              </h3>
              <p className="text-slate-400 leading-relaxed">
                To build innovative and intelligent tools that solve real-world
                problems and empower people—especially developers and learners.
                I'm looking for a role that challenges my logic, expands my
                technical depth, and gives me the freedom to create things that
                matter. I want to work at the intersection of web development,
                AI, and purposeful design.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
