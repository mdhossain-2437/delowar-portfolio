import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";

export default function OfflineBanner() {
  const offline = useOfflineStatus();

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-4 right-4 z-[1200] rounded-2xl bg-amber-500 text-amber-950 px-4 py-2 shadow-lg flex items-center gap-2"
        >
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">
            Offline — play the AR Dino game via `/offline.html`
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
