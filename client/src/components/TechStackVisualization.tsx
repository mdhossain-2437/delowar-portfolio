import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiNodedotjs, 
  SiExpress, SiMongodb, SiPostgresql, SiTailwindcss, SiFigma,
  SiGit, SiDocker, SiVite, SiFramer, SiPrisma, SiRedux
} from "react-icons/si";

export default function TechStackVisualization() {
  const techStack = [
    { name: "React", icon: <SiReact className="w-12 h-12" />, color: "#61DAFB", category: "Frontend" },
    { name: "Next.js", icon: <SiNextdotjs className="w-12 h-12" />, color: "#000000", category: "Frontend" },
    { name: "TypeScript", icon: <SiTypescript className="w-12 h-12" />, color: "#3178C6", category: "Language" },
    { name: "JavaScript", icon: <SiJavascript className="w-12 h-12" />, color: "#F7DF1E", category: "Language" },
    { name: "Node.js", icon: <SiNodedotjs className="w-12 h-12" />, color: "#339933", category: "Backend" },
    { name: "Express", icon: <SiExpress className="w-12 h-12" />, color: "#000000", category: "Backend" },
    { name: "MongoDB", icon: <SiMongodb className="w-12 h-12" />, color: "#47A248", category: "Database" },
    { name: "PostgreSQL", icon: <SiPostgresql className="w-12 h-12" />, color: "#4169E1", category: "Database" },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="w-12 h-12" />, color: "#06B6D4", category: "Styling" },
    { name: "Framer Motion", icon: <SiFramer className="w-12 h-12" />, color: "#FF0055", category: "Animation" },
    { name: "Prisma", icon: <SiPrisma className="w-12 h-12" />, color: "#2D3748", category: "ORM" },
    { name: "Redux", icon: <SiRedux className="w-12 h-12" />, color: "#764ABC", category: "State" },
    { name: "Git", icon: <SiGit className="w-12 h-12" />, color: "#F05032", category: "Tools" },
    { name: "Docker", icon: <SiDocker className="w-12 h-12" />, color: "#2496ED", category: "Tools" },
    { name: "Vite", icon: <SiVite className="w-12 h-12" />, color: "#646CFF", category: "Build" },
    { name: "Figma", icon: <SiFigma className="w-12 h-12" />, color: "#F24E1E", category: "Design" },
  ];

  const categories = Array.from(new Set(techStack.map(t => t.category)));

  return (
    <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Tech Stack
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The tools and technologies I use to bring ideas to life
          </p>
        </motion.div>

        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <div key={category}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold mb-6 text-accent"
              >
                {category}
              </motion.h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {techStack
                  .filter(tech => tech.category === category)
                  .map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (categoryIndex * 0.1) + (index * 0.05) }}
                    >
                      <Card className="glass-card group hover:border-accent/50 transition-all duration-300">
                        <CardContent className="p-6 text-center">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="mb-3 flex justify-center"
                            style={{ color: tech.color }}
                          >
                            {tech.icon}
                          </motion.div>
                          <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                            {tech.name}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
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
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm always learning and exploring new technologies to stay at the cutting edge of web development. 
                This stack allows me to build fast, scalable, and beautiful applications that users love.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
