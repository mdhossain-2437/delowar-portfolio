import { motion } from "framer-motion";
import ProfilePhoto from "./ProfilePhoto";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { BinaryTitle } from "@/components/ui/BinaryTitle";

export default function About() {
  const isVisible = useScrollReveal();

  const skillCards = [
    {
      icon: "💻",
      title: "Web Dev",
      tech: "React, Node, MongoDB",
      color: "primary",
    },
    {
      icon: "🧠",
      title: "AI/ML",
      tech: "Learning intelligent systems",
      color: "accent",
    },
    {
      icon: "🎨",
      title: "Design",
      tech: "Modern, usable UI/UX",
      color: "primary",
    },
    {
      icon: "⚡",
      title: "Performance",
      tech: "Fast, optimized solutions",
      color: "accent",
    },
  ];

  return (
    <section
      id="about"
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
            <BinaryTitle
              text="About Me"
              className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
            />
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div
                className="space-y-4 text-lg text-slate-400 leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p>
                  I learned to ship product-first: freelancing in Dhaka cafes,
                  hacking nights with friends, and saying yes to impossible
                  deadlines. Those scrappy builds turned into production React
                  apps, design systems, and AI agents that now power classrooms
                  and small businesses.
                </p>
                <p>
                  The throughline? Story-driven problem solving. I map the
                  user's day, cut the friction, and measure outcomes. Whether it
                  is a voice-led navigation, a resilient payments flow, or a
                  clever animation, the work is always anchored to results.
                </p>
              </motion.div>

              {/* Skills Cards */}
              <motion.div
                className="grid grid-cols-2 gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                viewport={{ once: true }}
              >
                {skillCards.map((skill, index) => (
                  <motion.div
                    key={skill.title}
                    className="bg-slate-900/50 border border-slate-700/60 backdrop-blur-sm p-6 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    data-testid={`skill-card-${skill.title
                      .toLowerCase()
                      .replace(/[^a-z]/g, "")}`}
                  >
                    <div className="text-2xl mb-2">{skill.icon}</div>
                    <h3 className="font-semibold text-white mb-2">
                      {skill.title}
                    </h3>
                    <p className="text-sm text-slate-400">{skill.tech}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Fun Fact */}
              <motion.div
                className="bg-slate-900/50 border border-slate-700/60 backdrop-blur-sm p-6 rounded-lg mt-8 border-l-4 border-purple-500"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                viewport={{ once: true }}
                data-testid="fun-fact"
              >
                <p className="text-sm text-slate-400">
                  <strong className="text-purple-400">Fun fact:</strong> I can't
                  live without dark mode and I believe coffee is a developer's
                  best friend ☕
                </p>
              </motion.div>
            </div>

            <div className="relative">
              <ProfilePhoto />

              {/* Timeline */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                viewport={{ once: true }}
                data-testid="journey-timeline"
              >
                <div className="flex items-center space-x-4">
                  <div className="timeline-line w-1 h-20 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="text-sm text-purple-400">
                      2019 → Started coding journey
                    </div>
                    <div className="text-sm text-cyan-400">
                      2023 → Full-stack development
                    </div>
                    <div className="text-sm text-purple-400">
                      2025 → AI-powered applications
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="mt-8 space-y-3 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Let's collaborate
                </p>
                <p className="text-lg font-semibold text-white">
                  Open to founder-style sprints, audits, and AI automation
                  builds.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:hello@delowar.dev"
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300 hover:bg-purple-500/20 transition-colors border border-purple-500/20"
                  >
                    contact@delowarhossain.dev
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mdhossain2437"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-purple-500 hover:text-purple-300 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <button
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                  >
                    Book a call
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
