"use client";
import { useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Inner r3f scene. Lazy-loaded by CraftCanvas.tsx via next/dynamic so the
// three + @react-three/fiber bundle never lands on routes that don't render
// this file.
//
// Geometry is procedural — body panels built from primitives. When real GLBs
// arrive, swap this scene's Panels component for one that loads from
// `/public/3d/{slug}.glb` and references each panel as a named submesh.

type PanelConfig = {
  id: string;
  shape:
    | { kind: "box"; size: [number, number, number] }
    | { kind: "cylinder"; radius: number; length: number; axis: "x" | "y" | "z" };
  /** Final assembled position. */
  pos: [number, number, number];
  /** Disassembled offset added at progress=0. Goes to zero at progress=1. */
  dis: [number, number, number];
  /** Disassembled rotation in radians, applied at progress=0 and decays to 0. */
  disRot?: [number, number, number];
  /** Constant rotation always applied (e.g., wheel axis orientation). */
  baseRot?: [number, number, number];
  color: string;
  metalness?: number;
  roughness?: number;
};

const BODY_DARK = "#1a1a1a";
const BODY_MID = "#2a2a2a";
const TIRE_BLACK = "#0a0a0a";
const RIM_GREY = "#3a3a3a";

const W = 1.85; // chassis width
const L = 4.5; // chassis length

// Mid-engine exotic-inspired layout. Coordinates: -Z is forward, +X is right.
const PANELS: PanelConfig[] = [
  // Chassis — the anchor. Stays at origin even when other panels splay.
  {
    id: "chassis",
    shape: { kind: "box", size: [W, 0.3, L] },
    pos: [0, 0, 0],
    dis: [0, 0, 0],
    color: BODY_MID,
    metalness: 0.7,
    roughness: 0.45,
  },
  // Front clamshell — hood + fenders fused. Slopes upward toward the cabin.
  {
    id: "front-clamshell",
    shape: { kind: "box", size: [W - 0.05, 0.25, 1.5] },
    pos: [0, 0.32, -1.2],
    dis: [0, 1.2, -2.0],
    disRot: [-0.5, 0, 0],
    color: BODY_DARK,
    metalness: 0.75,
    roughness: 0.4,
  },
  // Cabin/roof — the greenhouse, narrower than chassis to read like a coupe.
  {
    id: "cabin",
    shape: { kind: "box", size: [W - 0.4, 0.45, 1.4] },
    pos: [0, 0.62, 0.0],
    dis: [0, 1.6, 0],
    color: BODY_DARK,
    metalness: 0.9,
    roughness: 0.2, // glass-ish
  },
  // Rear engine cover — slopes upward at the back, mid-engine signature.
  {
    id: "rear-cover",
    shape: { kind: "box", size: [W - 0.05, 0.3, 1.5] },
    pos: [0, 0.32, 1.2],
    dis: [0, 1.0, 2.2],
    disRot: [0.4, 0, 0],
    color: BODY_DARK,
    metalness: 0.75,
    roughness: 0.4,
  },
  // Left door
  {
    id: "door-l",
    shape: { kind: "box", size: [0.06, 0.55, 1.3] },
    pos: [-(W / 2 + 0.03), 0.25, -0.05],
    dis: [-1.4, 0, 0],
    disRot: [0, 0.3, 0],
    color: BODY_DARK,
    metalness: 0.75,
    roughness: 0.4,
  },
  // Right door
  {
    id: "door-r",
    shape: { kind: "box", size: [0.06, 0.55, 1.3] },
    pos: [W / 2 + 0.03, 0.25, -0.05],
    dis: [1.4, 0, 0],
    disRot: [0, -0.3, 0],
    color: BODY_DARK,
    metalness: 0.75,
    roughness: 0.4,
  },
  // Front splitter — thin strip ahead of the chassis.
  {
    id: "front-splitter",
    shape: { kind: "box", size: [W + 0.1, 0.06, 0.3] },
    pos: [0, -0.18, -2.05],
    dis: [0, -0.6, -1.0],
    color: TIRE_BLACK,
    metalness: 0.4,
    roughness: 0.6,
  },
  // Rear diffuser — thin strip behind.
  {
    id: "rear-diffuser",
    shape: { kind: "box", size: [W + 0.1, 0.06, 0.3] },
    pos: [0, -0.18, 2.05],
    dis: [0, -0.6, 1.0],
    color: TIRE_BLACK,
    metalness: 0.4,
    roughness: 0.6,
  },
  // Rear wing — perched above the engine cover.
  {
    id: "rear-wing",
    shape: { kind: "box", size: [W - 0.5, 0.05, 0.18] },
    pos: [0, 0.85, 1.85],
    dis: [0, 1.2, 1.6],
    disRot: [0, 0, 0],
    color: BODY_MID,
    metalness: 0.6,
    roughness: 0.5,
  },
  // Wheels — cylinders rotated 90° around Z so their axis runs along X.
  ...wheel("wheel-fl", [-(W / 2 + 0.05), -0.18, -1.5], [-1.0, 0, 0]),
  ...wheel("wheel-fr", [W / 2 + 0.05, -0.18, -1.5], [1.0, 0, 0]),
  ...wheel("wheel-rl", [-(W / 2 + 0.05), -0.18, 1.5], [-1.0, 0, 0]),
  ...wheel("wheel-rr", [W / 2 + 0.05, -0.18, 1.5], [1.0, 0, 0]),
];

function wheel(
  id: string,
  pos: [number, number, number],
  dis: [number, number, number],
): PanelConfig[] {
  return [
    {
      id: `${id}-tire`,
      shape: { kind: "cylinder", radius: 0.34, length: 0.28, axis: "x" },
      pos,
      dis,
      baseRot: [0, 0, Math.PI / 2],
      color: TIRE_BLACK,
      metalness: 0.05,
      roughness: 0.85,
    },
    {
      id: `${id}-rim`,
      shape: { kind: "cylinder", radius: 0.22, length: 0.3, axis: "x" },
      pos,
      dis,
      baseRot: [0, 0, Math.PI / 2],
      color: RIM_GREY,
      metalness: 0.85,
      roughness: 0.25,
    },
  ];
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

type Props = {
  progressRef: RefObject<number>;
};

function Panels({ progressRef }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const orbitRef = useRef(0);

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0;
    const eased = easeOutCubic(p);
    const k = 1 - eased; // disassembly factor: 1 at start, 0 when assembled

    // Slow ambient orbit — subtle even during disassembly.
    orbitRef.current += delta * 0.18;
    if (groupRef.current) {
      groupRef.current.rotation.y = orbitRef.current;
    }

    for (let i = 0; i < PANELS.length; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const cfg = PANELS[i];
      mesh.position.set(
        cfg.pos[0] + cfg.dis[0] * k,
        cfg.pos[1] + cfg.dis[1] * k,
        cfg.pos[2] + cfg.dis[2] * k,
      );
      const baseX = cfg.baseRot?.[0] ?? 0;
      const baseY = cfg.baseRot?.[1] ?? 0;
      const baseZ = cfg.baseRot?.[2] ?? 0;
      const dRotX = cfg.disRot?.[0] ?? 0;
      const dRotY = cfg.disRot?.[1] ?? 0;
      const dRotZ = cfg.disRot?.[2] ?? 0;
      mesh.rotation.set(baseX + dRotX * k, baseY + dRotY * k, baseZ + dRotZ * k);
    }
  });

  return (
    <group ref={groupRef}>
      {PANELS.map((cfg, i) => (
        <mesh
          key={cfg.id}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          castShadow
          receiveShadow
        >
          {cfg.shape.kind === "box" ? (
            <boxGeometry args={cfg.shape.size} />
          ) : (
            <cylinderGeometry
              args={[cfg.shape.radius, cfg.shape.radius, cfg.shape.length, 32]}
            />
          )}
          <meshStandardMaterial
            color={cfg.color}
            metalness={cfg.metalness ?? 0.5}
            roughness={cfg.roughness ?? 0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.18} />
      {/* Key — high-right, dramatic */}
      <directionalLight position={[4, 5, 2]} intensity={1.4} color="#ffffff" />
      {/* Fill — low-left, weak */}
      <directionalLight position={[-3, 1, -2]} intensity={0.35} color="#ffffff" />
      {/* Rim — from behind, defines silhouette edges */}
      <directionalLight position={[0, 2, -5]} intensity={0.5} color="#ffffff" />
    </>
  );
}

export default function CraftScene({ progressRef }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [3.2, 1.4, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Lighting />
      <Panels progressRef={progressRef} />
      {/* Soft shadow plane below the car so panels read against a horizon. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#000000"
          metalness={0}
          roughness={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Canvas>
  );
}
