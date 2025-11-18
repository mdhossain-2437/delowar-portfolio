import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

export default function ARPortal() {
  const [arUrl, setArUrl] = useState("https://delowar.dev/ar-card");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setArUrl(`${window.location.origin}/ar-card`);
    }
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_360px] gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">WebXR card</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Meet me in AR — scan the code to drop a virtual business card on your desk.
          </h2>
          <p className="text-muted-foreground">
            Powered by WebXR + model-viewer. Load it on your phone for an interactive avatar and tap
            “View in your space”.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => window.open(arUrl, "_blank")}>Open AR Card</Button>
            <Button variant="outline" onClick={() => window.open(`${arUrl}?intro=1`, "_blank")}>
              See instructions
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center"
        >
          <QRCodeSVG value={arUrl} size={220} fgColor="#f8fafc" bgColor="transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Scan me on your phone</p>
        </motion.div>
      </div>
    </section>
  );
}
