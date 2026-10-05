// ─── WORLD — PHYSICAL BOUNDS & COLLIDERS ───────────────────────────────────────
// Robust, high-performance static primitive colliders for districts and boundaries.
// Separating collision shapes from visual render groups eliminates tunneling,
// instanced-mesh collider drops, and trimesh polygon trap glitches.

import { RigidBody, CuboidCollider } from '@react-three/rapier';

export function WorldBounds() {
  return (
    <RigidBody type="fixed" colliders={false}>
      {/* ══════════════════════════════════════════════════════════════════════
          1. DISTRICT GROUND & PLATFORM COLLIDERS
         ══════════════════════════════════════════════════════════════════════ */}

      {/* Central Harbour Island (Y = 0) */}
      <CuboidCollider position={[0, -0.4, 0]} args={[16, 0.4, 16]} />

      {/* AI Silicon Valley Platform (Y = 3.5) */}
      <CuboidCollider position={[0, 3.1, -48]} args={[18, 0.4, 16]} />
      {/* High North Bridge (Plaza → AI Lab) */}
      <CuboidCollider position={[0, 1.75, -24]} args={[3.2, 0.35, 14]} />

      {/* Cargo Harbor Platform (Y = 1.0) */}
      <CuboidCollider position={[48, 0.6, 0]} args={[18, 0.4, 18]} />
      {/* East Bridge (Plaza → Cargo Harbor) */}
      <CuboidCollider position={[24, 0.5, 0]} args={[14, 0.35, 3.2]} />

      {/* Neon Arcade Platform (Y = 0.5) */}
      <CuboidCollider position={[-48, 0.1, 0]} args={[18, 0.4, 18]} />
      {/* West Bridge (Plaza → Neon Arcade) */}
      <CuboidCollider position={[-24, 0.25, 0]} args={[14, 0.35, 3.2]} />

      {/* Ancient Oasis Sunken Sanctuary (Y = -2.0) */}
      <CuboidCollider position={[0, -2.4, 48]} args={[18, 0.4, 18]} />
      {/* South Descent Bridge (Plaza → Archive) */}
      <CuboidCollider position={[0, -1.0, 24]} args={[3.2, 0.35, 14]} />

      {/* Coastal Beacon & Sea Cliff (Y = 5.5) */}
      <CuboidCollider position={[42, 5.1, -42]} args={[14, 0.4, 14]} />
      {/* Cliff Walkway (AI Lab → Lighthouse) */}
      <CuboidCollider position={[22, 4.3, -46]} rotation={[0, -0.3, 0]} args={[12, 0.35, 2.5]} />

      {/* World bedrock base plane (failsafe ocean floor) */}
      <CuboidCollider position={[0, -4.5, 0]} args={[120, 0.5, 120]} />

      {/* ══════════════════════════════════════════════════════════════════════
          2. WORLD PERIMETER BOUNDARY WALLS (Keeps drone inside 180m map)
         ══════════════════════════════════════════════════════════════════════ */}
      {/* North boundary */}
      <CuboidCollider position={[0, 10, -88]} args={[92, 16, 1]} />
      {/* South boundary */}
      <CuboidCollider position={[0, 10, 88]} args={[92, 16, 1]} />
      {/* East boundary */}
      <CuboidCollider position={[88, 10, 0]} args={[1, 16, 92]} />
      {/* West boundary */}
      <CuboidCollider position={[-88, 10, 0]} args={[1, 16, 92]} />
      {/* Sky ceiling */}
      <CuboidCollider position={[0, 28, 0]} args={[92, 1, 92]} />


      {/* ══════════════════════════════════════════════════════════════════════
          3. DISTRICT ARCHITECTURAL & OBSTACLE COLLIDERS
         ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Central Town & Harbour ── */}
      {/* Central Fountain base */}
      <CuboidCollider position={[0, 0.4, 0]} args={[2.2, 0.4, 2.2]} />
      {/* Mail Depot / Delivery Postbox */}
      <CuboidCollider position={[3.2, 0.6, 2.8]} args={[0.5, 0.6, 0.5]} />
      {/* Courtyard Tree Trunk */}
      <CuboidCollider position={[-3.5, 1.6, -3]} args={[0.45, 1.6, 0.45]} />
      {/* Town Bench */}
      <CuboidCollider position={[-1.5, 0.35, -5.5]} args={[0.9, 0.35, 0.4]} />
      {/* Corner low walls */}
      <CuboidCollider position={[-12, 0.5, 8]} args={[2.5, 0.5, 0.35]} />
      <CuboidCollider position={[12, 0.5, -8]} args={[0.35, 0.5, 2.5]} />
      {/* Lamp posts base colliders */}
      <CuboidCollider position={[-7.5, 1.6, 0]} args={[0.2, 1.6, 0.2]} />
      <CuboidCollider position={[7.5, 1.6, 0]} args={[0.2, 1.6, 0.2]} />
      <CuboidCollider position={[0, 1.6, 7.5]} args={[0.2, 1.6, 0.2]} />
      <CuboidCollider position={[0, 1.6, -7.5]} args={[0.2, 1.6, 0.2]} />

      {/* ── AI Silicon Valley (Center [0, 3.5, -48]) ── */}
      {/* Quantum Observatory Dome Base */}
      <CuboidCollider position={[0, 5.0, -56]} args={[8.5, 2.5, 0.4]} />
      {/* Research Center Side Walls */}
      <CuboidCollider position={[-12, 5.0, -48]} args={[0.4, 2.5, 7.5]} />
      <CuboidCollider position={[12, 5.0, -48]} args={[0.4, 2.5, 7.5]} />
      {/* Server Rack Monoliths */}
      <CuboidCollider position={[8.5, 4.8, -52]} args={[1.5, 1.4, 0.6]} />
      <CuboidCollider position={[-8.5, 4.8, -52]} args={[1.5, 1.4, 0.6]} />
      {/* Central Quantum Core Exhibit */}
      <CuboidCollider position={[0, 4.8, -48]} args={[2.5, 1.2, 2.5]} />

      {/* ── Cargo Harbor / Project Port (Center [48, 1.0, 0]) ── */}
      {/* Cargo Crane Base Tower */}
      <CuboidCollider position={[56, 5.0, -6]} args={[1.2, 5.0, 1.2]} />
      {/* Stacked Branded Shipping Containers */}
      <CuboidCollider position={[52, 2.6, 8]} args={[3.2, 1.8, 1.6]} />
      <CuboidCollider position={[44, 2.6, -8]} args={[3.2, 1.8, 1.6]} />
      <CuboidCollider position={[55, 2.6, 0]} args={[1.6, 1.8, 3.2]} />
      {/* Dock Warehouses */}
      <CuboidCollider position={[40, 2.8, 11]} args={[2.5, 2.0, 1.8]} />

      {/* ── Neon Arcade & Physics Funland (Center [-48, 0.5, 0]) ── */}
      {/* Arcade Hall Back Wall */}
      <CuboidCollider position={[-56, 3.0, 0]} args={[0.4, 3.0, 9.5]} />
      {/* Arcade Side Wings */}
      <CuboidCollider position={[-48, 3.0, -12]} args={[8.5, 3.0, 0.4]} />
      <CuboidCollider position={[-48, 3.0, 12]} args={[8.5, 3.0, 0.4]} />
      {/* Arcade Cabinets */}
      <CuboidCollider position={[-52, 1.8, -5]} args={[0.6, 1.4, 0.6]} />
      <CuboidCollider position={[-52, 1.8, 5]} args={[0.6, 1.4, 0.6]} />
      {/* Launch Jump Ramp */}
      <CuboidCollider position={[-40, 1.2, 0]} rotation={[0, 0, -0.32]} args={[2.4, 0.2, 2.2]} />

      {/* ── Ancient Oasis / Sunken Sanctuary (Center [0, -2.0, 48]) ── */}
      {/* Sunken Temple Back Wall */}
      <CuboidCollider position={[0, 0.5, 58]} args={[12, 3.0, 0.4]} />
      {/* Temple Side Walls */}
      <CuboidCollider position={[-12, 0.5, 48]} args={[0.4, 3.0, 9.5]} />
      <CuboidCollider position={[12, 0.5, 48]} args={[0.4, 3.0, 9.5]} />
      {/* Cyber Obelisks */}
      <CuboidCollider position={[-6, 0.5, 44]} args={[0.5, 3.0, 0.5]} />
      <CuboidCollider position={[6, 0.5, 44]} args={[0.5, 3.0, 0.5]} />
      {/* Resume Grand Altar */}
      <CuboidCollider position={[0, -0.8, 50]} args={[1.5, 1.2, 1.0]} />

      {/* ── Coastal Beacon / Lighthouse (Center [42, 5.5, -42]) ── */}
      {/* Lighthouse Tower Base */}
      <CuboidCollider position={[42, 10.0, -42]} args={[2.2, 6.0, 2.2]} />
      {/* Cliff Retaining Wall */}
      <CuboidCollider position={[34, 6.2, -36]} rotation={[0, -0.78, 0]} args={[4.5, 1.2, 0.4]} />

      {/* ── NPCs Colliders ── */}
      {/* Sai the Builder (Central Plaza) */}
      <CuboidCollider position={[-1.8, 0.7, -3.2]} args={[0.35, 0.7, 0.35]} />
      {/* Dr. Tensor (AI Lab) */}
      <CuboidCollider position={[0, 4.2, -43]} args={[0.35, 0.7, 0.35]} />
      {/* Chief Byte (Cargo Port) */}
      <CuboidCollider position={[44, 1.7, 2]} args={[0.35, 0.7, 0.35]} />
      {/* Retro Bot (Arcade) */}
      <CuboidCollider position={[-44, 1.2, -3]} args={[0.35, 0.7, 0.35]} />
      {/* Keeper Sandy (Lighthouse) */}
      <CuboidCollider position={[39, 6.2, -39]} args={[0.35, 0.7, 0.35]} />

    </RigidBody>
  );
}
