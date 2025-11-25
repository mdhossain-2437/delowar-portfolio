import { motion } from "framer-motion";
import { Code2, Database, Sparkles, Zap, Brain, Layers } from "lucide-react";

type Skill = {
  name: string;
  level: number;
  icon: React.ComponentType<any>;
};

type SkillCategory = {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  skills: Skill[];
  color: string;
};

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend Development",
    description: "Building beautiful, responsive user interfaces",
    icon: Code2,
    color: "from-purple-500 to-pink-500",
    skills: [
      { name: "React & Next.js", level: 95, icon: Code2 },
      { name: "TypeScript", level: 90, icon: Code2 },
      { name: "Tailwind CSS", level: 95, icon: Sparkles },
      { name: "Framer Motion", level: 85, icon: Zap },
    ],
  },
  {
    title: "Backend Development",
    description: "Scalable server-side solutions",
    icon: Database,
    color: "from-cyan-500 to-blue-500",
    skills: [
      { name: "Node.js & Express", level: 90, icon: Database },
      { name: "PostgreSQL & MongoDB", level: 85, icon: Database },
      { name: "REST & GraphQL APIs", level: 90, icon: Layers },
      { name: "Authentication & Security", level: 85, icon: Sparkles },
    ],
  },
  {
    title: "AI & Modern Tools",
    description: "Leveraging cutting-edge technologies",
    icon: Brain,
    color: "from-green-500 to-emerald-500",
    skills: [
      { name: "OpenAI & LangChain", level: 80, icon: Brain },
      { name: "Docker & CI/CD", level: 85, icon: Layers },
      { name: "Git & GitHub", level: 95, icon: Code2 },
      { name: "Testing & QA", level: 85, icon: Zap },
    ],
  },
];

const tools = [
  "VS Code",
  "Figma",
  "Git",
  "Docker",
  "Postman",
  "Linear",
  "Vercel",
  "AWS",
  "Firebase",
  "Supabase",
  "Prisma",
  "Drizzle",
];

export default function SkillsNew() {
  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(139,92,246,0.08),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(34,211,238,0.08),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 container-wide gutter">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Expertise
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A comprehensive toolkit for building modern web applications
          </p>
        </motion.div>

        {/* Skill Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {skillCategories.map((category, index) => {
            const CategoryIcon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-3xl p-8 bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="space-y-3">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
                    >
                      <CategoryIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {category.title}
                    </h3>
                    <p className="text-slate-400">{category.description}</p>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    {category.skills.map((skill) => {
                      const SkillIcon = skill.icon;
                      return (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <SkillIcon className="w-4 h-4 text-purple-400" />
                              <span className="text-sm font-medium text-slate-300">
                                {skill.name}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-purple-400">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="relative h-2 rounded-full bg-slate-800/50 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tools & Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 md:p-12 bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Tools & Platforms
            </h3>
            <p className="text-slate-400">
              Technologies I work with on a daily basis
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool, index) => (
              <motion.div
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -4 }}
                className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 font-medium hover:border-purple-500 hover:text-purple-300 hover:bg-slate-800 transition-all cursor-default"
              >
                {tool}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
