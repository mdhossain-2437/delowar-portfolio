import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  User,
  Sparkles,
  FolderGit2,
  MessageCircle,
  BookOpen,
  Newspaper,
  Users,
} from "lucide-react";
import VoiceCommandToggle from "@/components/VoiceCommandToggle";
import InstallPWAButton from "@/components/InstallPWAButton";
import FocusModeToggle from "@/components/FocusModeToggle";
import SoundToggle from "@/components/SoundToggle";
import LocaleToggle from "@/components/LocaleToggle";
import { useTranslation } from "@/hooks/useTranslation";

export default function Navigation() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const t = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["home", "about", "skills", "projects", "blog", "contact"];
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
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "home", label: t("nav.home"), icon: Home },
    { id: "about", label: t("nav.about"), icon: User },
    { id: "skills", label: t("nav.skills"), icon: Sparkles },
    { id: "projects", label: t("nav.projects"), icon: FolderGit2 },
    { id: "blog", label: t("nav.blog"), icon: BookOpen },
    { id: "contact", label: t("nav.contact"), icon: MessageCircle },
  ];

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
          <div className="flex justify-between items-center h-20">
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

            <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  activeSection === item.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`nav-${item.id}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => navigate("/guestbook")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              aria-label="Guestbook"
              type="button"
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/blog")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              type="button"
            >
              <BookOpen className="w-4 h-4" />
              {t("nav.blog")}
            </button>
            <button
              onClick={() => navigate("/uses")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              type="button"
            >
              {t("nav.uses")}
            </button>
            <InstallPWAButton />
            <FocusModeToggle />
            <SoundToggle />
            <LocaleToggle />
          </div>
          <div className="hidden lg:block">
            <VoiceCommandToggle />
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
              {
                id: "guestbook-page",
                label: t("nav.guestbook"),
                icon: Users,
                action: () => navigate("/guestbook"),
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
          <FocusModeToggle />
          <SoundToggle />
          <LocaleToggle />
        </div>
      </motion.div>
    </Fragment>
  );
}
