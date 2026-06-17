"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import DigitalTwinModel from "./DigitalTwinModel";

interface Props {
  twinProgress: number;
  mouseX: number;
  mouseY: number;
}

export default function DigitalTwinCanvas({ twinProgress, mouseX, mouseY }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 4]} intensity={1.8} color="#00DCB4" />
      <pointLight position={[-4, -2, 3]} intensity={0.6} color="#7B61FF" />
      <pointLight position={[0, -4, 2]} intensity={0.4} color="#ffffff" />

      <Suspense fallback={null}>
        <DigitalTwinModel
          twinProgress={twinProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </Suspense>
    </Canvas>
  );
}
