import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const scriptId = "model-viewer-script";

export default function ARCardPage() {
  useEffect(() => {
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    document.head.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 space-y-6">
      <Helmet>
        <title>AR Business Card | Delowar Hossain</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center">Delowar’s AR Business Card</h1>
      <p className="text-muted-foreground text-center max-w-2xl">
        Tap the “Enter AR” button below (mobile with ARCore/ARKit) to project the card into your
        space. On desktop you can orbit the model.
      </p>
      <model-viewer
        src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
        alt="Delowar AR avatar"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        exposure="1.1"
        style={{
          width: "100%",
          maxWidth: "520px",
          height: "520px",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
    </div>
  );
}
