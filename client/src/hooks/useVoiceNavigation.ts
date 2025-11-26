import { useEffect, useRef, useState } from "react";

type Recognition = InstanceType<typeof window.SpeechRecognition>;

const COMMANDS: Record<string, string> = {
  home: "home",
  projects: "projects",
  blog: "blog",
  contact: "contact",
  about: "about",
  skills: "skills",
  guestbook: "guestbook",
};

const findSection = (phrase: string) => {
  const normalized = phrase.toLowerCase();
  for (const [keyword, section] of Object.entries(COMMANDS)) {
    if (normalized.includes(keyword)) return section;
  }
  if (normalized.includes("login")) return "/auth/login";
  return null;
};

export function useVoiceNavigation() {
  const recognitionRef = useRef<Recognition | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsAvailable(false);
      return;
    }

    const RecognitionCtor =
      (window.SpeechRecognition as typeof window.SpeechRecognition | undefined) ||
      window.webkitSpeechRecognition;
    
    if (!RecognitionCtor) {
      setIsAvailable(false);
      return;
    }

    try {
      const recognition = new RecognitionCtor();
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.trim();
        setTranscript(spoken);
        const target = findSection(spoken);
        if (target) {
          if (target.startsWith("/")) {
            window.location.assign(target);
          } else {
            const el = document.getElementById(target);
            if (el) {
              const offset = 80;
              const elementPosition = el.offsetTop - offset;
              window.scrollTo({ top: elementPosition, behavior: "smooth" });
            }
          }
        }
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setIsAvailable(false);
        }
      };
      
      recognitionRef.current = recognition;
      setIsAvailable(true);
    } catch (error) {
      setIsAvailable(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore stop errors
        }
      }
    };
  }, []);

  const toggle = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return {
    isAvailable,
    isListening,
    transcript,
    toggleListening: toggle,
  };
}
