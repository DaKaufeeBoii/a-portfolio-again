import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { WORLD_INTERACTIONS } from '../data/interactions';
import { WORLD } from '../lib/constants';
import { useDiscoveryStore, useUIStore, useWorldStore } from '../state/stores';
import { soundFx } from '../utils/soundEffects';

export const NPC_RECIPIENTS = [
  {
    id: 'weights',
    name: 'Dr. Tensor',
    pos: [0, -44] as [number, number],
    district: 'AI Silicon Valley',
    hintMsg: 'DELIVER 1.5B NEURAL WEIGHTS TO DR. TENSOR',
    chatMsg: 'DISCUSS QUANTUM INFERENCE WITH DR. TENSOR',
    rewardMsg: 'AI Lab Neural Weights Delivered! Dr. Tensor optimized the RAG pipeline.',
  },
  {
    id: 'relay',
    name: 'Chief Byte',
    pos: [44, 2] as [number, number],
    district: 'Cargo Harbor',
    hintMsg: 'DELIVER IOT RELAY TO CHIEF BYTE',
    chatMsg: 'INSPECT CARGO HARBOR WITH CHIEF BYTE',
    rewardMsg: 'Cargo Harbor IoT Relay Delivered! Container telemetries are live.',
  },
  {
    id: 'joystick',
    name: 'Retro Bot',
    pos: [-44, -3] as [number, number],
    district: 'Neon Arcade',
    hintMsg: 'DELIVER GOLD JOYSTICK TO RETRO BOT',
    chatMsg: 'CHALLENGE RETRO BOT TO HIGH-SCORE RUN',
    rewardMsg: 'Arcade Gold Joystick Delivered! Retro Bot launched bonus speed mode.',
  },
  {
    id: 'scroll',
    name: 'Archivist Chronos',
    pos: [0, 46] as [number, number],
    district: 'Ancient Oasis',
    hintMsg: 'DELIVER DECRYPTED SCROLL TO ARCHIVIST CHRONOS',
    chatMsg: 'BROWSE SYSTEM CHRONICLES WITH CHRONOS',
    rewardMsg: 'Ancient Resume Scroll Restored! Historical archives decrypted.',
  },
  {
    id: 'beacon',
    name: 'Keeper Sandy',
    pos: [39, -39] as [number, number],
    district: 'Coastal Lighthouse',
    hintMsg: 'DELIVER QUANTUM BATTERY TO KEEPER SANDY',
    chatMsg: 'GREET KEEPER SANDY AT LIGHTHOUSE',
    rewardMsg: 'Lighthouse Beacon Powered Up! Ocean shipping lanes illuminated.',
  },
];

export function executeInteraction() {
  const world = useWorldStore.getState();
  const ui = useUIStore.getState();
  if (!world.worldReady || ui.recruiterModeOpen) return;

  if (world.openPanelId) {
    world.setOpenPanelId(null);
    return;
  }

  const pos = world.dronePosition;

  // 1. Postbox Parcel Pickup
  const distMail = Math.hypot(pos[0] - 3.2, pos[2] - 2.8);
  if (distMail < 4.5 && !world.activeDeliveryPackage) {
    const available = ['weights', 'relay', 'joystick', 'scroll', 'beacon'];
    const nextMission = available.find((m) => !world.completedDeliveries.includes(m)) || 'weights';
    world.startMission(nextMission);
    soundFx.packagePickup();
    const pkg = useWorldStore.getState().activeDeliveryPackage;
    ui.pushToast({
      id: 'pickup-' + Date.now(),
      title: '📦 Delivery Secured!',
      description: `Package clamped to drone! Deliver to ${pkg?.recipient || 'destination'}. Check radar!`,
      icon: '📬',
    });
    return;
  }

  // 2. Deliveries or Chats with NPCs
  for (const npc of NPC_RECIPIENTS) {
    const dist = Math.hypot(pos[0] - npc.pos[0], pos[2] - npc.pos[1]);
    if (dist < 4.5) {
      if (world.activeDeliveryPackage?.id === npc.id) {
        world.completeMission(npc.id);
        soundFx.packageDeliver();
        ui.pushToast({
          id: 'deliver-' + Date.now(),
          title: '🎉 Delivery Successful!',
          description: npc.rewardMsg,
          icon: '✨',
        });
        useDiscoveryStore.getState().unlockAchievement('deliverer');
        return;
      } else {
        soundFx.scoreChime();
        ui.pushToast({
          id: 'chat-' + Date.now(),
          title: `💬 ${npc.name}`,
          description: `Greetings from ${npc.district}! Complete parcel delivery missions across all 5 biomes.`,
          icon: '🏝️',
        });
        return;
      }
    }
  }

  // 3. Builder NPC / Sai
  const distBuilder = Math.hypot(pos[0] - (-1.5), pos[2] - (-3.5));
  if (distBuilder < 4.5) {
    soundFx.click();
    world.setOpenPanelId('builder');
    return;
  }

  // 4. World Interactions (projects, timeline artifacts, etc.)
  for (const target of WORLD_INTERACTIONS) {
    const dist = Math.hypot(pos[0] - target.position[0], pos[2] - target.position[2]);
    if (dist < WORLD.interactRadius) {
      soundFx.click();
      world.setOpenPanelId(target.id);
      if (target.id.startsWith('timeline-')) {
        useDiscoveryStore.getState().unlockAchievement('archaeologist');
      }
      return;
    }
  }
}

export function WorldInteractions() {
  const activeHintKey = useRef<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'KeyE' || event.repeat) return;
      executeInteraction();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useFrame(() => {
    const ui = useUIStore.getState();
    const world = useWorldStore.getState();
    const pos = world.dronePosition;
    const panelOpen = Boolean(world.openPanelId) || ui.recruiterModeOpen;

    if (!world.worldReady || panelOpen) {
      if (activeHintKey.current !== null) {
        activeHintKey.current = null;
        ui.setInteractionHint(null);
      }
      return;
    }

    let hint: { label: string; type: string } | null = null;
    let hintKey: string | null = null;

    // 1. Postbox
    const distMail = Math.hypot(pos[0] - 3.2, pos[2] - 2.8);
    if (distMail < 4.5) {
      if (!world.activeDeliveryPackage) {
        const available = ['weights', 'relay', 'joystick', 'scroll', 'beacon'];
        const nextMission = available.find((m) => !world.completedDeliveries.includes(m)) || 'weights';
        hint = { label: `PICK UP PARCEL FOR ${nextMission.toUpperCase()}`, type: 'delivery' };
        hintKey = 'mail-pickup';
      }
    }

    // 2. Delivery NPCs
    if (!hint) {
      for (const npc of NPC_RECIPIENTS) {
        const dist = Math.hypot(pos[0] - npc.pos[0], pos[2] - npc.pos[1]);
        if (dist < 4.5) {
          if (world.activeDeliveryPackage?.id === npc.id) {
            hint = { label: npc.hintMsg, type: 'delivery' };
            hintKey = `deliver-${npc.id}`;
          } else {
            hint = { label: npc.chatMsg, type: 'dialogue' };
            hintKey = `chat-${npc.id}`;
          }
          break;
        }
      }
    }

    // 3. Sai / Builder
    if (!hint) {
      const distBuilder = Math.hypot(pos[0] - (-1.5), pos[2] - (-3.5));
      if (distBuilder < 4.5) {
        hint = { label: 'TALK TO SAI VELAGALA', type: 'builder' };
        hintKey = 'builder-talk';
      }
    }

    // 4. World Interactions (projects, etc.)
    if (!hint) {
      let nearest: (typeof WORLD_INTERACTIONS)[number] | null = null;
      let nearestDistance: number = WORLD.interactRadius;
      for (const target of WORLD_INTERACTIONS) {
        const distance = Math.hypot(pos[0] - target.position[0], pos[2] - target.position[2]);
        if (distance < nearestDistance) {
          nearest = target;
          nearestDistance = distance;
        }
      }
      if (nearest) {
        hint = { label: nearest.label, type: 'INTERACT' };
        hintKey = nearest.id;
      }
    }

    if (activeHintKey.current !== hintKey) {
      activeHintKey.current = hintKey;
      ui.setInteractionHint(hint);
    }
  });

  return null;
}
