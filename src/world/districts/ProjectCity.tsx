// ─── DISTRICT — PROJECT CITY ──────────────────────────────────────────────────
// Studio lane. Three distinct studios + secondary project markers.

import {
  WallPanel, Window, Door, TerminalScreen, PottedPlant,
  LampPost, Cable, WallShrub,
} from '../EnvironmentKit';
import { PALETTE } from '../../lib/constants';

// ─── String light strand ──────────────────────────────────────────────────────

function StringLights({ from, to, count = 6 }: {
  from: [number, number, number];
  to: [number, number, number];
  count?: number;
}) {
  return (
    <group>
      {/* Wire */}
      <mesh
        position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2]}
        rotation={[0, Math.atan2(to[0] - from[0], to[2] - from[2]), 0.04]}
      >
        <cylinderGeometry args={[0.01, 0.01, Math.sqrt((to[0]-from[0])**2+(to[2]-from[2])**2) * 1.02, 4]} />
        <meshStandardMaterial color="#202024" roughness={0.9} metalness={0.3} />
      </mesh>
      {/* Bulbs */}
      {Array.from({ length: count }).map((_, i) => {
        const t = i / (count - 1);
        const sag = Math.sin(t * Math.PI) * 0.15;
        const x = from[0] + (to[0] - from[0]) * t;
        const y = from[1] + (to[1] - from[1]) * t - sag;
        const z = from[2] + (to[2] - from[2]) * t;
        const colors = ['#FFD080', '#FFC060', '#FFE090'];
        const c = colors[i % colors.length];
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.045, 5, 5]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.8} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── ProjectPulse Studio ──────────────────────────────────────────────────────

function ProjectPulseStudio({ position }: { position: [number, number, number] }) {
  const [bx, by, bz] = position;
  return (
    <group>
      {/* Open-front studio shell, with a clear doorway facing the lane */}
      <WallPanel position={[bx + 2.5, by + 1.8, bz]} w={0.35} h={3.6} d={4} color={PALETTE.concrete} />
      <WallPanel position={[bx, by + 1.8, bz - 2]} w={5} h={3.6} d={0.35} color={PALETTE.concrete} />
      <WallPanel position={[bx, by + 1.8, bz + 2]} w={5} h={3.6} d={0.35} color={PALETTE.concrete} />
      <WallPanel position={[bx - 2.5, by + 1.8, bz - 1.35]} w={0.35} h={3.6} d={1.3} color={PALETTE.concretLight} />
      <WallPanel position={[bx - 2.5, by + 1.8, bz + 1.35]} w={0.35} h={3.6} d={1.3} color={PALETTE.concretLight} />
      {/* Roof — slight overhang */}
      <WallPanel position={[bx, by + 3.65, bz]} w={5.3} h={0.15} d={4.3} color="#2A2A2E" />

      {/* Window — large collaborative workspace visible from street */}
      <Window position={[bx - 2.52, by + 2.0, bz - 1.35]} w={1.0} h={1.4}
        emissive={PALETTE.projectCityAccent} rotation={[0, Math.PI / 2, 0]} />
      <Window position={[bx - 2.52, by + 2.0, bz + 1.35]} w={1.0} h={1.4}
        emissive={PALETTE.projectCityAccent} rotation={[0, Math.PI / 2, 0]} />

      {/* Door */}
      <Door position={[bx - 2.52, by + 1.2, bz]} open rotation={[0, Math.PI / 2, 0]} />

      {/* Sign on front wall */}
      <mesh position={[bx - 2.54, by + 3.1, bz]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[3, 0.35, 0.08]} />
        <meshStandardMaterial color={PALETTE.projectCityAccent} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Status display outside */}
      <mesh position={[bx - 2.7, by + 1.4, bz + 1.8]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.55, 0.3, 0.04]} />
        <meshStandardMaterial color="#40FF80" emissive="#40FF80" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>

      {/* Interior visible kanban board (through window) */}
      <mesh position={[bx - 0.5, by + 1.8, bz - 1.8]} castShadow>
        <boxGeometry args={[1.8, 1.2, 0.06]} />
        <meshStandardMaterial color="#1E2028" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Card columns on board */}
      {[0, 1, 2].map((col) =>
        [0, 1, 2].map((row) => (
          <mesh key={`${col}-${row}`}
            position={[bx - 1.1 + col * 0.6, by + 1.5 + row * 0.3, bz - 1.73]}
            castShadow>
            <boxGeometry args={[0.45, 0.22, 0.02]} />
            <meshStandardMaterial
              color={['#50A080', '#A07040', '#6090C0'][col]}
              roughness={0.88} metalness={0.06}
            />
          </mesh>
        ))
      )}

      {/* Collaborative table */}
      <mesh position={[bx, by + 0.5, bz]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.08, 1.0]} />
        <meshStandardMaterial color={PALETTE.timber} roughness={0.88} metalness={0.04} />
      </mesh>
      {/* Table legs */}
      {[[-1.1, -0.4], [-1.1, 0.4], [1.1, -0.4], [1.1, 0.4]].map(([lx, lz], i) => (
        <mesh key={i} position={[bx + lx, by + 0.23, bz + lz]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.46, 5]} />
          <meshStandardMaterial color="#303030" roughness={0.7} metalness={0.5} />
        </mesh>
      ))}
      <TerminalScreen position={[bx + 0.5, by + 0.9, bz - 0.45]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}

// ─── Kaufee-Home Station (private, insular booth) ─────────────────────────────

function KaufeeHomeStation({ position }: { position: [number, number, number] }) {
  const [bx, by, bz] = position;
  return (
    <group>
      {/* Kiosk walls keep the front open for entry */}
      <WallPanel position={[bx + 1.25, by + 1.4, bz]} w={0.25} h={2.8} d={2.2} color="#202026" />
      <WallPanel position={[bx, by + 1.4, bz - 1.1]} w={2.5} h={2.8} d={0.2} color="#202026" />
      <WallPanel position={[bx, by + 1.4, bz + 1.1]} w={2.5} h={2.8} d={0.2} color="#202026" />
      <WallPanel position={[bx - 1.25, by + 1.4, bz - 0.9]} w={0.25} h={2.8} d={0.4} color={PALETTE.concrete} />
      <WallPanel position={[bx - 1.25, by + 1.4, bz + 0.9]} w={0.25} h={2.8} d={0.4} color={PALETTE.concrete} />
      {/* Roof — pronounced overhang */}
      <WallPanel position={[bx, by + 2.85, bz]} w={2.8} h={0.12} d={2.5} color="#282830" />

      {/* Sign */}
      <mesh position={[bx - 1.27, by + 2.6, bz]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.8, 0.25, 0.08]} />
        <meshStandardMaterial color={PALETTE.aiLabAccent} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* "NO CLOUD" sign (humorous detail) */}
      <mesh position={[bx - 1.27, by + 1.1, bz + 0.7]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.03]} />
        <meshStandardMaterial color="#FF4040" emissive="#FF4040" emissiveIntensity={0.3} roughness={0.7} />
      </mesh>

      {/* Interior workstation */}
      <mesh position={[bx, by + 0.5, bz - 0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.08, 0.7]} />
        <meshStandardMaterial color={PALETTE.timber} roughness={0.88} metalness={0.04} />
      </mesh>
      <TerminalScreen position={[bx, by + 1.0, bz - 0.85]} color={PALETTE.screenBlue} />

      {/* File storage units (local only — no cables going out) */}
      <mesh position={[bx + 0.75, by + 0.65, bz - 0.7]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.45]} />
        <meshStandardMaterial color="#1A1A20" roughness={0.8} metalness={0.4} />
      </mesh>
      {/* Only internal cable (loopback) */}
      <Cable from={[bx, by + 0.9, bz - 0.5]} to={[bx + 0.5, by + 0.9, bz - 0.5]} sag={0.05} color="#303038" />

      {/* Headphone hook */}
      <mesh position={[bx - 0.85, by + 1.5, bz - 0.9]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.2, 5]} />
        <meshStandardMaterial color="#4040A0" roughness={0.6} metalness={0.7} />
      </mesh>

      <PottedPlant position={[bx - 0.6, by + 0.1, bz + 0.7]} />
    </group>
  );
}

// ─── BharatVaani Booth (open-air, audio equipment) ───────────────────────────

function BharatVaaniBooth({ position }: { position: [number, number, number] }) {
  const [bx, by, bz] = position;
  return (
    <group>
      {/* Posts */}
      {[[-1, -0.8], [-1, 0.8], [1, -0.8], [1, 0.8]].map(([ox, oz], i) => (
        <mesh key={i} position={[bx + ox, by + 1.6, bz + oz]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 3.2, 6]} />
          <meshStandardMaterial color={PALETTE.timber} roughness={0.9} metalness={0.04} />
        </mesh>
      ))}
      {/* Partial roof/overhang (not fully enclosed) */}
      <WallPanel position={[bx, by + 3.25, bz - 0.4]} w={2.1} h={0.15} d={1.2} color={PALETTE.timber} />
      {/* Back wall with script-like decorative texture */}
      <WallPanel position={[bx, by + 1.6, bz + 0.8]} w={2.0} h={3.2} d={0.18} color={PALETTE.concrete} />

      {/* Language indicator marks on back wall (geometric script suggestion) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i}
          position={[bx - 0.8 + (i % 4) * 0.4, by + 0.8 + Math.floor(i / 4) * 0.5, bz + 0.9]}
          rotation={[0, 0, (i % 3 - 1) * 0.3]}>
          <boxGeometry args={[0.18, 0.04, 0.02]} />
          <meshStandardMaterial
            color={['#A0D080', '#D0A060', '#80B0D0', '#C080A0'][i % 4]}
            emissive={['#A0D080', '#D0A060', '#80B0D0', '#C080A0'][i % 4]}
            emissiveIntensity={0.2}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* Microphone (geometric) */}
      <mesh position={[bx - 0.5, by + 1.2, bz - 0.2]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.35, 7]} />
        <meshStandardMaterial color="#D0D0D8" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[bx - 0.5, by + 1.5, bz - 0.2]}>
        <sphereGeometry args={[0.1, 7, 6]} />
        <meshStandardMaterial color="#C0C0C8" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Speaker unit */}
      <mesh position={[bx + 0.6, by + 1.0, bz - 0.2]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.28]} />
        <meshStandardMaterial color="#1C1C22" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* Translation display — two screens with morphing content */}
      <mesh position={[bx - 0.3, by + 2.1, bz - 0.35]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.04]} />
        <meshStandardMaterial
          color={PALETTE.dataGreen}
          emissive={PALETTE.dataGreen}
          emissiveIntensity={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[bx + 0.4, by + 2.1, bz - 0.35]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.04]} />
        <meshStandardMaterial
          color={PALETTE.lampAmber}
          emissive={PALETTE.lampAmber}
          emissiveIntensity={0.4}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

// ─── ProjectCity District ─────────────────────────────────────────────────────

export function ProjectCity() {
  const Y = 0.5;

  return (
    <group position={[26, 0.5, 0]}>
      {/* ── Chief Byte NPC (Port Harbour Master) ───────────────────── */}
      <group position={[18, Y, 2]}>
        {/* Overalls / Hardhat Body */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.32, 1.4, 8]} />
          <meshStandardMaterial color="#EA580C" roughness={0.6} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
        </mesh>
        {/* Yellow Safety Hardhat */}
        <mesh position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.22, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FACC15" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Hovering '!' indicator */}
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* ── ProjectPulse Studio ─────────────────────────────────────── */}
      <ProjectPulseStudio position={[26, Y, -4]} />

      {/* ── Kaufee-Home Station ─────────────────────────────────────── */}
      <KaufeeHomeStation position={[18, Y, 2]} />

      {/* ── BharatVaani Booth ───────────────────────────────────────── */}
      <BharatVaaniBooth position={[22, Y, 6]} />

      {/* ── WSENTRY — security checkpoint aesthetic ─────────────────── */}
      <group position={[26, Y, 4]}>
        <WallPanel position={[0, 0.9, 0]} w={1.4} h={1.8} d={1.0} color="#1E1E24" />
        <WallPanel position={[0, 1.82, 0]} w={1.6} h={0.15} d={1.2} color="#28282E" />
        {/* Camera prop */}
        <mesh position={[0.5, 1.6, 0]} rotation={[0, -0.3, 0.2]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.2, 6]} />
          <meshStandardMaterial color="#404048" roughness={0.6} metalness={0.6} />
        </mesh>
        <mesh position={[0.65, 1.6, 0]} rotation={[0.2, -0.3, 0]}>
          <coneGeometry args={[0.07, 0.15, 6]} />
          <meshStandardMaterial color="#303038" roughness={0.6} metalness={0.6} />
        </mesh>
      </group>

      {/* ── API Cemetery (easter egg corner) ───────────────────────── */}
      <group position={[20, Y, -8]}>
        {[
          { x: -0.6, z: 0, label: 'REST v1' },
          { x: 0, z: 0.4, label: 'DEPRECATED' },
          { x: 0.7, z: 0, label: 'v0.0.1' },
        ].map((g, i) => (
          <group key={i} position={[g.x, 0, g.z]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.5, 0.06]} />
              <meshStandardMaterial color="#2A282C" roughness={0.95} metalness={0.05} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <boxGeometry args={[0.4, 0.08, 0.1]} />
              <meshStandardMaterial color="#242226" roughness={0.98} metalness={0.02} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── String lights overhead ──────────────────────────────────── */}
      <StringLights from={[15, Y + 4.5, -4]} to={[30, Y + 4.5, -4]} count={7} />
      <StringLights from={[15, Y + 4.5, 2]} to={[30, Y + 4.5, 2]} count={7} />
      <StringLights from={[15, Y + 4.5, 6]} to={[28, Y + 4.5, 6]} count={5} />

      {/* ── Lamp posts at lane entrance ─────────────────────────────── */}
      <LampPost position={[14, Y, -1]} />
      <LampPost position={[14, Y, 1]} />

      {/* ── Ground-level detail ─────────────────────────────────────── */}
      <PottedPlant position={[16, Y, -2]} />
      <PottedPlant position={[16, Y, 3]} />
      <WallShrub position={[30, Y, 8]} scale={0.8} />
      <WallShrub position={[30, Y, -8]} scale={0.7} />

      {/* ── Bump-Carts garage marker ────────────────────────────────── */}
      <group position={[28, Y, -7]}>
        <WallPanel position={[0, 0.6, 0]} w={2.5} h={1.2} d={1.8} color="#1C1C20" />
        {/* Garage door — half-open */}
        <mesh position={[0, 1.25, 0.82]} castShadow>
          <boxGeometry args={[2.2, 0.12, 0.12]} />
          <meshStandardMaterial color="#383838" roughness={0.8} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
