import { useEffect, useState } from "react";

export default function FPSRamMonitor() {
  const [fps, setFps] = useState(0);
  const [ram, setRam] = useState<string>("N/A");

  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const loop = (time: number) => {
      frameCount += 1;
      const delta = time - lastTime;
      if (delta >= 1000) {
        setFps(Math.round((frameCount * 1000) / delta));
        frameCount = 0;
        lastTime = time;

        const perf = (performance as any).memory;
        if (perf) {
          const used = perf.usedJSHeapSize / 1024 / 1024;
          const limit = perf.jsHeapSizeLimit / 1024 / 1024;
          setRam(`${used.toFixed(0)} / ${limit.toFixed(0)} MB`);
        }
      }
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 text-[11px] font-mono bg-black/70 backdrop-blur rounded-xl border border-white/10 px-3 py-2 text-white shadow-lg">
      <div>FPS: {fps}</div>
      <div>RAM: {ram}</div>
    </div>
  );
}
