import { motion } from "framer-motion";

export default function AnimatedSVG() {
  return (
    <div className="relative w-80 h-80 mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "hsl(270 95% 75%)", stopOpacity: 0.3 }} />
            <stop offset="50%" style={{ stopColor: "hsl(197 71% 73%)", stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: "hsl(142 72% 60%)", stopOpacity: 0.3 }} />
          </linearGradient>
          <clipPath id="hexClip">
            <polygon points="200,20 320,80 320,200 200,260 80,200 80,80" />
          </clipPath>
        </defs>

        {/* Background hexagon */}
        <motion.polygon
          points="200,30 310,85 310,195 200,250 90,195 90,85"
          fill="url(#profileGradient)"
          stroke="hsl(270 95% 75%)"
          strokeWidth="2"
          opacity="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Developer illustration */}
        <g clipPath="url(#hexClip)">
          {/* Person silhouette */}
          <motion.circle
            cx="200"
            cy="150"
            r="40"
            fill="hsl(270 95% 75%)"
            opacity="0.8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <motion.rect
            x="170"
            y="180"
            width="60"
            height="80"
            rx="30"
            fill="hsl(197 71% 73%)"
            opacity="0.8"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.8 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />

          {/* Code elements */}
          <motion.text
            x="120"
            y="120"
            fontFamily="monospace"
            fontSize="12"
            fill="hsl(142 72% 60%)"
            opacity="0.6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            &lt;/&gt;
          </motion.text>
          <motion.text
            x="260"
            y="140"
            fontFamily="monospace"
            fontSize="10"
            fill="hsl(270 95% 75%)"
            opacity="0.6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            {"{ }"}
          </motion.text>
          <motion.text
            x="130"
            y="220"
            fontFamily="monospace"
            fontSize="8"
            fill="hsl(197 71% 73%)"
            opacity="0.6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            const dev = awesome;
          </motion.text>
        </g>

        {/* Floating code symbols */}
        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <motion.text
            x="100"
            y="80"
            fontFamily="monospace"
            fontSize="14"
            fill="hsl(270 95% 75%)"
            opacity="0.7"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            React
          </motion.text>
        </motion.g>

        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
        >
          <motion.text
            x="280"
            y="220"
            fontFamily="monospace"
            fontSize="12"
            fill="hsl(197 71% 73%)"
            opacity="0.7"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            AI/ML
          </motion.text>
        </motion.g>

        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 2 }}
        >
          <motion.text
            x="150"
            y="300"
            fontFamily="monospace"
            fontSize="10"
            fill="hsl(142 72% 60%)"
            opacity="0.7"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: 2.4, duration: 0.5 }}
          >
            Node.js
          </motion.text>
        </motion.g>
      </svg>
    </div>
  );
}
