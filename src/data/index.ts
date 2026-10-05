// ─── DATA — PROJECTS ──────────────────────────────────────────────────────────

export type InteractionType = 'INSPECT' | 'ENTER' | 'SCAN' | 'READ' | 'PLAY' | 'COLLECT' | 'TALK';

export interface Project {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  stack: string[];
  highlights: string[];
  github?: string;
  demo?: string;
  districtPosition: [number, number, number]; // [x, y, z] in world space
  artifactType: 'studio' | 'station' | 'booth' | 'terminal' | 'cabinet';
  accentColor: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'projectpulse',
    name: 'ProjectPulse',
    category: 'AI / Full Stack',
    shortDesc: 'AI-powered project management platform with real-time collaboration.',
    longDesc:
      'Full-stack project management system built with Next.js and PostgreSQL. Features Kanban workflows, budget monitoring, role-based access control, and an AI risk assessment engine powered by Mistral AI with rule-based fallback analysis.',
    stack: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Mistral AI'],
    highlights: [
      'Real-time collaborative workspaces',
      'AI-driven project risk assessment',
      'Kanban + budget monitoring',
      'Role-based access control',
      'Rule-based fallback analysis',
    ],
    github: 'https://github.com/DaKaufeeBoii/ProjectPulse',
    demo: 'https://project-pulse-ver2.vercel.app',
    districtPosition: [52, 1.0, -4],
    artifactType: 'studio',
    accentColor: '#F0A050',
  },
  {
    id: 'kaufeehome',
    name: 'Kaufee-Home',
    category: 'AI Agents / Desktop',
    shortDesc: 'Privacy-first local desktop AI agent — no cloud, no compromise.',
    longDesc:
      'A local AI agent that runs entirely on-device using Ollama. Enables natural-language file search, application launching, system monitoring, and filesystem operations. Uses tool-calling, permission-gated execution, voice-driven workflows, and local speech recognition with TTS.',
    stack: ['Python', 'Ollama', 'SQLite', 'Vosk (speech)', 'FastAPI'],
    highlights: [
      'Fully local — zero cloud dependency',
      'Tool calling + permission-gated execution',
      'Voice-driven workflows with local STT/TTS',
      'Natural-language filesystem operations',
      'System monitoring integration',
    ],
    github: 'https://github.com/DaKaufeeBoii/Kaufee-Home',
    districtPosition: [44, 1.0, 2],
    artifactType: 'station',
    accentColor: '#8FCFFF',
  },
  {
    id: 'bharatvaani',
    name: 'BharatVaani',
    category: 'Android / NLP',
    shortDesc: 'Fully offline multilingual Android translator for five languages.',
    longDesc:
      'An Android translator that works completely offline. Supports five Indian languages with bidirectional translation, offline speech recognition via Vosk, Android TTS, MVVM architecture, and Dependency Injection via Hilt.',
    stack: ['Kotlin', 'Jetpack Compose', 'Google ML Kit', 'Vosk', 'Hilt'],
    highlights: [
      '100% offline — no internet required',
      'Five languages, bidirectional',
      'Offline speech recognition (Vosk)',
      'MVVM + Repository Pattern',
      'Dependency Injection via Hilt',
    ],
    github: undefined,
    districtPosition: [48, 1.0, 6],
    artifactType: 'booth',
    accentColor: '#A0E8C0',
  },
  {
    id: 'wsentry',
    name: 'WSENTRY',
    category: 'Security / Systems',
    shortDesc: 'Workspace security and access management system.',
    longDesc:
      'A major project for workspace entry and access control. Built in Python with a focus on robust security patterns and system-level integration.',
    stack: ['Python'],
    highlights: [
      'Workspace access management',
      'Security-focused architecture',
    ],
    github: 'https://github.com/DaKaufeeBoii/WSENTRY',
    districtPosition: [52, 1.0, 4],
    artifactType: 'terminal',
    accentColor: '#C0A0FF',
  },
  {
    id: 'bumpcarts',
    name: 'Bump-Carts',
    category: 'Game / Experiment',
    shortDesc: 'A physics-based bumper cart game experiment.',
    longDesc:
      'A TypeScript-based physics game experiment with bumper cart mechanics. Built as a technical exploration of real-time physics and multiplayer patterns.',
    stack: ['TypeScript', 'Three.js'],
    highlights: [
      'Physics-based gameplay',
      'Real-time collision handling',
    ],
    github: 'https://github.com/DaKaufeeBoii/Bump-Carts',
    districtPosition: [54, 1.0, -7],
    artifactType: 'cabinet',
    accentColor: '#FFD080',
  },
];

// ─── DATA — EXPERIENCE ────────────────────────────────────────────────────────

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  year: number;
}

export const EXPERIENCE: Experience[] = [
  {
    id: 'flyrank',
    company: 'FlyRank AI',
    role: 'Backend AI Engineer Intern',
    period: 'July 2026 – Present',
    location: 'Remote',
    highlights: [
      'Production-ready server-side AI systems',
      'Retrieval & structured outputs',
      'API contracts + tool-calling workflows',
      'Error handling + evaluation datasets',
      'Evaluation harnesses',
    ],
    year: 2026,
  },
  {
    id: 'hackveda',
    company: 'Hackveda Solutions Private Limited',
    role: 'Python Developer Intern',
    period: 'February 2026 – May 2026',
    location: 'Remote',
    highlights: [
      'Python data-analysis programs',
      'Investment trend evaluation',
      'Trading pattern analysis',
    ],
    year: 2026,
  },
];

// ─── DATA — TIMELINE ──────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  year: number;
  label: string;
  description: string;
  type: 'education' | 'internship' | 'achievement' | 'project';
  archivePosition: [number, number, number];
}

export const TIMELINE: TimelineEvent[] = [
  {
    id: 'kgrcet-start',
    year: 2023,
    label: 'KGRCET — B.Tech CSE AI/ML Begins',
    description: 'Enrolled at KG Reddy College of Engineering and Technology, Bachelor of CSE with AI/ML Specialization.',
    type: 'education',
    archivePosition: [-6, -2, 12],
  },
  {
    id: 'ikarus-2024',
    year: 2024,
    label: 'IKARUS 2024 — First Prize',
    description: 'First Prize Winner, IKARUS Inter-College Technical Fest.',
    type: 'achievement',
    archivePosition: [-2, -2, 16],
  },
  {
    id: 'best-student-2025',
    year: 2025,
    label: 'Best Student Award',
    description: 'Best Student Award 2025, CSE-AIML Department.',
    type: 'achievement',
    archivePosition: [2, -2, 20],
  },
  {
    id: 'hackveda-2026',
    year: 2026,
    label: 'Hackveda Solutions — Python Intern',
    description: 'Python Developer Intern, data analysis and trading trend evaluation.',
    type: 'internship',
    archivePosition: [4, -2, 22],
  },
  {
    id: 'flyrank-2026',
    year: 2026,
    label: 'FlyRank AI — Backend AI Intern',
    description: 'Building production-ready server-side AI systems: retrieval, structured outputs, tool-calling workflows.',
    type: 'internship',
    archivePosition: [6, -2, 24],
  },
];

// ─── DATA — ACHIEVEMENTS ──────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji or symbol
  condition: string; // internal trigger key
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-contact',
    title: 'First Contact',
    description: 'Met the Builder.',
    icon: '◈',
    condition: 'met_builder',
  },
  {
    id: 'system-architect',
    title: 'System Architect',
    description: 'Inspected three projects.',
    icon: '⬡',
    condition: 'inspected_three_projects',
  },
  {
    id: 'local-ai',
    title: 'Local AI',
    description: 'Discovered Kaufee-Home.',
    icon: '⬙',
    condition: 'found_kaufeehome',
  },
  {
    id: 'archaeologist',
    title: 'Archaeologist',
    description: 'Found an archived milestone.',
    icon: '◰',
    condition: 'visited_archive',
  },
  {
    id: 'player-2',
    title: 'Player 2',
    description: 'Opened with a gamepad.',
    icon: '◫',
    condition: 'used_gamepad',
  },
  {
    id: 'curious',
    title: 'Curious',
    description: 'Found a hidden interaction.',
    icon: '◎',
    condition: 'found_hidden',
  },
  {
    id: 'chaos-engineer',
    title: 'Chaos Engineer',
    description: 'Found the secret room.',
    icon: '◬',
    condition: 'found_secret',
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Discovered everything.',
    icon: '◉',
    condition: 'completed_world',
  },
];

// ─── DATA — SOCIALS ───────────────────────────────────────────────────────────

export const SOCIALS = {
  github: 'https://github.com/DaKaufeeBoii',
  linkedin: 'https://www.linkedin.com/in/vstr',
  email: undefined as string | undefined, // not publicly documented
};
