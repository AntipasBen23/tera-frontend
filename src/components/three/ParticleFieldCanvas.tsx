"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ParticleField from "./ParticleField";

export default function ParticleFieldCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: false, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1]}
    >
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>
    </Canvas>
  );
}
