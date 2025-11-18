import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "@/hooks/useTranslation";

const hardware = [
  { name: "MacBook Pro 14” (M3)", description: "Main dev machine, silent and battery friendly." },
  { name: "LG UltraFine 5K", description: "Tuned color profile for design reviews and Figma." },
  { name: "Keychron Q2 Pro", description: "Gateron brown switches with custom Bangla legends." },
  { name: "Logitech MX Master 3S", description: "Fast context switching and flow between devices." },
  { name: "Herman Miller Mirra 2", description: "Keeps posture sane during multi-hour pairing sessions." },
];

const software = [
  { name: "VS Code + Cursor", description: "Theme: Poimandres • Font: JetBrains Mono & Fira Code." },
  { name: "Warp Terminal", description: "AI commands + zsh, synced dotfiles via chezmoi." },
  { name: "Arc Browser", description: "Spaces for client work, devtools profiles, notion/web." },
  { name: "Raycast", description: "Clipboard history, timers, and script commands for deployments." },
  { name: "CleanShot X", description: "Polished screen recordings for async updates." },
];

export default function UsesPage() {
  const t = useTranslation();

  const renderList = (items: Array<{ name: string; description: string }>) => (
    <div className="space-y-4">
      {items.map((item) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <p className="text-base font-semibold text-white">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="py-24 bg-slate-950 min-h-screen text-white">
      <Helmet>
        <title>/uses | Delowar Hossain</title>
        <meta
          name="description"
          content="Hardware and software powering Delowar Hossain's daily build routine."
        />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">/uses</p>
          <h1 className="text-4xl font-bold">{t("uses.title")}</h1>
          <p className="text-muted-foreground">{t("uses.subtitle")}</p>
        </header>
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">{t("uses.hardware")}</h2>
          {renderList(hardware)}
        </section>
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">{t("uses.software")}</h2>
          {renderList(software)}
        </section>
      </div>
    </div>
  );
}
