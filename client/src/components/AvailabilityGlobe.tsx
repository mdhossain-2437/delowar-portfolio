import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { motion } from "framer-motion";
import { useEnvironment } from "@/contexts/EnvironmentContext";

export default function AvailabilityGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isNight, weather } = useEnvironment();

  useEffect(() => {
    if (!canvasRef.current) return;
    let phi = 0;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: typeof window === "undefined" ? 1 : window.devicePixelRatio,
      width: 600 * (typeof window === "undefined" ? 1 : window.devicePixelRatio),
      height: 600 * (typeof window === "undefined" ? 1 : window.devicePixelRatio),
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      scale: 1,
      mapSamples: 16000,
      mapBrightness: 2,
      baseColor: [0.05, 0.08, 0.16],
      markerColor: [0.1, 0.6, 0.9],
      glowColor: [0.2, 0.2, 0.9],
      markers: [{ location: [23.81, 90.41], size: 0.12 }],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => globe?.destroy();
  }, []);

  const availability = isNight ? "Sleeping / async replies" : "Available for collabs";
  const statusColor = isNight ? "text-amber-400" : "text-emerald-400";

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[420px,1fr] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Availability</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Where I’m dialing in from today
          </h2>
          <p className="text-muted-foreground mb-6">
            Real-time signal from Dhaka with weather + sunlight context. Clients instantly know if a
            quick call will be synchronous or async.
          </p>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-[0.3em]">
                  Local time
                </p>
                <p className="text-2xl font-semibold text-white">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Dhaka",
                  })}
                </p>
              </div>
              <span className={`text-sm font-semibold ${statusColor}`}>{availability}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {weather.condition} {weather.temperature !== null ? `• ${weather.temperature}°C` : ""}
              </span>
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </motion.div>

        <motion.canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="w-full h-full max-w-[480px] mx-auto"
          style={{ width: "100%", height: "100%", aspectRatio: 1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </section>
  );
}
