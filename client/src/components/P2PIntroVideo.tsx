import { motion } from "framer-motion";

export default function P2PIntroVideo() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_420px] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground mb-4">
            P2P Intro
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Peer-to-peer streaming concept
          </h2>
          <p className="text-muted-foreground">
            In production, the intro reel boots via WebTorrent/WebRTC and prefers peers over CDN.
            This demo uses the same video file locally while the decentralized handshake remains
            documented in the repo’s `P2PIntroVideo` component for environments where WebTorrent is
            whitelisted.
          </p>
          <p className="text-xs text-emerald-400 mt-4">
            Local preview mode: serving fallback MP4 (no WebTorrent bundle).
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur"
        >
          <video
            controls
            playsInline
            className="w-full h-full aspect-video bg-black"
            poster="https://i.imgur.com/e4HunJf.jpg"
            src="https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v"
          />
        </motion.div>
      </div>
    </section>
  );
}
