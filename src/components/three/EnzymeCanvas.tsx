"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import EnzymeModel from "./EnzymeModel";
import { useIsMobile, useIsReducedMotion } from "@/hooks/useIsMobile";

const MODEL_PATHS: Record<number, string> = {
  0: "/models/enzyme.glb",
  1: "/models/platform.glb",
  2: "/models/reactor.glb",
  3: "/models/applications.glb",
  // 4 = team section — canvas hidden, photo shown instead
  5: "/models/investors.glb",
};

interface Props {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
  sectionIndex: number;
}

export default function EnzymeCanvas({ mouseX, mouseY, scrollProgress, sectionIndex }: Props) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number>(0);
  const startTime = useRef<number | null>(null);
  const DURATION = 2000;
  const isMobile = useIsMobile();
  const reducedMotion = useIsReducedMotion();

  // Progress within the current section: 0 → 1
  const sectionLocalProgress = Math.min((scrollProgress * 6) - sectionIndex, 1);

  // Start cross-fading to next model at 70% through each section
  const transitionBlend = Math.max(0, Math.min(1, (sectionLocalProgress - 0.7) / 0.3));

  // Current section grows slightly as you scroll through it
  const currentScaleFactor = 1 + sectionLocalProgress * 0.18;
  const currentOpacity = 1 - transitionBlend;

  // Next model enters small and scales up
  const nextScaleFactor = 0.65 + transitionBlend * 0.35;
  const nextOpacity = transitionBlend;

  const currentPath = MODEL_PATHS[sectionIndex] ?? "/models/enzyme.glb";
  const nextIndex = Math.min(sectionIndex + 1, 5);
  const nextPath = MODEL_PATHS[nextIndex] ?? currentPath;
  // Don't show a 3D model for the team section (index 4)
  const showNextModel = transitionBlend > 0.01 && nextIndex !== sectionIndex && nextIndex !== 4;

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }

    const tick = (now: number) => {
      if (!startTime.current) startTime.current = now;
      const elapsed = now - startTime.current;
      const t = Math.min(elapsed / DURATION, 1);
      setProgress(1 - Math.pow(1 - t, 4));
      if (t < 1) rafId.current = requestAnimationFrame(tick);
    };

    const timeout = setTimeout(() => {
      rafId.current = requestAnimationFrame(tick);
    }, 200);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId.current);
    };
  }, [reducedMotion]);

  if (isMobile) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(0,220,180,0.12) 0%, transparent 70%)",
        }}
      />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]}   intensity={1.4} color="#00B8CC" />
      <pointLight position={[-4, -3, 3]} intensity={0.7} color="#44C038" />
      <pointLight position={[0, -5, 2]}  intensity={0.3} color="#ffffff" />

      {/* Current section model — zooms in and fades as section ends */}
      <Suspense fallback={null}>
        <EnzymeModel
          assemblyProgress={progress}
          mouseX={reducedMotion ? 0 : mouseX}
          mouseY={reducedMotion ? 0 : mouseY}
          scrollProgress={scrollProgress}
          modelPath={currentPath}
          opacityFactor={currentOpacity}
          scaleFactor={currentScaleFactor}
        />
      </Suspense>

      {/* Next section model — fades in and scales up before the section switch */}
      {showNextModel && (
        <Suspense fallback={null}>
          <EnzymeModel
            assemblyProgress={1}
            mouseX={reducedMotion ? 0 : mouseX}
            mouseY={reducedMotion ? 0 : mouseY}
            scrollProgress={scrollProgress}
            modelPath={nextPath}
            opacityFactor={nextOpacity}
            scaleFactor={nextScaleFactor}
          />
        </Suspense>
      )}
    </Canvas>
  );
}
