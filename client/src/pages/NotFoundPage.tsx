import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Compass, Key } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAchievements } from "@/contexts/AchievementContext";

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
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <Helmet>
        <title>404 | Delowar Hossain</title>
        <meta name="description" content="The page you are looking for does not exist." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

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
            className="absolute rounded-full border border-primary/20 w-80 h-80 sm:w-[420px] sm:h-[420px]"
            style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }}
          />
          <motion.div
            className="absolute rounded-full border border-accent/20 w-[520px] h-[520px]"
            style={{ bottom: "5%", left: "40%", transform: "translateX(-50%)" }}
          />
        </motion.div>
        <motion.svg
          viewBox="0 0 400 400"
          className="absolute opacity-10"
          style={{ top: "20%", right: "10%" }}
          initial={{ rotate: -15 }}
          animate={{ rotate: 15 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 12, ease: "easeInOut" }}
        >
          <motion.path
            d="M50 200 Q200 50 350 200 Q200 350 50 200Z"
            fill="none"
            stroke="url(#gradient404)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
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
        <motion.h1
          className="text-8xl sm:text-9xl font-black text-white tracking-tight"
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 12 }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-2xl font-semibold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Lost in hyperspace
        </motion.p>

        <p className="text-muted-foreground">
          The coordinates you dialed don't exist anymore. Let's drop you back to a safe orbit or
          jump into the contact bay to report a bug.
        </p>

        <form
          onSubmit={submitPuzzle}
          className="space-y-2 border border-border rounded-2xl p-4 bg-background/80"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Key className="h-4 w-4 text-primary" />
            <span>Escape puzzle: convert 1010₂ + 5₁₀ into decimal.</span>
          </div>
          <div className="flex gap-2">
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="flex-1 rounded-xl border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter answer…"
            />
            <Button type="submit" variant="secondary">
              Submit
            </Button>
          </div>
          {feedback && (
            <p className={`text-xs ${solved ? "text-emerald-400" : "text-amber-400"}`}>
              {feedback}
            </p>
          )}
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button size="lg" data-testid="button-home" className="w-48">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="w-48">
              <Compass className="mr-2 h-5 w-5" />
              Contact Me
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
