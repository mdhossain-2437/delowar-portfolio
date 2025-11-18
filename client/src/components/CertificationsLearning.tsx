import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, Trophy, GraduationCap } from "lucide-react";

export default function CertificationsLearning() {
  const certifications = [
    {
      title: "Meta Front-End Developer",
      issuer: "Meta (Coursera)",
      date: "2023",
      icon: <Award className="w-8 h-8" />,
      skills: ["React", "JavaScript", "HTML/CSS"],
    },
    {
      title: "Full Stack Open",
      issuer: "University of Helsinki",
      date: "2023",
      icon: <GraduationCap className="w-8 h-8" />,
      skills: ["Node.js", "Express", "MongoDB"],
    },
    {
      title: "JavaScript Algorithms",
      issuer: "freeCodeCamp",
      date: "2022",
      icon: <Trophy className="w-8 h-8" />,
      skills: ["Algorithms", "Data Structures"],
    },
    {
      title: "Responsive Web Design",
      issuer: "freeCodeCamp",
      date: "2022",
      icon: <BookOpen className="w-8 h-8" />,
      skills: ["CSS", "Flexbox", "Grid"],
    },
  ];

  const learningGoals = [
    { topic: "TypeScript Advanced Patterns", progress: 75 },
    { topic: "System Design & Architecture", progress: 60 },
    { topic: "AI/ML Integration", progress: 45 },
    { topic: "Web3 & Blockchain", progress: 30 },
  ];

  return (
    <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Certifications & Learning
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Committed to continuous learning and professional development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card group hover:border-accent/50 transition-all duration-300 h-full">
                <div className="h-2 bg-primary/40" />
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#020817] text-primary mb-4 group-hover:scale-110 transition-transform">
                    {cert.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {cert.issuer}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {cert.date}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
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
        >
          <Card className="glass-card p-8 max-w-4xl mx-auto">
            <CardContent>
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Current Learning Goals
              </h3>
              <div className="space-y-6">
                {learningGoals.map((goal, index) => (
                  <motion.div
                    key={goal.topic}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">{goal.topic}</span>
                      <span className="text-sm text-accent font-semibold">{goal.progress}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${goal.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
