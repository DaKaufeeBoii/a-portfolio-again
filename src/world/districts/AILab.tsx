// ─── DISTRICT — AI LAB ────────────────────────────────────────────────────────
// Research compound. Elevated +2.5. Gate, workstations, RAG pipeline, cables.

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  WallPanel, TerminalScreen, ServerRack, Cable,
  LampPost, WallShrub, Window,
} from '../EnvironmentKit';
import { PALETTE } from '../../lib/constants';

// ─── Data flow particle (animated along cable path) ──────────────────────────

function DataFlowParticle({ from, to, speed = 1.2, color = PALETTE.dataGreen }: {
  from: [number, number, number];
  to: [number, number, number];
  speed?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const t = useRef(Math.random());

  useFrame((_, delta) => {
    t.current = (t.current + delta * speed) % 1;
    ref.current.position.lerpVectors(
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
      t.current
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 4, 4]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.0} />
    </mesh>
  );
}

// ─── RAG Pipeline station ─────────────────────────────────────────────────────

function RAGStation({ basePos }: { basePos: [number, number, number] }) {
  const [bx, by, bz] = basePos;

  // Station positions (spatially representing the pipeline)
  const docShelf: [number, number, number] = [bx - 3, by, bz];
  const retrievalUnit: [number, number, number] = [bx - 1, by, bz];
  const contextAssembler: [number, number, number] = [bx + 1, by, bz];
  const modelTerminal: [number, number, number] = [bx + 3, by, bz];

  return (
    <group>
      {/* === Document Shelf === */}
      <group position={docShelf}>
        {/* Shelf unit */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.0, 1.6, 0.4]} />
          <meshStandardMaterial color="#252528" roughness={0.8} metalness={0.3} />
        </mesh>
        {/* Document "binders" on shelves */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 3 }).map((_, col) => (
            <mesh key={`${row}-${col}`}
              position={[-0.3 + col * 0.3, -0.5 + row * 0.35, 0.22]}
              castShadow>
              <boxGeometry args={[0.22, 0.3, 0.07]} />
              <meshStandardMaterial
                color={['#5080A0', '#A06050', '#508060', '#A09040'][row]}
                roughness={0.85}
                metalness={0.05}
              />
            </mesh>
          ))
        )}
        {/* Label: DOCUMENTS */}
        <mesh position={[0, 0.88, 0.22]} castShadow>
          <boxGeometry args={[0.85, 0.15, 0.03]} />
          <meshStandardMaterial color={PALETTE.aiLabAccent} emissive={PALETTE.aiLabAccent} emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* === Retrieval Unit (humming machine) === */}
      <group position={retrievalUnit}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.65, 0.9, 0.5]} />
          <meshStandardMaterial color="#1E1E24" roughness={0.7} metalness={0.5} />
        </mesh>
        {/* Indicator lights */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.25, 0.2 + i * 0.2, 0.26]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color={PALETTE.dataGreen} emissive={PALETTE.dataGreen} emissiveIntensity={1.5} />
          </mesh>
        ))}
        {/* Fan vent lines */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.18 + i * 0.1, -0.1, 0.26]}>
            <boxGeometry args={[0.04, 0.3, 0.02]} />
            <meshStandardMaterial color="#282830" roughness={0.8} metalness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, -0.58, 0]} castShadow>
          <boxGeometry args={[0.8, 0.15, 0.6]} />
          <meshStandardMaterial color="#202026" roughness={0.8} metalness={0.5} />
        </mesh>
      </group>

      {/* === Context Assembler === */}
      <TerminalScreen position={[...contextAssembler, 0] as unknown as [number,number,number]}
        rotation={[0, 0, 0]}
        color={PALETTE.dataGreen}
      />

      {/* === Model Terminal === */}
      <group position={modelTerminal}>
        {/* Larger terminal */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.8, 0.14]} />
          <meshStandardMaterial color="#181820" roughness={0.75} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.95, 0.65, 0.03]} />
          <meshStandardMaterial
            color={PALETTE.screenBlue}
            emissive={PALETTE.screenBlue}
            emissiveIntensity={0.6}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* === Cables between stations === */}
      <Cable from={[bx - 2.5, by + 0.4, bz]} to={[bx - 1.3, by + 0.4, bz]} color="#303038" />
      <Cable from={[bx - 0.7, by + 0.4, bz]} to={[bx + 0.7, by + 0.4, bz]} color="#303038" />
      <Cable from={[bx + 1.4, by + 0.4, bz]} to={[bx + 2.5, by + 0.4, bz]} color="#303038" />

      {/* === Data flow particles === */}
      {Array.from({ length: 3 }).map((_, i) => (
        <DataFlowParticle
          key={`d-doc-ret-${i}`}
          from={[bx - 2.5, by + 0.42, bz]}
          to={[bx - 1.3, by + 0.42, bz]}
          speed={0.8 + i * 0.3}
        />
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <DataFlowParticle
          key={`d-ret-ctx-${i}`}
          from={[bx - 0.7, by + 0.42, bz]}
          to={[bx + 0.7, by + 0.42, bz]}
          speed={0.9 + i * 0.25}
          color={PALETTE.screenBlue}
        />
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <DataFlowParticle
          key={`d-ctx-mdl-${i}`}
          from={[bx + 1.4, by + 0.42, bz]}
          to={[bx + 2.5, by + 0.42, bz]}
          speed={1.0 + i * 0.2}
          color={PALETTE.lampAmber}
        />
      ))}
    </group>
  );
}

// ─── AI Lab Gate ──────────────────────────────────────────────────────────────

function CompoundGate({ position, open }: {
  position: [number, number, number];
  open?: boolean;
}) {
  return (
    <group position={position}>
      {/* Gate posts */}
      <mesh position={[-1.8, 1.2, 0]} castShadow>
        <boxGeometry args={[0.25, 2.4, 0.25]} />
        <meshStandardMaterial color={PALETTE.concrete} roughness={0.92} metalness={0.08} />
      </mesh>
      <mesh position={[1.8, 1.2, 0]} castShadow>
        <boxGeometry args={[0.25, 2.4, 0.25]} />
        <meshStandardMaterial color={PALETTE.concrete} roughness={0.92} metalness={0.08} />
      </mesh>
      {/* Top bar */}
      <mesh position={[0, 2.45, 0]} castShadow>
        <boxGeometry args={[3.85, 0.2, 0.25]} />
        <meshStandardMaterial color={PALETTE.concrete} roughness={0.92} metalness={0.08} />
      </mesh>
      {/* Warning light */}
      <mesh position={[0, 2.65, 0]}>
        <boxGeometry args={[0.25, 0.15, 0.25]} />
        <meshStandardMaterial
          color="#FF6030"
          emissive="#FF6030"
          emissiveIntensity={open ? 0.2 : 1.2}
          roughness={0.4}
        />
      </mesh>
      {/* Chain link fill (visual only — thin slats) */}
      {!open && Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[(i - 3.5) * 0.4, 1.2, 0]}>
          <boxGeometry args={[0.05, 2.2, 0.04]} />
          <meshStandardMaterial color="#505060" roughness={0.7} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ─── AILab District ───────────────────────────────────────────────────────────

export function AILab() {
  const Y = 2.5; // base elevation inside district group

  return (
    <group position={[0, 1.0, -25]}>
      {/* ── Compound walls ─────────────────────────────────────────── */}
      {/* Back wall */}
      <WallPanel position={[0, Y + 1.5, -32]} w={20} h={3} d={0.4} color={PALETTE.concrete} />
      {/* Side walls */}
      <WallPanel position={[-10, Y + 1.5, -27]} w={0.4} h={3} d={10} color={PALETTE.concrete} />
      <WallPanel position={[10, Y + 1.5, -27]} w={0.4} h={3} d={10} color={PALETTE.concrete} />

      {/* ── Gate (entry point) ─────────────────────────────────────── */}
      <CompoundGate position={[0, 0.85, -12.5]} open />

      {/* ── Overhead strip light ────────────────────────────────────── */}
      {[-4, 0, 4].map((x, i) => (
        <group key={i}>
          <mesh position={[x, Y + 3.8, -22]}>
            <boxGeometry args={[1.2, 0.06, 0.15]} />
            <meshStandardMaterial
              color={PALETTE.screenBlue}
              emissive={PALETTE.screenBlue}
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* ── RAG Pipeline (the central exhibit) ─────────────────────── */}
      <RAGStation basePos={[0, Y + 0.9, -23]} />

      {/* ── Workstation cluster ─────────────────────────────────────── */}
      {/* Desk */}
      <mesh position={[-6, Y + 0.48, -18]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.08, 0.9]} />
        <meshStandardMaterial color={PALETTE.timber} roughness={0.88} metalness={0.04} />
      </mesh>
      <TerminalScreen position={[-6, Y + 1.1, -18.2]} rotation={[0, 0, 0]} />
      {/* Coffee mug */}
      <mesh position={[-5.2, Y + 0.6, -17.7]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 7]} />
        <meshStandardMaterial color="#5A3020" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Desk lamp */}
      <LampPost position={[-7.2, Y, -18]} />

      {/* ── Dr. Tensor NPC (Chief AI Researcher) ──────────────────── */}
      <group position={[0, Y + 0.1, -19]}>
        {/* Robe / Lab Coat */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.32, 1.4, 8]} />
          <meshStandardMaterial color="#0284C7" roughness={0.5} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
        </mesh>
        {/* Holographic Visor */}
        <mesh position={[0, 1.58, 0.14]}>
          <boxGeometry args={[0.22, 0.08, 0.06]} />
          <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1.4} />
        </mesh>
        {/* Hovering '!' Indicator */}
        <mesh position={[0, 2.05, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={1.6} />
        </mesh>
      </group>

      {/* ── Server rack in corner ───────────────────────────────────── */}
      <ServerRack position={[7, Y + 0.9, -30]} />
      <ServerRack position={[8, Y + 0.9, -30]} />

      {/* ── Overhead cable runs ─────────────────────────────────────── */}
      <Cable from={[-6, Y + 3.5, -18]} to={[0, Y + 3.5, -22]} sag={0.2} color="#282830" />
      <Cable from={[0, Y + 3.5, -22]} to={[7, Y + 3.5, -28]} sag={0.25} color="#282830" />

      {/* ── Minimal vegetation at compound corners ──────────────────── */}
      <WallShrub position={[-9, Y, -31]} scale={0.7} />
      <WallShrub position={[9, Y, -31]} scale={0.6} />

      {/* ── Windows in back wall ────────────────────────────────────── */}
      <Window position={[-4, Y + 2, -31.8]} w={1.4} h={1.0} emissive={PALETTE.screenBlue} />
      <Window position={[4, Y + 2, -31.8]} w={1.4} h={1.0} emissive="#A0D8FF" />

      {/* ── Small "research board" with pinned notes ────────────────── */}
      <mesh position={[4, Y + 1.8, -17.8]} castShadow>
        <boxGeometry args={[1.6, 1.0, 0.06]} />
        <meshStandardMaterial color={PALETTE.timber} roughness={0.9} metalness={0.04} />
      </mesh>
      {/* Pinned note planes */}
      {[[-0.4, 0.2], [0.1, -0.1], [0.4, 0.3]].map(([ox, oy], i) => (
        <mesh key={i} position={[4 + ox, Y + 1.8 + oy, -17.73]} rotation={[0, 0, (i - 1) * 0.08]}>
          <boxGeometry args={[0.35, 0.25, 0.01]} />
          <meshStandardMaterial
            color={['#F5E090', '#E8C0A0', '#C0E0C0'][i]}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}
