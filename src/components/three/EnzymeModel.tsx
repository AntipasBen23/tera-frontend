"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ATOM_COUNT = 48;
const BOND_COUNT = 52;
const SEED = 42;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface AtomDef {
  pos: THREE.Vector3;
  radius: number;
  color: THREE.Color;
  targetPos: THREE.Vector3;
}

interface BondDef {
  a: number;
  b: number;
}

function buildMolecule(rand: () => number) {
  const atoms: AtomDef[] = [];

  // Build a helical-ribbon-ish arrangement of atoms in 3D
  for (let i = 0; i < ATOM_COUNT; i++) {
    const t = i / ATOM_COUNT;
    const angle = t * Math.PI * 6;
    const radius = 0.8 + rand() * 0.3;
    const x = Math.cos(angle) * radius + (rand() - 0.5) * 0.4;
    const y = (t - 0.5) * 3.2 + (rand() - 0.5) * 0.3;
    const z = Math.sin(angle) * radius + (rand() - 0.5) * 0.4;

    const targetPos = new THREE.Vector3(x, y, z);

    // Atoms start scattered around origin (assembly effect)
    const scatter = 4;
    const startPos = new THREE.Vector3(
      (rand() - 0.5) * scatter,
      (rand() - 0.5) * scatter,
      (rand() - 0.5) * scatter
    );

    // Color: mix of teal/violet/white based on position
    const hue = 0.47 + rand() * 0.15; // teal to violet range
    const sat = 0.6 + rand() * 0.4;
    const lit = 0.55 + rand() * 0.3;
    const color = new THREE.Color().setHSL(hue, sat, lit);

    atoms.push({
      pos: startPos.clone(),
      targetPos,
      radius: 0.04 + rand() * 0.06,
      color,
    });
  }

  // Build bonds between nearby atoms
  const bonds: BondDef[] = [];
  for (let i = 0; i < ATOM_COUNT - 1 && bonds.length < BOND_COUNT; i++) {
    // Main chain bond
    bonds.push({ a: i, b: i + 1 });
    // Occasional cross-links for the ribbon feel
    if (i < ATOM_COUNT - 4 && rand() > 0.65 && bonds.length < BOND_COUNT) {
      bonds.push({ a: i, b: i + 3 + Math.floor(rand() * 3) });
    }
  }

  return { atoms, bonds };
}

interface Props {
  assemblyProgress: number; // 0 = scattered, 1 = assembled
  mouseX: number;
  mouseY: number;
}

export default function EnzymeModel({ assemblyProgress, mouseX, mouseY }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const atomMeshes = useRef<THREE.Mesh[]>([]);
  const bondMeshes = useRef<THREE.Mesh[]>([]);

  const rand = useMemo(() => seededRandom(SEED), []);
  const { atoms, bonds } = useMemo(() => buildMolecule(rand), [rand]);

  // Idle rotation
  const idleAngle = useRef(0);
  const targetRot = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  useEffect(() => {
    targetRot.current.x = mouseY * 0.25;
    targetRot.current.y = mouseX * 0.35;
  }, [mouseX, mouseY]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Lerp atom positions toward target based on assemblyProgress
    atoms.forEach((atom, i) => {
      const mesh = atomMeshes.current[i];
      if (!mesh) return;
      mesh.position.lerpVectors(atom.pos, atom.targetPos, assemblyProgress);
      mesh.scale.setScalar(THREE.MathUtils.lerp(0.1, 1, assemblyProgress));
      (mesh.material as THREE.MeshStandardMaterial).opacity = assemblyProgress;
    });

    // Lerp bond visibility
    bondMeshes.current.forEach((mesh) => {
      if (!mesh) return;
      (mesh.material as THREE.MeshStandardMaterial).opacity =
        Math.max(0, assemblyProgress * 2 - 0.5);
    });

    // Idle self-rotation
    idleAngle.current += delta * 0.18;

    // Smooth mouse parallax
    currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 0.05;
    currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 0.05;

    groupRef.current.rotation.y = idleAngle.current + currentRot.current.y;
    groupRef.current.rotation.x = currentRot.current.x;
  });

  // Bond geometry helper
  function BondMesh({ a, b, idx }: { a: number; b: number; idx: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
      if (meshRef.current) bondMeshes.current[idx] = meshRef.current;
    }, [idx]);

    const posA = atoms[a].targetPos;
    const posB = atoms[b].targetPos;
    const mid = posA.clone().add(posB).multiplyScalar(0.5);
    const dir = posB.clone().sub(posA);
    const length = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize()
    );

    return (
      <mesh ref={meshRef} position={mid} quaternion={quat}>
        <cylinderGeometry args={[0.012, 0.012, length, 6]} />
        <meshStandardMaterial
          color="#00DCB4"
          emissive="#00DCB4"
          emissiveIntensity={0.3}
          transparent
          opacity={0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      {/* Atoms */}
      {atoms.map((atom, i) => (
        <mesh
          key={`atom-${i}`}
          ref={(m) => {
            if (m) atomMeshes.current[i] = m;
          }}
          position={atom.pos}
        >
          <sphereGeometry args={[atom.radius, 10, 10]} />
          <meshStandardMaterial
            color={atom.color}
            emissive={atom.color}
            emissiveIntensity={0.4}
            transparent
            opacity={0}
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Bonds */}
      {bonds.map((b, i) => (
        <BondMesh key={`bond-${i}`} a={b.a} b={b.b} idx={i} />
      ))}
    </group>
  );
}
