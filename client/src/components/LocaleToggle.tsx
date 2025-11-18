import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";

export default function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  const nextLocale = locale === "en" ? "bn" : "en";

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      className="flex items-center gap-2 text-xs"
      onClick={() => setLocale(nextLocale)}
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4" />
      {locale === "en" ? "বাংলা" : "English"}
    </Button>
  );
}
