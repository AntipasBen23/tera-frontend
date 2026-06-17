"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  cutawayProgress: number; // 0 = closed shell, 1 = fully open/revealed
  mouseX: number;
  mouseY: number;
}

// Floating particle (substrate or product)
function FlowParticle({
  idx,
  side,
  progress,
}: {
  idx: number;
  side: "in" | "out";
  progress: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => ({
    phase: (idx / 8) * Math.PI * 2,
    radius: 0.15 + (idx % 3) * 0.08,
    speed: 0.4 + (idx % 4) * 0.15,
  }), [idx]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Particles flow from y=1.5 (top, substrate in) or y=-1.5 (bottom, product out)
    const dir = side === "in" ? -1 : 1;
    const y = ((t * offset.speed + offset.phase) % (Math.PI * 2)) / (Math.PI * 2);
    meshRef.current.position.y = side === "in"
      ? 1.5 - y * 2
      : -1.5 + y * 2;
    meshRef.current.position.x = Math.sin(t * offset.speed + offset.phase) * offset.radius * (1 + dir * 0.3);
    meshRef.current.position.z = Math.cos(t * offset.speed * 0.7 + offset.phase) * offset.radius;
    meshRef.current.scale.setScalar(progress * (0.04 + Math.sin(t * 2 + offset.phase) * 0.01));
  });

  const color = side === "in" ? "#7B61FF" : "#00DCB4";

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.9 * progress}
      />
    </mesh>
  );
}

export default function ReactorModel({ cutawayProgress, mouseX, mouseY }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const currentRot = useRef({ x: 0, y: 0 });
  const idleAngle = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Shell becomes transparent as cutaway opens
    if (shellRef.current) {
      const mat = shellRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = THREE.MathUtils.lerp(0.7, 0.08, cutawayProgress);
      mat.wireframe = cutawayProgress > 0.5;
    }

    // Slow idle rotation
    idleAngle.current += delta * 0.12;

    // Mouse parallax damping
    currentRot.current.x += (mouseY * 0.2 - currentRot.current.x) * 0.05;
    currentRot.current.y += (mouseX * 0.3 - currentRot.current.y) * 0.05;

    groupRef.current.rotation.y = idleAngle.current + currentRot.current.y;
    groupRef.current.rotation.x = currentRot.current.x;
  });

  return (
    <group ref={groupRef}>
      {/* Outer vessel shell — cylinder */}
      <mesh ref={shellRef}>
        <cylinderGeometry args={[0.9, 0.9, 3.2, 32, 1, true]} />
        <meshStandardMaterial
          color="#1a2a3a"
          emissive="#00DCB4"
          emissiveIntensity={0.05}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.12, 32]} />
        <meshStandardMaterial
          color="#1a2a3a"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.12, 32]} />
        <meshStandardMaterial
          color="#1a2a3a"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Inner solution glow — a translucent sphere suggesting liquid */}
      <mesh scale={[0.82, 0.95, 0.82]}>
        <cylinderGeometry args={[0.9, 0.9, 3.0, 24, 1, false]} />
        <meshStandardMaterial
          color="#004D3F"
          emissive="#00DCB4"
          emissiveIntensity={0.12 + cutawayProgress * 0.2}
          transparent
          opacity={0.3 + cutawayProgress * 0.2}
          roughness={0}
          metalness={0}
        />
      </mesh>

      {/* Enzyme cluster in centre — suspended spheres */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 0.25 + (i % 3) * 0.1;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * r,
              (i % 4 - 1.5) * 0.28,
              Math.sin(angle) * r,
            ]}
            scale={cutawayProgress}
          >
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial
              color="#00DCB4"
              emissive="#00DCB4"
              emissiveIntensity={0.7}
              roughness={0.2}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Substrate particles flowing in (top) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <FlowParticle key={`in-${i}`} idx={i} side="in" progress={cutawayProgress} />
      ))}

      {/* Product particles flowing out (bottom) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <FlowParticle key={`out-${i}`} idx={i} side="out" progress={cutawayProgress} />
      ))}

      {/* Pipe stubs — top inlet */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.0, 12]} />
        <meshStandardMaterial color="#223344" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Pipe stubs — bottom outlet */}
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.0, 12]} />
        <meshStandardMaterial color="#223344" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}
