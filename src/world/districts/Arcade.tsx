import { WallPanel, ArcadeCabinet, LampPost, Window } from '../EnvironmentKit';
import { PALETTE } from '../../lib/constants';
import { RigidBody } from '@react-three/rapier';

// ─── BRUNO SIMON BOWLING PINS (Physics RigidBodies) ──────────────────────────

function BowlingPins({ baseY = 0 }: { baseY: number }) {
  // 10-pin triangle layout
  const pinPositions: [number, number, number][] = [
    // Row 1 (Apex pin)
    [0, baseY + 0.45, 0],
    // Row 2
    [-0.35, baseY + 0.45, -0.6],
    [0.35, baseY + 0.45, -0.6],
    // Row 3
    [-0.7, baseY + 0.45, -1.2],
    [0, baseY + 0.45, -1.2],
    [0.7, baseY + 0.45, -1.2],
    // Row 4
    [-1.05, baseY + 0.45, -1.8],
    [-0.35, baseY + 0.45, -1.8],
    [0.35, baseY + 0.45, -1.8],
    [1.05, baseY + 0.45, -1.8],
  ];

  return (
    <group position={[-16, 0, 4]}>
      {pinPositions.map((pos, idx) => (
        <RigidBody
          key={idx}
          position={pos}
          colliders="hull"
          restitution={0.5}
          friction={0.3}
          mass={0.8}
        >
          <group>
            {/* White Bowling Pin Body */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.09, 0.14, 0.8, 8]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Red neck stripe */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.095, 0.1, 0.12, 8]} />
              <meshStandardMaterial color="#EF4444" roughness={0.4} />
            </mesh>
            {/* Top crown */}
            <mesh position={[0, 0.42, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
            </mesh>
          </group>
        </RigidBody>
      ))}
    </group>
  );
}

export function Arcade() {
  const Y = 0;

  return (
    <group position={[-26, 0.5, 0]}>
      {/* ── Bruno Simon Bowling Pins Alley ── */}
      <BowlingPins baseY={Y} />

      {/* ── Bruno Simon-style Dynamic Physics Box Pyramid ── */}
      <group position={[-18, Y, 1]}>
        {[
          [-0.6, 0.35, 0], [0, 0.35, 0], [0.6, 0.35, 0],
          [-0.9, 0.35, 0.8], [-0.3, 0.35, 0.8], [0.3, 0.35, 0.8], [0.9, 0.35, 0.8],
          [-0.3, 1.05, 0.4], [0.3, 1.05, 0.4],
          [0, 1.75, 0.4],
        ].map((pos, i) => (
          <RigidBody key={i} position={pos as [number, number, number]} colliders="cuboid" restitution={0.4} friction={0.6}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.48, 0.48, 0.48]} />
              <meshStandardMaterial
                color={['#F59E0B', '#38BDF8', '#10B981', '#EC4899', '#A855F7'][i % 5]}
                roughness={0.25}
                metalness={0.3}
              />
            </mesh>
          </RigidBody>
        ))}
      </group>

      {/* ── Retro Bot NPC ── */}
      <group position={[-18, Y, -3]}>
        {/* CRT Head / Body */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.6, 0.7, 0.5]} />
          <meshStandardMaterial color="#374151" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Animated Green CRT Face */}
        <mesh position={[0, 0.75, 0.26]}>
          <boxGeometry args={[0.45, 0.35, 0.02]} />
          <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={1.2} />
        </mesh>
        {/* Antennas */}
        <mesh position={[0.2, 1.15, 0]} rotation={[0, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.35, 6]} />
          <meshStandardMaterial color="#9CA3AF" metalness={0.8} />
        </mesh>
        <mesh position={[-0.2, 1.15, 0]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.35, 6]} />
          <meshStandardMaterial color="#9CA3AF" metalness={0.8} />
        </mesh>
        {/* Hovering '!' indicator */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* ── Open-air Synthwave Neon Arch Trusses (No camera occlusion) ── */}
      {[-7, -2, 3].map((zPos, idx) => (
        <group key={idx} position={[-22, Y, zPos]}>
          {/* Left Pillar */}
          <mesh position={[-8.5, 3.5, 0]}>
            <cylinderGeometry args={[0.16, 0.2, 7, 8]} />
            <meshStandardMaterial color="#1E1E24" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Right Pillar */}
          <mesh position={[8.5, 3.5, 0]}>
            <cylinderGeometry args={[0.16, 0.2, 7, 8]} />
            <meshStandardMaterial color="#1E1E24" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Glowing Neon Crossbeam */}
          <mesh position={[0, 7.0, 0]}>
            <boxGeometry args={[17.2, 0.25, 0.25]} />
            <meshStandardMaterial
              color={['#EC4899', '#38BDF8', '#A855F7'][idx]}
              emissive={['#EC4899', '#38BDF8', '#A855F7'][idx]}
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      ))}

      {/* ── Perimeter wall back & sides (open top) ── */}
      <WallPanel position={[-22, Y + 1.8, -9]} w={18} h={3.6} d={0.4} color="#242428" />
      <WallPanel position={[-30, Y + 1.8, -2]} w={0.4} h={3.6} d={14} color="#262628" />
      <WallPanel position={[-14, Y + 1.8, -2]} w={0.4} h={3.6} d={14} color="#262628" />

      {/* ── Ambient Arcade Glow ── */}
      <pointLight position={[-22, 4.5, -2]} color="#EC4899" intensity={6} distance={15} />

      {/* ── ARCADE CABINETS ─────────────────────────────────────────── */}
      <ArcadeCabinet position={[-26, Y + 0.95, -4]} rotation={Math.PI / 6} screenColor="#FF6040" isPlayable={true} />
      <group position={[-24, Y + 0.95, 0]} rotation={[0, -0.3, 0]}>
        <ArcadeCabinet position={[0, 0, 0]} rotation={0} screenColor="#202020" />
        <mesh position={[0, -0.4, 0.33]} rotation={[-0.2, 0, 0.1]}>
          <boxGeometry args={[0.25, 0.06, 0.02]} />
          <meshStandardMaterial color="#F0D040" roughness={0.7} metalness={0.0} />
        </mesh>
      </group>
      <ArcadeCabinet position={[-19, Y + 0.95, -5]} rotation={-Math.PI / 4} screenColor="#60D060" />

      {/* Small retro TV on table */}
      <group position={[-28, Y, -7]}>
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.08, 0.7]} />
          <meshStandardMaterial color={PALETTE.timber} roughness={0.9} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.6, 0.5, 0.45]} />
          <meshStandardMaterial color="#181818" roughness={0.8} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.76, 0.23]}>
          <boxGeometry args={[0.45, 0.36, 0.04]} />
          <meshStandardMaterial color="#40FF40" emissive="#40FF40" emissiveIntensity={0.5} roughness={0.2} />
        </mesh>
      </group>

      {/* ── High score neon display on wall ─────────────────────────── */}
      <mesh position={[-22, Y + 2.8, -8.8]}>
        <boxGeometry args={[3.5, 1.2, 0.06]} />
        <meshStandardMaterial color="#FF6040" emissive="#FF6040" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>

      {/* ── Entry lamp post pair ─────────────────────────────────────── */}
      <LampPost position={[-14.5, Y, 3]} emissiveIntensity={1.2} />
      <LampPost position={[-14.5, Y, -3]} emissiveIntensity={1.2} />

      {/* ── Side window (exterior glow from inside) ──────────────────── */}
      <Window position={[-30.2, Y + 1.8, -4]} w={1.2} h={0.9} emissive="#FFD080" rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}
