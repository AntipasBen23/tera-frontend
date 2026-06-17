"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 180;

export default function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, velocities, phases } = useMemo(() => {
    let seed = 7919;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const phases = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (rand() - 0.5) * 14;
      positions[i * 3 + 1] = (rand() - 0.5) * 8;
      positions[i * 3 + 2] = (rand() - 0.5) * 6 - 2;

      velocities[i * 3] = (rand() - 0.5) * 0.003;
      velocities[i * 3 + 1] = (rand() - 0.5) * 0.002;
      velocities[i * 3 + 2] = 0;

      phases[i] = rand() * Math.PI * 2;
    }

    return { positions, velocities, phases };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    return g;
  }, [positions]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);

      x += velocities[i * 3] + Math.sin(t * 0.3 + phases[i]) * 0.001;
      y += velocities[i * 3 + 1] + Math.cos(t * 0.25 + phases[i] * 0.7) * 0.001;

      // Wrap around edges
      if (x > 7) x = -7;
      if (x < -7) x = 7;
      if (y > 4) y = -4;
      if (y < -4) y = 4;

      pos.setXY(i, x, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        color="#00DCB4"
        size={0.04}
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}
