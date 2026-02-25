import { useState, type FormEvent, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Compass, Key, Sparkles, Zap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAchievements } from "@/contexts/AchievementContext";
import gsap from "gsap";

const orbitVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 36,
      ease: "linear",
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.4, 0.8, 0.4],
    transition: {
      repeat: Infinity,
      duration: 6,
      ease: "easeInOut",
    },
  },
};

export default function NotFoundPage() {
  const [answer, setAnswer] = useState("");
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const navigate = useNavigate();
  const { unlock, unlocked } = useAchievements();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP title animation with glitch effect
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { scale: 0.5, opacity: 0, rotateY: -180 },
        {
          scale: 1,
          opacity: 1,
          rotateY: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
        }
      );

      // Continuous glitch effect
      gsap.to(titleRef.current, {
        x: "random(-5, 5)",
        y: "random(-2, 2)",
        duration: 0.1,
        repeat: -1,
        repeatRefresh: true,
        ease: "none",
        yoyo: true,
      });
    }

    // Animated particles
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll(".particle");
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          x: `random(-100, 100)`,
          y: `random(-100, 100)`,
          scale: `random(0.5, 1.5)`,
          opacity: `random(0.3, 0.8)`,
          duration: `random(2, 4)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.1,
        });
      });
    }

    // Glitch overlay animation
    if (glitchRef.current) {
      gsap.to(glitchRef.current, {
        opacity: 0.3,
        duration: 0.05,
        repeat: -1,
        yoyo: true,
        repeatDelay: 2,
      });
    }
  }, []);

  const submitPuzzle = (event: FormEvent) => {
    event.preventDefault();
    const normalized = answer.trim();
    if (normalized === "15") {
      setSolved(true);
      setFeedback("Correct! Redirect unlocked.");
      if (!unlocked.has("puzzle-master")) {
        unlock("puzzle-master");
      }
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      setFeedback("Nope. Remember: 1010₂ + 5₁₀ ?");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Helmet>
        <title>404 | Delowar Hossain</title>
        <meta
          name="description"
          content="The page you are looking for does not exist."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Animated particles background */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-purple-500/30 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Glitch overlay */}
      <div
        ref={glitchRef}
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 mix-blend-overlay"
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={pulseVariants}
        animate="animate"
      >
        <motion.div
          variants={orbitVariants}
          animate="animate"
          className="absolute inset-0"
        >
          <motion.div
            className="absolute rounded-full border-2 border-purple-500/30 w-80 h-80 sm:w-[420px] sm:h-[420px] shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }}
          />
          <motion.div
            className="absolute rounded-full border-2 border-cyan-500/30 w-[520px] h-[520px] shadow-[0_0_50px_rgba(56,189,248,0.3)]"
            style={{ bottom: "5%", left: "40%", transform: "translateX(-50%)" }}
          />
        </motion.div>
        <motion.svg
          viewBox="0 0 400 400"
          className="absolute opacity-20"
          style={{ top: "20%", right: "10%", width: "300px" }}
          initial={{ rotate: -15 }}
          animate={{ rotate: 15 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 12,
            ease: "easeInOut",
          }}
        >
          <motion.path
            d="M50 200 Q200 50 350 200 Q200 350 50 200Z"
            fill="none"
            stroke="url(#gradient404)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="gradient404" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl mx-auto space-y-6 relative z-10"
      >
        <div className="relative">
          <motion.h1
            ref={titleRef}
            className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 tracking-tight drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 12 }}
          >
            404
          </motion.h1>
          {/* Sparkle effects */}
          <Sparkles className="absolute -top-8 left-1/4 w-8 h-8 text-yellow-400 animate-pulse" />
          <Zap className="absolute -bottom-4 right-1/3 w-6 h-6 text-cyan-400 animate-bounce" />
        </div>

        <motion.p
          className="text-2xl font-semibold text-white drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🚀 Lost in hyperspace
        </motion.p>

        <motion.p
          className="text-slate-300 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          The coordinates you dialed don't exist anymore. Let's drop you back to
          a safe orbit or jump into the contact bay to report a bug.
        </motion.p>

        <motion.form
          onSubmit={submitPuzzle}
          className="space-y-3 border-2 border-purple-500/30 rounded-2xl p-5 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.2)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Key className="h-5 w-5 text-cyan-400 animate-pulse" />
            <span className="font-medium">
              🔐 Escape puzzle: convert{" "}
              <span className="text-purple-400 font-mono">1010₂ + 5₁₀</span>{" "}
              into decimal.
            </span>
          </div>
          <div className="flex gap-2">
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="flex-1 rounded-xl border-2 border-purple-500/50 bg-slate-800/50 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder="Enter answer..."
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Submit
            </Button>
          </div>
          {feedback && (
            <motion.p
              className={`text-sm font-medium ${
                solved ? "text-emerald-400" : "text-amber-400"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {feedback}
            </motion.p>
          )}
        </motion.form>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/">
            <Button
              size="lg"
              data-testid="button-home"
              className="w-48 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              size="lg"
              variant="outline"
              className="w-48 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <Compass className="mr-2 h-5 w-5" />
              Contact Me
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
