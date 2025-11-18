import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Palette, Code, TestTube, Rocket, RefreshCw } from "lucide-react";

export default function WorkProcess() {
  const processes = [
    {
      step: "01",
      icon: <Search className="w-8 h-8" />,
      title: "Discovery & Research",
      description: "Understanding your goals, target audience, and technical requirements. I dive deep into what makes your project unique.",
    },
    {
      step: "02",
      icon: <Palette className="w-8 h-8" />,
      title: "Design & Planning",
      description: "Creating wireframes, user flows, and technical architecture. Every pixel and every line of code is planned with purpose.",
    },
    {
      step: "03",
      icon: <Code className="w-8 h-8" />,
      title: "Development",
      description: "Building with clean, maintainable code using modern technologies. Regular updates keep you in the loop every step of the way.",
    },
    {
      step: "04",
      icon: <TestTube className="w-8 h-8" />,
      title: "Testing & QA",
      description: "Rigorous testing across devices and browsers. I ensure everything works flawlessly before launch.",
    },
    {
      step: "05",
      icon: <Rocket className="w-8 h-8" />,
      title: "Launch & Deploy",
      description: "Smooth deployment with proper monitoring and optimization. Your project goes live without a hitch.",
    },
    {
      step: "06",
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Support & Iterate",
      description: "Ongoing support and improvements based on user feedback. Great products evolve with their users.",
    },
  ];

  return (
    <section id="process" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            How I Work
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A proven process that delivers exceptional results, every time
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processes.map((process, index) => (
            <motion.div
              key={process.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card group hover:border-accent/50 transition-all duration-300 h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/40" />

                <CardContent className="p-6 pt-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#020817] text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    {process.icon}
                  </div>
                  
                  <div className="text-sm font-mono text-muted-foreground mb-2">
                    Step {process.step}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {process.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {process.description}
                  </p>
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
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Collaboration is Key
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Throughout this entire process, I maintain clear communication with regular updates, 
                feedback sessions, and collaborative decision-making. Your input shapes the final product, 
                ensuring it perfectly aligns with your vision.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
