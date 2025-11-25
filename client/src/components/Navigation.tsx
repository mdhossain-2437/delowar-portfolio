import { useState, useEffect, useRef, Fragment, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Sparkles,
  FolderGit2,
  MessageCircle,
  BookOpen,
  Newspaper,
  Zap,
  Mic,
  Volume2,
  VolumeX,
} from "lucide-react";
import InstallPWAButton from "@/components/InstallPWAButton";
import LocaleToggle from "@/components/LocaleToggle";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/contexts/ThemeContext";
import { useSoundboard } from "@/contexts/SoundContext";

type VoiceIntent = {
  id: string;
  keywords: string[];
  label: string;
  action: () => void;
  type: "section" | "route" | "system" | "utility";
};

type VoiceFeedback = {
  heard: string;
  action?: string;
  status: "matched" | "missed";
};

export default function Navigation() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [lastHeard, setLastHeard] = useState<string | null>(null);
  const [voiceFeedback, setVoiceFeedback] = useState<VoiceFeedback | null>(
    null
  );
  const recognitionRef = useRef<any>(null);
  const { toggleTheme, setTheme } = useTheme();
  const { muted, toggleMute, playSuccess, isMusicPlaying } = useSoundboard();
  const t = useTranslation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);

        const sections = [
          "home",
          "about",
          "skills",
          "stack",
          "experience",
          "projects",
          "impact",
          "blog",
          "achievements",
          "contact",
        ];
        const scrollPosition = window.scrollY + 150;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (
              scrollPosition >= offsetTop &&
              scrollPosition < offsetTop + offsetHeight
            ) {
              setActiveSection(section);
              break;
            }
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }
    setVoiceSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      handleVoiceCommand(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onstart = () => setIsListening(true);

    recognitionRef.current = recognition;

    return () => {
      recognition.stop?.();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!voiceFeedback) return;
    const timeout = window.setTimeout(() => setVoiceFeedback(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [voiceFeedback]);

  const scrollToSection = (sectionId: string) => {
    const attemptScroll = (attempts = 0) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({ top: elementPosition, behavior: "smooth" });
      } else if (attempts < 10) {
        // If element not found (lazy loading), scroll to bottom to trigger loading
        if (attempts === 0) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }
        // Retry after a short delay
        setTimeout(() => attemptScroll(attempts + 1), 200);
      }
    };
    attemptScroll();
  };

  const navItems = useMemo(
    () => [
      {
        id: "home",
        label: t("nav.home"),
        icon: Home,
        voiceKeywords: ["home", "top", "hero"],
      },
      {
        id: "about",
        label: t("nav.about"),
        icon: User,
        voiceKeywords: ["about", "bio", "who"],
      },
      {
        id: "skills",
        label: t("nav.skills"),
        icon: Sparkles,
        voiceKeywords: ["skills", "skill"],
      },
      {
        id: "stack",
        label: "Stack",
        icon: Zap,
        voiceKeywords: ["stack", "tech", "tooling"],
      },
      {
        id: "experience",
        label: "Experience",
        icon: User,
        voiceKeywords: ["experience", "career", "resume summary"],
      },
      {
        id: "projects",
        label: t("nav.projects"),
        icon: FolderGit2,
        voiceKeywords: ["projects", "portfolio", "work"],
      },
      {
        id: "impact",
        label: "Impact",
        icon: BookOpen,
        voiceKeywords: ["impact", "case"],
      },
      {
        id: "blog",
        label: t("nav.blog"),
        icon: BookOpen,
        voiceKeywords: ["blog", "articles"],
      },
      {
        id: "achievements",
        label: "Achievements",
        icon: Sparkles,
        voiceKeywords: ["achievements", "awards"],
      },
      {
        id: "contact",
        label: t("nav.contact"),
        icon: MessageCircle,
        voiceKeywords: ["contact"],
      },
    ],
    [t]
  );

  const voiceIntents = useMemo<VoiceIntent[]>(() => {
    const sectionIntents: VoiceIntent[] = navItems.map((item) => ({
      id: item.id,
      label: `${item.label} section`,
      type: "section",
      keywords: [
        item.id,
        item.label.toLowerCase(),
        `${item.label.toLowerCase()} section`,
        ...item.voiceKeywords,
      ],
      action: () => scrollToSection(item.id),
    }));

    const routeIntents: VoiceIntent[] = [
      {
        id: "open-blog-page",
        label: "Open blog page",
        keywords: ["open blog", "go to blog page", "blog page"],
        type: "route",
        action: () => navigate("/blog"),
      },
      {
        id: "open-resume",
        label: "Open resume",
        keywords: ["open resume", "resume", "cv"],
        type: "route",
        action: () => navigate("/resume"),
      },
      {
        id: "open-guestbook",
        label: "Guestbook",
        keywords: ["guestbook", "sign guest book"],
        type: "route",
        action: () => navigate("/guestbook"),
      },
      {
        id: "open-uses",
        label: "Uses and gear",
        keywords: ["uses page", "gear", "tools i use"],
        type: "route",
        action: () => navigate("/uses"),
      },
      {
        id: "open-contact-page",
        label: "Open contact page",
        keywords: ["contact page", "message page", "send a note"],
        type: "route",
        action: () => navigate("/contact"),
      },
      {
        id: "open-projects-page",
        label: "Open projects page",
        keywords: ["projects page", "all projects", "project list"],
        type: "route",
        action: () => navigate("/projects"),
      },
    ];

    const systemIntents: VoiceIntent[] = [
      {
        id: "theme-dark",
        label: "Switch to dark theme",
        keywords: ["dark mode", "night mode", "dark theme"],
        type: "system",
        action: () => setTheme("dark"),
      },
      {
        id: "theme-light",
        label: "Switch to light theme",
        keywords: ["light mode", "day mode", "light theme"],
        type: "system",
        action: () => setTheme("light"),
      },
      {
        id: "theme-toggle",
        label: "Toggle theme",
        keywords: ["toggle theme", "switch theme", "change theme"],
        type: "system",
        action: toggleTheme,
      },
      {
        id: "toggle-sound",
        label: muted ? "Unmute interface sound" : "Mute interface sound",
        keywords: [
          "mute sound",
          "unmute sound",
          "silence",
          "sound on",
          "sound off",
        ],
        type: "system",
        action: toggleMute,
      },
    ];

    const utilityIntents: VoiceIntent[] = [
      {
        id: "scroll-down",
        label: "Scroll down",
        keywords: ["scroll down", "go down", "next section", "move down"],
        type: "utility",
        action: () =>
          window.scrollBy({
            top: Math.max(window.innerHeight * 0.75, 400),
            behavior: "smooth",
          }),
      },
      {
        id: "scroll-up",
        label: "Scroll up",
        keywords: ["scroll up", "go up", "previous section", "back up"],
        type: "utility",
        action: () =>
          window.scrollBy({
            top: -Math.max(window.innerHeight * 0.75, 400),
            behavior: "smooth",
          }),
      },
    ];

    return [
      ...sectionIntents,
      ...routeIntents,
      ...systemIntents,
      ...utilityIntents,
    ];
  }, [navItems, navigate, muted, toggleMute, setTheme, toggleTheme]);

  const matchVoiceIntent = (text: string) =>
    voiceIntents.find((intent) =>
      intent.keywords.some((keyword) => text.includes(keyword))
    );

  const handleVoiceCommand = (text: string) => {
    const normalized = text.trim().toLowerCase();
    if (!normalized) return;
    setLastHeard(normalized);

    const matchedIntent = matchVoiceIntent(normalized);

    if (matchedIntent) {
      matchedIntent.action();
      playSuccess();
      setVoiceFeedback({
        heard: normalized,
        action: matchedIntent.label,
        status: "matched",
      });
      return;
    }

    setVoiceFeedback({
      heard: normalized,
      action: "Command not mapped yet",
      status: "missed",
    });
  };

  const toggleVoiceNav = () => {
    if (!voiceSupported || !recognitionRef.current) {
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <Fragment>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-500"
        data-testid="navigation"
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-500 ${
            isScrolled ? "px-4 py-2" : "px-4 py-4"
          }`}
        >
          <div
            className={`relative rounded-2xl transition-all duration-500 ${
              isScrolled
                ? "bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 shadow-2xl shadow-purple-500/10"
                : "bg-slate-900/50 backdrop-blur-md border border-slate-800/50"
            }`}
          >
            <div className="relative px-6 py-4">
              <div className="flex justify-between items-center">
                {/* Logo */}
                <motion.button
                  onClick={() => scrollToSection("home")}
                  className="relative group flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="hidden sm:flex relative">
                    {/* Creative stacked logo design */}
                    <div className="flex flex-col items-start space-y-[-8px]">
                      {/* Line 1: Delowar - Same size as Hossain */}
                      <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] drop-shadow-[0_0_18px_rgba(168,85,247,0.6)] transform -rotate-1">
                        Delowar
                      </span>
                    </div>
                  </div>
                </motion.button>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-2 bg-slate-800/30 rounded-xl px-2 py-2 border border-slate-700/30">
                  {navItems
                    .filter((_, index) => index < 7 && index !== 7)
                    .concat(navItems[9])
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          data-testid={`nav-${item.id}`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="navActiveSection"
                              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg"
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="hidden xl:inline">
                              {item.label}
                            </span>
                          </span>
                        </motion.button>
                      );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Voice Button */}
                  <motion.button
                    onClick={toggleVoiceNav}
                    className={`relative h-10 w-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${
                      isListening
                        ? "border-purple-500 text-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/25"
                        : "border-slate-700 text-slate-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/5"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Voice navigation"
                    type="button"
                    disabled={!voiceSupported}
                  >
                    {isListening && (
                      <>
                        <span className="absolute -inset-1 rounded-xl bg-purple-500/20 blur animate-pulse" />
                        <span className="absolute inset-0 flex items-center justify-center gap-0.5">
                          {[0, 1, 2].map((bar) => (
                            <motion.span
                              key={bar}
                              className="w-0.5 rounded-full bg-purple-400"
                              animate={{
                                height: ["30%", "80%", "40%"],
                                opacity: [0.6, 1, 0.6],
                              }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: bar * 0.1,
                              }}
                            />
                          ))}
                        </span>
                      </>
                    )}
                    <Mic
                      className={`h-4 w-4 ${
                        isListening ? "opacity-0" : "opacity-100"
                      } transition-opacity`}
                    />
                  </motion.button>

                  {/* Music Toggle Button */}
                  <motion.button
                    onClick={toggleMute}
                    className={`relative h-10 w-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${
                      !muted && isMusicPlaying
                        ? "border-cyan-500 text-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/25"
                        : "border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={muted ? "Unmute music" : "Mute music"}
                    type="button"
                  >
                    {!muted && isMusicPlaying && (
                      <span className="absolute -inset-1 rounded-xl bg-cyan-500/20 blur animate-pulse" />
                    )}
                    {muted ? (
                      <VolumeX className="h-4 w-4 relative z-10" />
                    ) : (
                      <Volume2 className="h-4 w-4 relative z-10" />
                    )}
                  </motion.button>

                  {/* Additional Tools */}
                  <div className="hidden md:flex items-center gap-2">
                    <LocaleToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        className="fixed bottom-4 left-4 right-4 lg:hidden z-[1000]"
      >
        <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/90 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />

          <div className="relative grid grid-cols-5 gap-1 p-2">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-300"
                  whileTap={{ scale: 0.95 }}
                  data-testid={`mobile-bottom-nav-${item.id}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mobileActiveSection"
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 flex flex-col items-center gap-1 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium">
                      {item.label}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="mt-3 flex justify-between items-center gap-2">
          <motion.button
            onClick={toggleVoiceNav}
            className={`relative h-11 px-4 flex items-center gap-2 rounded-xl border transition-all duration-300 ${
              isListening
                ? "border-purple-500 text-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/25"
                : "border-slate-700 text-slate-400 bg-slate-900/50 backdrop-blur-sm"
            }`}
            whileTap={{ scale: 0.95 }}
            aria-label="Voice navigation"
            type="button"
            disabled={!voiceSupported}
          >
            {isListening && (
              <span className="absolute -inset-1 rounded-xl bg-purple-500/20 blur animate-pulse" />
            )}
            <Mic className="h-4 w-4" />
            <span className="text-xs font-medium">Voice</span>
          </motion.button>

          <LocaleToggle />
        </div>
      </motion.div>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed top-16 left-4 right-4 md:left-auto md:right-4 md:w-72 z-[1000] rounded-2xl border border-primary/30 bg-background/90 px-4 py-3 shadow-xl backdrop-blur"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Listening
                </span>
              </div>
              <div className="flex items-end gap-1 h-5">
                {[0, 1, 2, 3, 4].map((bar) => (
                  <motion.span
                    key={bar}
                    className="w-[3px] rounded-full bg-primary/80"
                    animate={{
                      height: ["30%", "100%", "35%"],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: bar * 0.08,
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Try “open projects page”, “dark mode”, or “scroll down”.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {voiceFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed top-32 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[1000] flex flex-col gap-1 rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Voice command
            </div>
            <div className="text-sm font-semibold text-foreground line-clamp-2">
              “{voiceFeedback.heard}”
            </div>
            <div
              className={`text-xs ${
                voiceFeedback.status === "matched"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {voiceFeedback.action}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {lastHeard && !voiceFeedback && (
        <div className="fixed top-16 right-4 z-[1000] hidden md:flex items-center gap-2 rounded-full bg-background/80 border border-border px-4 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-semibold text-foreground">Heard:</span>
          <span className="truncate max-w-[200px]">{lastHeard}</span>
        </div>
      )}
    </Fragment>
  );
}
