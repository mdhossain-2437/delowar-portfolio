import { motion } from "framer-motion";
import AnimatedSVG from "./AnimatedSVG";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function About() {
  const isVisible = useScrollReveal();

  const skillCards = [
    { icon: "💻", title: "Web Dev", tech: "React, Node, MongoDB", color: "primary" },
    { icon: "🧠", title: "AI/ML", tech: "Learning intelligent systems", color: "accent" },
    { icon: "🎨", title: "Design", tech: "Modern, usable UI/UX", color: "primary" },
    { icon: "⚡", title: "Performance", tech: "Fast, optimized solutions", color: "accent" }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-background to-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About Me
            </span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.p 
                className="text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                I started learning code outside the traditional CSE path, driven by curiosity and passion for technology. 
                Now I build web applications, design intuitive UI/UX, and experiment with AI/ML to create meaningful solutions.
              </motion.p>

              <motion.p 
                className="text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                My mission is to create reliable, scalable, and beautiful technology that helps people. 
                I'm particularly excited about the intersection of web development and artificial intelligence.
              </motion.p>

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
                    className={`glass-card p-6 rounded-lg hover:shadow-lg hover:shadow-${skill.color}/10 transition-all duration-300 cursor-pointer`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    data-testid={`skill-card-${skill.title.toLowerCase().replace(/[^a-z]/g, '')}`}
                  >
                    <div className="text-2xl mb-2">{skill.icon}</div>
                    <h3 className={`font-semibold text-${skill.color} mb-2`}>{skill.title}</h3>
                    <p className="text-sm text-muted-foreground">{skill.tech}</p>
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
                  <strong className="text-primary">Fun fact:</strong> I can't live without dark mode and I believe coffee is a developer's best friend ☕
                </p>
              </motion.div>
            </div>

            <div className="relative">
              <AnimatedSVG />
              
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
                    <div className="text-sm text-primary">2019 → Started coding journey</div>
                    <div className="text-sm text-accent">2023 → Full-stack development</div>
                    <div className="text-sm text-primary">2025 → AI-powered applications</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
