import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Status = {
  version: string;
  cacheKeys: string[];
  precached: string[];
};

export default function PrecacheStrategyDemo() {
  const [status, setStatus] = useState<Status | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready.then((registration) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        setStatus(event.data as Status);
      };
      registration.active?.postMessage({ type: "GET_SW_STATUS" }, [channel.port2]);
    });
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Pre-caching strategy
            </p>
            <h3 className="text-3xl font-semibold text-foreground">
              How service workers keep the experience instant
            </h3>
          </div>
          <Button variant="outline" onClick={() => setOpen((prev) => !prev)}>
            {open ? "Hide precache list" : "Show precache list"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Every deploy ships a new SW version. Toggling below reveals exactly which assets are
          precached versus fetched network-first, so recruiters see the caching strategy.
        </p>
        {open && (
          <div className="rounded-3xl border border-border bg-card/70 p-6 text-sm">
            {!status ? (
              <p className="text-muted-foreground">Querying service worker…</p>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  SW {status.version} caches {status.precached.length} assets
                </p>
                <ul className="mt-3 space-y-1 max-h-48 overflow-auto text-muted-foreground">
                  {status.precached.map((asset) => (
                    <li key={asset}>{asset}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
