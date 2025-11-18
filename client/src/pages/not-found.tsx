import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      <Helmet>
        <title>404 | Delowar Hossain</title>
      </Helmet>
      {/* Floating orbs in background */}
      <div className="absolute inset-0">
        <div className="floating-orb absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-transparent rounded-full animate-float"></div>
        <div className="floating-orb absolute top-60 right-15 w-24 h-24 bg-gradient-to-r from-accent/20 to-transparent rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="floating-orb absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-r from-primary/10 to-transparent rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="glass-card p-12 rounded-lg max-w-md w-full mx-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Animated 404 SVG */}
          <div className="mb-8">
            <svg viewBox="0 0 300 200" className="w-64 h-32 mx-auto">
              {/* Main 404 text */}
              <motion.text
                x="150"
                y="80"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="48"
                fill="hsl(270 95% 75%)"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                404
              </motion.text>

              {/* Glitch effect lines */}
              <motion.rect
                x="50"
                y="65"
                width="200"
                height="2"
                fill="hsl(197 71% 73%)"
                opacity="0.6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 0.5, 1] }}
                transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
              />
              <motion.rect
                x="80"
                y="85"
                width="140"
                height="2"
                fill="hsl(142 72% 60%)"
                opacity="0.6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 0.8, 1, 0.3] }}
                transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
              />

              {/* Floating error symbols */}
              <motion.g
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <circle cx="80" cy="120" r="4" fill="hsl(197 71% 73%)" opacity="0.8"/>
                <text x="75" y="125" fontSize="8" fill="hsl(197 71% 73%)" fontFamily="monospace">!</text>
              </motion.g>

              <motion.g
                animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
              >
                <circle cx="220" cy="110" r="3" fill="hsl(142 72% 60%)" opacity="0.8"/>
                <text x="217" y="114" fontSize="6" fill="hsl(142 72% 60%)" fontFamily="monospace">?</text>
              </motion.g>

              <motion.g
                animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
              >
                <circle cx="150" cy="140" r="3" fill="hsl(270 95% 75%)" opacity="0.6"/>
                <text x="147" y="144" fontSize="6" fill="hsl(270 95% 75%)" fontFamily="monospace">X</text>
              </motion.g>

              {/* Code brackets */}
              <motion.text
                x="30"
                y="80"
                fontSize="24"
                fill="hsl(215 20% 65%)"
                fontFamily="monospace"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                {"<"}
              </motion.text>
              <motion.text
                x="270"
                y="80"
                fontSize="24"
                fill="hsl(215 20% 65%)"
                fontFamily="monospace"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                {"/>"}
              </motion.text>

              {/* Dev joke subtitle */}
              <motion.text
                x="150"
                y="160"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="12"
                fill="hsl(215 20% 65%)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                Oops! Wrong commit branch
              </motion.text>

              {/* Terminal cursor */}
              <motion.rect
                x="265"
                y="150"
                width="2"
                height="15"
                fill="hsl(270 95% 75%)"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <motion.h1
            className="text-3xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            data-testid="not-found-title"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            className="text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            data-testid="not-found-description"
          >
            Looks like you've ventured into uncharted code territory! 
            This page seems to have escaped to another dimension. 
            Let's get you back to familiar ground.
          </motion.p>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
              data-testid="back-home-button"
            >
              <i className="fas fa-home mr-2"></i>
              Back to Home
            </Link>

            <div className="mt-6 text-sm text-muted-foreground">
              <p>
                <i className="fas fa-code mr-2 text-accent"></i>
                Error 404: File not found in repository
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
