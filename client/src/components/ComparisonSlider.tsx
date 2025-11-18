import { useState } from "react";
import { motion } from "framer-motion";

const beforeImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";
const afterImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

export default function ComparisonSlider() {
  const [value, setValue] = useState(50);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Before vs After</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Design impact slider</h2>
          <p className="text-muted-foreground">
            Drag to compare legacy UI with the redesigned experience.
          </p>
        </motion.div>
        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url(${beforeImage})`, backgroundSize: "cover" }}
            aria-hidden
          />
          <div
            className="absolute inset-0 border-r border-white/50"
            style={{
              width: `${value}%`,
              backgroundImage: `url(${afterImage})`,
              backgroundSize: "cover",
            }}
            aria-hidden
          />
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${value}%` }}
            aria-hidden
          >
            <div className="h-24 w-24 -ml-12 rounded-full border-2 border-white/60 bg-white/10 backdrop-blur flex items-center justify-center text-white text-sm font-semibold">
              Drag
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            aria-label="Adjust comparison slider"
          />
        </div>
      </div>
    </section>
  );
}
