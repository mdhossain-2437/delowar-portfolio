import { motion } from "framer-motion";
import { useEffect, useMemo, useState, useRef, lazy, Suspense } from "react";
import {
  ArrowRight,
  Code2,
  Zap,
  Github,
  Linkedin,
  Mail,
  Star,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Lazy load 3D Room Experience for better performance
const Room3DExperience = lazy(
  () => import("@/components/3d/room/Room3DExperience")
);

const stats = [
  { label: "Projects", value: "50+", icon: Code2 },
  { label: "Years Experience", value: "5+", icon: TrendingUp },
  { label: "Client Satisfaction", value: "100%", icon: Star },
];

export default function Hero() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const phrases = useMemo(
    () => [
      "Building Digital Experiences",
      "Full-Stack Web Developer",
      "AI & Modern Web Solutions",
      "Crafting Beautiful Interfaces",
    ],
    []
  );

  const [typed, setTyped] = useState("");
  const [loop, setLoop] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[loop % phrases.length] ?? "";
    const atWord = typed === current;
    const delta = isDeleting ? 30 : 100;

    const timer = window.setTimeout(() => {
      setTyped((prev) =>
        isDeleting
          ? current.substring(0, prev.length - 1)
          : current.substring(0, prev.length + 1)
      );

      if (!isDeleting && atWord) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && typed === "") {
        setIsDeleting(false);
        setLoop((n) => n + 1);
      }
    }, delta);

    return () => window.clearTimeout(timer);
  }, [phrases, typed, isDeleting, loop]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const offset = 80;
    const top = element.offsetTop - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Room Background - Full Screen */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div
              className={`w-full h-full flex items-center justify-center ${
                theme === "dark"
                  ? "bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950"
                  : "bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100"
              }`}
            >
              <div
                className={`text-center space-y-4 ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <div
                  className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto ${
                    theme === "dark" ? "border-purple-500" : "border-purple-600"
                  }`}
                />
                <p className="animate-pulse text-lg">
                  Loading 3D Experience...
                </p>
              </div>
            </div>
          }
        >
          <Room3DExperience className="w-full h-full" />
        </Suspense>
      </div>

      {/* Gradient overlay for text readability */}
      <div
        className={`absolute inset-0 z-[1] pointer-events-none ${
          theme === "dark"
            ? "bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent"
            : "bg-gradient-to-r from-white/80 via-white/40 to-transparent"
        }`}
      />

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r backdrop-blur-sm ${
                theme === "dark"
                  ? "from-purple-500/10 to-cyan-500/10 border border-purple-500/20"
                  : "from-purple-500/20 to-cyan-500/20 border border-purple-500/30"
              }`}
            >
              <Zap
                className={`w-4 h-4 ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-purple-300" : "text-purple-700"
                }`}
              >
                Available for freelance
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold leading-tight"
              >
                <span
                  className={`bg-clip-text text-transparent ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-white via-purple-200 to-cyan-200"
                      : "bg-gradient-to-r from-slate-900 via-purple-700 to-cyan-700"
                  }`}
                >
                  Delowar Hossain
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="h-16 flex items-center"
              >
                <h2
                  className={`text-2xl md:text-3xl font-semibold ${
                    theme === "dark" ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {typed}
                  <span
                    className={`inline-block w-0.5 h-8 ml-1 animate-pulse ${
                      theme === "dark" ? "bg-purple-500" : "bg-purple-600"
                    }`}
                  />
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`text-lg max-w-xl leading-relaxed ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Passionate about creating exceptional web experiences with
                modern technologies. Specializing in React, TypeScript, and
                full-stack development.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("projects")}
                className={`group px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold inline-flex items-center gap-2 shadow-lg transition-all ${
                  theme === "dark"
                    ? "shadow-purple-500/25 hover:shadow-purple-500/40"
                    : "shadow-purple-500/30 hover:shadow-purple-500/50"
                }`}
              >
                View My Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("contact")}
                className={`px-8 py-4 rounded-full border-2 font-semibold transition-all backdrop-blur-sm ${
                  theme === "dark"
                    ? "border-slate-700 text-slate-300 hover:border-purple-500 hover:text-purple-300"
                    : "border-slate-300 text-slate-700 hover:border-purple-500 hover:text-purple-600"
                }`}
              >
                Get In Touch
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4"
            >
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "#", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  href={href}
                  aria-label={label}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all backdrop-blur-sm ${
                    theme === "dark"
                      ? "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-purple-400 hover:border-purple-500"
                      : "bg-white/50 border-slate-300 text-slate-600 hover:text-purple-600 hover:border-purple-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`grid grid-cols-3 gap-6 pt-8 border-t ${
                theme === "dark" ? "border-slate-800" : "border-slate-200"
              }`}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon
                      className={`w-6 h-6 ${
                        theme === "dark" ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-3xl font-bold mb-1 ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Empty for 3D background to show */}
          <div className="hidden lg:block" />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-6 h-10 rounded-full border-2 flex items-start justify-center p-2 ${
              theme === "dark" ? "border-slate-700" : "border-slate-300"
            }`}
          >
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${
                theme === "dark" ? "bg-purple-500" : "bg-purple-600"
              }`}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
