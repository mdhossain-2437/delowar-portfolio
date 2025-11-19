import { useEffect, useRef, useState } from "react";

export default function MicroFrontendShowcase() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState("Loading Vue micro-frontend…");

  useEffect(() => {
    let destroyed = false;
    const mountVue = async () => {
      try {
        if (!window.Vue) {
          await loadScript("https://unpkg.com/vue@3/dist/vue.global.prod.js");
        }
        if (destroyed || !containerRef.current) return;
        const { createApp } = window.Vue!;
        const app = createApp({
          template: `<div class="p-4 text-sm text-white">
              <p class="uppercase tracking-[0.4em] text-xs text-white/70 mb-2">Vue micro-app</p>
              <p>Projects component rendered with Vue 3 inside a React page.</p>
              <ul class="list-disc pl-4 mt-3 space-y-1">
                <li>Decoupled deploys</li>
                <li>Framework diversity</li>
              </ul>
            </div>`,
        });
        app.mount(containerRef.current);
        setStatus("Vue micro-frontend mounted");
        return () => {
          destroyed = true;
          app.unmount();
        };
      } catch (error) {
        setStatus("Failed to load Vue micro-frontend");
        console.error(error);
      }
    };
    mountVue();
    return () => {
      destroyed = true;
    };
  }, []);

  return (
    <section className="py-20 bg-card/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Micro-frontend showcase
        </p>
        <h3 className="text-3xl font-semibold text-foreground">
          Vue project tile living inside a React shell
        </h3>
        <p className="text-sm text-muted-foreground">
          This proves I can blend frameworks—React powers the shell while Vue renders the projects
          widget dynamically.
        </p>
        <div className="rounded-3xl border border-border bg-[#1e1b4b] flex">
          <div
            ref={containerRef}
            className="flex-1 rounded-3xl"
            style={{ minHeight: "180px" }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{status}</p>
      </div>
    </section>
  );
}

declare global {
  interface Window {
    Vue?: { createApp: (options: any) => { mount(el: Element): void; unmount(): void } };
  }
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load script")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load script"));
    document.body.appendChild(script);
  });
}
