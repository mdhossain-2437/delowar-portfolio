import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useUISounds } from "@/hooks/useUISounds";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const t = useTranslation();
  const { playClick, playHover } = useUISounds();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      toast({
        title: "Subscribed!",
        description: "Welcome to the lab notes.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: (error as Error).message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-12 text-center space-y-4"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            {t("newsletter.title")}
          </p>
          <h2 className="text-3xl font-bold text-white">{t("newsletter.subtitle")}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mt-6">
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="bg-black/40 border-white/10 text-white"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-primary via-accent to-primary"
              disabled={isSubmitting}
              onMouseEnter={playHover}
              onClick={playClick}
            >
              {isSubmitting ? "Sending..." : t("newsletter.cta")}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
