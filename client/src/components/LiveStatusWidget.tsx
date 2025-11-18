import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Activity, Wifi, CalendarDays } from "lucide-react";

function getAvailability(hour: number) {
  if (hour >= 9 && hour < 18) {
    return {
      label: "Heads-down build window",
      status: "online",
      color: "text-emerald-400",
    };
  }
  if (hour >= 18 && hour < 23) {
    return {
      label: "Advisory / async reviews",
      status: "async",
      color: "text-sky-400",
    };
  }
  return {
    label: "Deep research + rest",
    status: "offline",
    color: "text-muted-foreground",
  };
}

function getNextSlot(hour: number) {
  if (hour < 9) return "Next build sprint kicks off at 09:00 BST";
  if (hour < 18) return "Strategy reviews open again after 18:00 BST";
  return "Morning stand-up at 09:00 BST tomorrow";
}

export default function LiveStatusWidget() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      }),
    [],
  );

  const formattedTime = formatter.format(now);
  const hour = now.getHours();
  const availability = getAvailability(hour);
  const nextSlot = getNextSlot(hour);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-2xl space-y-4 text-sm"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <span>Live availability</span>
        <span className={availability.color}>{availability.status}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-background/40 border border-white/10 px-4 py-3 flex-1">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            Current time
          </p>
          <p className="text-2xl font-semibold text-foreground">{formattedTime}</p>
        </div>
        <div className="rounded-2xl bg-background/40 border border-white/10 px-4 py-3 flex-1">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            Mode
          </p>
          <p className="text-lg font-semibold text-foreground">{availability.label}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-background/30 px-4 py-3">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Wifi className="h-4 w-4 text-primary" />
            Collaboration Surface
          </p>
          <p className="text-sm text-foreground">
            Linear, Notion, FigJam — synced via automation bots.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-background/30 px-4 py-3">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-accent" />
            Next slot
          </p>
          <p className="text-sm text-foreground">{nextSlot}</p>
        </div>
      </div>
    </motion.div>
  );
}
