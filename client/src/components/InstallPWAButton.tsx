import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function InstallPWAButton() {
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (event: any) => {
      event.preventDefault();
      setPromptEvent(event);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || !promptEvent) {
    return null;
  }

  const install = async () => {
    promptEvent.prompt();
    await promptEvent.userChoice;
    setVisible(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={install}
      type="button"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
}
