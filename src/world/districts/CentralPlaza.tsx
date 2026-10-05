// ─── DISTRICT — CENTRAL HARBOUR & KAUFEE TOWN ──────────────────────────────────
// The bustling town square, orientation hub, fountain, docks, and mail dispatch.

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  CourtyardTree, LampPost, Bench,
  SignPost, WallShrub, GroundCover, WallPanel
} from '../EnvironmentKit';
import { PALETTE } from '../../lib/constants';

function CentralFountain() {
  const waterRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.rotation.z = clock.elapsedTime * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Basin Octagon */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 3.2, 0.7, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Inner Water Surface */}
      <mesh ref={waterRef} position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 16]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Center Pillar */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 1.2, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Upper Bowl */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[1.3, 0.6, 0.35, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Water spout / Spire */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial
          color="#E0F2FE"
          emissive="#38BDF8"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Warm ambient water glow */}
      <pointLight position={[0, 1.2, 0]} color="#38BDF8" intensity={4} distance={8} />
    </group>
  );
}

// ─── HARBOUR PIER & DOCK SECTION ─────────────────────────────────────────────

function HarbourPier() {
  return (
    <group position={[12, -0.2, 10]}>
      {/* Wooden Boardwalk Pier */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[4.5, 0.3, 8]} />
        <meshStandardMaterial color="#5C4738" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Mooring Bollards */}
      {[-1.8, 1.8].map((bx, idx) => (
        <group key={idx} position={[bx, 0.3, 3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.14, 0.5, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Cozy docked rowboat */}
      <group position={[2.8, -0.6, 1.5]} rotation={[0, 0.2, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.6, 2.8]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
        {/* Boat lantern */}
        <pointLight position={[0, 0.6, 1]} color="#FDE047" intensity={2} distance={5} />
      </group>
    </group>
  );
}

export function CentralPlaza() {
  return (
    <group>
      {/* ── THE CENTRAL FOUNTAIN ── */}
      <CentralFountain />

      {/* ── HARBOUR PIER & WOODEN BOARDWALK ── */}
      <HarbourPier />

      {/* ── LANDMARK COURTYARD TREES ── */}
      <CourtyardTree position={[-6.5, 0, -5.5]} />
      <CourtyardTree position={[6.5, 0, -5.5]} />
      <CourtyardTree position={[-6.5, 0, 5.5]} />

      <GroundCover position={[-6.5, 0.01, -5.5]} />
      <GroundCover position={[6.5, 0.01, -5.5]} />
      <GroundCover position={[-6.5, 0.01, 5.5]} />

      {/* ── LAMP POSTS (Warm Abeto Street Lighting) ── */}
      <LampPost position={[-8.5, 0, 0]} />
      <LampPost position={[8.5, 0, 0]} />
      <LampPost position={[0, 0, 8.5]} />
      <LampPost position={[0, 0, -8.5]} />
      <LampPost position={[-8.5, 0, -8.5]} />
      <LampPost position={[8.5, 0, 8.5]} />

      {/* ── DIRECTIONAL SIGNPOSTS ── */}
      <SignPost position={[4.5, 0, 4.5]} />
      <SignPost position={[-4.5, 0, -4.5]} />

      {/* ── TOWN BENCHES ── */}
      <Bench position={[-4.0, 0, -1.5]} rotation={Math.PI / 2} />
      <Bench position={[4.0, 0, -1.5]} rotation={-Math.PI / 2} />
      <Bench position={[-1.5, 0, -6.5]} rotation={0} />

      {/* ── LOW STONE BORDERS & FLOWER POTS ── */}
      <WallPanel position={[-11, 0.4, 7]} w={3.5} h={0.8} d={0.35} color={PALETTE.concrete} />
      <WallShrub position={[-10, 0.4, 7.5]} />
      <WallPanel position={[11, 0.4, -7]} w={0.35} h={0.8} d={3.5} color={PALETTE.concrete} />
      <WallShrub position={[11.5, 0.4, -6.5]} />
    </group>
  );
}
