import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceNavigation } from "@/hooks/useVoiceNavigation";

export default function VoiceCommandToggle() {
  const { isAvailable, isListening, transcript, toggleListening } = useVoiceNavigation();

  if (!isAvailable) return null;

  return (
    <div className="flex flex-col items-end gap-2 text-right">
      <Button
        variant={isListening ? "default" : "outline"}
        className="flex items-center gap-2"
        onClick={toggleListening}
        type="button"
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        {isListening ? "Stop Voice Nav" : "Voice Navigate"}
      </Button>
      {transcript && (
        <p className="text-xs text-muted-foreground max-w-xs">
          Heard: <span className="text-foreground">{transcript}</span>
        </p>
      )}
    </div>
  );
}
