// ─── CHARACTER — BUILDER NPC ──────────────────────────────────────────────────
// Small voxel-style figure. Not realistic. Idle bob + ping animation on approach.

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore, useDiscoveryStore, useUIStore } from '../../state/stores';
import { PALETTE } from '../../lib/constants';

function PingRing({ radius, color }: { radius: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const tRef = useRef(Math.random());

  useFrame((_, delta) => {
    tRef.current = (tRef.current + delta * 0.8) % 1;
    const s = 1 + tRef.current * 2;
    ref.current.scale.set(s, 1, s);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    if (mat) mat.opacity = 1 - tRef.current;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <ringGeometry args={[radius - 0.06, radius, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={1}
        depthWrite={false}
      />
    </mesh>
  );
}

export function BuilderNPC({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Group>(null!);
  const builderMet = useWorldStore((s) => s.builderMet);
  const openPanelId = useWorldStore((s) => s.openPanelId);
  const setBuilderMet = useWorldStore((s) => s.setBuilderMet);
  const setOpenPanelId = useWorldStore((s) => s.setOpenPanelId);
  const addDiscovery = useDiscoveryStore((s) => s.addDiscovery);
  const unlockAchievement = useDiscoveryStore((s) => s.unlockAchievement);
  const pushToast = useUIStore((s) => s.pushToast);

  useEffect(() => {
    if (openPanelId !== 'builder' || builderMet) return;
    setBuilderMet();
    addDiscovery('met_builder');
    unlockAchievement('first-contact');
    pushToast({
      id: 'first-contact',
      title: 'First Contact',
      description: 'Met the Builder.',
      icon: '◈',
    });
  }, [openPanelId, builderMet, setBuilderMet, addDiscovery, unlockAchievement, pushToast]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !bodyRef.current) return;
    const t = clock.elapsedTime;

    // Idle bob
    bodyRef.current.position.y = Math.sin(t * 1.4) * 0.06;

    groupRef.current.rotation.y = 0;
  });

  const handleInteract = () => {
    if (!builderMet) {
      setBuilderMet();
      addDiscovery('met_builder');
      unlockAchievement('first-contact');
      pushToast({
        id: 'first-contact',
        title: 'First Contact',
        description: 'Met the Builder.',
        icon: '◈',
      });
    }
    setOpenPanelId('builder');
  };

  return (
    <group ref={groupRef} position={position} onClick={handleInteract}>
      <group ref={bodyRef}>
        {/* ── Body — voxel/block style ──────────────────────────────── */}
        {/* Legs */}
        <mesh position={[-0.08, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#3A3060" roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh position={[0.08, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#3A3060" roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Torso */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.35, 0.45, 0.22]} />
          <meshStandardMaterial color="#485090" roughness={0.65} metalness={0.15} />
        </mesh>
        {/* Jacket detail stripe */}
        <mesh position={[0, 0.62, 0.12]}>
          <boxGeometry args={[0.1, 0.35, 0.02]} />
          <meshStandardMaterial color={PALETTE.lampAmber} emissive={PALETTE.lampAmber} emissiveIntensity={0.4} roughness={0.5} />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.24, 0.58, 0]} castShadow>
          <boxGeometry args={[0.14, 0.36, 0.15]} />
          <meshStandardMaterial color="#485090" roughness={0.65} metalness={0.15} />
        </mesh>
        <mesh position={[0.24, 0.58, 0]} castShadow>
          <boxGeometry args={[0.14, 0.36, 0.15]} />
          <meshStandardMaterial color="#485090" roughness={0.65} metalness={0.15} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.98, 0]} castShadow>
          <boxGeometry args={[0.28, 0.28, 0.25]} />
          <meshStandardMaterial color="#D0A880" roughness={0.6} metalness={0.05} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.07, 1.0, 0.13]}>
          <boxGeometry args={[0.06, 0.04, 0.01]} />
          <meshStandardMaterial color="#1A1018" roughness={0.5} metalness={0} />
        </mesh>
        <mesh position={[0.07, 1.0, 0.13]}>
          <boxGeometry args={[0.06, 0.04, 0.01]} />
          <meshStandardMaterial color="#1A1018" roughness={0.5} metalness={0} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 1.14, 0]}>
          <boxGeometry args={[0.29, 0.09, 0.26]} />
          <meshStandardMaterial color="#1A1418" roughness={0.85} metalness={0.1} />
        </mesh>
      </group>

      {/* ── Ping rings — visible when unmet ──────────────────────────── */}
      {!builderMet && (
        <>
          <PingRing radius={0.5} color={PALETTE.plazaAccent} />
          <PingRing radius={0.8} color={PALETTE.plazaAccent} />
        </>
      )}
    </group>
  );
}
