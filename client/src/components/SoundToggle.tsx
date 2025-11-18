import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUISounds } from "@/hooks/useUISounds";

export default function SoundToggle() {
  const { muted, toggleMute } = useUISounds();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleMute}
      className="flex items-center gap-2 text-xs"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {muted ? "Unmute" : "Sound on"}
    </Button>
  );
}
