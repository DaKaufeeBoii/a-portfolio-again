// ─── WORLD — LIGHTING ─────────────────────────────────────────────────────────
// Authored per the Art Direction document.
// Two-temperature system: warm amber (human/work) + cool blue-white (data/screens)
// NO global shadow maps — only drone shadow from single directional.

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '../lib/constants';

export function WorldLighting() {
  const moonRef = useRef<THREE.DirectionalLight>(null!);

  // Very subtle atmospheric drift
  useFrame(({ clock }) => {
    if (moonRef.current) {
      const t = clock.elapsedTime * 0.05;
      moonRef.current.position.x = Math.sin(t) * 60;
      moonRef.current.position.z = Math.cos(t) * 60;
    }
  });

  return (
    <>
      {/* ── Ambient — rich cool twilight fill for readable geometry ──────── */}
      <ambientLight color="#384260" intensity={1.6} />

      {/* ── Moonlight / sky directional — crisp, luminous, casting soft shadows */}
      <directionalLight
        ref={moonRef}
        color="#C8DCFF"
        intensity={2.2}
        position={[35, 55, 25]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />

      {/* ── Hemisphere — sky cool vs ground bounce warmth ────────────────── */}
      <hemisphereLight
        args={['#5A72A0', '#4A3D2E', 0.9]}
      />

      {/* ─── CENTRAL PLAZA ────────────────────────────────────────────────── */}
      {/* Primary courtyard overhead lamp */}
      <pointLight
        color={PALETTE.lampAmber}
        intensity={55}
        distance={28}
        decay={1.6}
        position={[0, 5.5, 0]}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-radius={4}
        shadow-bias={-0.001}
      />
      {/* Secondary fill — softer spread */}
      <pointLight
        color="#F0D080"
        intensity={28}
        distance={28}
        decay={1.6}
        position={[3, 3.5, -3]}
        castShadow={false}
      />
      {/* Path lamp posts contribution */}
      <pointLight color={PALETTE.lampSecondary} intensity={18} distance={14} decay={1.6} position={[-6, 2.8, 0]} />
      <pointLight color={PALETTE.lampSecondary} intensity={18} distance={14} decay={1.6} position={[6, 2.8, 0]} />
      <pointLight color={PALETTE.lampSecondary} intensity={18} distance={14} decay={1.6} position={[0, 2.8, 6]} />
      <pointLight color={PALETTE.lampSecondary} intensity={18} distance={14} decay={1.6} position={[0, 2.8, -6]} />

      {/* ─── AI LAB ───────────────────────────────────────────────────────── */}
      {/* Cool work light overhead */}
      <pointLight
        color={PALETTE.screenBlue}
        intensity={65}
        distance={38}
        decay={1.6}
        position={[0, 9, -48]}
        castShadow={false}
      />
      {/* Terminal screen glow fill */}
      <pointLight color="#B0E0FF" intensity={32} distance={22} decay={1.6} position={[-4, 4.5, -48]} />
      <pointLight color="#9CD0FF" intensity={30} distance={22} decay={1.6} position={[4, 4.5, -48]} />
      {/* Warm work lamp — human presence */}
      <pointLight color="#F4D078" intensity={35} distance={24} decay={1.6} position={[0, 5.2, -44]} />

      {/* ─── PROJECT CITY ─────────────────────────────────────────────────── */}
      {/* String lights overhead */}
      <pointLight color="#FFC070" intensity={38} distance={28} decay={1.6} position={[48, 6.2, -4]} />
      <pointLight color="#FFD080" intensity={38} distance={28} decay={1.6} position={[48, 6.2, 0]} />
      <pointLight color="#FFC065" intensity={38} distance={28} decay={1.6} position={[48, 6.2, 5]} />
      {/* Studio window spill */}
      <pointLight color={PALETTE.projectCityAccent} intensity={36} distance={24} decay={1.6} position={[52, 4.5, -4]} />
      <pointLight color={PALETTE.screenBlue} intensity={30} distance={22} decay={1.6} position={[44, 4.5, 2]} />

      {/* ─── ARCADE ───────────────────────────────────────────────────────── */}
      <pointLight
        color="#FFE0A0"
        intensity={50}
        distance={30}
        decay={1.6}
        position={[-48, 5.2, 0]}
        castShadow={false}
      />
      <pointLight color="#FF8868" intensity={32} distance={20} decay={1.6} position={[-52, 3.5, -4]} />
      <pointLight color="#70CEFF" intensity={30} distance={20} decay={1.6} position={[-50, 3.5, 0]} />
      <pointLight color="#90FF90" intensity={26} distance={18} decay={1.6} position={[-44, 3.5, 4]} />

      {/* ─── ARCHIVE ──────────────────────────────────────────────────────── */}
      <pointLight color={PALETTE.archiveAccent} intensity={35} distance={24} decay={1.6} position={[-4, 0.2, 48]} />
      <pointLight color={PALETTE.archiveAccent} intensity={32} distance={22} decay={1.6} position={[4, 0.2, 48]} />
      <pointLight color="#D4A468" intensity={28} distance={26} decay={1.6} position={[0, 1.5, 46]} />
      <pointLight color="#80A0D0" intensity={24} distance={30} decay={1.6} position={[0, 3.5, 48]} />

      {/* ─── COASTAL LIGHTHOUSE ───────────────────────────────────────────── */}
      <pointLight color="#FEF08A" intensity={65} distance={48} decay={1.5} position={[42, 12, -42]} />
    </>
  );
}
