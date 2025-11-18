import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Clock, Star, CheckCircle2, BarChart3 } from "lucide-react";

export default function RealWorldImpact() {
  const impacts = [
    {
      title: "E-Commerce Platform",
      client: "Local Business Owner",
      description: "Built a complete online store that processes 100+ orders daily, increasing revenue by 300%",
      stats: [
        { label: "Daily Orders", value: "100+", icon: <TrendingUp className="w-4 h-4" /> },
        { label: "Revenue Growth", value: "+300%", icon: <BarChart3 className="w-4 h-4" /> },
        { label: "Active Users", value: "2,500+", icon: <Users className="w-4 h-4" /> },
      ],
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    {
      title: "School Management System",
      client: "Educational Institution",
      description: "Automated attendance, grading, and parent communication, saving 15+ hours per week for teachers",
      stats: [
        { label: "Time Saved", value: "15h/week", icon: <Clock className="w-4 h-4" /> },
        { label: "Students", value: "500+", icon: <Users className="w-4 h-4" /> },
        { label: "Satisfaction", value: "4.8/5", icon: <Star className="w-4 h-4" /> },
      ],
      tech: ["Next.js", "PostgreSQL", "TypeScript"],
    },
    {
      title: "Freelancer Portfolio Generator",
      client: "Open Source Project",
      description: "Created a tool used by 500+ developers to build professional portfolios in minutes",
      stats: [
        { label: "Active Users", value: "500+", icon: <Users className="w-4 h-4" /> },
        { label: "Templates", value: "20+", icon: <CheckCircle2 className="w-4 h-4" /> },
        { label: "GitHub Stars", value: "150+", icon: <Star className="w-4 h-4" /> },
      ],
      tech: ["React", "Tailwind", "Vite"],
    },
    {
      title: "Inventory Management App",
      client: "Retail Chain",
      description: "Streamlined stock management across 3 stores, reducing waste by 40% and increasing efficiency",
      stats: [
        { label: "Waste Reduced", value: "-40%", icon: <TrendingUp className="w-4 h-4" /> },
        { label: "Stores", value: "3", icon: <CheckCircle2 className="w-4 h-4" /> },
        { label: "Items Tracked", value: "5,000+", icon: <BarChart3 className="w-4 h-4" /> },
      ],
      tech: ["React", "Express", "MySQL", "Redis"],
    },
  ];

  return (
    <section id="real-impact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Real-World Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Projects that made a real difference for real people and businesses
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {impacts.map((impact, index) => (
            <motion.div
              key={impact.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card group hover:border-accent/50 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="w-full h-2 rounded-full bg-primary/40 mb-6" />
                  
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {impact.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    <Users className="w-4 h-4 inline mr-1" />
                    {impact.client}
                  </p>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {impact.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {impact.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="flex items-center justify-center mb-1 text-accent">
                          {stat.icon}
                        </div>
                        <div className="text-xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {impact.tech.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
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
          className="text-center mt-12"
        >
          <Card className="glass-card p-8 max-w-3xl mx-auto">
            <CardContent>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Verified Results
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                <span className="text-accent font-semibold">Beyond the code:</span> These aren't just projects—they're solutions that help businesses grow, 
                teachers save time, and developers build their careers. Every line of code serves a purpose, 
                and every feature solves a real problem.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">10+</div>
                  <div className="text-sm text-muted-foreground">Live Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">4,000+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">98%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">System Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
