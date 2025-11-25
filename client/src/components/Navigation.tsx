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
  const [voiceFeedback, setVoiceFeedback] = useState<VoiceFeedback | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toggleTheme, setTheme } = useTheme();
  const { muted, toggleMute, playSuccess } = useSoundboard();
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
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
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
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

  const navItems = useMemo(
    () => [
      { id: "home", label: t("nav.home"), icon: Home, voiceKeywords: ["home", "top", "hero"] },
      { id: "about", label: t("nav.about"), icon: User, voiceKeywords: ["about", "bio", "who"] },
      { id: "skills", label: t("nav.skills"), icon: Sparkles, voiceKeywords: ["skills", "skill"] },
      { id: "stack", label: "Stack", icon: Zap, voiceKeywords: ["stack", "tech", "tooling"] },
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
      { id: "impact", label: "Impact", icon: BookOpen, voiceKeywords: ["impact", "case"] },
      { id: "blog", label: t("nav.blog"), icon: BookOpen, voiceKeywords: ["blog", "articles"] },
      {
        id: "achievements",
        label: "Achievements",
        icon: Sparkles,
        voiceKeywords: ["achievements", "awards"],
      },
      { id: "contact", label: t("nav.contact"), icon: MessageCircle, voiceKeywords: ["contact"] },
    ],
    [t],
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
        keywords: ["mute sound", "unmute sound", "silence", "sound on", "sound off"],
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

    return [...sectionIntents, ...routeIntents, ...systemIntents, ...utilityIntents];
  }, [navItems, navigate, muted, toggleMute, setTheme, toggleTheme]);

  const matchVoiceIntent = (text: string) =>
    voiceIntents.find((intent) => intent.keywords.some((keyword) => text.includes(keyword)));

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
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
        data-testid="navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <motion.button
              onClick={() => scrollToSection("home")}
              className="text-2xl font-bold group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Delowar
              </span>
            </motion.button>

            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeSection === item.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={toggleVoiceNav}
                className={`relative h-10 w-10 flex items-center justify-center rounded-full border transition-colors ${
                  isListening
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border/60 text-muted-foreground hover:text-primary hover:border-primary/60"
                }`}
                aria-label="Voice navigation"
                type="button"
                disabled={!voiceSupported}
              >
                {isListening && (
                  <span className="absolute -inset-2 rounded-full bg-primary/10 blur animate-pulse" />
                )}
                {isListening && (
                  <span className="absolute inset-0 flex items-center justify-center gap-1">
                    {[0, 1, 2, 3].map((bar) => (
                      <motion.span
                        key={bar}
                        className="w-1 rounded-full bg-primary/70"
                        animate={{ height: ["35%", "90%", "45%"], opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 1.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: bar * 0.1,
                        }}
                      />
                    ))}
                  </span>
                )}
                <Mic className="h-4 w-4" />
                {isListening && (
                  <span className="absolute inset-[-6px] rounded-full border border-primary/30 animate-ping" />
                )}
              </button>
              <InstallPWAButton />
              <LocaleToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="fixed bottom-4 left-0 right-0 px-4 md:hidden z-[1000]"
      >
        <div className="max-w-md mx-auto rounded-3xl border border-border bg-background/80 backdrop-blur-xl shadow-2xl shadow-primary/10">
          <div className="flex items-center justify-between">
            {[
              ...navItems.map((item) => ({
                ...item,
                action: () => scrollToSection(item.id),
                isRoute: false,
              })),
              {
                id: "blog-page",
                label: t("nav.blog"),
                icon: Newspaper,
                action: () => navigate("/blog"),
                isRoute: true,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = !item.isRoute && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="relative flex-1 px-3 py-3 flex flex-col items-center gap-1 text-xs font-medium focus-visible:outline-none"
                  data-testid={`mobile-bottom-nav-${item.id}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mobileActiveSection"
                      className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 flex flex-col items-center gap-1 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-2 max-w-md mx-auto">
          <button
            onClick={toggleVoiceNav}
            className={`relative h-10 w-10 flex items-center justify-center rounded-full border transition-colors ${
              isListening
                ? "border-primary text-primary bg-primary/10"
                : "border-border/60 text-muted-foreground hover:text-primary hover:border-primary/60"
            }`}
            aria-label="Voice navigation"
            type="button"
            disabled={!voiceSupported}
          >
            {isListening && (
              <span className="absolute -inset-2 rounded-full bg-primary/10 blur animate-pulse" />
            )}
            {isListening && (
              <span className="absolute inset-0 flex items-center justify-center gap-1">
                {[0, 1, 2, 3].map((bar) => (
                  <motion.span
                    key={bar}
                    className="w-1 rounded-full bg-primary/70"
                    animate={{ height: ["35%", "90%", "45%"], opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 1.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: bar * 0.1,
                    }}
                  />
                ))}
              </span>
            )}
            <Mic className="h-4 w-4" />
            {isListening && (
              <span className="absolute inset-[-6px] rounded-full border border-primary/30 animate-ping" />
            )}
          </button>
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
                    animate={{ height: ["30%", "100%", "35%"], opacity: [0.6, 1, 0.6] }}
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
                voiceFeedback.status === "matched" ? "text-primary" : "text-muted-foreground"
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
