import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const typeMultiplier: Record<string, number> = {
  ecommerce: 1.6,
  "saas-dashboard": 1.4,
  landing: 1.1,
};

const deadlineMultiplier: Record<string, number> = {
  urgent: 1.5,
  normal: 1,
};

export default function PricingCalculator() {
  const [projectType, setProjectType] = useState<keyof typeof typeMultiplier>("ecommerce");
  const [pages, setPages] = useState(5);
  const [deadline, setDeadline] = useState<keyof typeof deadlineMultiplier>("normal");

  const estimate = useMemo(() => {
    const base = 1500;
    const price =
      base * typeMultiplier[projectType] * deadlineMultiplier[deadline] + pages * 120;
    const timeline = Math.ceil((pages * 3 + 10) / (deadline === "urgent" ? 1.5 : 1));
    return {
      price: Math.round(price / 100) * 100,
      timeline,
    };
  }, [projectType, pages, deadline]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-card p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
                  Pricing sandbox
                </p>
                <h2 className="text-3xl font-bold text-white">Instant estimate</h2>
                <label className="block text-sm font-semibold text-muted-foreground mt-6">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(event) => setProjectType(event.target.value as any)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3"
                >
                  <option value="ecommerce">E-commerce / Marketplace</option>
                  <option value="saas-dashboard">SaaS Dashboard</option>
                  <option value="landing">Launch Landing Page</option>
                </select>

                <label className="block text-sm font-semibold text-muted-foreground mt-4">
                  Pages / Screens ({pages})
                </label>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={pages}
                  onChange={(event) => setPages(Number(event.target.value))}
                  className="w-full accent-primary"
                />

                <label className="block text-sm font-semibold text-muted-foreground mt-4">
                  Deadline
                </label>
                <div className="flex gap-3">
                  {(["normal", "urgent"] as const).map((speed) => (
                    <Button
                      key={speed}
                      type="button"
                      variant={deadline === speed ? "default" : "outline"}
                      onClick={() => setDeadline(speed)}
                    >
                      {speed === "urgent" ? "Urgent (<=2 wks)" : "Standard"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white/5 p-6 border border-white/10 space-y-4">
                <p className="text-sm text-muted-foreground uppercase tracking-[0.4em]">
                  Estimate
                </p>
                <h3 className="text-4xl font-bold text-white">
                  ${estimate.price.toLocaleString()}
                </h3>
                <p className="text-muted-foreground">
                  Includes discovery, design system extensions, production build + instrumentation.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Timeline</p>
                    <p className="text-white font-semibold">{estimate.timeline} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Plan</p>
                    <p className="text-white font-semibold">50/30/20 milestone</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent">
                  Book this scope
                </Button>
                <p className="text-xs text-muted-foreground">
                  Final pricing may adjust after a 30min scoping call.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
