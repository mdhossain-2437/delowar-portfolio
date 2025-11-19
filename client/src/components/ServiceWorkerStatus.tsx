import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

type Status = {
  version: string;
  cacheKeys: string[];
  precached: string[];
};

export default function ServiceWorkerStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      setError("Service workers unsupported");
      return;
    }

    let cancelled = false;
    navigator.serviceWorker.ready
      .then((registration) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          if (cancelled) return;
          if (event.data?.version) {
            setStatus(event.data as Status);
            setError(null);
          } else if (event.data?.error) {
            setError(event.data.error);
          }
        };

        registration.active?.postMessage(
          { type: "GET_SW_STATUS" },
          [messageChannel.port2],
        );
      })
      .catch((err) => {
        setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!status && !error) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 text-xs text-muted-foreground bg-background/80 backdrop-blur-lg border border-border rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
      <ShieldCheck className="h-4 w-4 text-emerald-400" />
      {error ? (
        <span>SW audit unavailable: {error}</span>
      ) : (
        <span>
          SW {status?.version} · {status?.precached.length ?? 0} assets precached
        </span>
      )}
    </div>
  );
}
