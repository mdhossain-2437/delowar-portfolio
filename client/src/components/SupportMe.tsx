import { useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUISounds } from "@/hooks/useUISounds";

const tiers = [
  {
    label: "Coffee",
    description: "৳200 — sponsor a caffeine boost during late-night deployments.",
    amount: "৳200",
  },
  {
    label: "Lunch",
    description: "৳600 — fuels longer deep work sessions + library research days.",
    amount: "৳600",
  },
];

export default function SupportMe() {
  const [selectedTier, setSelectedTier] = useState(tiers[0]);
  const { playClick, playHover } = useUISounds();

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Support</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Fuel the builds</h2>
            <p className="text-muted-foreground">
              Prefer sending thanks in bKash or crypto? Pick a tier and the modal will reveal QR
              codes plus wallet addresses.
            </p>
            <div className="flex flex-wrap gap-3">
              {tiers.map((tier) => (
                <button
                  key={tier.label}
                  type="button"
                  onClick={() => {
                    playClick();
                    setSelectedTier(tier);
                  }}
                  onMouseEnter={playHover}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selectedTier.label === tier.label
                      ? "border-primary/80 bg-primary/10 text-white"
                      : "border-white/10 text-muted-foreground hover:text-white"
                  }`}
                >
                  {tier.label} • {tier.amount}
                </button>
              ))}
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 via-primary to-amber-400 text-white"
                onMouseEnter={playHover}
                onClick={playClick}
              >
                <Coffee className="mr-2 h-5 w-5" />
                Treat me to {selectedTier.label}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  {selectedTier.label} tier — {selectedTier.amount}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-2xl border border-dashed border-white/20 p-4">
                  <p className="text-sm text-muted-foreground mb-2">bKash QR</p>
                  <div className="grid grid-cols-4 gap-1 bg-white p-4 rounded-xl">
                    {[...Array(16)].map((_, index) => (
                      <div
                        key={index}
                        className={`h-4 w-4 ${index % 2 === 0 ? "bg-slate-900" : "bg-transparent"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Account: +8801315123134</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">USDT (TRC20)</p>
                  <code className="block rounded-xl bg-black/30 p-3 text-xs text-white break-all">
                    TNpqEexamplecryptoaddr9934
                  </code>
                  <p className="text-sm text-muted-foreground">BTC (Lightning)</p>
                  <code className="block rounded-xl bg-black/30 p-3 text-xs text-white break-all">
                    bc1qexamplelightningaddr
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  I’ll reply with a personalized thank-you and what your support unlocked that week.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
