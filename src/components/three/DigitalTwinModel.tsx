"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SENSOR_POINTS = [
  { pos: [0, 1.4, 0.9] as [number, number, number], label: "Temperature", color: "#FF6B6B" },
  { pos: [0.9, 0.6, 0] as [number, number, number], label: "pH", color: "#FFE66D" },
  { pos: [-0.9, 0, 0] as [number, number, number], label: "Pressure", color: "#A8DAFF" },
  { pos: [0, -0.8, 0.9] as [number, number, number], label: "Flow Rate", color: "#7B61FF" },
  { pos: [0.6, 0.1, -0.7] as [number, number, number], label: "Enzyme Activity", color: "#00DCB4" },
  { pos: [-0.5, -1.2, 0.5] as [number, number, number], label: "Substrate", color: "#C77DFF" },
  { pos: [0, 1.0, -0.9] as [number, number, number], label: "Yield", color: "#F5C542" },
  { pos: [0.9, -0.5, 0.3] as [number, number, number], label: "Oxygen", color: "#AEF6FF" },
];

function SensorPip({
  pos,
  color,
  idx,
  visible,
}: {
  pos: [number, number, number];
  color: string;
  idx: number;
  visible: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => (idx / SENSOR_POINTS.length) * Math.PI * 2, [idx]);

  useFrame(({ clock }) => {
    if (!meshRef.current || !ringRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = Math.sin(t * 1.8 + phase) * 0.5 + 0.5; // 0..1
    const scale = 1 + pulse * 0.5;
    ringRef.current.scale.setScalar(scale * visible);
    meshRef.current.scale.setScalar(visible);
    (ringRef.current.material as THREE.MeshStandardMaterial).opacity = (0.6 - pulse * 0.4) * visible;
  });

  return (
    <group position={pos}>
      {/* Core pip */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Pulsing ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.1, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

interface Props {
  twinProgress: number; // 0 = plain reactor, 1 = full digital twin
  mouseX: number;
  mouseY: number;
}

export default function DigitalTwinModel({ twinProgress, mouseX, mouseY }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.LineSegments>(null);
  const currentRot = useRef({ x: 0, y: 0 });
  const idleAngle = useRef(0);

  // Build grid lines for the digital-twin scan effect
  const gridGeo = useMemo(() => {
    const points: number[] = [];
    const r = 0.92;
    const segs = 16;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      points.push(Math.cos(a) * r, -1.6, Math.sin(a) * r);
      points.push(Math.cos(a) * r, 1.6, Math.sin(a) * r);
    }
    // Horizontal rings
    for (let y = -1.4; y <= 1.4; y += 0.4) {
      for (let i = 0; i < segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        points.push(Math.cos(a) * r, y, Math.sin(a) * r);
        points.push(Math.cos(a2) * r, y, Math.sin(a2) * r);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    idleAngle.current += delta * 0.1;
    currentRot.current.x += (mouseY * 0.2 - currentRot.current.x) * 0.05;
    currentRot.current.y += (mouseX * 0.3 - currentRot.current.y) * 0.05;

    groupRef.current.rotation.y = idleAngle.current + currentRot.current.y;
    groupRef.current.rotation.x = currentRot.current.x;

    // Animate grid opacity
    if (gridRef.current) {
      (gridRef.current.material as THREE.LineBasicMaterial).opacity = twinProgress * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Reactor body — semi-transparent shell */}
      <mesh>
        <cylinderGeometry args={[0.9, 0.9, 3.2, 32, 1, true]} />
        <meshStandardMaterial
          color="#0D1520"
          emissive="#00DCB4"
          emissiveIntensity={0.05 + twinProgress * 0.15}
          transparent
          opacity={0.35 - twinProgress * 0.2}
          side={THREE.DoubleSide}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.12, 32]} />
        <meshStandardMaterial color="#1a2a3a" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.12, 32]} />
        <meshStandardMaterial color="#1a2a3a" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Digital twin grid overlay */}
      <lineSegments ref={gridRef} geometry={gridGeo}>
        <lineBasicMaterial
          color="#00DCB4"
          transparent
          opacity={0}
        />
      </lineSegments>

      {/* Sensor pips */}
      {SENSOR_POINTS.map((s, i) => (
        <SensorPip
          key={s.label}
          pos={s.pos}
          color={s.color}
          idx={i}
          visible={twinProgress}
        />
      ))}

      {/* Inner glow */}
      <mesh>
        <cylinderGeometry args={[0.85, 0.85, 3.0, 24]} />
        <meshStandardMaterial
          color="#003D30"
          emissive="#00DCB4"
          emissiveIntensity={0.1 + twinProgress * 0.35}
          transparent
          opacity={0.15 + twinProgress * 0.25}
          roughness={0}
        />
      </mesh>

      {/* Pipe top */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.0, 12]} />
        <meshStandardMaterial color="#223344" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Pipe bottom */}
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.0, 12]} />
        <meshStandardMaterial color="#223344" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}

export { SENSOR_POINTS };
