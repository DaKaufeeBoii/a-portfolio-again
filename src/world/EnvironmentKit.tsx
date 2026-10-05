// ─── WORLD — ENVIRONMENTAL ASSET KIT ─────────────────────────────────────────
// Phase 2-3: Architectural components and props.
// Every element is constructed from authored geometry, not raw primitives.

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PALETTE } from '../lib/constants';

// ─── MATERIALS ────────────────────────────────────────────────────────────────

const MAT = {
  concrete: new THREE.MeshStandardMaterial({ color: PALETTE.concrete, roughness: 0.93, metalness: 0.05 }),
  concretLight: new THREE.MeshStandardMaterial({ color: PALETTE.concretLight, roughness: 0.9, metalness: 0.06 }),
  timber: new THREE.MeshStandardMaterial({ color: PALETTE.timber, roughness: 0.88, metalness: 0.03 }),
  metal: new THREE.MeshStandardMaterial({ color: PALETTE.metal, roughness: 0.55, metalness: 0.7 }),
  darkMetal: new THREE.MeshStandardMaterial({ color: '#404048', roughness: 0.6, metalness: 0.8 }),
  rust: new THREE.MeshStandardMaterial({ color: PALETTE.rust, roughness: 0.95, metalness: 0.1 }),
  foliage: new THREE.MeshStandardMaterial({ color: PALETTE.foliageDark, roughness: 0.95, metalness: 0 }),
  foliageLight: new THREE.MeshStandardMaterial({ color: PALETTE.foliageLight, roughness: 0.92, metalness: 0 }),
  bark: new THREE.MeshStandardMaterial({ color: PALETTE.bark, roughness: 0.97, metalness: 0 }),
  lampAmber: new THREE.MeshStandardMaterial({
    color: PALETTE.lampAmber,
    emissive: PALETTE.lampAmber,
    emissiveIntensity: 1.4,
    roughness: 0.4,
    metalness: 0.1,
  }),
  screenBlue: new THREE.MeshStandardMaterial({
    color: PALETTE.screenBlue,
    emissive: PALETTE.screenBlue,
    emissiveIntensity: 0.8,
    roughness: 0.3,
    metalness: 0.1,
  }),
  groundCover: new THREE.MeshStandardMaterial({ color: PALETTE.groundCover, roughness: 0.98, metalness: 0 }),
};

// ─── LAMP POST ────────────────────────────────────────────────────────────────
// Industrial overhead lamp — the plaza's key light source.

export function LampPost({ position, emissiveIntensity = 1.4 }: {
  position: [number, number, number];
  emissiveIntensity?: number;
}) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.08, 3.2, 6]} />
        <meshStandardMaterial color="#3A3A42" roughness={0.65} metalness={0.7} />
      </mesh>
      {/* Horizontal arm */}
      <mesh position={[0.6, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
        <meshStandardMaterial color="#3A3A42" roughness={0.65} metalness={0.7} />
      </mesh>
      {/* Lamp housing */}
      <mesh position={[1.2, 1.3, 0]} castShadow>
        <boxGeometry args={[0.35, 0.22, 0.22]} />
        <meshStandardMaterial color="#2A2A30" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Lamp glass — emissive */}
      <mesh position={[1.2, 1.2, 0]}>
        <boxGeometry args={[0.28, 0.06, 0.18]} />
        <meshStandardMaterial
          color={PALETTE.lampAmber}
          emissive={PALETTE.lampAmber}
          emissiveIntensity={emissiveIntensity}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* Base plate */}
      <mesh position={[0, -1.55, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.1, 6]} />
        <meshStandardMaterial color="#28282E" roughness={0.9} metalness={0.4} />
      </mesh>
    </group>
  );
}

// ─── OVERHEAD LAMP (hanging from cable) ──────────────────────────────────────

export function HangingLamp({ position }: { position: [number, number, number] }) {
  const lampRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (lampRef.current) {
      // Gentle sway
      lampRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.025;
    }
  });

  return (
    <group position={position}>
      {/* Cable */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 2.4, 4]} />
        <meshStandardMaterial color="#202024" roughness={0.9} metalness={0.3} />
      </mesh>
      <group ref={lampRef}>
        {/* Shade */}
        <mesh position={[0, 0, 0]} castShadow>
          <coneGeometry args={[0.35, 0.28, 8, 1, true]} />
          <meshStandardMaterial color="#2A2A2E" roughness={0.6} metalness={0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* Bulb — emissive */}
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshStandardMaterial
            color={PALETTE.lampAmber}
            emissive={PALETTE.lampAmber}
            emissiveIntensity={2.0}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

// ─── BENCH ────────────────────────────────────────────────────────────────────
// Assembled from seat slats, legs, and armrests. Not a box.

export function Bench({ position, rotation = 0 }: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat slats */}
      {[-0.08, 0.04, 0.16].map((offset, i) => (
        <mesh key={i} position={[0, 0.44, offset]} castShadow>
          <boxGeometry args={[1.4, 0.07, 0.1]} />
          <meshStandardMaterial color={PALETTE.timber} roughness={0.88} metalness={0.03} />
        </mesh>
      ))}
      {/* Legs */}
      {[-0.55, 0.55].map((x, i) => (
        <group key={i} position={[x, 0, 0.04]}>
          <mesh position={[0, 0.22, -0.12]} castShadow>
            <boxGeometry args={[0.07, 0.44, 0.07]} />
            <meshStandardMaterial color="#3A3840" roughness={0.7} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.22, 0.2]} castShadow>
            <boxGeometry args={[0.07, 0.44, 0.07]} />
            <meshStandardMaterial color="#3A3840" roughness={0.7} metalness={0.5} />
          </mesh>
          {/* Cross brace */}
          <mesh position={[0, 0.12, 0.04]}>
            <boxGeometry args={[0.06, 0.06, 0.38]} />
            <meshStandardMaterial color="#3A3840" roughness={0.7} metalness={0.5} />
          </mesh>
          {/* Armrest */}
          <mesh position={[0, 0.52, 0.04]} castShadow>
            <boxGeometry args={[0.08, 0.07, 0.36]} />
            <meshStandardMaterial color={PALETTE.timber} roughness={0.85} metalness={0.03} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── DIRECTIONAL SIGNPOST ─────────────────────────────────────────────────────
// The plaza's diegetic navigation — arrows pointing to districts.

export function SignPost({ position }: { position: [number, number, number] }) {
  const signs = [
    { label: 'AI LAB', angle: 0, color: PALETTE.aiLabAccent },
    { label: 'ARCADE', angle: Math.PI / 2, color: PALETTE.arcadeAccent },
    { label: 'PROJECTS', angle: Math.PI, color: PALETTE.projectCityAccent },
    { label: 'ARCHIVE', angle: -Math.PI / 2, color: PALETTE.archiveAccent },
  ];

  return (
    <group position={position}>
      {/* Central pole */}
      <mesh castShadow>
        <cylinderGeometry args={[0.065, 0.08, 2.8, 6]} />
        <meshStandardMaterial color={PALETTE.timber} roughness={0.9} metalness={0.04} />
      </mesh>
      {/* Signs */}
      {signs.map((s, i) => {
        const y = 1.1 + i * 0.36;
        const signRotY = -s.angle;
        return (
          <group key={i} position={[0, y, 0]} rotation={[0, signRotY, 0]}>
            {/* Sign board */}
            <mesh position={[0.55, 0, 0]} castShadow>
              <boxGeometry args={[0.9, 0.24, 0.06]} />
              <meshStandardMaterial color={s.color} roughness={0.85} metalness={0.06} />
            </mesh>
            {/* Arrow */}
            <mesh position={[1.06, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.1, 0.18, 4]} />
              <meshStandardMaterial color={s.color} roughness={0.7} metalness={0.1} />
            </mesh>
          </group>
        );
      })}
      {/* Base cap */}
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 6]} />
        <meshStandardMaterial color="#282828" roughness={0.95} metalness={0.3} />
      </mesh>
    </group>
  );
}

// ─── THE COURTYARD TREE ───────────────────────────────────────────────────────
// Most complex vegetation. Irregular, not a sphere on a stick.

export function CourtyardTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main trunk — tapered, slightly curved */}
      <mesh position={[0, 1.5, 0]} rotation={[0.04, 0, 0.06]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 3, 7]} />
        <primitive object={MAT.bark} attach="material" />
      </mesh>

      {/* Primary branches */}
      {[
        { pos: [0.8, 3.2, 0.3] as [number,number,number], rot: [0.3, 0.4, 0.35] as [number,number,number], scale: [1,1,1] as [number,number,number] },
        { pos: [-0.9, 3.4, -0.2] as [number,number,number], rot: [0.25, 1.2, -0.4] as [number,number,number], scale: [1,1,1] as [number,number,number] },
        { pos: [0.3, 3.6, -0.8] as [number,number,number], rot: [-0.3, 2.4, 0.2] as [number,number,number], scale: [1,1,1] as [number,number,number] },
        { pos: [-0.4, 3.8, 0.7] as [number,number,number], rot: [0.35, 3.8, -0.25] as [number,number,number], scale: [1,1,1] as [number,number,number] },
      ].map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot} castShadow>
          <cylinderGeometry args={[0.06, 0.1, 1.2, 5]} />
          <primitive object={MAT.bark} attach="material" />
        </mesh>
      ))}

      {/* Leaf clusters — NOT uniform spheres. Offset, flattened, irregular. */}
      {[
        { pos: [1.2, 4.5, 0.5] as [number,number,number], scale: [1.4, 0.9, 1.2] as [number,number,number] },
        { pos: [-1.1, 4.8, -0.3] as [number,number,number], scale: [1.2, 0.8, 1.5] as [number,number,number] },
        { pos: [0.2, 5.2, -1.0] as [number,number,number], scale: [1.0, 1.1, 0.9] as [number,number,number] },
        { pos: [-0.5, 5.5, 0.8] as [number,number,number], scale: [1.3, 0.7, 1.1] as [number,number,number] },
        { pos: [0.4, 5.8, 0.2] as [number,number,number], scale: [1.6, 1.0, 1.4] as [number,number,number] },
        { pos: [-0.8, 4.3, 0.6] as [number,number,number], scale: [0.9, 0.8, 1.0] as [number,number,number] },
        { pos: [0.9, 4.0, -0.5] as [number,number,number], scale: [1.1, 0.9, 0.8] as [number,number,number] },
      ].map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale} castShadow>
          <dodecahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? PALETTE.foliageLight : PALETTE.foliageDark}
            roughness={0.97}
            metalness={0}
            flatShading
          />
        </mesh>
      ))}

      {/* Ground roots visible above surface */}
      {[0, 1.1, 2.3, 3.7].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.35, 0.06, Math.sin(angle) * 0.35]}
          rotation={[0.1, angle, 0.15]} castShadow>
          <cylinderGeometry args={[0.04, 0.1, 0.4, 4]} />
          <primitive object={MAT.bark} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

// ─── WALL SHRUB ───────────────────────────────────────────────────────────────

export function WallShrub({ position, scale = 1 }: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {[
        { pos: [0, 0.4, 0] as [number,number,number], s: [1.2, 0.8, 1.0] as [number,number,number] },
        { pos: [0.3, 0.3, 0.2] as [number,number,number], s: [0.8, 0.6, 0.9] as [number,number,number] },
        { pos: [-0.2, 0.35, -0.15] as [number,number,number], s: [0.9, 0.7, 0.8] as [number,number,number] },
      ].map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.s} castShadow>
          <dodecahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color={PALETTE.foliageDark} roughness={0.98} metalness={0} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// ─── GROUND COVER PATCH ───────────────────────────────────────────────────────

export function GroundCover({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + i * 0.3;
        const r = 0.3 + (i % 4) * 0.15;
        return (
          <mesh key={i}
            position={[Math.cos(angle) * r, 0.1, Math.sin(angle) * r]}
            rotation={[0, angle, 0.3]}
          >
            <boxGeometry args={[0.05, 0.22, 0.04]} />
            <meshStandardMaterial color={PALETTE.groundCover} roughness={0.99} metalness={0} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── POTTED PLANT ─────────────────────────────────────────────────────────────

export function PottedPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.36, 7]} />
        <meshStandardMaterial color="#5A4A3A" roughness={0.92} metalness={0.05} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.04, 7]} />
        <meshStandardMaterial color="#3A2A1A" roughness={0.99} metalness={0} />
      </mesh>
      {/* Plant body */}
      <mesh position={[0, 0.7, 0]} scale={[1.0, 1.2, 0.9]} castShadow>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={PALETTE.foliageDark} roughness={0.97} metalness={0} flatShading />
      </mesh>
      <mesh position={[0.15, 0.85, 0.1]} scale={[0.7, 0.9, 0.7]} castShadow>
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={PALETTE.foliageLight} roughness={0.96} metalness={0} flatShading />
      </mesh>
    </group>
  );
}

// ─── CABLE ────────────────────────────────────────────────────────────────────
// Simple visual cable between two points.

export function Cable({ from, to, sag = 0.3, color = '#282828' }: {
  from: [number, number, number];
  to: [number, number, number];
  sag?: number;
  color?: string;
}) {
  const mid: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2 - sag,
    (from[2] + to[2]) / 2,
  ];
  const len = Math.sqrt(
    (to[0] - from[0]) ** 2 + (to[1] - from[1]) ** 2 + (to[2] - from[2]) ** 2
  );
  const angle = Math.atan2(to[0] - from[0], to[2] - from[2]);

  return (
    <mesh position={mid} rotation={[0, angle, 0.08]}>
      <cylinderGeometry args={[0.018, 0.018, len * 1.05, 4]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.2} />
    </mesh>
  );
}

// ─── PIPE RAILING ─────────────────────────────────────────────────────────────

export function PipeRailing({ from, to, height = 0.9 }: {
  from: [number, number, number];
  to: [number, number, number];
  height?: number;
}) {
  const cx = (from[0] + to[0]) / 2;
  const cy = (from[1] + to[1]) / 2 + height;
  const cz = (from[2] + to[2]) / 2;
  const len = Math.sqrt((to[0] - from[0]) ** 2 + (to[2] - from[2]) ** 2);
  const angle = Math.atan2(to[0] - from[0], to[2] - from[2]);
  const posts = Math.max(2, Math.round(len / 2));

  return (
    <group>
      {/* Top rail */}
      <mesh position={[cx, cy, cz]} rotation={[0, angle, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, len, 5]} />
        <meshStandardMaterial color={PALETTE.metal} roughness={0.6} metalness={0.7} />
      </mesh>
      {/* Posts */}
      {Array.from({ length: posts }).map((_, i) => {
        const t = posts > 1 ? i / (posts - 1) : 0;
        const px = from[0] + (to[0] - from[0]) * t;
        const pz = from[2] + (to[2] - from[2]) * t;
        const py = from[1] + (to[1] - from[1]) * t;
        return (
          <mesh key={i} position={[px, py + height / 2, pz]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, height, 5]} />
            <meshStandardMaterial color={PALETTE.metal} roughness={0.6} metalness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── WALL PANEL ───────────────────────────────────────────────────────────────

export function WallPanel({ position, w, h, d, color, rotation = [0, 0, 0] }: {
  position: [number, number, number];
  w: number; h: number; d: number;
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.92} metalness={0.05} />
    </mesh>
  );
}

// ─── WINDOW UNIT ──────────────────────────────────────────────────────────────

export function Window({ position, w = 1.2, h = 0.9, emissive = PALETTE.screenBlue, rotation = [0, 0, 0] }: {
  position: [number, number, number];
  w?: number; h?: number;
  emissive?: string;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[w + 0.12, h + 0.12, 0.12]} />
        <meshStandardMaterial color="#2A2A30" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Glass — emissive warm glow from inside */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[w, h, 0.06]} />
        <meshStandardMaterial
          color={emissive}
          emissive={emissive}
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.0}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

// ─── DOOR UNIT ────────────────────────────────────────────────────────────────

export function Door({ position, open = false, rotation = [0, 0, 0] }: {
  position: [number, number, number];
  open?: boolean;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 2.4, 0.14]} />
        <meshStandardMaterial color="#2A2A30" roughness={0.75} metalness={0.3} />
      </mesh>
      {/* Door panel */}
      <mesh position={[open ? 0.6 : 0, 0, 0.02]} rotation={[0, open ? -Math.PI / 2 : 0, 0]} castShadow>
        <boxGeometry args={[1.2, 2.2, 0.06]} />
        <meshStandardMaterial color={PALETTE.timber} roughness={0.85} metalness={0.05} />
      </mesh>
    </group>
  );
}

// ─── TERMINAL SCREEN ──────────────────────────────────────────────────────────

export function TerminalScreen({ position, rotation = [0, 0, 0], color = PALETTE.screenBlue }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  const screenRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame(({ clock }) => {
    if (screenRef.current) {
      // Subtle flicker
      screenRef.current.emissiveIntensity = 0.55 + Math.sin(clock.elapsedTime * 4.3) * 0.04;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Monitor body */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.65, 0.1]} />
        <meshStandardMaterial color="#1E1E24" roughness={0.7} metalness={0.5} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.02, 0.06]}>
        <boxGeometry args={[0.78, 0.54, 0.02]} />
        <meshStandardMaterial
          ref={screenRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.15}
          metalness={0}
        />
      </mesh>
      {/* Stand */}
      <mesh position={[0, -0.44, 0]} castShadow>
        <boxGeometry args={[0.08, 0.22, 0.08]} />
        <meshStandardMaterial color="#1E1E24" roughness={0.75} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.56, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.2]} />
        <meshStandardMaterial color="#1A1A20" roughness={0.8} metalness={0.4} />
      </mesh>
    </group>
  );
}

// ─── SERVER RACK UNIT ─────────────────────────────────────────────────────────

export function ServerRack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.5, 1.8, 0.6]} />
        <meshStandardMaterial color="#1C1C22" roughness={0.7} metalness={0.6} />
      </mesh>
      {/* Server units — stacked thin slabs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[0, -0.65 + i * 0.26, 0.26]}>
          <mesh castShadow>
            <boxGeometry args={[0.44, 0.2, 0.08]} />
            <meshStandardMaterial color="#242430" roughness={0.7} metalness={0.5} />
          </mesh>
          {/* Status LED */}
          <mesh position={[0.18, 0, 0.05]}>
            <boxGeometry args={[0.04, 0.04, 0.02]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#40FF80' : '#FF4040'}
              emissive={i % 3 === 0 ? '#40FF80' : '#FF4040'}
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── ARCADE CABINET ───────────────────────────────────────────────────────────

export function ArcadeCabinet({ position, rotation = 0, screenColor = '#60C0FF', isPlayable = false }: {
  position: [number, number, number];
  rotation?: number;
  screenColor?: string;
  isPlayable?: boolean;
}) {
  const screenRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame(({ clock }) => {
    if (screenRef.current) {
      screenRef.current.emissiveIntensity = 0.7 + Math.sin(clock.elapsedTime * 2.1) * 0.1;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.75, 1.9, 0.65]} />
        <meshStandardMaterial color="#1A1A1E" roughness={0.8} metalness={0.4} />
      </mesh>
      {/* Screen bezel */}
      <mesh position={[0, 0.35, 0.3]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.06]} />
        <meshStandardMaterial color="#101012" roughness={0.8} metalness={0.5} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.35, 0.34]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.52, 0.42, 0.02]} />
        <meshStandardMaterial
          ref={screenRef}
          color={screenColor}
          emissive={screenColor}
          emissiveIntensity={0.7}
          roughness={0.2}
        />
      </mesh>
      {/* Marquee (lit if playable) */}
      {isPlayable && (
        <mesh position={[0, 0.82, 0.3]}>
          <boxGeometry args={[0.5, 0.08, 0.02]} />
          <meshStandardMaterial color={screenColor} emissive={screenColor} emissiveIntensity={0.8} />
        </mesh>
      )}
      {/* Control panel */}
      <mesh position={[0, -0.1, 0.32]} rotation={[-0.7, 0, 0]} castShadow>
        <boxGeometry args={[0.68, 0.4, 0.06]} />
        <meshStandardMaterial color="#141416" roughness={0.85} metalness={0.3} />
      </mesh>
      {/* Joystick */}
      <mesh position={[-0.12, -0.04, 0.44]}>
        <cylinderGeometry args={[0.025, 0.025, 0.12, 6]} />
        <meshStandardMaterial color="#E0E0E0" roughness={0.6} metalness={0.7} />
      </mesh>
      {/* Buttons */}
      {[0.08, 0.18, 0.28].map((x, i) => (
        <mesh key={i} position={[x, -0.08, 0.45]}>
          <cylinderGeometry args={[0.025, 0.025, 0.03, 6]} />
          <meshStandardMaterial
            color={['#FF4060', '#40C0FF', '#40FF80'][i]}
            emissive={['#FF4060', '#40C0FF', '#40FF80'][i]}
            emissiveIntensity={0.4}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      ))}
      {/* Legs */}
      {[[-0.3, 0.3], [-0.3, -0.3], [0.3, 0.3], [0.3, -0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, -1.08, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.14, 5]} />
          <meshStandardMaterial color="#252528" roughness={0.9} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}
