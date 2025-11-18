import { motion } from "framer-motion";
import React, { Suspense, lazy } from "react";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
const CanvasHero = lazy(() => import("./3d/CanvasHero"));
import { useInView } from "react-intersection-observer";

export default function Hero() {
  const typingText = useTypingAnimation(
    "Web Developer, AI Explorer, Creative Problem Solver",
    50
  );
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden hero-gradient"
    >
      {/* 3D Background - Temporarily disabled due to React Three Fiber compatibility issues */}
      {/* <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <CanvasHero />
        </Suspense>
      </div> */}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background/90 z-1"></div>

      {/* Interactive Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] z-1"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative z-10">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <motion.div
                className="text-sm md:text-lg font-mono mb-4 text-accent/80"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="inline-block">{"<"}</span>
                <span className="inline-block mx-2">Hello, World!</span>
                <span className="inline-block">{"/>"}</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <span className="relative">
                  <span className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-lg"></span>
                  <span className="relative bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Delowar Hossain
                  </span>
                </span>
              </motion.h1>

              <div className="text-xl md:text-2xl lg:text-3xl mb-8 h-16 flex items-center justify-center">
                <motion.span
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  {typingText}
                  <span className="animate-pulse">|</span>
                </motion.span>
              </div>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-center leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span className="text-accent">Building</span> fast, reliable,
                and beautiful digital experiences that actually work.{" "}
                <span className="text-primary">Passionate</span> about creating
                innovative tools that empower developers and learners.
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("projects")}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg overflow-hidden"
              data-testid="view-work-button"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2">
                View My Work
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  initial={{ x: 0 }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("contact")}
              className="group relative px-8 py-4 border border-border bg-card/30 backdrop-blur-sm text-foreground font-semibold rounded-lg overflow-hidden hover:border-accent/50 transition-colors duration-300"
              data-testid="contact-button"
            >
              <span className="relative flex items-center justify-center gap-2">
                Let's Connect
                <motion.span
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  👋
                </motion.span>
              </span>
            </motion.button>
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
