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
  isMusicPlaying: boolean;
};

const SoundContext = createContext<SoundContextValue | null>(null);
const STORAGE_KEY = "delowar-ui-sound-muted";

// Background music playlist - dynamically loads all numbered music files
const generateMusicPlaylist = () => {
  const playlist: string[] = [];
  // Check for music files from 1 to 100 (you can increase this number)
  for (let i = 1; i <= 100; i++) {
    playlist.push(`/audio/${i}.mp3`);
  }
  return playlist;
};

const MUSIC_PLAYLIST = generateMusicPlaylist();

type Tone = { frequency: number; duration: number; volume?: number };

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackIndex = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
  }, [muted]);

  // Initialize and manage background music
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create audio element
    const audio = new Audio();
    audio.volume = 0.3; // Set to 30% volume
    audio.loop = false; // We'll handle looping manually for playlist
    audio.preload = "auto"; // Preload audio for faster playback
    bgMusicRef.current = audio;

    // Play next track in playlist
    const playNextTrack = () => {
      if (!bgMusicRef.current || muted) return;

      currentTrackIndex.current =
        (currentTrackIndex.current + 1) % MUSIC_PLAYLIST.length;
      bgMusicRef.current.src = MUSIC_PLAYLIST[currentTrackIndex.current];
      bgMusicRef.current.play().catch(() => {
        // Auto-play might be blocked, will play on user interaction
        setIsMusicPlaying(false);
      });
    };

    // Handle track end - play next
    audio.addEventListener("ended", playNextTrack);

    // Auto-start music on any user interaction if not muted
    const startMusic = () => {
      if (!bgMusicRef.current || muted || isMusicPlaying) return;

      bgMusicRef.current.src = MUSIC_PLAYLIST[0];
      bgMusicRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
          // Remove listeners after first successful play
          document.removeEventListener("click", startMusic);
          document.removeEventListener("keydown", startMusic);
          document.removeEventListener("touchstart", startMusic);
        })
        .catch(() => {
          setIsMusicPlaying(false);
        });
    };

    // Try auto-play immediately
    if (!muted) {
      audio.src = MUSIC_PLAYLIST[0];
      audio
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch(() => {
          // Auto-play blocked - add listeners for user interaction
          setIsMusicPlaying(false);
          document.addEventListener("click", startMusic, { once: true });
          document.addEventListener("keydown", startMusic, { once: true });
          document.addEventListener("touchstart", startMusic, { once: true });
        });
    }

    return () => {
      audio.pause();
      audio.removeEventListener("ended", playNextTrack);
      document.removeEventListener("click", startMusic);
      document.removeEventListener("keydown", startMusic);
      document.removeEventListener("touchstart", startMusic);
      bgMusicRef.current = null;
    };
  }, []);

  // Handle mute/unmute
  useEffect(() => {
    if (!bgMusicRef.current) return;

    if (muted) {
      bgMusicRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      // Try to resume or start playing
      const playPromise = bgMusicRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch(() => {
            setIsMusicPlaying(false);
          });
      }
    }
  }, [muted]);

  const ensureAudioContext = () => {
    if (audioCtxRef.current || typeof window === "undefined")
      return audioCtxRef.current;
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
    [muted]
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
      isMusicPlaying,
    }),
    [muted, playClick, playHover, playSuccess, isMusicPlaying]
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSoundboard() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundboard must be used within SoundProvider");
  return ctx;
}
