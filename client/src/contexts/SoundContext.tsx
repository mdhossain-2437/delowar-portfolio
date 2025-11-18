import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SoundContextValue = {
  muted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playHover: () => void;
  playSuccess: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);
const STORAGE_KEY = "delowar-ui-sound-muted";

type Tone = { frequency: number; duration: number; volume?: number };

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
  }, [muted]);

  const ensureAudioContext = () => {
    if (audioCtxRef.current || typeof window === "undefined") return audioCtxRef.current;
    audioCtxRef.current = new AudioContext();
    return audioCtxRef.current;
  };

  const playSequence = useCallback(
    (tones: Tone[]) => {
      if (muted) return;
      const ctx = ensureAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      tones.reduce((start, tone) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = tone.frequency;
        gainNode.gain.value = tone.volume ?? 0.2;
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + tone.duration);
        return start + tone.duration * 0.9;
      }, now);
    },
    [muted],
  );

  const playClick = useCallback(() => {
    playSequence([
      { frequency: 420, duration: 0.08 },
      { frequency: 360, duration: 0.06, volume: 0.15 },
    ]);
  }, [playSequence]);

  const playHover = useCallback(() => {
    playSequence([{ frequency: 680, duration: 0.08, volume: 0.08 }]);
  }, [playSequence]);

  const playSuccess = useCallback(() => {
    playSequence([
      { frequency: 540, duration: 0.12, volume: 0.25 },
      { frequency: 720, duration: 0.16, volume: 0.18 },
    ]);
  }, [playSequence]);

  const toggleMute = () => setMuted((state) => !state);

  const value = useMemo(
    () => ({
      muted,
      toggleMute,
      playClick,
      playHover,
      playSuccess,
    }),
    [muted, playClick, playHover, playSuccess],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSoundboard() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundboard must be used within SoundProvider");
  return ctx;
}
