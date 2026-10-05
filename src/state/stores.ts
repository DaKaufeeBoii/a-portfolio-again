// ─── STATE — WORLD STORE ──────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DistrictId } from '../lib/constants';
import type { Achievement } from '../data';

interface WorldState {
  // Active district
  activeDistrict: DistrictId;
  setActiveDistrict: (id: DistrictId) => void;

  // Camera mode
  cameraMode: 'explore' | 'inspect' | 'map' | 'cinematic';
  setCameraMode: (mode: WorldState['cameraMode']) => void;

  // Inspection target
  inspectTarget: string | null;
  setInspectTarget: (id: string | null) => void;

  // Drone position (shared for camera)
  dronePosition: [number, number, number];
  setDronePosition: (pos: [number, number, number]) => void;

  // UI panel
  openPanelId: string | null;
  setOpenPanelId: (id: string | null) => void;

  // Pause
  isPaused: boolean;
  setIsPaused: (v: boolean) => void;

  // Map toggle
  isMapOpen: boolean;
  setIsMapOpen: (v: boolean) => void;

  // Loaded
  worldReady: boolean;
  setWorldReady: (v: boolean) => void;

  // Builder NPC
  builderMet: boolean;
  setBuilderMet: () => void;

  // Teleportation (Colonia Zacamil style quick jumps)
  teleportTarget: [number, number, number] | null;
  setTeleportTarget: (target: [number, number, number] | null) => void;

  // Real-time flight telemetry
  droneSpeed: number;
  setDroneSpeed: (speed: number) => void;

  // Delivery system (Abeto Messenger inspired)
  activeMissionId: string | null;
  activeDeliveryPackage: { id: string; title: string; recipient: string; targetPos: [number, number, number] } | null;
  completedDeliveries: string[];
  collectedBeans: string[];
  ringsPassed: string[];
  startMission: (id: string) => void;
  completeMission: (id: string) => void;
  collectBean: (id: string) => void;
  passRing: (id: string) => void;

  // NPC Dialogue
  activeNPC: { id: string; name: string; role: string; text: string; hint?: string } | null;
  setActiveNPC: (npc: { id: string; name: string; role: string; text: string; hint?: string } | null) => void;

  // Mobile / Touch controls (Bruno Simon style)
  virtualJoystick: { x: number; y: number; active: boolean; boost: boolean };
  setVirtualJoystick: (v: { x: number; y: number; active: boolean; boost: boolean }) => void;
}

export const useWorldStore = create<WorldState>()((set) => ({
  activeDistrict: 'plaza',
  setActiveDistrict: (id) => set({ activeDistrict: id }),

  cameraMode: 'explore',
  setCameraMode: (mode) => set({ cameraMode: mode }),

  inspectTarget: null,
  setInspectTarget: (id) => set({ inspectTarget: id }),

  dronePosition: [0, 1.2, 0],
  setDronePosition: (pos) => set({ dronePosition: pos }),

  openPanelId: null,
  setOpenPanelId: (id) => set({ openPanelId: id }),

  isPaused: false,
  setIsPaused: (v) => set({ isPaused: v }),

  isMapOpen: false,
  setIsMapOpen: (v) => set({ isMapOpen: v }),

  worldReady: false,
  setWorldReady: (v) => set({ worldReady: v }),

  builderMet: false,
  setBuilderMet: () => set({ builderMet: true }),

  teleportTarget: null,
  setTeleportTarget: (teleportTarget) => set({ teleportTarget }),

  droneSpeed: 0,
  setDroneSpeed: (droneSpeed) => set({ droneSpeed }),

  // Messenger Deliveries
  activeMissionId: null,
  activeDeliveryPackage: null,
  completedDeliveries: [],
  collectedBeans: [],
  ringsPassed: [],

  startMission: (id) => {
    const missions: Record<string, { title: string; recipient: string; targetPos: [number, number, number] }> = {
      'weights': { title: '1.5B Neural Weights', recipient: 'Dr. Tensor at AI Silicon Valley', targetPos: [0, 3.5, -45] },
      'relay': { title: 'IoT Coordinator Chip', recipient: 'Chief Byte at Cargo Harbor', targetPos: [45, 1.0, 0] },
      'joystick': { title: 'Sanwa Gold Joystick', recipient: 'Retro Bot at Neon Arcade', targetPos: [-45, 0.5, 0] },
      'scroll': { title: 'Decrypted Resume Scroll', recipient: 'Archivist Chronos at Ancient Oasis', targetPos: [0, -2.0, 45] },
      'beacon': { title: 'Quantum Flare Battery', recipient: 'Keeper Sandy at Coastal Beacon', targetPos: [40, 5.5, -40] },
    };
    const m = missions[id];
    if (m) {
      set({
        activeMissionId: id,
        activeDeliveryPackage: { id, title: m.title, recipient: m.recipient, targetPos: m.targetPos },
      });
    }
  },

  completeMission: (id) =>
    set((s) => ({
      activeMissionId: null,
      activeDeliveryPackage: null,
      completedDeliveries: s.completedDeliveries.includes(id) ? s.completedDeliveries : [...s.completedDeliveries, id],
    })),

  collectBean: (id) =>
    set((s) => ({
      collectedBeans: s.collectedBeans.includes(id) ? s.collectedBeans : [...s.collectedBeans, id],
    })),

  passRing: (id) =>
    set((s) => ({
      ringsPassed: s.ringsPassed.includes(id) ? s.ringsPassed : [...s.ringsPassed, id],
    })),

  activeNPC: null,
  setActiveNPC: (activeNPC) => set({ activeNPC }),

  virtualJoystick: { x: 0, y: 0, active: false, boost: false },
  setVirtualJoystick: (virtualJoystick) => set({ virtualJoystick }),
}));

// ─── STATE — DISCOVERY / ACHIEVEMENT STORE (persisted) ───────────────────────

interface DiscoveryState {
  discovered: Set<string>;
  unlockedAchievements: Achievement['id'][];
  addDiscovery: (key: string) => void;
  unlockAchievement: (id: Achievement['id']) => void;
  hasDiscovered: (key: string) => boolean;
  hasAchievement: (id: Achievement['id']) => boolean;
  projectsInspected: number;
  incrementProjectsInspected: () => void;
}

// Use persist but serialize Set as array
export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      discovered: new Set<string>(),
      unlockedAchievements: [],
      projectsInspected: 0,

      addDiscovery: (key) =>
        set((s) => ({
          discovered: new Set([...s.discovered, key]),
        })),

      unlockAchievement: (id) =>
        set((s) => ({
          unlockedAchievements: s.unlockedAchievements.includes(id)
            ? s.unlockedAchievements
            : [...s.unlockedAchievements, id],
        })),

      hasDiscovered: (key) => get().discovered.has(key),
      hasAchievement: (id) => get().unlockedAchievements.includes(id),

      incrementProjectsInspected: () =>
        set((s) => ({ projectsInspected: s.projectsInspected + 1 })),
    }),
    {
      name: 'kaufee-world-discoveries',
      // Serialize Set → array
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          if (parsed?.state?.discovered) {
            parsed.state.discovered = new Set(parsed.state.discovered);
          }
          return parsed;
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              discovered: [...value.state.discovered],
            },
          };
          localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

// ─── STATE — UI STORE ─────────────────────────────────────────────────────────

interface UIState {
  // Achievement toast queue
  toastQueue: Array<{ id: string; title: string; description: string; icon: string }>;
  pushToast: (t: UIState['toastQueue'][number]) => void;
  popToast: () => void;

  // Interaction hint
  interactionHint: { label: string; type: string } | null;
  setInteractionHint: (h: UIState['interactionHint']) => void;

  // Recruiter mode
  recruiterModeOpen: boolean;
  setRecruiterModeOpen: (v: boolean) => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;

  // Loading
  loadingProgress: number;
  setLoadingProgress: (n: number) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  toastQueue: [],
  pushToast: (t) => set((s) => ({ toastQueue: [...s.toastQueue, t] })),
  popToast: () => set((s) => ({ toastQueue: s.toastQueue.slice(1) })),

  interactionHint: null,
  setInteractionHint: (h) => set({ interactionHint: h }),

  recruiterModeOpen: false,
  setRecruiterModeOpen: (v) => set({ recruiterModeOpen: v }),

  soundEnabled: false,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  loadingProgress: 0,
  setLoadingProgress: (n) => set({ loadingProgress: n }),
}));
