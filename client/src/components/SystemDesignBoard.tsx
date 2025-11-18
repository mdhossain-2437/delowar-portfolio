import { useState } from "react";
import { motion } from "framer-motion";

const nodes = [
  { id: "client", label: "Client (React/Vite)", x: 80, y: 50 },
  { id: "server", label: "Express API + Vite SSR", x: 320, y: 50 },
  { id: "db", label: "Neon Postgres + Drizzle", x: 560, y: 120 },
  { id: "cms", label: "Notion / Obsidian Garden", x: 320, y: 160 },
  { id: "auth", label: "GitHub OAuth", x: 80, y: 170 },
  { id: "p2p", label: "WebRTC / WebTorrent", x: 560, y: 30 },
];

const edges: [string, string][] = [
  ["client", "server"],
  ["server", "db"],
  ["server", "cms"],
  ["client", "p2p"],
  ["client", "auth"],
  ["auth", "server"],
];

export default function SystemDesignBoard() {
  const [zoom, setZoom] = useState(1);

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
              System design
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Interactive architecture board
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Hover or zoom to inspect how frontend, backend, automation, and P2P layers handshake.
              Everything you see maps directly to code running in this repo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Zoom</span>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={zoom}
              onChange={(event) => setZoom(parseFloat(event.target.value))}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-slate-900/80 border border-white/10 p-4 overflow-auto"
        >
          <svg
            viewBox="0 0 640 240"
            style={{ width: "100%", height: "100%", transform: `scale(${zoom})` }}
          >
            <defs>
              <linearGradient id="node" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>

            {edges.map(([source, target]) => {
              const start = nodes.find((n) => n.id === source)!;
              const end = nodes.find((n) => n.id === target)!;
              return (
                <line
                  key={`${source}-${target}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="url(#node)"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  opacity={0.6}
                />
              );
            })}

            {nodes.map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x - 70}
                  y={node.y - 20}
                  width={140}
                  height={40}
                  rx={12}
                  fill="rgba(15,23,42,0.85)"
                  stroke="url(#node)"
                  strokeWidth={1.5}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize={12}
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
