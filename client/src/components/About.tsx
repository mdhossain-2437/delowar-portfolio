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
      className="py-24 bg-gradient-to-b from-background to-card"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <BinaryTitle text="About Me" className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" />
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div
                className="space-y-4 text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p>
                  I learned to ship product-first: freelancing in Dhaka cafes, hacking nights with
                  friends, and saying yes to impossible deadlines. Those scrappy builds turned into
                  production React apps, design systems, and AI agents that now power classrooms and
                  small businesses.
                </p>
                <p>
                  The throughline? Story-driven problem solving. I map the user's day, cut the
                  friction, and measure outcomes. Whether it is a voice-led navigation, a resilient
                  payments flow, or a clever animation, the work is always anchored to results.
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
                    className="glass-card p-6 rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
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
                    <h3 className="font-semibold text-foreground mb-2">
                      {skill.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {skill.tech}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Fun Fact */}
              <motion.div
                className="glass-card p-6 rounded-lg mt-8 border-l-4 border-primary"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                viewport={{ once: true }}
                data-testid="fun-fact"
              >
                <p className="text-sm text-muted-foreground">
                  <strong className="text-primary">Fun fact:</strong> I can't
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
                    <div className="text-sm text-primary">
                      2019 → Started coding journey
                    </div>
                    <div className="text-sm text-accent">
                      2023 → Full-stack development
                    </div>
                    <div className="text-sm text-primary">
                      2025 → AI-powered applications
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  Let’s collaborate
                </p>
                <p className="text-lg font-semibold text-foreground">
                  Open to founder-style sprints, audits, and AI automation builds.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:hello@delowar.dev"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/15 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/25 transition-colors"
                  >
                    hello@delowar.dev
                  </a>
                  <a
                    href="https://www.linkedin.com/in/delowarhossain-dev"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold hover:border-primary/60 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <button
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary via-accent to-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
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
