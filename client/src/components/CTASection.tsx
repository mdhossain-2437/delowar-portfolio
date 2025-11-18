import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Download, MessageSquare, Calendar } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";
import { useUISounds } from "@/hooks/useUISounds";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useTranslation } from "@/hooks/useTranslation";

export default function CTASection() {
  const haptic = useHaptic();
  const { playClick, playHover } = useUISounds();
  const t = useTranslation();
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-card overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
            <div className="relative p-12 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              >
                {t("cta.title")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              >
                {t("cta.subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <MagneticButton
                  size="lg"
                  onClick={() => {
                    haptic();
                    playClick();
                    scrollToContact();
                  }}
                  onMouseEnter={playHover}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    {t("cta.action")}
                  </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="border-2 group"
                  onMouseEnter={playHover}
                  onClick={playClick}
                  >
                    <Download className="w-5 h-5 mr-2 group-hover:translate-y-1 transition-transform" />
                    {t("cta.download")}
                  </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="border-2"
                  onMouseEnter={playHover}
                  onClick={() => {
                    haptic();
                    playClick();
                  }}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {t("cta.schedule")}
                  </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 pt-8 border-t border-border"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                  <div>
                    <div className="text-3xl font-bold text-accent mb-2">10+</div>
                    <div className="text-sm text-muted-foreground">Projects Completed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent mb-2">98%</div>
                    <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Support Available</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
