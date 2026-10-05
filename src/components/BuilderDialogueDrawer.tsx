import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useWorldStore } from '../state/stores';
import { soundFx } from '../utils/soundEffects';

interface BuilderDialogueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DialogueOption {
  text: string;
  nextStep?: number;
  action?: string;
  close?: boolean;
}

interface DialogueNode {
  speaker: string;
  text: string;
  options: DialogueOption[];
}

const DIALOGUES: DialogueNode[] = [
  {
    speaker: 'Sai (Builder)',
    text: "Welcome to Kaufee World. I built this interactive universe to showcase my production AI architectures, edge translators, and local agent experiments.",
    options: [
      { text: "Where should I start?", nextStep: 1 },
      { text: "Tell me about your FlyRank AI work.", nextStep: 2 },
      { text: "Take me to the AI Lab.", action: 'teleport-ailab' },
    ],
  },
  {
    speaker: 'Sai (Builder)',
    text: "Head North through the cyber gate to reach the AI Lab. East leads to Project City where ProjectPulse stands tall. South takes you to the Archive with my awards.",
    options: [
      { text: "Teleport to Project City", action: 'teleport-projectcity' },
      { text: "Thanks, I will fly there myself!", nextStep: 0, close: true },
    ],
  },
  {
    speaker: 'Sai (Builder)',
    text: "At FlyRank AI, I engineer production server-side AI systems: structured JSON contracts, automated evaluation harnesses, and resilient tool-calling workflows.",
    options: [
      { text: "Inspect Kaufee-Home (Local Agent)", action: 'inspect-kaufeehome' },
      { text: "Let's explore!", nextStep: 0, close: true },
    ],
  },
];

export const BuilderDialogueDrawer = ({ isOpen, onClose }: BuilderDialogueDrawerProps) => {
  const [step, setStep] = useState(0);
  const setTeleportTarget = useWorldStore((s) => s.setTeleportTarget);
  const setOpenPanelId = useWorldStore((s) => s.setOpenPanelId);

  if (!isOpen) return null;

  const current = DIALOGUES[step] || DIALOGUES[0];

  const handleOption = (opt: DialogueOption) => {
    soundFx.click();
    if (opt.action === 'teleport-ailab') {
      setTeleportTarget([0, 2.5, -22]);
      onClose();
    } else if (opt.action === 'teleport-projectcity') {
      setTeleportTarget([22, 0.5, 0]);
      onClose();
    } else if (opt.action === 'inspect-kaufeehome') {
      setOpenPanelId('kaufeehome');
      onClose();
    } else if (opt.close) {
      onClose();
    } else if (opt.nextStep !== undefined) {
      setStep(opt.nextStep);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '640px',
        zIndex: 85,
        animation: 'dialogue-pop 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          backgroundColor: 'rgba(10, 12, 19, 0.95)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8), var(--shadow-glow-amber)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)', boxShadow: '0 0 8px var(--amber)' }} />
            <span style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>
              {current.speaker}
            </span>
          </div>

          <button
            onClick={() => { soundFx.click(); onClose(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '14.5px', color: '#FFF', lineHeight: '1.6', marginBottom: '20px' }}>
          {current.text}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOption(opt)}
              className="btn btn-secondary btn-sm"
              style={{
                justifyContent: 'space-between',
                textAlign: 'left',
                padding: '10px 16px',
                fontSize: '13px',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <span>{opt.text}</span>
              <ArrowRight size={13} color="var(--amber)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
