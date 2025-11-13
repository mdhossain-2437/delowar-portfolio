import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import HeroModel from "./HeroModel";

export default function CanvasHero() {
  const [hasWebGL, setHasWebGL] = React.useState(true);

  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return null;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      onCreated={(state) => {
        state.gl.setClearColor(0x000000, 0);
      }}
    >
      <Suspense fallback={null}>
        <HeroModel />
      </Suspense>
    </Canvas>
  );
}
