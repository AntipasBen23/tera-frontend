"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  assemblyProgress: number;
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}

const TARGET_SIZE = 2.4;

export default function EnzymeModel({ assemblyProgress, mouseX, mouseY, scrollProgress }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/enzyme.glb");

  const idleAngle  = useRef(0);
  const targetRot  = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  // Bounding-box normalisation — runs once after GLB loads
  const { scale: normScale, offset } = useMemo(() => {
    const box  = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    return {
      scale:  maxDim > 0 ? TARGET_SIZE / maxDim : 1,
      offset: center.negate(),          // shift so centroid sits at origin
    };
  }, [scene]);

  // Collect every material so we can drive opacity without traversing each frame
  const materials = useMemo(() => {
    const seen = new Set<THREE.Material>();
    scene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => {
        if (seen.has(m)) return;
        m.transparent = true;
        m.depthWrite  = false;
        seen.add(m);
      });
    });
    return Array.from(seen);
  }, [scene]);

  // Mouse parallax target
  useEffect(() => {
    targetRot.current.x = mouseY * 0.22;
    targetRot.current.y = mouseX * 0.32;
  }, [mouseX, mouseY]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Idle rotation + smooth mouse parallax
    idleAngle.current += delta * 0.16;
    currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 0.05;
    currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 0.05;

    // Scroll-driven: add extra Y rotation and vertical drift as user scrolls
    const scrollRotY  = scrollProgress * Math.PI * 0.7; // ~126° over full journey
    const scrollDriftY = scrollProgress * 0.6;           // float upward gently

    groupRef.current.rotation.y = idleAngle.current + currentRot.current.y + scrollRotY;
    groupRef.current.rotation.x = currentRot.current.x;
    groupRef.current.position.y = scrollDriftY;

    // Assembly: scale up + fade in
    const eased = THREE.MathUtils.lerp(0.3, 1, assemblyProgress);
    groupRef.current.scale.setScalar(normScale * eased);
    materials.forEach((m) => { m.opacity = assemblyProgress; });
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        position={[offset.x, offset.y, offset.z]}
      />
    </group>
  );
}

useGLTF.preload("/models/enzyme.glb");
useGLTF.setDecoderPath("/draco/");
