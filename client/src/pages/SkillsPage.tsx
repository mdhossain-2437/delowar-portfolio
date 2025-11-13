import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  SiJavascript, 
  SiTypescript, 
  SiPython, 
  SiHtml5, 
  SiCss3,
  SiReact, 
  SiNextdotjs, 
  SiTailwindcss,
  SiFramer,
  SiRedux,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiSocketdotio,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiPrisma,
  SiGit,
  SiGithub,
  SiDocker,
  SiVite,
  SiWebpack,
  SiFigma
} from "react-icons/si";
import { 
  Code2, 
  Database, 
  Settings, 
  Palette, 
  Users, 
  Zap,
  Globe,
  Server,
  Lightbulb,
  MessageSquare,
  Target,
  BookOpen
} from "lucide-react";

export default function SkillsPage() {
  const skillCategories = [
    {
      title: "Languages",
      icon: <Code2 className="w-6 h-6" />,
      color: "from-purple-500 to-purple-700",
      skills: [
        { name: "JavaScript", icon: <SiJavascript className="w-6 h-6" />, color: "text-yellow-400" },
        { name: "TypeScript", icon: <SiTypescript className="w-6 h-6" />, color: "text-blue-500" },
        { name: "Python", icon: <SiPython className="w-6 h-6" />, color: "text-blue-400" },
        { name: "HTML5", icon: <SiHtml5 className="w-6 h-6" />, color: "text-orange-500" },
        { name: "CSS3", icon: <SiCss3 className="w-6 h-6" />, color: "text-blue-500" }
      ]
    },
    {
      title: "Frontend",
      icon: <Globe className="w-6 h-6" />,
      color: "from-cyan-500 to-cyan-700",
      skills: [
        { name: "React", icon: <SiReact className="w-6 h-6" />, color: "text-cyan-400" },
        { name: "Next.js", icon: <SiNextdotjs className="w-6 h-6" />, color: "text-foreground" },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="w-6 h-6" />, color: "text-cyan-500" },
        { name: "shadcn/ui", icon: <Zap className="w-5 h-5" />, color: "text-foreground" },
        { name: "Framer Motion", icon: <SiFramer className="w-6 h-6" />, color: "text-pink-500" },
        { name: "Redux", icon: <SiRedux className="w-6 h-6" />, color: "text-purple-500" },
        { name: "React Query", icon: <Code2 className="w-5 h-5" />, color: "text-red-500" },
        { name: "Wouter", icon: <Code2 className="w-5 h-5" />, color: "text-blue-400" }
      ]
    },
    {
      title: "Backend",
      icon: <Server className="w-6 h-6" />,
      color: "from-green-500 to-green-700",
      skills: [
        { name: "Node.js", icon: <SiNodedotjs className="w-6 h-6" />, color: "text-green-500" },
        { name: "Express.js", icon: <SiExpress className="w-6 h-6" />, color: "text-foreground" },
        { name: "NestJS", icon: <SiNestjs className="w-6 h-6" />, color: "text-red-500" },
        { name: "RESTful APIs", icon: <Code2 className="w-5 h-5" />, color: "text-blue-400" },
        { name: "WebSockets", icon: <SiSocketdotio className="w-6 h-6" />, color: "text-foreground" }
      ]
    },
    {
      title: "Database",
      icon: <Database className="w-6 h-6" />,
      color: "from-blue-500 to-blue-700",
      skills: [
        { name: "MongoDB", icon: <SiMongodb className="w-6 h-6" />, color: "text-green-500" },
        { name: "PostgreSQL", icon: <SiPostgresql className="w-6 h-6" />, color: "text-blue-400" },
        { name: "Redis", icon: <SiRedis className="w-6 h-6" />, color: "text-red-500" },
        { name: "Drizzle ORM", icon: <Code2 className="w-5 h-5" />, color: "text-green-400" },
        { name: "Prisma", icon: <SiPrisma className="w-6 h-6" />, color: "text-foreground" }
      ]
    },
    {
      title: "DevOps & Tools",
      icon: <Settings className="w-6 h-6" />,
      color: "from-orange-500 to-orange-700",
      skills: [
        { name: "Git", icon: <SiGit className="w-6 h-6" />, color: "text-orange-500" },
        { name: "GitHub", icon: <SiGithub className="w-6 h-6" />, color: "text-foreground" },
        { name: "Docker", icon: <SiDocker className="w-6 h-6" />, color: "text-blue-400" },
        { name: "Vite", icon: <SiVite className="w-6 h-6" />, color: "text-purple-500" },
        { name: "Webpack", icon: <SiWebpack className="w-6 h-6" />, color: "text-blue-500" },
        { name: "CI/CD", icon: <Code2 className="w-5 h-5" />, color: "text-green-400" }
      ]
    },
    {
      title: "Design & Other",
      icon: <Palette className="w-6 h-6" />,
      color: "from-pink-500 to-pink-700",
      skills: [
        { name: "Responsive Design", icon: <Globe className="w-5 h-5" />, color: "text-cyan-400" },
        { name: "UI/UX Principles", icon: <Palette className="w-5 h-5" />, color: "text-pink-500" },
        { name: "Figma", icon: <SiFigma className="w-6 h-6" />, color: "text-purple-500" },
        { name: "VS Code", icon: <Code2 className="w-5 h-5" />, color: "text-blue-500" },
        { name: "Testing", icon: <Target className="w-5 h-5" />, color: "text-green-500" }
      ]
    },
    {
      title: "Soft Skills",
      icon: <Users className="w-6 h-6" />,
      color: "from-teal-500 to-teal-700",
      skills: [
        { name: "Communication", icon: <MessageSquare className="w-5 h-5" />, color: "text-blue-400" },
        { name: "Problem-solving", icon: <Lightbulb className="w-5 h-5" />, color: "text-yellow-400" },
        { name: "Teamwork", icon: <Users className="w-5 h-5" />, color: "text-green-400" },
        { name: "Self-learning", icon: <BookOpen className="w-5 h-5" />, color: "text-purple-400" },
        { name: "Mentoring", icon: <Users className="w-5 h-5" />, color: "text-cyan-400" }
      ]
    }
  ];

  const currentlyLearning = [
    "Advanced TypeScript Patterns",
    "AI/ML Integration",
    "System Design"
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
          data-testid="skills-header-section"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Skills & Expertise
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive showcase of my technical capabilities, tools, and technologies I work with to build modern web applications
          </p>

          {/* Currently Learning Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mt-8"
            data-testid="currently-learning-section"
          >
            <span className="text-sm text-muted-foreground font-medium">Currently learning:</span>
            {currentlyLearning.map((tech, index) => (
              <Badge 
                key={tech}
                variant="secondary" 
                className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:border-primary/50 transition-colors"
                data-testid={`learning-badge-${index}`}
              >
                {tech}
              </Badge>
            ))}
          </motion.div>
        </motion.section>

        {/* Skills Categories */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-12"
          data-testid="skills-categories-section"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
              data-testid={`category-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}>
                  {category.icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  {category.title}
                </h2>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: categoryIndex * 0.1 + skillIndex * 0.05, 
                      duration: 0.4 
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    data-testid={`skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <Card className="glass-card h-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`${skill.color} transition-transform duration-300 group-hover:scale-110`}>
                          {skill.icon}
                        </div>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {skill.name}
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Skills Summary Card */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
          data-testid="skills-summary-section"
        >
          <Card className="glass-card border-l-4 border-primary">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white flex-shrink-0 shadow-xl">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Continuous Growth & Learning
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    As a self-taught developer, I'm constantly expanding my skill set and staying up-to-date with the latest 
                    technologies and best practices. My approach is hands-on and project-driven, ensuring I can apply 
                    new knowledge effectively in real-world scenarios.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    I believe in building strong fundamentals while being adaptable to new tools and frameworks. Each project 
                    is an opportunity to learn, grow, and deliver better solutions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

      </div>
    </div>
  );
}
