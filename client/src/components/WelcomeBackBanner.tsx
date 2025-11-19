import { useEffect, useState } from "react";

const NAME_KEY = "welcome-name";
const LAST_VISIT_KEY = "last-visit";

export default function WelcomeBackBanner() {
  const [name, setName] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [lastVisit, setLastVisit] = useState<string | null>(null);

  useEffect(() => {
    const storedName = window.localStorage.getItem(NAME_KEY);
    const storedVisit = window.localStorage.getItem(LAST_VISIT_KEY);
    if (storedName) {
      setName(storedName);
    }
    if (storedVisit) {
      setLastVisit(new Date(Number(storedVisit)).toLocaleString());
    }
    window.localStorage.setItem(LAST_VISIT_KEY, String(Date.now()));
  }, []);

  const save = () => {
    if (!input.trim()) return;
    window.localStorage.setItem(NAME_KEY, input.trim());
    setName(input.trim());
  };

  if (!name) {
    return (
      <div className="rounded-3xl border border-border bg-card/80 px-4 py-3 flex flex-col gap-2 text-sm text-muted-foreground">
        <p>Tell me your name so I can welcome you back next time.</p>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-2xl border border-border bg-transparent px-3 py-2"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Your name"
          />
          <button
            type="button"
            onClick={save}
            className="px-4 py-2 rounded-2xl bg-primary text-white text-xs"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
      <div>
        Welcome back, <strong>{name}</strong>! Last time you visited{" "}
        {lastVisit ?? "just a moment ago"}.
      </div>
      <button
        type="button"
        className="text-xs uppercase tracking-[0.3em] text-primary mt-2 sm:mt-0"
        onClick={() => {
          window.localStorage.removeItem(NAME_KEY);
          setName(null);
        }}
      >
        Reset
      </button>
    </div>
  );
}
