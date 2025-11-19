import { motion } from "framer-motion";

const techTiles = [
  { label: "React", color: "#38bdf8" },
  { label: "Three.js", color: "#f97316" },
  { label: "Drizzle", color: "#a855f7" },
  { label: "Vite", color: "#6366f1" },
  { label: "Firebase", color: "#fbbf24" },
];

export default function PhysicsDragGallery() {
  return (
    <section className="py-20 bg-card/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Physics drag lab
        </p>
        <h3 className="text-3xl font-semibold text-foreground">
          Toss my stack around — inertia enabled via Framer Motion
        </h3>
        <div className="flex flex-wrap gap-4">
          {techTiles.map((tile) => (
            <motion.div
              key={tile.label}
              drag
              dragElastic={0.6}
              dragTransition={{ bounceStiffness: 200, bounceDamping: 10 }}
              className="w-40 h-24 rounded-2xl shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white text-lg font-semibold"
              style={{ background: tile.color }}
            >
              {tile.label}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
