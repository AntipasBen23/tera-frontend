"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import MoleculeCarousel from "./MoleculeCarousel";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  activeIndex: number;
  mouseX: number;
  mouseY: number;
}

export default function MoleculeCarouselCanvas({ activeIndex, mouseX, mouseY }: Props) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div
        className="w-full h-full rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123,97,255,0.08) 0%, transparent 80%)",
          border: "1px solid var(--border)",
        }}
      />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 3, 4]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={1.0} />

      <Suspense fallback={null}>
        <MoleculeCarousel
          activeIndex={activeIndex}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </Suspense>
    </Canvas>
  );
}
