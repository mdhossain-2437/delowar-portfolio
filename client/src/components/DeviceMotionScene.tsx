import { useEffect, useState } from "react";

export default function DeviceMotionScene() {
  const [supported, setSupported] = useState(true);
  const [tilt, setTilt] = useState({ beta: 0, gamma: 0 });

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      setSupported(false);
      return;
    }
    const handler = (event: DeviceOrientationEvent) => {
      setTilt({
        beta: event.beta ?? 0,
        gamma: event.gamma ?? 0,
      });
    };
    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler);
  }, []);

  return (
    <section className="py-20 bg-card/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Device motion sensing
        </p>
        <h3 className="text-3xl font-semibold text-foreground">
          Tilt your phone to move the floating artifact
        </h3>
        {!supported && (
          <p className="text-sm text-muted-foreground">
            Your device does not expose motion sensors. Try on mobile.
          </p>
        )}
        <div className="h-64 rounded-3xl border border-border bg-gradient-to-br from-indigo-900 to-slate-900 relative overflow-hidden">
          <div
            className="absolute w-24 h-24 rounded-full bg-primary/70 blur-2xl transition-transform duration-150"
            style={{
              transform: `translate(${tilt.gamma}px, ${tilt.beta}px)`,
              left: "calc(50% - 48px)",
              top: "calc(50% - 48px)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
