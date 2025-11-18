import { motion } from "framer-motion";
import { Suspense, lazy, useMemo, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { MousePointerClick, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/projectsData";
import { Fade } from "react-awesome-reveal";

const CanvasHero = lazy(() => import("./3d/CanvasHero"));

const heroStats = [
  { value: "18+", label: "Products shipped" },
  { value: "6", label: "Industries touched" },
  { value: "100%", label: "Remote-ready" },
];

const heroTech = ["React", "Next.js", "TypeScript", "Node.js", "Postgres", "Drizzle ORM"];
const heroRoles = [
  "Product Engineer",
  "AI Explorer",
  "Design Systems Fan",
  "Workflow Automator",
];

export default function Hero() {
  const featuredProject = useMemo(
    () => projects.find((project) => project.featured) ?? projects[0],
    [],
  );
  const [roleIndex, setRoleIndex] = useState(0);
  const currentRole = heroRoles[roleIndex];
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    const timer = setInterval(
      () => setRoleIndex((prev) => (prev + 1) % heroRoles.length),
      2600,
    );
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen overflow-hidden hero-gradient"
    >
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-noise" />
      <div className="hero-canvas pointer-events-none">
        <Suspense fallback={null}>
          <CanvasHero />
        </Suspense>
      </div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_420px] items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground"
            >
              <MousePointerClick className="h-4 w-4 text-accent" />
              Product Engineer • Remote Friendly
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Delowar Hossain
                </h1>
                <div className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
                  <Fade key={currentRole} triggerOnce={false} duration={600}>
                    <span>{currentRole}</span>
                  </Fade>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Full-stack developer focused on expressive web products—crafting immersive
                  portfolios, developer tools, and business dashboards with React, TypeScript, and
                  motion-forward UX.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground font-semibold inline-flex items-center gap-2"
                  >
                    View Projects
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="/Delowar_Hossain_Resume.pdf"
                    className="px-8 py-3 rounded-xl border border-white/20 text-foreground font-semibold hover:border-accent transition-colors"
                  >
                    Download Resume
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {heroTech.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur"
                >
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-[32px] border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-primary/10 space-y-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>Featured project</span>
                <span>{featuredProject.category}</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">{featuredProject.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {featuredProject.description}
                </p>
              </div>
              {featuredProject && (
                <div className="flex flex-wrap gap-2">
                  {featuredProject.tags.slice(0, 5).map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="flex-1 rounded-2xl border border-white/20 py-3 text-sm font-semibold hover:border-accent transition-colors"
                >
                  Case Study
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="flex-1 rounded-2xl bg-white/10 py-3 text-sm font-semibold hover:bg-white/20 transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
