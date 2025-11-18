import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

export default function FeaturedProjects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack online store with payment integration, inventory management, and real-time analytics. Increased client revenue by 300%.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      liveUrl: "#",
      githubUrl: "#",
      stats: ["100+ Daily Orders", "+300% Revenue", "2,500+ Users"],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "School Management System",
      description: "Comprehensive system for managing students, attendance, grades, and parent communication. Saves teachers 15+ hours weekly.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      tech: ["Next.js", "PostgreSQL", "TypeScript", "Prisma"],
      liveUrl: "#",
      githubUrl: "#",
      stats: ["500+ Students", "15h/week Saved", "4.8/5 Rating"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "AI Task Manager",
      description: "Smart productivity app with AI-powered task prioritization, time tracking, and automated scheduling suggestions.",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
      tech: ["React", "Express", "OpenAI", "Redis"],
      liveUrl: "#",
      githubUrl: "#",
      stats: ["1,000+ Users", "40% Time Saved", "AI-Powered"],
      gradient: "from-cyan-500 to-green-500",
    },
  ];

  return (
    <section id="featured-projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing my best work - projects that solved real problems and delivered measurable results
          </p>
        </motion.div>

        <div className="space-y-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-card overflow-hidden group hover:border-accent/50 transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className={`relative overflow-hidden ${index % 2 === 0 ? 'order-1' : 'order-2'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 z-10" />
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient}`} />
                  </div>
                  
                  <CardContent className={`p-8 flex flex-col justify-center ${index % 2 === 0 ? 'order-2' : 'order-1'}`}>
                    <h3 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border">
                      {project.stats.map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="text-lg font-bold text-accent">{stat}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Button variant="default" className="bg-gradient-to-r from-primary to-accent">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </Button>
                      <Button variant="outline">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg"
            className="group"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
