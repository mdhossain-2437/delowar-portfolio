import { motion } from "framer-motion";
import { useState } from "react";

export default function ProfilePhoto() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Animated background gradients */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Gradient background layers */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/15 to-accent/30 rounded-3xl blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-primary/10 to-accent/25 rounded-3xl blur-xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Main photo container */}
      <motion.div
        className="relative z-10 w-full h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Decorative frame */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/50 via-primary/20 to-accent/50 p-[2px]"
          animate={{
            background: [
              "linear-gradient(to bottom right, hsla(270,95%,75%,0.5), hsla(270,95%,75%,0.2), hsla(197,71%,73%,0.5))",
              "linear-gradient(to bottom right, hsla(270,95%,75%,0.2), hsla(197,71%,73%,0.4), hsla(270,95%,75%,0.5))",
              "linear-gradient(to bottom right, hsla(197,71%,73%,0.5), hsla(270,95%,75%,0.2), hsla(197,71%,73%,0.3))",
              "linear-gradient(to bottom right, hsla(270,95%,75%,0.5), hsla(197,71%,73%,0.4), hsla(270,95%,75%,0.2))",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="relative w-full h-full bg-gray-900/90 rounded-3xl overflow-hidden backdrop-blur-sm">
            {/* Photo with effects */}
            <motion.div
              className="relative w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 animate-pulse" />
              )}

              <img
                src="/delowar-photo.png"
                alt="Delowar Hossain"
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  // Fallback to placeholder if image doesn't exist
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-family='system-ui' font-size='24'%3EDelowar Hossain%3C/text%3E%3C/svg%3E";
                  setImageLoaded(true);
                }}
              />

              {/* Overlay gradient for better text visibility if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent opacity-60" />
            </motion.div>
          </div>
        </motion.div>

        {/* Floating tech badges */}
        <motion.div
          className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-accent text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg shadow-primary/40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          whileHover={{ scale: 1.1 }}
        >
          Web Developer
        </motion.div>

        <motion.div
          className="absolute -bottom-2 -left-2 bg-gradient-to-r from-accent to-primary text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg shadow-accent/40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          whileHover={{ scale: 1.1 }}
        >
          AI Learner
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-2 h-2 bg-primary/70 rounded-full shadow-lg shadow-primary/40" />
        </motion.div>

        <motion.div
          className="absolute -bottom-4 right-1/4"
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-2 h-2 bg-accent/70 rounded-full shadow-lg shadow-accent/40" />
        </motion.div>

        <motion.div
          className="absolute top-1/2 -right-4"
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-2 h-2 bg-accent/60 rounded-full shadow-lg shadow-accent/30" />
        </motion.div>
      </motion.div>

      {/* Code snippets floating around */}
      <motion.div
        className="absolute top-10 -left-16 text-primary/70 font-mono text-sm"
        animate={{
          y: [0, -10, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        &lt;React /&gt;
      </motion.div>

      <motion.div
        className="absolute bottom-20 -right-16 text-accent/70 font-mono text-sm"
        animate={{
          y: [0, -10, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        {"{ AI/ML }"}
      </motion.div>

      <motion.div
        className="absolute -bottom-8 left-1/3 text-accent/60 font-mono text-xs"
        animate={{
          y: [0, -10, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        Node.js
      </motion.div>
    </div>
  );
}
