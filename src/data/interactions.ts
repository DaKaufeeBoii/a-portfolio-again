import { PROJECTS, TIMELINE } from './index';

export interface WorldInteraction {
  id: string;
  label: string;
  description: string;
  position: [number, number, number];
}

export const WORLD_INTERACTIONS: WorldInteraction[] = [
  {
    id: 'mail-depot',
    label: 'Open Messenger Delivery Depot',
    description: 'Dispatch central for delivering parcels and packages across the archipelago islands.',
    position: [3.2, 0, 2.8],
  },
  {
    id: 'builder',
    label: 'Talk to Sai the Builder',
    description: 'Sai Velagala (Kaufee) — Backend AI Engineer and creator of this archipelago.',
    position: [-1.8, 0, -3.2],
  },
  ...PROJECTS.map((project) => ({
    id: project.id,
    label: `Inspect ${project.name}`,
    description: project.shortDesc,
    position: project.districtPosition,
  })),
  {
    id: 'rag-exhibit',
    label: 'Inspect the RAG pipeline',
    description: 'Follow the flow from source documents through retrieval and context assembly to a language model.',
    position: [0, 3.5, -48],
  },
  {
    id: 'lab-workstation',
    label: 'Inspect the AI workstation',
    description: 'A closer look at the tools and experiments behind the AI Lab.',
    position: [-6, 3.5, -43],
  },
  {
    id: 'arcade-game',
    label: 'Inspect Kaufee Dodge',
    description: 'A physics-based bumper cart game experiment built to explore real-time collision and multiplayer patterns.',
    position: [-52, 0.5, -4],
  },
  ...TIMELINE.map((event) => ({
    id: `timeline-${event.id}`,
    label: `Read ${event.year}: ${event.label}`,
    description: event.description,
    position: [-5.2, -2, event.archivePosition[2] + 26] as [number, number, number],
  })),
  {
    id: 'archive-machines',
    label: 'Inspect the retired machines',
    description: 'Old terminals and early experiments preserved in the Archive.',
    position: [-7, -2, 46],
  },
  {
    id: 'archive-diagnostic',
    label: 'Read the diagnostic terminal',
    description: 'A field note on diagnosing a drone power failure.',
    position: [6, -2, 40],
  },
  {
    id: 'lighthouse-beacon',
    label: 'Inspect Coastal Lighthouse',
    description: 'The towering marine beacon guiding air messengers across the northern reefs.',
    position: [42, 5.5, -42],
  },
];
