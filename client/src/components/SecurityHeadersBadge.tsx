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
    frameguard?: string;
    permissionsPolicy?: string;
    referrerPolicy?: string;
  };
  timestamp: string;
  source: "api" | "fallback";
};

const REQUIRED_DIRECTIVES = ["defaultSrc", "scriptSrc", "styleSrc", "objectSrc"];

const fallbackSecurity = (): SecurityResponse => ({
  profile: {
    mode: "development",
    csp: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
      },
    },
    hstsEnabled: false,
    frameguard: "SAMEORIGIN",
    permissionsPolicy: "camera=(), microphone=(), geolocation=()",
    referrerPolicy: "strict-origin-when-cross-origin",
  },
  timestamp: new Date().toISOString(),
  source: "fallback",
});

function computeGrade(profile: SecurityResponse["profile"]) {
  const missing = REQUIRED_DIRECTIVES.filter(
    (directive) => !profile.csp.directives[directive],
  );
  if (!missing.length && profile.hstsEnabled) {
    return { label: "A+", tone: "text-emerald-400", note: "Strict CSP + HSTS detected." };
  }
  if (missing.length <= 2) {
    return {
      label: "B",
      tone: "text-amber-400",
      note: `Tight policy, missing ${missing.join(", ") || "some directives"}.`,
    };
  }
  return { label: "C", tone: "text-red-400", note: "Core CSP directives absent." };
}

export default function SecurityHeadersBadge() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery<SecurityResponse>({
    queryKey: ["security-headers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/health/security", {
          headers: { Accept: "application/json" },
        });
        const contentType = res.headers.get("content-type") ?? "";
        if (!res.ok || !contentType.includes("application/json")) {
          throw new Error("Unexpected response");
        }
        const payload = await res.json();
        return { ...payload, source: "api" as const };
      } catch (err) {
        console.warn("Security policy fallback", err);
        return fallbackSecurity();
      }
    },
    refetchInterval: 1000 * 60 * 5,
  });

  const grade = data ? computeGrade(data.profile) : undefined;
  const badgeLabel = isLoading
    ? "Auditing…"
    : `Security headers: ${
        data?.profile.mode === "production" ? "strict" : "dev-safe"
      }${data?.source === "fallback" ? " (fallback)" : ""}`;

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-border bg-background hover:bg-muted transition-colors"
      >
        {data?.source === "fallback" ? (
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
          {!isLoading && data && (
            <>
              <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white/5 px-3 py-2">
                <div className="text-xs text-muted-foreground">
                  {data.source === "fallback" ? (
                    <p className="text-amber-400">
                      Fallback profile (local). Live headers unavailable.
                    </p>
                  ) : (
                    <p>Fetched directly from Helmet middleware</p>
                  )}
                </div>
                {grade && (
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${grade.tone}`}>{grade.label}</p>
                    <p className="text-[11px] text-muted-foreground">{grade.note}</p>
                  </div>
                )}
              </div>
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
                {data.profile.frameguard && (
                  <p>
                    <strong>Frameguard:</strong> {data.profile.frameguard}
                  </p>
                )}
                {data.profile.permissionsPolicy && (
                  <p>
                    <strong>Permissions-Policy:</strong> {data.profile.permissionsPolicy}
                  </p>
                )}
                {data.profile.referrerPolicy && (
                  <p>
                    <strong>Referrer-Policy:</strong> {data.profile.referrerPolicy}
                  </p>
                )}
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
