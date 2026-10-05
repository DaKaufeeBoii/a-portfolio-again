// ─── KAUFEE WORLD — GLOBAL CONSTANTS ──────────────────────────────────────────

// World palette (from Art Direction document — brightened for clarity)
export const PALETTE = {
  // Ground / Concrete
  groundBase: '#36373E',
  groundDetail: '#464852',
  groundPath: '#27282F',

  // Warm lights
  lampAmber: '#F7D688',
  lampSecondary: '#ECC874',
  screenBlue: '#9FD6FF',
  dataGreen: '#ADEEC9',

  // Vegetation
  foliageDark: '#548864',
  foliageLight: '#78AC77',
  bark: '#6E5946',
  groundCover: '#496B46',

  // Architecture
  concrete: '#484852',
  concretLight: '#5A5A66',
  timber: '#7B6A50',
  metal: '#8E8E9E',
  rust: '#996444',

  // District accents
  plazaAccent: '#FAD88F',
  aiLabAccent: '#95D5FF',
  projectCityAccent: '#F5A95A',
  arcadeAccent: '#F0B86A',
  archiveAccent: '#DEA868',

  // Sky / Fog
  skyNight: '#151928',
  fogColor: '#1A1E30',

  // UI
  uiBg: 'rgba(18,20,26,0.92)',
  uiText: '#F0F0E8',
  uiBorder: '#4A4A58',
} as const;

// World scale (Expanded archipelago inspired by messenger.abeto.co and bruno-simon.com)
export const WORLD = {
  // District center positions [x, z]
  plazaCenter: [0, 0] as [number, number],
  aiLabCenter: [0, -48] as [number, number],
  arcadeCenter: [-48, 0] as [number, number],
  projectCityCenter: [48, 0] as [number, number],
  archiveCenter: [0, 48] as [number, number],
  lighthouseCenter: [42, -42] as [number, number],

  // Elevations
  plazaY: 0,
  aiLabY: 3.5,
  arcadeY: 0.5,
  projectCityY: 1.0,
  archiveY: -2.0,
  lighthouseY: 5.5,

  // District trigger radii
  districtTriggerRadius: 18,

  // Interaction radii
  interactRadius: 5.0,
  interactHintRadius: 7.5,

  // Fog (pushed back for wide vista views across the archipelago)
  fogNear: 75,
  fogFar: 260,
} as const;

// Camera
export const CAMERA = {
  // Exploration mode
  followHeight: 3.6,
  followDistance: 7.2,
  followLag: 0.12,
  fov: 65,

  // Map mode
  mapHeight: 90,
  mapFov: 50,

  // Inspection mode
  inspectDuration: 0.8, // seconds (GSAP)
} as const;

// Drone
export const DRONE = {
  speed: 11.5,
  boostMultiplier: 2.2,
  hoverAmplitude: 0.09,
  hoverFrequency: 2.2,
  tiltAmount: 0.18, // radians
  rollAmount: 0.12,
  height: 1.15, // default hover height above ground
  colliderRadius: 0.42,
  visualScale: 0.72,
} as const;

// Districts
export type DistrictId = 'plaza' | 'ailab' | 'projectcity' | 'arcade' | 'archive' | 'lighthouse';

export const DISTRICTS: Record<DistrictId, {
  name: string;
  label: string;
  center: [number, number];
  elevation: number;
  accentColor: string;
  triggerRadius: number;
  description: string;
}> = {
  plaza: {
    name: 'plaza',
    label: 'Kaufee Harbour',
    center: [0, 0],
    elevation: 0,
    accentColor: PALETTE.plazaAccent,
    triggerRadius: 18,
    description: 'Central orientation square, Mail Dispatch postbox, and Sai’s Atelier',
  },
  ailab: {
    name: 'ailab',
    label: 'AI Silicon Valley',
    center: [0, -48],
    elevation: 3.5,
    accentColor: PALETTE.aiLabAccent,
    triggerRadius: 18,
    description: 'Quantum observatory, GPU clusters, and Dr. Tensor’s research lab',
  },
  projectcity: {
    name: 'projectcity',
    label: 'Cargo Harbor',
    center: [48, 0],
    elevation: 1.0,
    accentColor: PALETTE.projectCityAccent,
    triggerRadius: 18,
    description: 'Shipping docks, container cranes, and Sai’s production project vaults',
  },
  arcade: {
    name: 'arcade',
    label: 'Neon Arcade',
    center: [-48, 0],
    elevation: 0.5,
    accentColor: PALETTE.arcadeAccent,
    triggerRadius: 18,
    description: 'Bruno Simon physics playground, bowling alley, and jump ramps',
  },
  archive: {
    name: 'archive',
    label: 'Ancient Oasis',
    center: [0, 48],
    elevation: -2.0,
    accentColor: PALETTE.archiveAccent,
    triggerRadius: 18,
    description: 'Sunken stone sanctuary, reflection pool, and official resume terminal',
  },
  lighthouse: {
    name: 'lighthouse',
    label: 'Coastal Beacon',
    center: [42, -42],
    elevation: 5.5,
    accentColor: '#FDE047',
    triggerRadius: 16,
    description: 'High sea cliff beacon, rotating spotlight, and secret coastal caves',
  },
};

