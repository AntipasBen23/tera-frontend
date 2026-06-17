"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import EnzymeModel from "./EnzymeModel";

interface Props {
  mouseX: number;
  mouseY: number;
}

export default function EnzymeCanvas({ mouseX, mouseY }: Props) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number>(0);
  const startTime = useRef<number | null>(null);
  const DURATION = 2000; // assembly duration ms

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setProgress(1);
      return;
    }

    const tick = (now: number) => {
      if (!startTime.current) startTime.current = now;
      const elapsed = now - startTime.current;
      const t = Math.min(elapsed / DURATION, 1);
      // Ease-out quart for snappy snap-in
      const eased = 1 - Math.pow(1 - t, 4);
      setProgress(eased);
      if (t < 1) rafId.current = requestAnimationFrame(tick);
    };

    // Small delay so preloader has faded first
    const timeout = setTimeout(() => {
      rafId.current = requestAnimationFrame(tick);
    }, 200);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00DCB4" />
      <pointLight position={[-4, -3, 3]} intensity={0.6} color="#7B61FF" />
      <pointLight position={[0, -5, 2]} intensity={0.4} color="#ffffff" />

      <Suspense fallback={null}>
        <EnzymeModel
          assemblyProgress={progress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </Suspense>
    </Canvas>
  );
}
