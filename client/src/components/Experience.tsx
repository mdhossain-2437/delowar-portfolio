import { motion } from "framer-motion";

export default function Experience() {
  const timelineItems = [
    {
      year: "2019",
      title: "Started Coding Journey",
      description: "Began self-learning programming outside traditional CSE education. Started with basic HTML, CSS, and JavaScript fundamentals.",
      color: "primary"
    },
    {
      year: "2021",
      title: "First Portfolio & Projects",
      description: "Created my first portfolio website and started working on small projects. Gained experience with responsive design and basic JavaScript frameworks.",
      color: "accent"
    },
    {
      year: "2023",
      title: "Full-Stack Development",
      description: "Mastered React, Node.js, and MongoDB stack. Built comprehensive web applications like WebDevWarrior and Kothopokothon Messenger with advanced features.",
      color: "primary"
    },
    {
      year: "2025",
      title: "AI & Advanced Development",
      description: "Currently exploring AI/ML technologies, building intelligent developer agents, and working on next-generation web applications with LangChain and LLMs.",
      color: "accent",
      current: true
    }
  ];

  return (
    <section id="experience" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Journey
            </span>
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary"></div>

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
                    <div className={`absolute left-6 w-4 h-4 bg-${item.color} rounded-full border-4 border-background ${
                      item.current ? 'animate-pulse-glow' : ''
                    }`}></div>
                    
                    <div className={`ml-16 glass-card p-6 rounded-lg ${
                      item.current ? 'border border-accent/30' : ''
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <span className={`text-sm text-${item.color} bg-${item.color}/20 px-2 py-1 rounded`}>
                          {item.year}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
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
            <div className="glass-card p-8 rounded-lg border-l-4 border-primary" data-testid="career-objective">
              <h3 className="text-xl font-semibold mb-4 text-primary">Career Objective</h3>
              <p className="text-muted-foreground leading-relaxed">
                To build innovative and intelligent tools that solve real-world problems and empower people—especially 
                developers and learners. I'm looking for a role that challenges my logic, expands my technical depth, 
                and gives me the freedom to create things that matter. I want to work at the intersection of web 
                development, AI, and purposeful design.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
