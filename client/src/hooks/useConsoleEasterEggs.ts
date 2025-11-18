import { useEffect } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

const shouldEnableInDev =
  typeof import.meta.env.VITE_ENABLE_DEV_KONAMI !== "undefined"
    ? import.meta.env.VITE_ENABLE_DEV_KONAMI === "true"
    : false;

const shouldEnable =
  import.meta.env.PROD ||
  import.meta.env.VITE_ENABLE_KONAMI === "true" ||
  shouldEnableInDev;

export function useConsoleEasterEggs() {
  useEffect(() => {
    if (typeof window === "undefined" || !shouldEnable) {
      return;
    }

    const asciiArt = `
██████╗ ███████╗██╗      ██████╗ ██╗    ██╗ █████╗ ██████╗ 
██╔══██╗██╔════╝██║     ██╔═══██╗██║    ██║██╔══██╗██╔══██╗
██████╔╝█████╗  ██║     ██║   ██║██║ █╗ ██║███████║██║  ██║
██╔═══╝ ██╔══╝  ██║     ██║   ██║██║███╗██║██╔══██║██║  ██║
██║     ███████╗███████╗╚██████╔╝╚███╔███╔╝██║  ██║██████╔╝
╚═╝     ╚══════╝╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝╚═════╝ `;

    if (import.meta.env.PROD || shouldEnableInDev) {
      console.log(`%c${asciiArt}`, "color:#a855f7;font-weight:bold;");
      console.log(
        "%cPsst! Try the Konami code for a secret neon theme.",
        "color:#38bdf8;font-size:12px;",
      );
    }

    const pressed: string[] = [];
    const handler = (event: KeyboardEvent) => {
      pressed.push(event.code);
      const isMatch = KONAMI_SEQUENCE.every((code, index) => code === pressed[index]);

      if (!isMatch) {
        pressed.length = 0;
        if (event.code === KONAMI_SEQUENCE[0]) {
          pressed.push(event.code);
        }
        return;
      }

      if (pressed.length === KONAMI_SEQUENCE.length) {
        document.body.classList.toggle("konami-theme");
        console.info("%cKonami mode toggled!", "color:#34d399;");
        pressed.length = 0;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
