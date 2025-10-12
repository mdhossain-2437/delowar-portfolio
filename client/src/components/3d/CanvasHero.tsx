import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import HeroModel from "./HeroModel";

export default function CanvasHero() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <HeroModel />
      </Suspense>
    </Canvas>
  );
}
