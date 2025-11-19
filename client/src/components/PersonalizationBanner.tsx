import { useQuery } from "@tanstack/react-query";
import { Globe, Loader2 } from "lucide-react";

type PersonalizationResponse = {
  profile: {
    country: string;
    ip?: string;
    primaryLanguage: string;
    greeting: string;
    message: string;
    regions: string[];
  };
  servedAt: string;
};

export default function PersonalizationBanner() {
  const { data, isLoading, error } = useQuery<PersonalizationResponse>({
    queryKey: ["edge-profile"],
    queryFn: async () => {
      const res = await fetch("/api/personalization/profile");
      if (!res.ok) throw new Error("Failed to resolve edge profile");
      return res.json();
    },
    refetchInterval: 1000 * 60 * 10,
  });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-lg p-5 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
          ) : (
            <Globe className="h-4 w-4 text-accent" />
          )}
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Edge personalization
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error.message}</p>}

        {!error && !isLoading && data && (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-foreground">
                  {data.profile.greeting} ({data.profile.country})
                </h4>
                <p className="text-sm text-muted-foreground">{data.profile.message}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                Routed via {data.profile.regions.join(" + ")} · content language{" "}
                <strong>{data.profile.primaryLanguage}</strong>
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground">
              Served at {new Date(data.servedAt).toLocaleTimeString()} · IP hint{" "}
              {data.profile.ip ?? "edge-simulated"}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
