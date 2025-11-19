import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

const assets = [
  { name: "Bio PDF", link: "/media/bio.pdf" },
  { name: "Logo SVG", link: "/media/logo.svg" },
  { name: "Profile photo", link: "/media/profile.jpg" },
];

export default function MediaKitPage() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-16">
      <Helmet>
        <title>Media Kit | Delowar Hossain</title>
        <meta
          name="description"
          content="Download bios, logos, and photography for interviews or speaking engagements."
        />
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Media kit</p>
          <h1 className="text-4xl font-bold">Resources for press & partners</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Everything you need to introduce me on stage or feature the work.
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card/70 p-6 space-y-4">
          {assets.map((asset) => (
            <div key={asset.name} className="flex items-center justify-between text-sm">
              <span>{asset.name}</span>
              <Button asChild variant="outline" size="sm">
                <a href={asset.link} download>
                  Download
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
