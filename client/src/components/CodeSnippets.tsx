import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUISounds } from "@/hooks/useUISounds";

type Snippet = {
  title: string;
  description: string;
  code: string;
  tags: string[];
};

const snippets: Snippet[] = [
  {
    title: "useDebouncedValue hook",
    description: "Delay expensive calls while keeping React state in sync.",
    code: `export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`,
    tags: ["react", "hooks", "performance"],
  },
  {
    title: "Center with clamp",
    description: "Fluid container that never feels too wide or too cramped.",
    code: `.prose-wrapper {
  width: min(90vw, clamp(320px, 72ch, 1100px));
  margin-inline: auto;
  padding-inline: clamp(1rem, 3vw, 2rem);
}`,
    tags: ["css", "layout"],
  },
  {
    title: "Safe fetch wrapper",
    description: "Typed fetch helper with useful defaults.",
    code: `export async function safeFetch<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }

  return (await response.json()) as T;
}`,
    tags: ["typescript", "api"],
  },
];

export default function CodeSnippets() {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();
  const { playClick, playHover, playSuccess } = useUISounds();

  const handleCopy = async (code: string, title: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(title);
      playSuccess();
      toast({
        title: "Snippet copied",
        description: `${title} is ready to paste.`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast({
        title: "Unable to copy",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Code pantry</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Copy-friendly snippets I reach for daily
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Small helpers that turn up in audits, dashboards, and automation work. Copy, tweak, and
            keep shipping.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {snippets.map((snippet, index) => (
            <motion.article
              key={snippet.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="flex justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{snippet.title}</h3>
                  <p className="text-sm text-muted-foreground">{snippet.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(snippet.code, snippet.title)}
                  onMouseEnter={playHover}
                  onMouseDown={playClick}
                  className="rounded-full border border-white/10 p-2 text-muted-foreground hover:text-white transition-colors"
                  aria-label="Copy snippet"
                >
                  {copied === snippet.title ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {snippet.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <pre className="rounded-2xl bg-black/60 p-4 text-sm text-slate-100 overflow-x-auto border border-white/5">
                <code>{snippet.code}</code>
              </pre>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
