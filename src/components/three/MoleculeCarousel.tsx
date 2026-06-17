"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Each "molecule" is a distinct procedural shape representing a different industry
const MOLECULE_DEFS = [
  {
    // Cosmetics — hyaluronic acid-ish: long chain
    name: "cosmetics",
    color: "#00DCB4",
    emissive: "#00DCB4",
    build: (seed: number) => {
      const atoms: { pos: [number, number, number]; r: number }[] = [];
      const bonds: [number, number][] = [];
      let rand = seed;
      const r = () => {
        rand = (rand * 16807) % 2147483647;
        return (rand - 1) / 2147483646;
      };
      // Long linear chain with branches
      for (let i = 0; i < 14; i++) {
        const t = (i / 13) * 4 - 2;
        atoms.push({ pos: [t, Math.sin(t * 1.5) * 0.3 + (r() - 0.5) * 0.2, (r() - 0.5) * 0.4], r: 0.07 + r() * 0.06 });
        if (i > 0) bonds.push([i - 1, i]);
        if (i % 3 === 0 && i > 0) {
          atoms.push({ pos: [t, atoms[atoms.length - 1].pos[1] + 0.5, 0], r: 0.05 });
          bonds.push([i, atoms.length - 1]);
        }
      }
      return { atoms, bonds };
    },
  },
  {
    // Fragrance — santalol-ish: bicyclic ring
    name: "fragrance",
    color: "#C77DFF",
    emissive: "#7B61FF",
    build: (seed: number) => {
      const atoms: { pos: [number, number, number]; r: number }[] = [];
      const bonds: [number, number][] = [];
      let rand = seed + 100;
      const r = () => {
        rand = (rand * 16807) % 2147483647;
        return (rand - 1) / 2147483646;
      };
      // Two fused rings
      const ring1Count = 6;
      const ring2Count = 5;
      for (let i = 0; i < ring1Count; i++) {
        const a = (i / ring1Count) * Math.PI * 2;
        atoms.push({ pos: [Math.cos(a) * 0.8, Math.sin(a) * 0.8, 0], r: 0.07 });
        bonds.push([i, (i + 1) % ring1Count]);
      }
      for (let i = 0; i < ring2Count; i++) {
        const a = (i / ring2Count) * Math.PI * 2;
        atoms.push({ pos: [Math.cos(a) * 0.55 + 1.2, Math.sin(a) * 0.55, 0.1], r: 0.06 });
        if (i > 0) bonds.push([ring1Count + i, ring1Count + i - 1]);
        if (i === ring2Count - 1) bonds.push([ring1Count + i, ring1Count]);
      }
      // Tail
      atoms.push({ pos: [1.9, 0.5, 0.3], r: 0.05 });
      atoms.push({ pos: [2.4, 0.2, 0.1], r: 0.04 });
      bonds.push([ring1Count + 2, atoms.length - 2]);
      bonds.push([atoms.length - 2, atoms.length - 1]);
      return { atoms, bonds };
    },
  },
  {
    // Pharmaceuticals — alkaloid-ish: tetracyclic cage
    name: "pharma",
    color: "#F5C542",
    emissive: "#F5A020",
    build: (seed: number) => {
      const atoms: { pos: [number, number, number]; r: number }[] = [];
      const bonds: [number, number][] = [];
      let rand = seed + 999;
      const r = () => {
        rand = (rand * 16807) % 2147483647;
        return (rand - 1) / 2147483646;
      };
      // Compact cage: 3 rings in 3D
      const layers = [
        { y: -0.6, count: 5, rr: 0.7 },
        { y: 0, count: 6, rr: 0.9 },
        { y: 0.7, count: 5, rr: 0.65 },
      ];
      let offset = 0;
      for (const layer of layers) {
        for (let i = 0; i < layer.count; i++) {
          const a = (i / layer.count) * Math.PI * 2;
          atoms.push({ pos: [Math.cos(a) * layer.rr, layer.y, Math.sin(a) * layer.rr], r: 0.07 + r() * 0.03 });
          bonds.push([offset + i, offset + (i + 1) % layer.count]);
        }
        offset += layer.count;
      }
      // Cross-layer bonds
      for (let i = 0; i < 4; i++) {
        bonds.push([i, 5 + i]);
        bonds.push([5 + i, 11 + (i % 5)]);
      }
      return { atoms, bonds };
    },
  },
];

function MoleculeShape({
  def,
  visible,
  mouseX,
  mouseY,
}: {
  def: (typeof MOLECULE_DEFS)[number];
  visible: boolean;
  mouseX: number;
  mouseY: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { atoms, bonds } = useMemo(() => def.build(42), [def]);
  const idleAngle = useRef(0);
  const currentRot = useRef({ x: 0, y: 0 });
  const opacityRef = useRef(visible ? 1 : 0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Fade in/out
    const targetOp = visible ? 1 : 0;
    opacityRef.current += (targetOp - opacityRef.current) * 0.06;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.opacity !== undefined) mat.opacity = opacityRef.current;
      }
    });
    groupRef.current.scale.setScalar(opacityRef.current * 0.9 + 0.1);

    idleAngle.current += delta * 0.22;
    currentRot.current.x += (mouseY * 0.25 - currentRot.current.x) * 0.05;
    currentRot.current.y += (mouseX * 0.3 - currentRot.current.y) * 0.05;

    groupRef.current.rotation.y = idleAngle.current + currentRot.current.y;
    groupRef.current.rotation.x = currentRot.current.x;
  });

  return (
    <group ref={groupRef}>
      {atoms.map((atom, i) => (
        <mesh key={i} position={atom.pos}>
          <sphereGeometry args={[atom.r, 10, 10]} />
          <meshStandardMaterial
            color={def.color}
            emissive={def.emissive}
            emissiveIntensity={0.6}
            transparent
            opacity={0}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      ))}
      {bonds.map(([a, b], i) => {
        const posA = new THREE.Vector3(...atoms[a].pos);
        const posB = new THREE.Vector3(...atoms[b].pos);
        const mid = posA.clone().add(posB).multiplyScalar(0.5);
        const dir = posB.clone().sub(posA);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.normalize()
        );
        return (
          <mesh key={`b-${i}`} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.015, 0.015, len, 6]} />
            <meshStandardMaterial
              color={def.color}
              emissive={def.emissive}
              emissiveIntensity={0.3}
              transparent
              opacity={0}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

interface Props {
  activeIndex: number;
  mouseX: number;
  mouseY: number;
}

export default function MoleculeCarousel({ activeIndex, mouseX, mouseY }: Props) {
  return (
    <group>
      {MOLECULE_DEFS.map((def, i) => (
        <MoleculeShape
          key={def.name}
          def={def}
          visible={i === activeIndex}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </group>
  );
}

export { MOLECULE_DEFS };
