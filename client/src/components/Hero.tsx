import { motion } from "framer-motion";
import AnimatedSVG from "./AnimatedSVG";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";

export default function Hero() {
  const typingText = useTypingAnimation("Web Developer, AI Explorer, Creative Problem Solver", 50);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden hero-gradient">
      {/* Floating Orbs */}
      <div className="absolute inset-0">
        <div className="floating-orb absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-primary/30 to-transparent rounded-full animate-float"></div>
        <div className="floating-orb absolute top-60 right-15 w-20 h-20 bg-gradient-to-r from-accent/30 to-transparent rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="floating-orb absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-r from-primary/20 to-transparent rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p 
            className="text-lg text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Hi, I'm
          </motion.p>

          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Delowar Hossain
            </span>
          </motion.h1>

          <div className="text-xl md:text-2xl lg:text-3xl mb-8 h-16 flex items-center justify-center">
            <span className="text-muted-foreground">
              {typingText}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            I build fast, reliable, and beautiful digital experiences that actually work. 
            Passionate about creating innovative tools that empower developers and learners.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
              data-testid="view-work-button"
            >
              View My Work
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 border border-border bg-card text-foreground font-semibold rounded-lg hover:bg-muted transition-all duration-300 transform hover:scale-105"
              data-testid="contact-button"
            >
              Let's Connect
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  );
}
