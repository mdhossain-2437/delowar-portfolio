import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SoundProvider } from "./contexts/SoundContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { startPerformanceMonitoring } from "./lib/perfVitals";
import { AchievementProvider } from "./contexts/AchievementContext";

if (typeof window !== "undefined") {
  (window as any).React = React;
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <ThemeProvider>
    <AchievementProvider>
      <SoundProvider>
        <LocaleProvider>
          <App />
        </LocaleProvider>
      </SoundProvider>
    </AchievementProvider>
  </ThemeProvider>
);

if (import.meta.env.PROD) {
  startPerformanceMonitoring({ idleTimeout: 1200 });
}

if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                newWorker.postMessage({ type: "SKIP_WAITING" });
              }
            });
          }
        });
      });
    });
  } else {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      })
      .catch(() => {
        // Failed to unregister dev service workers
      });
  }
}
