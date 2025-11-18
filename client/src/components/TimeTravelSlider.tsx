import { useTimeTravel } from "@/contexts/TimeTravelContext";
import { motion } from "framer-motion";

const eras: Array<{ label: string; value: "2025" | "2024" | "2023" | "2022"; note: string }> = [
  { label: "2025", value: "2025", note: "Current creator OS" },
  { label: "2024", value: "2024", note: "AI copilots everywhere" },
  { label: "2023", value: "2023", note: "Design refresh" },
  { label: "2022", value: "2022", note: "First indie release" },
];

export default function TimeTravelSlider() {
  const { era, setEra } = useTimeTravel();

  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Time Travel</p>
          <h2 className="text-3xl font-bold text-white">Explore previous versions</h2>
          <p className="text-muted-foreground">
            Slide through time to see how the portfolio evolved. Era tinting + typography shifts are
            applied globally.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <input
            type="range"
            min={0}
            max={eras.length - 1}
            step={1}
            value={eras.findIndex((item) => item.value === era)}
            onChange={(event) => {
              const nextEra = eras[Number(event.target.value)]?.value ?? "2025";
              setEra(nextEra);
            }}
            className="w-full accent-primary"
          />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            {eras.map((item) => (
              <motion.div
                key={item.value}
                layout
                className={`rounded-2xl border px-3 py-3 ${
                  era === item.value
                    ? "border-primary/80 bg-primary/20 text-white"
                    : "border-white/10 text-muted-foreground"
                }`}
              >
                <div className="text-lg font-semibold">{item.label}</div>
                <p className="text-xs">{item.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
