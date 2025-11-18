import { motion } from "framer-motion";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useInView } from "react-intersection-observer";
import {
  Sparkles,
  Cpu,
  Globe,
  Rocket,
  MessageSquare,
} from "lucide-react";

const heroHighlights = [
  {
    label: "Experience Architect",
    detail: "Cinematic, story-driven interfaces with purposeful motion.",
    icon: Sparkles,
  },
  {
    label: "Systems Thinker",
    detail: "Automation + AI-first workflows that scale teams globally.",
    icon: Cpu,
  },
  {
    label: "Community Catalyst",
    detail: "Mentoring the next wave of makers & founders worldwide.",
    icon: Globe,
  },
];

const heroStats = [
  { value: "45+", label: "Products shipped", sub: "Full-stack experiences" },
  { value: "12", label: "Awards & honors", sub: "Design + dev showcases" },
  { value: "1M+", label: "User interactions", sub: "Measured + optimized" },
];

const heroFocus = [
  {
    title: "Currently Crafting",
    description:
      "An AI-native workspace OS blending analytics, storytelling, and automation into one fluid canvas.",
    tag: "Realtime React • WebGL • Edge Functions",
  },
  {
    title: "Signature Move",
    description:
      "Layering volumetric gradients, tactile depth, and system thinking to guide users through complex flows.",
    tag: "Design Systems • Framer Motion • Narrative UX",
  },
];

export default function Hero() {
  const typingText = useTypingAnimation(
    "Web Developer, AI Explorer, Creative Problem Solver",
    50,
  );
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
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
      ref={ref}
      className="relative min-h-screen overflow-hidden hero-gradient"
    >
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-noise" />

      <div className="absolute inset-0 bg-grid-pattern opacity-[0.035] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_420px] items-center">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground"
            >
              <Rocket className="h-4 w-4 text-accent" />
              Available for visionary collaborations
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.9 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-muted-foreground text-xl md:text-2xl mb-4 font-mono">
                  {typingText}
                  <span className="animate-pulse">|</span>
                </span>
                <span className="relative inline-block">
                  <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 opacity-80" />
                  <span className="relative bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Delowar Hossain
                  </span>
                </span>{" "}
                crafts living, breathing digital playgrounds.
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                I help ambitious teams translate bold ideas into immersive
                products. From AI copilots to cinematic portfolios, every pixel
                and API is orchestrated to feel alive, intuitive, and
                unforgettable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex flex-wrap gap-3"
            >
              {heroHighlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 px-4 py-3"
                >
                  <div className="rounded-full bg-white/10 p-2 text-primary">
                    <highlight.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {highlight.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {highlight.detail}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => scrollToSection("projects")}
                className="group relative flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground font-semibold overflow-hidden"
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20" />
                <span className="relative flex items-center justify-center gap-2">
                  View Signature Work
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    →
                  </motion.span>
                </span>
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="flex-1 sm:flex-none rounded-2xl border border-white/15 bg-white/5 px-8 py-4 font-semibold text-foreground hover:border-accent/60 transition"
              >
                Book a Product Jam
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur"
                >
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="relative"
          >
            <div className="relative rounded-[36px] border border-white/15 bg-white/5 p-6 backdrop-blur-xl shadow-2xl shadow-primary/10">
              <div className="absolute inset-x-8 -top-4 h-8 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-2xl" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Focus</p>
                    <p className="text-2xl font-semibold">Lab Notes</p>
                  </div>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
                    Live feed
                  </span>
                </div>

                <div className="space-y-4">
                  {heroFocus.map((focus, index) => (
                    <motion.div
                      key={focus.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                      animate={{
                        y: inView ? [0, -4, 0] : 0,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 6 + index * 2,
                      }}
                    >
                      <p className="text-sm uppercase tracking-widest text-primary">
                        {focus.tag}
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        {focus.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {focus.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                  <p className="text-sm uppercase tracking-widest text-muted-foreground">
                    Open for collab
                  </p>
                  <p className="text-lg font-semibold">
                    Let's architect your next milestone, sprint, or launch week.
                  </p>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="inline-flex items-center gap-2 text-accent font-semibold"
                  >
                    Send a voice memo
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
