import { useState } from "react";
import html2canvas from "html2canvas";
import { Bug, Camera, Loader2, Send } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUISounds } from "@/hooks/useUISounds";

export default function BugReportWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [steps, setSteps] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { playClick, playHover, playSuccess } = useUISounds();

  const captureScreenshot = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        backgroundColor: "#020617",
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png", 0.7);
      setScreenshot(dataUrl);
      toast({ title: "Screenshot captured" });
    } catch (error) {
      toast({
        title: "Failed to capture screen",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const submitBug = async () => {
    if (!message.trim()) {
      toast({ title: "Add details", description: "Write what went wrong so I can help faster." });
      return;
    }
    setIsSending(true);
    try {
      const response = await fetch("/api/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, steps, screenshot }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      setMessage("");
      setSteps("");
      setScreenshot(null);
      setOpen(false);
      playSuccess();
      toast({
        title: "Bug report sent",
        description: "I’ll follow up with a fix or workaround shortly.",
      });
    } catch (error) {
      toast({
        title: "Unable to send report",
        description: (error as Error).message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="fixed bottom-6 left-6 z-[1100] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-lg backdrop-blur transition hover:bg-white/20"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          <Bug className="h-5 w-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="space-y-2">
            <DrawerTitle className="text-left text-2xl font-semibold">
              Found a bug? Ship it my way.
            </DrawerTitle>
            <p className="text-left text-sm text-muted-foreground">
              Capture the issue and it’ll ping my QA Slack channel instantly.
            </p>
          </DrawerHeader>
          <div className="space-y-4 px-6 pb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">What broke?</label>
              <Textarea
                value={message}
                rows={3}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Buttons not responding, layout off on mobile..."
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Steps to reproduce (optional)</label>
              <Input
                value={steps}
                onChange={(event) => setSteps(event.target.value)}
                placeholder="e.g. Open Hero › tap Install button › error toast"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Screenshot (optional)</label>
              <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-white/20 p-4 text-sm text-muted-foreground">
                {screenshot ? (
                  <img
                    src={screenshot}
                    alt="Captured bug screenshot"
                    className="rounded-xl border border-white/10"
                  />
                ) : (
                  <p>No screenshot yet. Capture the current viewport for extra context.</p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={captureScreenshot}
                  disabled={isCapturing}
                  className="justify-center"
                >
                  {isCapturing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Capturing...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" /> Capture screen
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-primary to-accent"
              onClick={submitBug}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send report
                </>
              )}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
