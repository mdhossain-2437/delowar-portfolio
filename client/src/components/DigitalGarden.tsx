import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

type GardenEntry = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  url?: string;
  lastSynced: string;
};

const fallbackGarden: GardenEntry[] = [
  {
    id: "garden-fallback-01",
    title: "Digital Garden bootstrap",
    summary:
      "Notion/Obsidian credentials are not wired locally, so this entry proves the garden still renders. In production, /api/garden returns live notes.",
    tags: ["automation", "learning"],
    url: "https://www.notion.so/",
    lastSynced: new Date().toISOString(),
  },
];

async function fetchGarden(): Promise<GardenEntry[]> {
  const res = await fetch("/api/garden");
  const raw = await res.text();
  if (!res.ok) {
    throw new Error(raw || "Failed to load garden entries");
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    if (import.meta.env.DEV) {
      console.info("Digital garden API missing JSON payload in dev; using fallback entries.");
    }
    return fallbackGarden;
  }

  try {
    return JSON.parse(raw) as GardenEntry[];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.info("Digital garden JSON parse error; using fallback entries.", error);
    }
    return fallbackGarden;
  }
}

export default function DigitalGarden() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["digital-garden"],
    queryFn: fetchGarden,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            Digital Garden
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Notes streaming live from Notion/Obsidian
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Automation pushes my learning notes straight into this public garden. Peek into building
            blocks before they become polished blog posts.
          </p>
        </motion.div>

        {isLoading && <p className="text-center text-muted-foreground">Syncing notes…</p>}
        {error && (
          <p className="text-center text-red-400">
            {(error as Error).message || "Unable to fetch garden entries."}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {data?.map((entry, index) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  live note
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.lastSynced).toLocaleDateString()}
                </p>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{entry.title}</h3>
              <p className="text-muted-foreground mb-3">{entry.summary || "No summary yet."}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-primary/15 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {entry.url && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary text-sm underline"
                >
                  Open original note
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
