import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";

const SECRET_MESSAGE =
  "Resume link: https://delowar.dev/resume.pdf :: Built with love & steganography.";

function encodeMessageOnCanvas(ctx: CanvasRenderingContext2D, text: string) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const messageBits = Array.from(text).flatMap((char) => {
    const binary = char.charCodeAt(0).toString(2).padStart(8, "0");
    return binary.split("").map(Number);
  });

  for (let i = 0; i < messageBits.length && i < data.length; i++) {
    data[i] = (data[i] & 0xfe) | messageBits[i]; // set least significant bit
  }
  ctx.putImageData(imageData, 0, 0);
}

export default function StegoResumeButton() {
  const [downloading, setDownloading] = useState(false);

  const generateImage = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(0.5, "#312e81");
      gradient.addColorStop(1, "#0ea5e9");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "bold 72px Inter, sans-serif";
      ctx.fillText("Hidden Blueprint", 60, 160);
      ctx.font = "24px Inter, sans-serif";
      ctx.fillText("Decode to read my CV secret.", 60, 220);

      encodeMessageOnCanvas(ctx, SECRET_MESSAGE);

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "delowar-stego-blueprint.png";
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="flex items-center gap-2"
      onClick={generateImage}
      disabled={downloading}
    >
      <DownloadCloud className="h-4 w-4" />
      {downloading ? "Encoding…" : "Download Secret Resume"}
    </Button>
  );
}
