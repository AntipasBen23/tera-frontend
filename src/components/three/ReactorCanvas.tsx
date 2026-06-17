"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ReactorModel from "./ReactorModel";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  cutawayProgress: number;
  mouseX: number;
  mouseY: number;
}

export default function ReactorCanvas({ cutawayProgress, mouseX, mouseY }: Props) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div
        className="w-full h-full rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,220,180,0.08) 0%, transparent 80%)",
          border: "1px solid var(--border)",
        }}
      />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1.5} color="#00DCB4" />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color="#7B61FF" />
      <pointLight position={[0, -4, 2]} intensity={0.5} color="#ffffff" />

      <Suspense fallback={null}>
        <ReactorModel
          cutawayProgress={cutawayProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </Suspense>
    </Canvas>
  );
}
