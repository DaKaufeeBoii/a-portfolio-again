// Portfolio Data for Sai Tarun Reddy Velagala

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: 'AI / Full-Stack' | 'AI Agents / Systems' | 'Mobile / Edge AI' | 'Systems / Security' | 'Web 3D / Simulation';
  featured: boolean;
  metrics: string[];
  description: string;
  highlights: string[];
  tech: string[];
  github?: string;
  demo?: string;
  accentColor: string;
  architecture: {
    client: string;
    engine: string;
    storageOrSafety: string;
  };
  simulatorType?: 'agent-tool-calling' | 'risk-assessment' | 'offline-translator';
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  status: 'Current' | 'Completed';
  summary: string;
  highlights: string[];
  tech: string[];
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: string;
  badge: string;
  description: string;
}

export const PERSONAL_INFO = {
  name: 'Sai Tarun Reddy Velagala',
  handle: 'DaKaufeeBoii',
  nickname: 'Kaufee',
  headline: 'Backend AI Engineer & Systems Developer',
  bio: 'Specializing in production server-side AI systems, local agentic workflows, structured LLM outputs, and resilient full-stack applications. Currently building production AI systems at FlyRank AI.',
  email: 'saitarunrdy@gmail.com',
  phone: '+91 7043692980',
  location: 'Hyderabad, Telangana, India',
  education: {
    institution: 'KG Reddy College of Engineering and Technology',
    degree: 'B.Tech in Computer Science and Engineering (AI/ML Specialization)',
    period: 'September 2023 – Present',
    cgpa: '8.49 / 10.0',
    location: 'Moinabad, Telangana',
  },
  socials: {
    github: 'https://github.com/DaKaufeeBoii',
    linkedin: 'https://www.linkedin.com/in/vstr',
    existingOs: 'https://vstr-os.vercel.app',
  },
  resumePath: '/Sai_Tarun_Reddy_Velagala.pdf',
  availability: 'Open to High-Impact AI & Software Engineering Roles',
  currentRole: 'Backend AI Engineer Intern @ FlyRank AI',
};

export const WORK_EXPERIENCE: Experience[] = [
  {
    id: 'flyrank-ai',
    company: 'FlyRank AI',
    role: 'Backend AI Engineer Intern',
    period: 'Jul 2026 – Present',
    location: 'Remote',
    status: 'Current',
    summary: 'Developing production-ready server side AI systems with retrieval, structured outputs, API contracts, tool-calling workflows, and robust error handling.',
    highlights: [
      'Engineered server-side LLM tool-calling pipelines with deterministic fallback heuristics and schema validation.',
      'Designed lightweight evaluation datasets and testing harnesses to audit model correctness, precision, and latency.',
      'Constructed strict API contracts and robust error-recovery protocols for resilient multi-agent execution.',
    ],
    tech: ['Python', 'FastAPI', 'RAG Pipelines', 'Tool Calling', 'LLM Evals', 'Structured Outputs', 'REST APIs'],
  },
  {
    id: 'hackveda',
    company: 'Hackveda Solutions Private Limited',
    role: 'Python Developer Intern',
    period: 'Feb 2026 – May 2026',
    location: 'Remote',
    status: 'Completed',
    summary: 'Developed Python data-analysis programs to find and evaluate trading trends in investment companies.',
    highlights: [
      'Analyzed high-volume financial market data to discover algorithmic trading trends and risk indicators.',
      'Engineered automated data extraction and transformation pipelines with Pandas and NumPy.',
      'Presented quantifiable trend evaluations to improve decision-making accuracy for client investment portfolios.',
    ],
    tech: ['Python', 'Pandas', 'NumPy', 'Data Analysis', 'Time-Series Modeling', 'Git'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'projectpulse',
    name: 'ProjectPulse',
    tagline: 'AI-Powered Project Management & Risk Assessment Platform',
    category: 'AI / Full-Stack',
    featured: true,
    accentColor: '#F59E0B',
    metrics: ['Real-Time Kanban', 'Mistral AI Engine', 'RBAC Security', 'Rule-Based Fallbacks'],
    description: 'Full-stack collaborative project management platform featuring automated AI risk assessment, real-time workspace updates, Kanban task boards, and budget tracking.',
    highlights: [
      'Engineered automated project risk analysis using Mistral AI with seamless rule-based fallback when offline.',
      'Implemented role-based access control (RBAC) ensuring fine-grained permission security across organizational workspaces.',
      'Built reactive Kanban task boards with budget threshold alerts and live status collaboration.',
    ],
    tech: ['Next.js', 'React', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Mistral AI', 'TypeScript'],
    github: 'https://github.com/DaKaufeeBoii/ProjectPulse',
    demo: 'https://project-pulse-ver2.vercel.app',
    architecture: {
      client: 'Next.js App Router + Optimistic UI Updates',
      engine: 'Mistral AI Inference API + Rule Fallback Heuristics',
      storageOrSafety: 'PostgreSQL + Prisma ORM + RBAC Guards',
    },
    simulatorType: 'risk-assessment',
  },
  {
    id: 'kaufeehome',
    name: 'Kaufee-Home',
    tagline: 'Privacy-First Local Desktop AI Agent with Voice & Tool Calling',
    category: 'AI Agents / Systems',
    featured: true,
    accentColor: '#38BDF8',
    metrics: ['100% On-Device', 'Zero Cloud Telemetry', 'Permission-Gated', 'Vosk Offline Voice'],
    description: 'Autonomous desktop AI agent running entirely locally on Ollama. Executes natural-language file operations, app launching, and system diagnostics with strict safety guardrails.',
    highlights: [
      'Constructed a zero-cloud tool-calling engine executing system operations, file search, and hardware telemetry.',
      'Designed a permission-gated execution security layer preventing unintended shell execution without confirmation.',
      'Integrated hands-free voice workflows utilizing Vosk offline speech recognition and low-latency local TTS.',
    ],
    tech: ['Python', 'Ollama', 'SQLite', 'Vosk STT', 'Local TTS', 'FastAPI', 'OS Subsystems'],
    github: 'https://github.com/DaKaufeeBoii/Kaufee-Home',
    architecture: {
      client: 'Voice STT (Vosk) / CLI Terminal Stream',
      engine: 'Ollama Local LLM (Llama 3 / Mistral) with Tool Bindings',
      storageOrSafety: 'Permission Gatekeeper + Local SQLite History',
    },
    simulatorType: 'agent-tool-calling',
  },
  {
    id: 'bharatvaani',
    name: 'BharatVaani',
    tagline: 'Fully Offline Multilingual Android Translator for Indian Languages',
    category: 'Mobile / Edge AI',
    featured: true,
    accentColor: '#10B981',
    metrics: ['5 Indian Languages', 'Zero Data Usage', 'Vosk Speech Engine', 'Hilt DI + MVVM'],
    description: 'High-performance Android speech and translation application operating completely without an internet connection across five languages.',
    highlights: [
      'Packaged on-device Google ML Kit translation modules for instant bidirectional translation without network calls.',
      'Integrated offline acoustic Vosk speech recognition with native Android Text-to-Speech for seamless voice conversations.',
      'Architected following modern Android best practices: MVVM, Clean Architecture, Repository Pattern, and Hilt DI.',
    ],
    tech: ['Kotlin', 'Jetpack Compose', 'Google ML Kit', 'Vosk Speech', 'Hilt', 'Coroutines', 'Android TTS'],
    architecture: {
      client: 'Jetpack Compose Declarative UI + Material 3',
      engine: 'On-Device Google ML Kit Models + Vosk Acoustic Engine',
      storageOrSafety: 'MVVM Clean Architecture + Repository Layer',
    },
    simulatorType: 'offline-translator',
  },
  {
    id: 'wsentry',
    name: 'WSENTRY',
    tagline: 'Workspace Security & Hardware Access Management Architecture',
    category: 'Systems / Security',
    featured: false,
    accentColor: '#A855F7',
    metrics: ['Granular Access Audit', 'Security-First', 'Cryptographic Checks'],
    description: 'Security-focused workspace entry and credential verification system engineered in Python for robust physical and logical boundary protection.',
    highlights: [
      'Engineered credential verification pipelines with multi-tier access permission trees.',
      'Maintained immutable access audit logs for compliance and incident tracking.',
    ],
    tech: ['Python', 'Security Engineering', 'Access Control Trees', 'System Integration'],
    github: 'https://github.com/DaKaufeeBoii/WSENTRY',
    architecture: {
      client: 'Entry Terminal Interface',
      engine: 'Policy Decision Point Engine',
      storageOrSafety: 'Encrypted Credential Store & Audit Log',
    },
  },
  {
    id: 'bumpcarts',
    name: 'Bump-Carts',
    tagline: 'Real-Time Physics & Collision Simulation Experiment',
    category: 'Web 3D / Simulation',
    featured: false,
    accentColor: '#EC4899',
    metrics: ['Rigid Body Collisions', 'Three.js Rendering', '60 FPS Physics'],
    description: 'Interactive web-based physics simulation investigating rigid body momentum transfer, continuous collision detection, and responsive 3D visualization.',
    highlights: [
      'Implemented real-time 3D physics calculations for vehicle dynamics and elastic collisions.',
      'Optimized Three.js rendering loop with frame-rate independence and smooth camera damping.',
    ],
    tech: ['TypeScript', 'Three.js', 'Physics Simulation', 'Vector Mathematics'],
    github: 'https://github.com/DaKaufeeBoii/Bump-Carts',
    architecture: {
      client: 'WebGL Canvas Viewport',
      engine: 'Custom Rigid Body Physics Tick Loop',
      storageOrSafety: 'Zero-latency Local State Buffer',
    },
  },
];

export const SKILL_CATEGORIES = [
  {
    id: 'ai-agents',
    name: 'AI, LLMs & Agents',
    description: 'Production architectures, local inference, and agentic workflows',
    skills: [
      { name: 'LLM Applications', level: 'Expert', hot: true },
      { name: 'AI Agents', level: 'Expert', hot: true },
      { name: 'RAG Pipelines', level: 'Advanced', hot: true },
      { name: 'Tool Calling / MCP', level: 'Expert', hot: true },
      { name: 'Structured Outputs', level: 'Expert', hot: true },
      { name: 'Model Evaluation & Rubrics', level: 'Advanced', hot: true },
      { name: 'Ollama & Local Models', level: 'Expert', hot: true },
      { name: 'Prompt Engineering', level: 'Advanced' },
      { name: 'NLP & Tokenization', level: 'Advanced' },
    ],
  },
  {
    id: 'backend-systems',
    name: 'Backend & Systems',
    description: 'High-reliability server APIs, databases, and microservices',
    skills: [
      { name: 'Python', level: 'Expert', hot: true },
      { name: 'FastAPI', level: 'Advanced', hot: true },
      { name: 'REST API Contracts', level: 'Advanced' },
      { name: 'SQL & PostgreSQL', level: 'Advanced' },
      { name: 'SQLite (Local DB)', level: 'Expert' },
      { name: 'Prisma ORM', level: 'Advanced' },
      { name: 'Supabase', level: 'Proficient' },
      { name: 'Data Analysis (Pandas/NumPy)', level: 'Advanced' },
    ],
  },
  {
    id: 'frontend-mobile',
    name: 'Frontend & Mobile',
    description: 'Modern reactive user interfaces, component design, and edge Android',
    skills: [
      { name: 'TypeScript', level: 'Advanced', hot: true },
      { name: 'React', level: 'Advanced', hot: true },
      { name: 'Next.js', level: 'Advanced', hot: true },
      { name: 'Vanilla & Modern CSS', level: 'Expert' },
      { name: 'Tailwind CSS', level: 'Advanced' },
      { name: 'Kotlin', level: 'Proficient' },
      { name: 'Jetpack Compose', level: 'Proficient' },
      { name: 'Google ML Kit', level: 'Advanced' },
    ],
  },
  {
    id: 'core-devops',
    name: 'Engineering Practices & Tooling',
    description: 'Architectural patterns, version control, and testing harnesses',
    skills: [
      { name: 'Git & GitHub Workflows', level: 'Expert' },
      { name: 'MVVM & Clean Architecture', level: 'Advanced' },
      { name: 'Dependency Injection (Hilt)', level: 'Proficient' },
      { name: 'Offline-First Engineering', level: 'Expert', hot: true },
      { name: 'Problem Solving & Algorithms', level: 'Advanced' },
      { name: 'Technical Documentation', level: 'Advanced' },
    ],
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ikarus-2024',
    title: 'First Prize Winner',
    organization: 'IKARUS 2024 Inter-College Technical Fest',
    year: '2024',
    badge: '🏆 1st Prize',
    description: 'Competed against top engineering colleges and won 1st Place for technical project innovation and live execution.',
  },
  {
    id: 'best-student-2025',
    title: 'Best Student Award',
    organization: 'KG Reddy College of Engineering & Tech (CSE-AIML)',
    year: '2025',
    badge: '⭐ Department Honors',
    description: 'Awarded to the top performing student across academic rigor, extracurricular contributions, and engineering project leadership.',
  },
  {
    id: 'cgpa-excellence',
    title: 'Academic Honor Roll (CGPA 8.49)',
    organization: 'B.Tech Computer Science & Engineering (AI/ML)',
    year: '2023 – Present',
    badge: '🎓 CGPA 8.49',
    description: 'Consistent top percentile academic standing across Data Structures, Algorithms, Machine Learning, and Database Systems.',
  },
];

export const EASTER_EGG_ACHIEVEMENTS = [
  { id: 'first_contact', name: 'First Contact', desc: 'Loaded the Kaufee Engine command center' },
  { id: 'architect', name: 'System Architect', desc: 'Inspected deep architecture diagrams' },
  { id: 'agent_runner', name: 'Agent Operator', desc: 'Executed a live simulation in the AI Sandbox' },
  { id: 'terminal_pro', name: 'Command Line Guru', desc: 'Discovered and executed a secret terminal command' },
  { id: 'recruiter_vip', name: 'Recruiter Fast-Track', desc: 'Viewed the one-click resume & dispatched contact' },
  { id: 'katamari_found', name: '☕ Katamari Master', desc: 'Discovered and played the secret Katamari game' },
];
