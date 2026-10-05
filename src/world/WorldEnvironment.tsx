// ─── WORLD — EXPANDED ARCHIPELAGO ENVIRONMENT ────────────────────────────────
// Inspired by messenger.abeto.co and bruno-simon.com.
// Features: Styled ocean water with gentle wave motion, 6 vast island biomes,
// grand suspension bridges, aerial boost rings, 10 collectible golden coffee beans,
// animated rotating lighthouse, and the Messenger Mail Depot.

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PALETTE, DISTRICTS } from '../lib/constants';
import { useWorldStore } from '../state/stores';
import { soundFx } from '../utils/soundEffects';

// ─── STYLIZED OCEAN WATER ────────────────────────────────────────────────────

function OceanWater() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.elapsedTime;
      meshRef.current.position.y = -1.35 + Math.sin(t * 1.2) * 0.08;
    }
  });

  return (
    <group>
      {/* Primary water surface */}
      <mesh ref={meshRef} position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 260, 32, 32]} />
        <meshStandardMaterial
          color="#0F2438"
          roughness={0.15}
          metalness={0.35}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Deep seabed */}
      <mesh position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[280, 280]} />
        <meshStandardMaterial color="#08101C" roughness={0.98} metalness={0.1} />
      </mesh>
    </group>
  );
}

// ─── PROCEDURAL ISLAND GROUND ────────────────────────────────────────────────

function IslandPlateau({
  cx,
  cz,
  y,
  width,
  depth,
  baseColor = '#2A2D34',
  topColor = PALETTE.groundBase,
  hasShoreline = true,
}: {
  cx: number;
  cz: number;
  y: number;
  width: number;
  depth: number;
  baseColor?: string;
  topColor?: string;
  hasShoreline?: boolean;
}) {
  return (
    <group position={[cx, y, cz]}>
      {/* Top flagstone ground */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <meshStandardMaterial color={topColor} roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Stone foundation / Cliff edge down to water */}
      <mesh position={[0, -1.5, 0]} receiveShadow>
        <boxGeometry args={[width + 0.8, 2.8, depth + 0.8]} />
        <meshStandardMaterial color={baseColor} roughness={0.96} metalness={0.02} />
      </mesh>

      {/* Sandy beach / foam ring around island */}
      {hasShoreline && (
        <mesh position={[0, -1.25, 0]} receiveShadow>
          <boxGeometry args={[width + 3.2, 0.15, depth + 3.2]} />
          <meshStandardMaterial color="#7E725C" roughness={0.95} metalness={0.0} />
        </mesh>
      )}
    </group>
  );
}

// ─── HIGH ARCHED SUSPENSION BRIDGE ───────────────────────────────────────────

function ArchBridge({
  from,
  to,
  width = 3.6,
  archHeight = 1.2,
}: {
  from: [number, number, number];
  to: [number, number, number];
  width?: number;
  archHeight?: number;
}) {
  const [x1, y1, z1] = from;
  const [x2, y2, z2] = to;

  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + archHeight;
  const cz = (z1 + z2) / 2;
  const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
  const angle = Math.atan2(x2 - x1, z2 - z1);
  const pitch = Math.atan2(y2 - y1, length);

  return (
    <group position={[cx, cy - 0.2, cz]} rotation={[pitch, angle, 0]}>
      {/* Bridge Deck */}
      <mesh receiveShadow>
        <boxGeometry args={[width, 0.35, length]} />
        <meshStandardMaterial color="#32353E" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Center cyber stripe */}
      <mesh position={[0, 0.19, 0]}>
        <boxGeometry args={[0.3, 0.02, length - 0.5]} />
        <meshStandardMaterial
          color={PALETTE.screenBlue}
          emissive={PALETTE.screenBlue}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Left & Right Railings */}
      {[-width / 2 + 0.15, width / 2 - 0.15].map((rx, idx) => (
        <group key={idx} position={[rx, 0.55, 0]}>
          {/* Top rail */}
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.06, length, 6]} />
            <meshStandardMaterial color="#606674" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Support posts */}
          {[-length * 0.35, 0, length * 0.35].map((pz, pi) => (
            <mesh key={pi} position={[0, -0.3, pz]}>
              <cylinderGeometry args={[0.05, 0.05, 0.65, 6]} />
              <meshStandardMaterial color="#454A56" metalness={0.6} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Bridge support pillars going down to seabed */}
      {[-length * 0.3, length * 0.3].map((pz, pi) => (
        <mesh key={pi} position={[0, -2.5, pz]} receiveShadow>
          <cylinderGeometry args={[0.4, 0.5, 5, 8]} />
          <meshStandardMaterial color="#26282E" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

// ─── AERIAL BOOST RINGS (SLIPSTREAM HOOPS) ───────────────────────────────────

export interface BoostRingData {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

const BOOST_RINGS: BoostRingData[] = [
  { id: 'ring-1', position: [0, 4.8, -18], rotation: [0, 0, 0], color: '#38BDF8' },
  { id: 'ring-2', position: [0, 6.5, -34], rotation: [0.1, 0, 0], color: '#38BDF8' },
  { id: 'ring-3', position: [18, 6.8, -44], rotation: [0, 0.8, 0], color: '#FACC15' },
  { id: 'ring-4', position: [34, 7.5, -28], rotation: [0, 1.4, 0], color: '#FACC15' },
  { id: 'ring-5', position: [48, 5.0, -16], rotation: [0, 0, 0], color: '#FB923C' },
  { id: 'ring-6', position: [26, 4.2, 0], rotation: [0, Math.PI / 2, 0], color: '#FB923C' },
  { id: 'ring-7', position: [0, 3.5, 26], rotation: [0, 0, 0], color: '#A78BFA' },
  { id: 'ring-8', position: [-26, 3.8, 0], rotation: [0, Math.PI / 2, 0], color: '#F472B6' },
  { id: 'ring-9', position: [-44, 4.5, -16], rotation: [0, 0.6, 0], color: '#F472B6' },
];

function BoostRing({ data }: { data: BoostRingData }) {
  const ringRef = useRef<THREE.Group>(null!);
  const dronePos = useWorldStore((s) => s.dronePosition);
  const ringsPassed = useWorldStore((s) => s.ringsPassed);
  const passRing = useWorldStore((s) => s.passRing);
  const isPassed = ringsPassed.includes(data.id);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.elapsedTime;
      // Gentle floating wobble
      ringRef.current.position.y = data.position[1] + Math.sin(t * 2.5 + data.position[0]) * 0.15;
    }

    // Check collision / fly-through
    const dx = dronePos[0] - data.position[0];
    const dy = dronePos[1] - data.position[1];
    const dz = dronePos[2] - data.position[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < 2.5 && !isPassed) {
      passRing(data.id);
      soundFx.boostRing();
    }
  });

  return (
    <group ref={ringRef} position={data.position} rotation={data.rotation}>
      {/* Outer Torus Ring */}
      <mesh castShadow>
        <torusGeometry args={[1.5, 0.08, 12, 32]} />
        <meshStandardMaterial
          color={isPassed ? '#4ADE80' : data.color}
          emissive={isPassed ? '#4ADE80' : data.color}
          emissiveIntensity={isPassed ? 1.6 : 1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Translucent Energy Field inside ring */}
      <mesh>
        <circleGeometry args={[1.4, 24]} />
        <meshBasicMaterial
          color={isPassed ? '#4ADE80' : data.color}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ring marker chevron lights */}
      {[-1.5, 1.5].map((lx, i) => (
        <mesh key={i} position={[lx, 0, 0]}>
          <boxGeometry args={[0.15, 0.3, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
}

// ─── 10 COLLECTIBLE GOLDEN COFFEE BEANS ──────────────────────────────────────

export interface CoffeeBeanData {
  id: string;
  name: string;
  locationLabel: string;
  position: [number, number, number];
}

export const COFFEE_BEANS: CoffeeBeanData[] = [
  { id: 'bean-1', name: 'Plaza Espresso Bean', locationLabel: 'Central Harbour Fountain', position: [0, 1.4, 0] },
  { id: 'bean-2', name: 'Quantum Roast Bean', locationLabel: 'Behind AI Quantum Observatory', position: [0, 6.2, -56] },
  { id: 'bean-3', name: 'Neural Latency Bean', locationLabel: 'AI Lab Server Monoliths', position: [-8.5, 5.2, -52] },
  { id: 'bean-4', name: 'Cargo Crane Apex Bean', locationLabel: 'Tip of the Port Cargo Crane', position: [56, 11.5, -6] },
  { id: 'bean-5', name: 'Dockside Mocha Bean', locationLabel: 'Project Harbor Dry Dock', position: [48, 2.2, 10] },
  { id: 'bean-6', name: 'Arcade Jackpot Bean', locationLabel: 'Behind Arcade Bowling Pins', position: [-54, 1.8, 0] },
  { id: 'bean-7', name: 'High-Score Turbo Bean', locationLabel: 'Neon Arcade Launch Ramp', position: [-40, 3.2, 0] },
  { id: 'bean-8', name: 'Ancient Glyph Bean', locationLabel: 'Sunken Oasis Reflection Pool', position: [0, -0.6, 52] },
  { id: 'bean-9', name: 'Beacon Keeper Bean', locationLabel: 'Lighthouse Observation Balcony', position: [42, 14.2, -42] },
  { id: 'bean-10', name: 'Smuggler Islet Bean', locationLabel: 'Secret Offshore Rock Pinnacle', position: [-36, 1.4, -36] },
];

function CollectibleCoffeeBean({ data }: { data: CoffeeBeanData }) {
  const beanRef = useRef<THREE.Group>(null!);
  const dronePos = useWorldStore((s) => s.dronePosition);
  const collectedBeans = useWorldStore((s) => s.collectedBeans);
  const collectBean = useWorldStore((s) => s.collectBean);
  const isCollected = collectedBeans.includes(data.id);

  useFrame(({ clock }) => {
    if (!beanRef.current || isCollected) return;

    const t = clock.elapsedTime;
    // Rotation & float bob
    beanRef.current.rotation.y = t * 2.2;
    beanRef.current.position.y = data.position[1] + Math.sin(t * 3.0 + data.position[0]) * 0.12;

    // Proximity check for collection
    const dx = dronePos[0] - data.position[0];
    const dy = dronePos[1] - beanRef.current.position.y;
    const dz = dronePos[2] - data.position[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < 2.0) {
      collectBean(data.id);
      soundFx.collect();
    }
  });

  if (isCollected) return null;

  return (
    <group ref={beanRef} position={data.position}>
      {/* 3D Stylized Golden Coffee Bean */}
      <mesh castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#D97706"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      {/* Center bean groove */}
      <mesh position={[0, 0, 0.28]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.45, 0.08]} />
        <meshStandardMaterial color="#78350F" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Floating Sparkle / Halo Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.48, 24]} />
        <meshBasicMaterial color="#FDE047" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Soft golden point light */}
      <pointLight color="#FDE047" intensity={3} distance={4} decay={2} />
    </group>
  );
}

// ─── ANIMATED ROTATING LIGHTHOUSE ────────────────────────────────────────────

function CoastalLighthouse({ position = [42, 5.5, -42] }: { position?: [number, number, number] }) {
  const beamRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (beamRef.current) {
      beamRef.current.rotation.y = clock.elapsedTime * 0.6; // rotating beacon
    }
  });

  return (
    <group position={position}>
      {/* Base Foundation / Rock Promontory */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[4.5, 6.0, 3, 10]} />
        <meshStandardMaterial color="#30343C" roughness={0.95} />
      </mesh>

      {/* Tower Shaft (Striped White & Crimson) */}
      <mesh position={[0, 5.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.8, 7.5, 12]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Red accent band */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <cylinderGeometry args={[2.2, 2.4, 1.8, 12]} />
        <meshStandardMaterial color="#DC2626" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Observation Balcony Railing */}
      <mesh position={[0, 9.0, 0]} castShadow>
        <cylinderGeometry args={[2.8, 2.8, 0.4, 16]} />
        <meshStandardMaterial color="#1E293B" roughness={0.6} metalness={0.6} />
      </mesh>
      <mesh position={[0, 9.6, 0]}>
        <torusGeometry args={[2.7, 0.06, 6, 24]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Lantern Room Glass Enclosure */}
      <mesh position={[0, 10.4, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 1.8, 12]} />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Lighthouse Roof Cap & Finial */}
      <mesh position={[0, 11.8, 0]} castShadow>
        <coneGeometry args={[2.2, 1.4, 12]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0, 12.8, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#FDE047" emissive="#FDE047" emissiveIntensity={1.5} />
      </mesh>

      {/* ── Rotating Sweeping Spotlight Beam ── */}
      <group ref={beamRef} position={[0, 10.4, 0]}>
        {/* Core intense lamp bulb */}
        <mesh>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshBasicMaterial color="#FFFBEB" />
        </mesh>
        <pointLight color="#FEF08A" intensity={12} distance={20} decay={1.5} />

        {/* Sweeping Long Distance Spot Light */}
        <spotLight
          position={[0, 0, 0]}
          target-position={[0, -2, 60]}
          color="#FEF08A"
          intensity={45}
          distance={120}
          angle={0.38}
          penumbra={0.6}
        />

        {/* Volumetric-style visible light cone geometry */}
        <mesh position={[0, -1.2, 28]} rotation={[Math.PI / 2 - 0.05, 0, 0]}>
          <cylinderGeometry args={[6.5, 0.4, 56, 16, 1, true]} />
          <meshBasicMaterial color="#FEF08A" transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ── Keeper Sandy NPC (Lighthouse Watchman) ── */}
      <group position={[-3.2, 0.5, 2.8]}>
        {/* Navy Pea Coat / Body */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.32, 1.4, 8]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
        </mesh>
        {/* Yellow Sou'wester Fisherman Hat */}
        <mesh position={[0, 1.72, 0]}>
          <coneGeometry args={[0.26, 0.22, 12]} />
          <meshStandardMaterial color="#EAB308" roughness={0.4} />
        </mesh>
        {/* Held Brass Sea Lantern */}
        <group position={[0.3, 0.7, 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.22, 8]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.2} />
          </mesh>
          <pointLight color="#FDE047" intensity={2} distance={4} />
        </group>
        {/* Hovering '!' indicator */}
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
}

// ─── MESSENGER MAIL DEPOT / POSTBOX ──────────────────────────────────────────

function MessengerPostOffice({ position = [3.2, 0, 2.8] }: { position?: [number, number, number] }) {
  const letterRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (letterRef.current) {
      const t = clock.elapsedTime;
      letterRef.current.position.y = 1.35 + Math.sin(t * 3.0) * 0.08;
      letterRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Mailbox Pedestal */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.9, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.6} />
      </mesh>

      {/* Iconic Red Messenger Mailbox */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.7, 0.55]} />
        <meshStandardMaterial color="#DC2626" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Curved dome roof */}
      <mesh position={[0, 1.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.55, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Brass mail slot */}
      <mesh position={[0, 1.05, 0.29]}>
        <boxGeometry args={[0.3, 0.06, 0.02]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Abeto Messenger Bird / Post Emblem */}
      <mesh position={[0, 0.85, 0.29]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#FEF08A" emissive="#FBBF24" emissiveIntensity={0.6} />
      </mesh>

      {/* Animated Floating Parcel / Letter Icon */}
      <group ref={letterRef}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.24, 0.26]} />
          <meshStandardMaterial color="#FDE047" emissive="#F59E0B" emissiveIntensity={0.8} />
        </mesh>
        {/* Package tie string */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.38, 0.03, 0.04]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <pointLight color="#FDE047" intensity={2} distance={3} />
      </group>
    </group>
  );
}

// ─── MASTER WORLD ENVIRONMENT ────────────────────────────────────────────────

export function WorldEnvironment() {
  return (
    <group>
      {/* ── Dynamic Stylized Water ── */}
      <OceanWater />

      {/* ── ARCHIPELAGO ISLANDS ── */}

      {/* 1. Central Harbour & Kaufee Town (Origin [0, 0]) */}
      <IslandPlateau
        cx={DISTRICTS.plaza.center[0]}
        cz={DISTRICTS.plaza.center[1]}
        y={DISTRICTS.plaza.elevation}
        width={34}
        depth={34}
        topColor="#383A42"
        baseColor="#22242B"
      />

      {/* 2. AI Silicon Valley (North [0, -48], Elevated +3.5) */}
      <IslandPlateau
        cx={DISTRICTS.ailab.center[0]}
        cz={DISTRICTS.ailab.center[1]}
        y={DISTRICTS.ailab.elevation}
        width={38}
        depth={34}
        topColor="#252936"
        baseColor="#181B24"
      />

      {/* 3. Cargo Harbor & Project Bay (East [48, 0], Rise +1.0) */}
      <IslandPlateau
        cx={DISTRICTS.projectcity.center[0]}
        cz={DISTRICTS.projectcity.center[1]}
        y={DISTRICTS.projectcity.elevation}
        width={36}
        depth={38}
        topColor="#2D3038"
        baseColor="#1F2128"
      />

      {/* 4. Neon Arcade & Physics Funland (West [-48, 0], Rise +0.5) */}
      <IslandPlateau
        cx={DISTRICTS.arcade.center[0]}
        cz={DISTRICTS.arcade.center[1]}
        y={DISTRICTS.arcade.elevation}
        width={36}
        depth={36}
        topColor="#1F2028"
        baseColor="#16171E"
      />

      {/* 5. Ancient Oasis & Sunken Sanctuary (South [0, 48], Sunken -2.0) */}
      <IslandPlateau
        cx={DISTRICTS.archive.center[0]}
        cz={DISTRICTS.archive.center[1]}
        y={DISTRICTS.archive.elevation}
        width={36}
        depth={36}
        topColor="#44413A"
        baseColor="#2A2822"
      />

      {/* 6. Coastal Beacon & Sea Cliff (North-East [42, -42], High Bluff +5.5) */}
      <IslandPlateau
        cx={DISTRICTS.lighthouse.center[0]}
        cz={DISTRICTS.lighthouse.center[1]}
        y={DISTRICTS.lighthouse.elevation}
        width={26}
        depth={26}
        topColor="#3A3E48"
        baseColor="#232730"
      />

      {/* 7. Secret Offshore Rock Pinnacle (North-West [-36, -36]) */}
      <IslandPlateau cx={-36} cz={-36} y={0.2} width={12} depth={12} topColor="#353740" baseColor="#1F2128" />

      {/* ── GRAND SUSPENSION & ARCH BRIDGES ── */}

      {/* North Bridge: Plaza → AI Silicon Valley */}
      <ArchBridge from={[0, 0.2, -16]} to={[0, 3.5, -32]} width={4.2} archHeight={1.4} />

      {/* East Bridge: Plaza → Cargo Harbor */}
      <ArchBridge from={[16, 0.2, 0]} to={[32, 1.0, 0]} width={4.2} archHeight={0.8} />

      {/* West Bridge: Plaza → Neon Arcade */}
      <ArchBridge from={[-16, 0.2, 0]} to={[-32, 0.5, 0]} width={4.2} archHeight={0.8} />

      {/* South Aqueduct Ramp: Plaza → Ancient Oasis */}
      <ArchBridge from={[0, 0.2, 16]} to={[0, -2.0, 32]} width={4.2} archHeight={-0.4} />

      {/* Cliff Suspension Trail: AI Lab → Coastal Beacon */}
      <ArchBridge from={[16, 3.5, -48]} to={[30, 5.5, -42]} width={3.0} archHeight={1.0} />

      {/* ── COASTAL LIGHTHOUSE & ROTATING BEACON ── */}
      <CoastalLighthouse />

      {/* ── MESSENGER CENTRAL MAIL DEPOT ── */}
      <MessengerPostOffice />

      {/* ── AERIAL BOOST RINGS (SKY HIGHWAY) ── */}
      {BOOST_RINGS.map((ring) => (
        <BoostRing key={ring.id} data={ring} />
      ))}

      {/* ── 10 COLLECTIBLE GOLDEN COFFEE BEANS ── */}
      {COFFEE_BEANS.map((bean) => (
        <CollectibleCoffeeBean key={bean.id} data={bean} />
      ))}
    </group>
  );
}
