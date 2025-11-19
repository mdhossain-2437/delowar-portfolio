import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAchievements } from "@/contexts/AchievementContext";

export default function AudioReactiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | OscillatorNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { unlock, unlocked } = useAchievements();

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      audioCtxRef.current?.close();
    };
  }, []);

  const startVisualizer = async () => {
    if (active) return;
    setError(null);

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    let sourceNode: MediaStreamAudioSourceNode | OscillatorNode;
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        sourceNode = audioCtx.createMediaStreamSource(stream);
      } else {
        throw new Error("Microphone unavailable");
      }
    } catch {
      // fallback oscillator so the visualizer still works without mic permissions
      const oscillator = audioCtx.createOscillator();
      oscillator.type = "sawtooth";
      oscillator.frequency.value = 220;
      oscillator.start();
      sourceNode = oscillator;
      setError("Microphone access denied, simulating audio wave.");
    }

    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;
    sourceRef.current = sourceNode;
    setActive(true);
    draw();
    if (!unlocked.has("sonic-vibes")) {
      unlock("sonic-vibes");
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#05030f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#a855f7");
        gradient.addColorStop(1, "#38bdf8");

        ctx.fillStyle = gradient;
        ctx.fillRect(
          x,
          canvas.height - barHeight / 1.5,
          barWidth,
          barHeight / 1.5,
        );
        x += barWidth + 1;
      }
      animationRef.current = requestAnimationFrame(renderFrame);
    };
    renderFrame();
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
            Audio Reactive Lab
          </p>
          <h3 className="text-3xl font-bold text-white">Listen to the UI breathe</h3>
          <p className="text-muted-foreground text-sm">
            Grant mic access or let the oscillator simulate beats to see the canvas respond.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            width={720}
            height={220}
            className="w-full border border-white/10 rounded-3xl bg-black/80"
          />
          <div className="flex flex-col items-center gap-2">
            <Button onClick={startVisualizer} disabled={active}>
              {active ? "Visualizer running" : "Start visualizer"}
            </Button>
            {error && <p className="text-xs text-amber-400">{error}</p>}
            {!active && (
              <p className="text-xs text-muted-foreground">
                Microphone access required for live audio; fallback uses synthetic waveform.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
