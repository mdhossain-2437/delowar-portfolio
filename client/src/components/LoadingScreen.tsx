import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function LoadingScreen({ onLoadComplete }: { onLoadComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (cancelled) {
          return prev;
        }
        if (prev >= 100) {
          clearInterval(timer);
          if (!cancelled) {
            setTimeout(() => {
              if (!cancelled) onLoadComplete();
            }, 300);
          }
          return 100;
        }
        return prev + 4;
      });
    }, 15);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [onLoadComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            DH
          </h1>
        </motion.div>

        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <motion.p
          className="text-sm text-muted-foreground font-mono"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {progress}%
        </motion.p>
      </div>
    </motion.div>
  );
}
