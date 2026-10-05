// ─── WORLD — ROOT SCENE ───────────────────────────────────────────────────────
// Assembles all districts, lighting, player, and NPCs.

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import { useWorldStore } from '../state/stores';
import { PALETTE, WORLD, DISTRICTS } from '../lib/constants';
import { WorldInteractions } from './WorldInteractions';
import { WorldEnvironment } from './WorldEnvironment';
import { WorldLighting } from './WorldLighting';
import { WorldBounds } from './WorldBounds';
import { CentralPlaza } from './districts/CentralPlaza';
import { AILab } from './districts/AILab';
import { ProjectCity } from './districts/ProjectCity';
import { Arcade } from './districts/Arcade';
import { Archive } from './districts/Archive';
import { DroneController } from './player/Drone';
import { BuilderNPC } from './characters/BuilderNPC';

// ─── World Scene (inside Canvas) ─────────────────────────────────────────────
// Lightweight throttled district detection — runs every 15 frames to save CPU.

let frameCount = 0;
function DistrictWatcher() {
  const dronePos = useWorldStore((s) => s.dronePosition);
  const setActiveDistrict = useWorldStore((s) => s.setActiveDistrict);

  useFrame(() => {
    frameCount++;
    if (frameCount % 15 !== 0) return;

    let nearest = 'plaza' as keyof typeof DISTRICTS;
    let minDist = Infinity;
    for (const [id, d] of Object.entries(DISTRICTS)) {
      const dx = dronePos[0] - d.center[0];
      const dz = dronePos[2] - d.center[1];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) {
        minDist = dist;
        nearest = id as keyof typeof DISTRICTS;
      }
    }
    setActiveDistrict(nearest);
  });

  return null;
}

// ─── World Scene (inside Canvas) ─────────────────────────────────────────────

function WorldScene() {
  return (
    <>
      {/* Atmosphere */}
      <fog attach="fog" args={[PALETTE.fogColor, WORLD.fogNear, WORLD.fogFar]} />

      {/* Lighting */}
      <WorldLighting />

      <Physics gravity={[0, -9.81, 0]}>
        {/* Solid, dedicated physical collision system */}
        <WorldBounds />

        {/* Visual districts and geometry */}
        <WorldEnvironment />
        <CentralPlaza />
        <AILab />
        <ProjectCity />
        <Arcade />
        <Archive />

        {/* Characters */}
        <BuilderNPC position={[-1.5, 0, -3.5]} />
      <WorldInteractions />

        {/* Player Drone with physics */}
        <DroneController />
      </Physics>

      {/* District detection */}
      <DistrictWatcher />
    </>
  );
}

// ─── World (Canvas wrapper) ───────────────────────────────────────────────────

export function World() {
  return (
    <Canvas
      camera={{
        fov: 65,
        near: 0.1,
        far: 320,
        position: [0, 10, 14],
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.25,
      }}
      shadows={true}
      style={{ background: PALETTE.skyNight }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
      }}
    >
      <Suspense fallback={null}>
        <WorldScene />
      </Suspense>
    </Canvas>
  );
}
