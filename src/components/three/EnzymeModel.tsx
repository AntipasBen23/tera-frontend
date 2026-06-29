"use client";

import { useRef, useMemo, useEffect, useState, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  parsePDB,
  getSecondaryType,
  type ParsedPDB,
  type SecondaryType,
} from "@/lib/parsePDB";

interface Segment {
  type: SecondaryType;
  points: THREE.Vector3[];
  index: number;
}

interface Props {
  assemblyProgress: number;
  mouseX: number;
  mouseY: number;
}

const COLOR: Record<SecondaryType, THREE.Color> = {
  helix: new THREE.Color("#00DCB4"),  // brand teal
  sheet: new THREE.Color("#7B61FF"),  // brand violet
  coil:  new THREE.Color("#9AAABB"),  // muted blue-grey
};

const RADIUS: Record<SecondaryType, number> = {
  helix: 0.065,
  sheet: 0.050,
  coil:  0.022,
};

const EMISSIVE: Record<SecondaryType, number> = {
  helix: 0.45,
  sheet: 0.40,
  coil:  0.08,
};

// ─── per-segment tube mesh ────────────────────────────────────────────────────
interface SegmentMeshProps {
  segment: Segment;
  meshRef: (m: THREE.Mesh | null) => void;
}

const SegmentMesh = memo(function SegmentMesh({ segment, meshRef }: SegmentMeshProps) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(segment.points, false, "catmullrom", 0.5);
    const tubularSegs = Math.max(segment.points.length * 4, 16);
    return new THREE.TubeGeometry(curve, tubularSegs, RADIUS[segment.type], 8, false);
  }, [segment]);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR[segment.type],
        emissive: COLOR[segment.type],
        emissiveIntensity: EMISSIVE[segment.type],
        transparent: true,
        opacity: 0,
        roughness: 0.2,
        metalness: 0.15,
        depthWrite: false,
      }),
    [segment.type]
  );

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  return <mesh ref={meshRef} geometry={geo} material={mat} frustumCulled={false} />;
});

// ─── main model ───────────────────────────────────────────────────────────────
export default function EnzymeModel({ assemblyProgress, mouseX, mouseY }: Props) {
  const groupRef  = useRef<THREE.Group>(null);
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);

  const [pdbData, setPdbData] = useState<ParsedPDB | null>(null);

  const idleAngle  = useRef(0);
  const targetRot  = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  // fetch PDB once
  useEffect(() => {
    fetch("/models/enzyme.pdb")
      .then((r) => r.text())
      .then((text) => setPdbData(parsePDB(text)));
  }, []);

  // mouse parallax target
  useEffect(() => {
    targetRot.current.x = mouseY * 0.25;
    targetRot.current.y = mouseX * 0.35;
  }, [mouseX, mouseY]);

  // build segments from PDB data
  const segments = useMemo((): Segment[] => {
    if (!pdbData || pdbData.caAtoms.length === 0) return [];

    // Use chain A (first chain found)
    const chainId = pdbData.caAtoms[0].chainId;
    const atoms = pdbData.caAtoms
      .filter((a) => a.chainId === chainId)
      .sort((a, b) => a.resSeq - b.resSeq);

    if (atoms.length < 4) return [];

    // Center + normalise into ±2.2 unit sphere
    const centroid = new THREE.Vector3();
    atoms.forEach((a) => centroid.add(new THREE.Vector3(a.x, a.y, a.z)));
    centroid.divideScalar(atoms.length);

    let maxDist = 0;
    const vecs = atoms.map((a) => {
      const v = new THREE.Vector3(a.x - centroid.x, a.y - centroid.y, a.z - centroid.z);
      if (v.length() > maxDist) maxDist = v.length();
      return { v, resSeq: a.resSeq };
    });

    const scale = 1.9 / maxDist;
    const pts = vecs.map(({ v, resSeq }) => ({
      point: v.clone().multiplyScalar(scale),
      resSeq,
    }));

    // Split into contiguous secondary-structure segments
    const segs: Segment[] = [];
    let curType: SecondaryType | null = null;
    let curPts: THREE.Vector3[] = [];
    let idx = 0;

    for (const { point, resSeq } of pts) {
      const type = getSecondaryType(resSeq, chainId, pdbData.helices, pdbData.sheets);

      if (type !== curType) {
        if (curPts.length >= 2 && curType !== null) {
          segs.push({ type: curType, points: [...curPts], index: idx++ });
        }
        // Overlap: share last point so tubes connect seamlessly
        curPts = curPts.length > 0 ? [curPts[curPts.length - 1], point] : [point];
        curType = type;
      } else {
        curPts.push(point);
      }
    }
    if (curPts.length >= 2 && curType !== null) {
      segs.push({ type: curType, points: curPts, index: idx++ });
    }

    return segs;
  }, [pdbData]);

  // resize mesh ref array when segment count changes
  useEffect(() => {
    meshesRef.current = new Array(segments.length).fill(null);
  }, [segments.length]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // idle rotation + mouse parallax
    idleAngle.current += delta * 0.18;
    currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 0.05;
    currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 0.05;
    groupRef.current.rotation.y = idleAngle.current + currentRot.current.y;
    groupRef.current.rotation.x = currentRot.current.x;

    // staggered reveal: each segment fades in sequentially
    const total = segments.length;
    if (total === 0) return;

    meshesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const threshold = i / total;
      const segProgress = THREE.MathUtils.clamp(
        (assemblyProgress - threshold) * total,
        0,
        1
      );
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = segProgress;
      mesh.scale.setScalar(THREE.MathUtils.lerp(0.5, 1, segProgress));
    });
  });

  if (!pdbData || segments.length === 0) return null;

  return (
    <group ref={groupRef}>
      {segments.map((seg, i) => (
        <SegmentMesh
          key={i}
          segment={seg}
          meshRef={(m) => { meshesRef.current[i] = m; }}
        />
      ))}
    </group>
  );
}
