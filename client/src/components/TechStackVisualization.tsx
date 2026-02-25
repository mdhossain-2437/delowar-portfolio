import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiTailwindcss,
  SiFigma,
  SiGit,
  SiDocker,
  SiVite,
  SiFramer,
  SiPrisma,
  SiRedux,
} from "react-icons/si";

export default function TechStackVisualization() {
  const techStack = [
    {
      name: "React",
      icon: <SiReact className="w-8 h-8" />,
      level: "Expert",
      category: "Frontend",
    },
    {
      name: "Next.js",
      icon: <SiNextdotjs className="w-8 h-8" />,
      level: "Advanced",
      category: "Frontend",
    },
    {
      name: "TypeScript",
      icon: <SiTypescript className="w-8 h-8" />,
      level: "Expert",
      category: "Language",
    },
    {
      name: "JavaScript",
      icon: <SiJavascript className="w-8 h-8" />,
      level: "Expert",
      category: "Language",
    },
    {
      name: "Node.js",
      icon: <SiNodedotjs className="w-8 h-8" />,
      level: "Expert",
      category: "Backend",
    },
    {
      name: "Express",
      icon: <SiExpress className="w-8 h-8" />,
      level: "Expert",
      category: "Backend",
    },
    {
      name: "MongoDB",
      icon: <SiMongodb className="w-8 h-8" />,
      level: "Advanced",
      category: "Database",
    },
    {
      name: "PostgreSQL",
      icon: <SiPostgresql className="w-8 h-8" />,
      level: "Advanced",
      category: "Database",
    },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss className="w-8 h-8" />,
      level: "Expert",
      category: "Styling",
    },
    {
      name: "Framer Motion",
      icon: <SiFramer className="w-8 h-8" />,
      level: "Advanced",
      category: "Animation",
    },
    {
      name: "Prisma",
      icon: <SiPrisma className="w-8 h-8" />,
      level: "Advanced",
      category: "ORM",
    },
    {
      name: "Redux",
      icon: <SiRedux className="w-8 h-8" />,
      level: "Advanced",
      category: "State",
    },
    {
      name: "Git",
      icon: <SiGit className="w-8 h-8" />,
      level: "Expert",
      category: "Tools",
    },
    {
      name: "Docker",
      icon: <SiDocker className="w-8 h-8" />,
      level: "Intermediate",
      category: "Tools",
    },
    {
      name: "Vite",
      icon: <SiVite className="w-8 h-8" />,
      level: "Advanced",
      category: "Build",
    },
    {
      name: "Figma",
      icon: <SiFigma className="w-8 h-8" />,
      level: "Intermediate",
      category: "Design",
    },
  ];

  return (
    <section
      id="tech-stack"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 relative overflow-hidden"
    >
      {/* Radial gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(139,92,246,0.08),transparent_50%),radial-gradient(circle_at_85%_80%,rgba(34,211,238,0.08),transparent_55%)] pointer-events-none" />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            My Tech Stack
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            The tools and technologies I use to bring ideas to life
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="glass-card group hover:border-accent/50 transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col items-center justify-between h-full">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mb-3 text-primary group-hover:text-accent transition-colors"
                  >
                    {tech.icon}
                  </motion.div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white mb-1">
                      {tech.name}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {tech.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <Card className="glass-card p-8 max-w-3xl mx-auto">
            <CardContent>
              <p className="text-lg text-slate-400 leading-relaxed">
                I'm always learning and exploring new technologies to stay at
                the cutting edge of web development. This stack allows me to
                build fast, scalable, and beautiful applications that users
                love.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
