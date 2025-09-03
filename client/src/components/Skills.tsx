import { useState } from "react";
import { motion } from "framer-motion";

export default function Skills() {
  const [activeTab, setActiveTab] = useState("proficient");

  const skillTabs = [
    { id: "proficient", label: "Proficient" },
    { id: "familiar", label: "Familiar" },
    { id: "exploring", label: "Exploring" }
  ];

  const skillsData = {
    proficient: [
      { name: "React", description: "Component-based UI development", icon: "fab fa-react", progress: 90 },
      { name: "JavaScript (ES6+)", description: "Modern JavaScript development", icon: "fab fa-js-square", progress: 85 },
      { name: "Tailwind CSS", description: "Utility-first CSS framework", icon: "fab fa-css3-alt", progress: 88 },
      { name: "Node.js", description: "Server-side JavaScript runtime", icon: "fab fa-node-js", progress: 80 },
      { name: "MongoDB", description: "NoSQL database management", icon: "fas fa-database", progress: 75 },
      { name: "Git/GitHub", description: "Version control and collaboration", icon: "fab fa-git-alt", progress: 85 }
    ],
    familiar: [
      { name: "Python", description: "Backend and AI/ML development", icon: "fab fa-python", progress: 70 },
      { name: "TypeScript", description: "Type-safe JavaScript development", icon: "fab fa-js-square", progress: 65 },
      { name: "Next.js", description: "React-based web framework", icon: "fas fa-rocket", progress: 60 },
      { name: "Bootstrap", description: "CSS framework for rapid UI", icon: "fab fa-bootstrap", progress: 70 },
      { name: "REST APIs", description: "RESTful web services", icon: "fas fa-cogs", progress: 75 }
    ],
    exploring: [
      { name: "TensorFlow", description: "Machine learning framework", icon: "fas fa-brain", progress: 40 },
      { name: "LangChain", description: "LLM application framework", icon: "fas fa-robot", progress: 35 },
      { name: "LLM Agents", description: "AI agent development", icon: "fas fa-microchip", progress: 30 },
      { name: "AI/ML Fundamentals", description: "Machine learning principles", icon: "fas fa-chart-line", progress: 45 }
    ]
  };

  return (
    <section id="skills" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Skills & Tech Stack
            </span>
          </h2>

          {/* Skill Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-4 bg-muted rounded-lg p-2">
              {skillTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                  data-testid={`skill-tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {skillsData[activeTab as keyof typeof skillsData].map((skill, index) => (
              <motion.div
                key={skill.name}
                className="glass-card p-6 rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
                data-testid={`skill-card-${skill.name.toLowerCase().replace(/[^a-z]/g, '')}`}
              >
                <div className="flex items-center mb-4">
                  <i className={`${skill.icon} text-2xl text-primary mr-3`}></i>
                  <h3 className="font-semibold">{skill.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{skill.description}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-secondary rounded-full h-1">
                  <motion.div
                    className="skill-bar h-1 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1 text-right">
                  {skill.progress}%
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
