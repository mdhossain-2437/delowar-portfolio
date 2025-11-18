import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    webgazer?: any;
  }
}

const WEBGAZER_URL = "https://webgazer.cs.brown.edu/webgazer.js";

function supportsWebGL() {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function EyeTrackingToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(() =>
    typeof window === "undefined" ? false : supportsWebGL(),
  );
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsSupported(supportsWebGL());
  }, []);

  useEffect(() => {
    if (!enabled) {
      window.webgazer?.pause();
      return;
    }

    if (!isSupported) {
      toast({
        title: "Eye tracking unavailable",
        description: "Your browser or device does not support WebGL.",
        variant: "destructive",
      });
      setEnabled(false);
      return;
    }

    let cancelled = false;
    const init = async () => {
      if (window.webgazer) {
        startListener();
        return;
      }
      setLoading(true);
      try {
        await loadScript();
        if (!cancelled) startListener();
      } catch (error) {
        toast({
          title: "Eye tracking unavailable",
          description: (error as Error).message,
          variant: "destructive",
        });
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    };
    init();
    return () => {
      cancelled = true;
      window.webgazer?.pause();
    };
  }, [enabled, toast, isSupported]);

  const loadScript = () =>
    new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${WEBGAZER_URL}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("WebGazer failed to load")), {
          once: true,
        });
        return;
      }
      const script = document.createElement("script");
      script.src = WEBGAZER_URL;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", () => resolve());
      script.addEventListener("error", () => reject(new Error("WebGazer failed to load")));
      document.body.appendChild(script);
    });

  const startListener = () => {
    window.webgazer.setRegression("ridge");
    window.webgazer.setTracker("TFFacemesh");
    window.webgazer.begin();
    window.webgazer.showVideo(false);
    window.webgazer.showFaceOverlay(false);
    window.webgazer.setGazeListener((data: { y: number } | null) => {
      if (!data) return;
      const relativeY = data.y / window.innerHeight - 0.5;
      window.scrollBy({ top: relativeY * 5, behavior: "smooth" });
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1100] flex flex-col items-end gap-2">
      <Button
        variant={enabled ? "default" : "outline"}
        className="flex items-center gap-2"
        onClick={() => setEnabled((prev) => !prev)}
        disabled={loading || !isSupported}
      >
        {enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        {loading
          ? "Booting WebGazer..."
          : !isSupported
            ? "Eye scroll unsupported"
            : enabled
              ? "Eye scroll on"
              : "Eye scroll off"}
      </Button>
      <p className="text-xs text-muted-foreground text-right max-w-[220px]">
        {isSupported
          ? "Experimental, opt-in feature. Uses your webcam locally and never uploads footage."
          : "Requires WebGL. Try a desktop browser if you want to test the experimental eye scroll."}
      </p>
    </div>
  );
}
