import { motion } from "framer-motion";
import { CloudRain, Moon, Sun, BatteryCharging, Activity } from "lucide-react";
import { useEnvironment } from "@/contexts/EnvironmentContext";

export default function AmbientStatusWidget() {
  const { weather, isNight, batteryLevel, isPowerSaving, lastUpdated } = useEnvironment();

  const batteryPercent = batteryLevel !== null ? Math.round(batteryLevel * 100) : null;
  const batteryLabel =
    batteryPercent !== null ? `${batteryPercent}%` : isPowerSaving ? "Power save" : "Unknown";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid gap-4 md:grid-cols-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl mt-8"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Weather</p>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            {weather.isRaining ? (
              <CloudRain className="h-5 w-5" />
            ) : isNight ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-base font-semibold text-white">{weather.condition}</p>
            <p className="text-xs text-muted-foreground">
              {weather.description || "Syncing..."}
              {weather.temperature !== null && ` • ${Math.round(weather.temperature)}°C`}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Time Mode</p>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
            {isNight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-base font-semibold text-white">
              {isNight ? "Night ambient" : "Day ambient"}
            </p>
            <p className="text-xs text-muted-foreground">
              {lastUpdated ? `Updated ${Math.round((Date.now() - lastUpdated) / 60000)}m ago` : ""}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Device State
        </p>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            {isPowerSaving ? <Activity className="h-5 w-5" /> : <BatteryCharging className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-base font-semibold text-white">
              {isPowerSaving ? "Power Saving" : "Full Motion"}
            </p>
            <p className="text-xs text-muted-foreground">{batteryLabel}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
