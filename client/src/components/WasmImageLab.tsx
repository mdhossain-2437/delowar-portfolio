import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import encode, { init as initMozjpeg } from "@jsquash/jpeg/encode";
import mozjpegWasmUrl from "@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm?url";

type Output = { url: string; size: number } | null;

let wasmModulePromise: Promise<WebAssembly.Module> | null = null;
let initPromise: Promise<void> | null = null;

async function ensureEncoderInitialized(
  initFn: (module?: WebAssembly.Module) => Promise<void>,
) {
  if (!wasmModulePromise) {
    wasmModulePromise = fetch(mozjpegWasmUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load mozjpeg wasm");
        return res.arrayBuffer();
      })
      .then((buffer) => WebAssembly.compile(buffer));
  }
  if (!initPromise) {
    initPromise = wasmModulePromise.then((module) => initFn(module));
  }
  await initPromise;
}

async function imageDataFromFile(file: File) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context missing");
  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

export default function WasmImageLab() {
  const [output, setOutput] = useState<Output>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setError(null);
    setOutput(null);

    try {
      const imageData = await imageDataFromFile(file);
      await ensureEncoderInitialized(initMozjpeg);
      const binary = await encode(imageData, { quality: 70 });
      const blob = new Blob([binary], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      setOutput({ url, size: blob.size });
    } catch (err: any) {
      setError(err?.message ?? "Compression failed");
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            WebAssembly Lab
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Client-side image compression (Rust ➜ Wasm)
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Drop an image to see Wasm codecs shrink files instantly. Everything runs in your browser
            — no uploads, no waiting.
          </p>
        </motion.div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={isCompressing}
              className="bg-black/40 border-white/10 file:text-white"
            />
            <Button type="button" disabled className="opacity-60">
              Powered by WebAssembly
            </Button>
          </div>

          {isCompressing && (
            <p className="text-sm text-emerald-400">Compiling codecs… crunching pixels…</p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {output && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Output size: {(output.size / 1024).toFixed(1)} KB
              </p>
              <a
                href={output.url}
                download="compressed.jpg"
                className="text-primary underline text-sm"
              >
                Download compressed image
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
