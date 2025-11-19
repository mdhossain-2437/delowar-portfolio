import { useEffect, useState } from "react";
import { Shield, Fingerprint } from "lucide-react";

type FingerprintData = {
  userAgent: string;
  languages: string[];
  timezone: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  colorDepth?: number;
  resolution: string;
  platform?: string;
  gpu?: string;
};

export default function BrowserFingerprintDemo() {
  const [fingerprint, setFingerprint] = useState<FingerprintData | null>(null);

  useEffect(() => {
    const data: FingerprintData = {
      userAgent: navigator.userAgent,
      languages: Array.from(navigator.languages ?? [navigator.language]),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "unknown",
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      colorDepth: window.screen.colorDepth,
      resolution: `${window.screen.width}x${window.screen.height}`,
      platform: navigator.platform,
    };

    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (gl && "getExtension" in gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        data.gpu = gl.getParameter((debugInfo as any).UNMASKED_RENDERER_WEBGL) as string;
      }
    }
    setFingerprint(data);
  }, []);

  const riskScore =
    fingerprint && fingerprint.gpu
      ? 85
      : fingerprint
        ? 60
        : 0;

  return (
    <section className="py-24 bg-card/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <Fingerprint className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Browser fingerprinting
            </p>
            <h3 className="text-2xl font-semibold text-foreground">
              You are more unique than you think
            </h3>
          </div>
        </div>

        {!fingerprint && (
          <p className="text-sm text-muted-foreground">Collecting entropy…</p>
        )}

        {fingerprint && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 rounded-3xl border border-border bg-background/70 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Shield className="h-4 w-4 text-amber-400" />
                Potential tracking vectors
              </div>
              <p className="text-xs text-muted-foreground">
                Combining these fields makes your browser {riskScore}% unique.
              </p>
              <ul className="text-sm text-foreground space-y-2 mt-3">
                <li>
                  <strong>User agent:</strong> {fingerprint.userAgent}
                </li>
                <li>
                  <strong>Languages:</strong> {fingerprint.languages.join(", ")}
                </li>
                <li>
                  <strong>Timezone:</strong> {fingerprint.timezone}
                </li>
                <li>
                  <strong>Screen:</strong> {fingerprint.resolution} @ {fingerprint.colorDepth} bit
                </li>
                {fingerprint.gpu && (
                  <li>
                    <strong>GPU:</strong> {fingerprint.gpu}
                  </li>
                )}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-background/70 p-6 text-sm text-muted-foreground space-y-3">
              <p>
                Fingerprints power fraud detection but also threaten privacy. Showing
                them educates recruiters and clients about my security mindset.
              </p>
              <p>
                Want to mitigate tracking? Use privacy-respecting browsers, block third-party
                scripts, and vary your user agent/IP.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
