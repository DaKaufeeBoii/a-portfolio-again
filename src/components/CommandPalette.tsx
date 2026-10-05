import { useState, useEffect, type ReactNode } from 'react';
import { 
  Terminal, 
  X, 
  FolderGit2, 
  Cpu, 
  Briefcase, 
  Award, 
  FileText, 
  Mail, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  Code,
  Gamepad2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  onUnlockSecret: (id: string) => void;
  onOpenKatamari?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: ReactNode;
  action: () => void;
}

export const CommandPalette = ({
  isOpen,
  onClose,
  onOpenResume,
  onUnlockSecret,
  onOpenKatamari,
}: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const scrollTo = (id: string) => {
    soundFx.click();
    onClose();
    const elem = document.querySelector(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyContact = (text: string, label: string) => {
    soundFx.click();
    navigator.clipboard.writeText(text);
    setCopiedStatus(`Copied ${label}!`);
    setTimeout(() => {
      setCopiedStatus(null);
      onClose();
    }, 1200);
  };

  const triggerSecret = () => {
    soundFx.achievement();
    onUnlockSecret('terminal_pro');
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    setCopiedStatus('🎉 Terminal Guru Achievement Unlocked!');
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  const commands: CommandItem[] = [
    {
      id: 'projects',
      title: 'Navigate to Projects Showcase',
      category: 'Navigation',
      icon: <FolderGit2 size={16} color="var(--amber)" />,
      action: () => scrollTo('#projects'),
    },
    {
      id: 'sandbox',
      title: 'Open Interactive AI & Architecture Sandbox',
      category: 'Simulators',
      icon: <Cpu size={16} color="var(--cyan)" />,
      action: () => scrollTo('#ai-sandbox'),
    },
    {
      id: 'experience',
      title: 'View FlyRank AI & Hackveda Experience',
      category: 'Career',
      icon: <Briefcase size={16} color="var(--emerald)" />,
      action: () => scrollTo('#experience'),
    },
    {
      id: 'skills',
      title: 'Explore Technology & Tools Matrix',
      category: 'Navigation',
      icon: <Code size={16} color="var(--purple)" />,
      action: () => scrollTo('#skills'),
    },
    {
      id: 'achievements',
      title: 'Inspect Awards & Honors (IKARUS First Prize)',
      category: 'Navigation',
      icon: <Award size={16} color="var(--amber)" />,
      action: () => scrollTo('#achievements'),
    },
    {
      id: 'resume',
      title: 'Open Official Resume PDF Viewer',
      category: 'Documents',
      icon: <FileText size={16} color="var(--cyan)" />,
      action: () => { soundFx.click(); onClose(); onOpenResume(); },
    },
    {
      id: 'copy-email',
      title: `Copy Email (${PERSONAL_INFO.email})`,
      category: 'Contact',
      icon: <Mail size={16} color="var(--emerald)" />,
      action: () => copyContact(PERSONAL_INFO.email, 'Email'),
    },
    {
      id: 'copy-phone',
      title: `Copy Phone Number (${PERSONAL_INFO.phone})`,
      category: 'Contact',
      icon: <Phone size={16} color="var(--emerald)" />,
      action: () => copyContact(PERSONAL_INFO.phone, 'Phone'),
    },
    {
      id: 'secret-easter-egg',
      title: 'exec kaufee_matrix_overdrive() // Secret Easter Egg',
      category: 'Secrets',
      icon: <Sparkles size={16} color="var(--amber)" />,
      action: triggerSecret,
    },
    {
      id: 'play-katamari',
      title: '🎮 Play Katamari — Roll up the portfolio!',
      category: 'Secrets',
      icon: <Gamepad2 size={16} color="var(--purple)" />,
      action: () => {
        soundFx.click();
        onUnlockSecret('katamari_found');
        onClose();
        onOpenKatamari?.();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px 20px 20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFx.click();
          onClose();
        }
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          backgroundColor: '#090B12',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), var(--shadow-glow-cyan)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(15, 18, 28, 0.9)',
          }}
        >
          <Terminal size={18} color="var(--cyan)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or query (e.g. 'sandbox', 'email', 'projects')..."
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#FFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          {copiedStatus && (
            <span style={{ color: 'var(--emerald)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              {copiedStatus}
            </span>
          )}
          <button
            onClick={() => { soundFx.click(); onClose(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Command List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              No matching commands found. Try 'projects', 'resume', or 'sandbox'.
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <div
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => soundFx.hover()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  marginBottom: '4px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {cmd.icon}
                  <span style={{ fontSize: '13.5px', color: '#E2E8F0', fontWeight: 500 }}>
                    {cmd.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    {cmd.category}
                  </span>
                  <ArrowRight size={13} color="var(--text-dim)" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(15, 18, 28, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)',
          }}
        >
          <span>Navigate with mouse or click</span>
          <span>ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
