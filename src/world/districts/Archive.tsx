// ─── DISTRICT — ARCHIVE ───────────────────────────────────────────────────────
// Below-grade vault. Accessed by descending steps. History is physically here.

import * as THREE from 'three';
import {
  WallPanel, WallShrub, TerminalScreen,
} from '../EnvironmentKit';
import { PALETTE, WORLD } from '../../lib/constants';
import { TIMELINE } from '../../data';

// ─── Reading lamp ─────────────────────────────────────────────────────────────

function ReadingLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Arm */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.1, 5]} />
        <meshStandardMaterial color="#303038" roughness={0.7} metalness={0.6} />
      </mesh>
      {/* Shade */}
      <mesh position={[0.2, 1.0, 0]} rotation={[0, 0, -0.5]} castShadow>
        <coneGeometry args={[0.18, 0.22, 7, 1, true]} />
        <meshStandardMaterial color="#2A2820" roughness={0.7} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0.2, 0.9, 0]}>
        <sphereGeometry args={[0.06, 6, 5]} />
        <meshStandardMaterial color={PALETTE.archiveAccent} emissive={PALETTE.archiveAccent} emissiveIntensity={1.6} roughness={0.3} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.08, 6]} />
        <meshStandardMaterial color="#282830" roughness={0.85} metalness={0.4} />
      </mesh>
    </group>
  );
}

// ─── Timeline artifact ────────────────────────────────────────────────────────

function TimelineArtifact({ event, wallX }: {
  event: typeof TIMELINE[0];
  wallX: number;
}) {
  const Y = WORLD.archiveY;
  const [, , ez] = event.archivePosition;

  const typeColor = {
    education: '#6090C0',
    internship: '#80C080',
    achievement: '#D0A040',
    project: PALETTE.projectCityAccent,
  }[event.type];

  return (
    <group position={[wallX, Y + 1.2, ez]}>
      {/* Mounting plate */}
      <mesh castShadow>
        <boxGeometry args={[0.12, 1.4, 2.0]} />
        <meshStandardMaterial color="#1E1E24" roughness={0.8} metalness={0.3} />
      </mesh>
      {/* Accent strip */}
      <mesh position={[0.07, 0, 0]}>
        <boxGeometry args={[0.04, 1.35, 1.95]} />
        <meshStandardMaterial color={typeColor} emissive={typeColor} emissiveIntensity={0.3} roughness={0.6} />
      </mesh>
      {/* Year marker */}
      <mesh position={[0.1, 0.55, -0.8]}>
        <boxGeometry args={[0.04, 0.3, 0.3]} />
        <meshStandardMaterial color={typeColor} emissive={typeColor} emissiveIntensity={0.8} roughness={0.4} />
      </mesh>
      {/* Physical prop by type */}
      {event.type === 'achievement' && (
        // Trophy silhouette
        <group position={[0.1, 0.2, 0.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.08, 0.3, 7]} />
            <meshStandardMaterial color="#C09020" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.14, 0.12, 0.1, 7]} />
            <meshStandardMaterial color="#C09020" roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      )}
      {event.type === 'internship' && (
        // Document/report
        <mesh position={[0.1, 0.1, 0.3]} castShadow>
          <boxGeometry args={[0.04, 0.4, 0.3]} />
          <meshStandardMaterial color="#E8E0C8" roughness={0.88} metalness={0.02} />
        </mesh>
      )}
      {event.type === 'education' && (
        // Book stack
        <group position={[0.1, 0.05, 0.2]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, i * 0.1, 0]} castShadow>
              <boxGeometry args={[0.04, 0.08, 0.28]} />
              <meshStandardMaterial color={['#5080A0', '#A05050', '#508060'][i]} roughness={0.85} metalness={0.05} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// ─── Old machine / retired terminal ──────────────────────────────────────────

function OldTerminal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Body — thick, rounded edges implied by face detail */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.6, 0.5]} />
        <meshStandardMaterial color="#1A1820" roughness={0.8} metalness={0.3} />
      </mesh>
      {/* Screen — dark or static */}
      <mesh position={[0, 0.06, 0.26]}>
        <boxGeometry args={[0.56, 0.44, 0.03]} />
        <meshStandardMaterial color="#0C0C10" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Old-style knobs */}
      {[-0.25, 0.25].map((x, i) => (
        <mesh key={i} position={[x, -0.2, 0.26]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 7]} />
          <meshStandardMaterial color="#404038" roughness={0.7} metalness={0.4} />
        </mesh>
      ))}
      {/* Stand */}
      <mesh position={[0, -0.38, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.15, 6]} />
        <meshStandardMaterial color="#181620" roughness={0.85} metalness={0.3} />
      </mesh>
    </group>
  );
}

// ─── Diagnostic Terminal (Easter Egg / Info) ───────────────────
function DiagnosticTerminal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <TerminalScreen 
        position={[0, 0, 0]} 
        color={PALETTE.archiveAccent}
      />
      {/* Sign label */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.0, 0.15, 0.02]} />
        <meshStandardMaterial color={PALETTE.archiveAccent} emissive={PALETTE.archiveAccent} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Archive District ─────────────────────────────────────────────────────────

export function Archive() {
  const Y = WORLD.archiveY;

  return (
    <group position={[0, 0, 26]}>
      {/* ── Archivist Chronos NPC ── */}
      <group position={[0, Y, 20]}>
        {/* Monastic Robe / Bronze Frame */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.35, 1.4, 8]} />
          <meshStandardMaterial color="#92400E" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.4} />
        </mesh>
        {/* Golden halo ring */}
        <mesh position={[0, 1.75, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.26, 0.02, 6, 24]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={1.2} />
        </mesh>
        {/* Hovering '!' indicator */}
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* ── Open-Air Oasis Vault walls ── */}
      <WallPanel position={[0, Y + 1.8, 32]} w={22} h={3.6} d={0.4} color="#202024" />
      <WallPanel position={[-11, Y + 1.8, 27]} w={0.4} h={3.6} d={10} color="#222226" />
      <WallPanel position={[11, Y + 1.8, 27]} w={0.4} h={3.6} d={10} color="#222226" />

      {/* ── TIMELINE ARTIFACTS ─────────────────────────────────────────────────── */}
      {TIMELINE.map((event) => (
        <TimelineArtifact key={event.id} event={event} wallX={-8} />
      ))}
      {/* ── DIAGNOSTIC TERMINAL (Easter Egg / Info) ─────────────────────────────── */}
      <group position={[6, Y + 0.9, 14]} rotation={[0, Math.PI, 0]}>
        <DiagnosticTerminal position={[0, 0, 0]} />
      </group>
      {/* Year stripe markers on ground level */}
      {[2023, 2024, 2025, 2026].map((year, i) => (
        <mesh key={year} position={[0, Y + 0.02, 14 + i * 4.5]}>
          <boxGeometry args={[18, 0.04, 0.12]} />
          <meshStandardMaterial
            color={PALETTE.archiveAccent}
            emissive={PALETTE.archiveAccent}
            emissiveIntensity={0.3}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* ── READING TABLE ────────────────────────────────────────────── */}
      <group position={[-4, Y, 22]}>
        {/* Table */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.08, 0.9]} />
          <meshStandardMaterial color={PALETTE.timber} roughness={0.9} metalness={0.04} />
        </mesh>
        {/* Table legs */}
        {[[-0.85, -0.35], [-0.85, 0.35], [0.85, -0.35], [0.85, 0.35]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.24, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.48, 5]} />
            <meshStandardMaterial color="#282828" roughness={0.8} metalness={0.4} />
          </mesh>
        ))}
        {/* Reading lamp */}
        <ReadingLamp position={[0.7, 0.56, -0.3]} />
        {/* Book cluster */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.5 + i * 0.14, 0.62, 0.2]} rotation={[0, (i % 2) * 0.1, 0]} castShadow>
            <boxGeometry args={[0.12, 0.26, 0.18]} />
            <meshStandardMaterial
              color={['#705030', '#405070', '#304050', '#703040'][i]}
              roughness={0.88}
              metalness={0.04}
            />
          </mesh>
        ))}
      </group>

      {/* ── OLD MACHINES section ────────────────────────────────────── */}
      <OldTerminal position={[-7, Y + 0.56, 18]} />
      <OldTerminal position={[-7, Y + 0.56, 20]} />
      <DiagnosticTerminal position={[-7, Y + 0.56, 22]} />
      {/* Stacked old build boxes */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-9, Y + 0.2 + i * 0.35, 20]} castShadow>
          <boxGeometry args={[0.7, 0.32, 0.5]} />
          <meshStandardMaterial color={`hsl(230, 10%, ${15 + i * 3}%)`} roughness={0.9} metalness={0.2} />
        </mesh>
      ))}

      {/* ── PROJECT TOMBSTONE section (easter egg graveyard) ─────────── */}
      <group position={[6, Y, 16]}>
        {[
          { x: -0.7, z: 0, label: 'REST' },
          { x: 0, z: 0.5, label: 'v0.1' },
          { x: 0.8, z: 0, label: 'PROTO' },
          { x: 0.3, z: -0.4, label: 'IDEA' },
        ].map((g, i) => (
          <group key={i} position={[g.x, 0, g.z]} rotation={[0, (i % 3 - 1) * 0.15, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.28, 0.48, 0.07]} />
              <meshStandardMaterial color="#282630" roughness={0.95} metalness={0.05} />
            </mesh>
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.38, 0.07, 0.12]} />
              <meshStandardMaterial color="#222024" roughness={0.98} metalness={0.02} />
            </mesh>
          </group>
        ))}
        {/* Small ground moss */}
        <WallShrub position={[-1, 0.02, -0.5]} scale={0.35} />
      </group>

      {/* ── Reading lamps along left wall ───────────────────────────── */}
      <ReadingLamp position={[-10, Y + 0.02, 18]} />
      <ReadingLamp position={[-10, Y + 0.02, 24]} />
      <ReadingLamp position={[-10, Y + 0.02, 30]} />

      {/* ── Dim overhead strip ──────────────────────────────────────── */}
      {[16, 20, 24, 28].map((z) => (
        <mesh key={z} position={[0, Y + 3.5, z]}>
          <boxGeometry args={[1.0, 0.04, 0.12]} />
          <meshStandardMaterial color="#5060A0" emissive="#5060A0" emissiveIntensity={0.2} roughness={0.4} />
        </mesh>
      ))}

      {/* ── Moss on walls (subtle green patches at base) ─────────────── */}
      {[-10, 10].map((x) =>
        [16, 20, 24, 28].map((z) => (
          <mesh key={`${x}-${z}`} position={[x + (x < 0 ? 0.22 : -0.22), Y + 0.25, z]}>
            <boxGeometry args={[0.06, 0.4, 0.6]} />
            <meshStandardMaterial color={PALETTE.groundCover} roughness={0.99} metalness={0} />
          </mesh>
        ))
      )}
    </group>
  );
}
