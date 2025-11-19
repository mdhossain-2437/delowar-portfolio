import { useState } from "react";
import { ShieldQuestion, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type SecurityResponse = {
  profile: {
    mode: string;
    csp: {
      directives: Record<string, string[]>;
    };
    hstsEnabled: boolean;
  };
  timestamp: string;
};

export default function SecurityHeadersBadge() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, error } = useQuery<SecurityResponse>({
    queryKey: ["security-headers"],
    queryFn: async () => {
      const res = await fetch("/api/health/security");
      if (!res.ok) {
        throw new Error("Failed to fetch security audit");
      }
      return res.json();
    },
    refetchInterval: 1000 * 60 * 5,
  });

  const badgeLabel = isLoading
    ? "Auditing…"
    : error
      ? "Security headers unavailable"
      : `Security headers: ${
          data?.profile.mode === "production" ? "strict" : "dev-safe"
        }`;

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-border bg-background hover:bg-muted transition-colors"
      >
        {error ? (
          <ShieldQuestion className="h-4 w-4 text-amber-500" />
        ) : (
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        )}
        <span className="text-muted-foreground">{badgeLabel}</span>
      </button>

      {open && (
        <div className="absolute left-0 bottom-12 w-80 p-4 bg-popover border border-border rounded-2xl shadow-2xl text-left space-y-3 z-30">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">Header policy</span>
            <span className="text-muted-foreground">
              {new Date(data?.timestamp ?? Date.now()).toLocaleTimeString()}
            </span>
          </div>
          {error && <p className="text-sm text-red-400">{error.message}</p>}
          {!error && !isLoading && data && (
            <>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>CSP:</strong>{" "}
                  {Object.keys(data.profile.csp.directives)
                    .slice(0, 3)
                    .join(", ")}
                  …
                </p>
                <p>
                  <strong>HSTS:</strong>{" "}
                  {data.profile.hstsEnabled ? "enabled" : "inactive"}
                </p>
                <p>
                  <strong>Mode:</strong> {data.profile.mode}
                </p>
              </div>
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer text-foreground">
                  View directives
                </summary>
                <ul className="mt-2 max-h-32 overflow-auto space-y-1 pr-1">
                  {Object.entries(data.profile.csp.directives).map(
                    ([directive, values]) => (
                      <li key={directive}>
                        <span className="font-semibold">{directive}:</span>{" "}
                        {values.join(" ")}
                      </li>
                    ),
                  )}
                </ul>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}
