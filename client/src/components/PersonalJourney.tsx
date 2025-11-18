import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Heart, Code, Lightbulb, Target, TrendingUp } from "lucide-react";

export default function PersonalJourney() {
  const journeySteps = [
    {
      year: "2019",
      icon: <Lightbulb className="w-8 h-8" />,
      title: "The Spark",
      description: "Discovered the magic of code when I built my first HTML page. That moment of seeing my creation come to life on screen changed everything.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      year: "2020",
      icon: <Code className="w-8 h-8" />,
      title: "Deep Dive",
      description: "Spent countless nights learning JavaScript, React, and Node.js. Every bug was a puzzle, every solution a victory.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      year: "2021",
      icon: <Rocket className="w-8 h-8" />,
      title: "First Freelance",
      description: "Landed my first client and delivered a full-stack e-commerce platform. The feeling of solving real-world problems was incredible.",
      color: "from-purple-500 to-pink-500",
    },
    {
      year: "2022",
      icon: <Target className="w-8 h-8" />,
      title: "Finding My Focus",
      description: "Specialized in React and Node.js, building scalable applications. Started contributing to open-source projects.",
      color: "from-green-500 to-emerald-500",
    },
    {
      year: "2023",
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth & Impact",
      description: "Built 10+ production applications helping businesses grow. Explored AI/ML to create smarter solutions.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      year: "2024-25",
      icon: <Heart className="w-8 h-8" />,
      title: "The Journey Continues",
      description: "Passionate about building beautiful, performant applications that make a real difference in people's lives.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section id="journey" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            My Coding Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From curious beginner to passionate developer - here's the story of how I fell in love with code
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary opacity-20 hidden md:block" />

          {journeySteps.map((step, index) => (
            <motion.div
              key={step.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex items-center mb-16 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } flex-col md:gap-8`}
            >
              <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} text-center`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="glass-card overflow-hidden group hover:border-accent/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {step.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="relative flex items-center justify-center my-4 md:my-0">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg z-10`}
                >
                  {step.year.slice(2)}
                </motion.div>
              </div>

              <div className="flex-1" />
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
                Why I Code
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I code because I love solving problems and creating things that matter. 
                Every line of code is an opportunity to make someone's life easier, 
                to build something beautiful, or to push the boundaries of what's possible. 
                It's not just about the technology—it's about the impact and the people behind the screens.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
