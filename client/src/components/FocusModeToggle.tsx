import { Button } from "@/components/ui/button";
import { useFocusMode } from "@/contexts/FocusContext";
import { Sparkles, Coffee } from "lucide-react";

export default function FocusModeToggle() {
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-xs"
      onClick={toggleFocusMode}
      title="Toggle Zen mode"
    >
      {isFocusMode ? <Coffee className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      {isFocusMode ? "Exit Zen" : "Zen Mode"}
    </Button>
  );
}
