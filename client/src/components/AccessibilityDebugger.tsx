import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AccessibilityDebugger() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) {
      document.body.classList.add("accessibility-debugger");
    } else {
      document.body.classList.remove("accessibility-debugger");
    }
  }, [active]);

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button
        size="sm"
        variant={active ? "default" : "outline"}
        onClick={() => setActive((prev) => !prev)}
        className="text-xs"
      >
        {active ? "Disable a11y overlay" : "Enable a11y overlay"}
      </Button>
    </div>
  );
}
