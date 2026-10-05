import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { SkillsMatrix } from './components/SkillsMatrix';
import { AchievementsSection } from './components/AchievementsSection';
import { ContactSection } from './components/ContactSection';
import { ProjectDrawer } from './components/ProjectDrawer';
import { BuilderDialogueDrawer } from './components/BuilderDialogueDrawer';
import { ResumeModal } from './components/ResumeModal';
import { CommandPalette } from './components/CommandPalette';
import { KatamariGame } from './components/KatamariGame';
import { useWorldStore } from './state/stores';
import { soundFx } from './utils/soundEffects';

// Konami code sequence for triggering Katamari
const KONAMI = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
// Alternative: type "katamari" anywhere
const KATAMARI_SEQUENCE = 'katamari';

export default function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unlockedEggs, setUnlockedEggs] = useState<string[]>(['first_contact']);
  const [katamariOpen, setKatamariOpen] = useState(false);
  const [katamariHint, setKatamariHint] = useState(false);

  const konamiRef = useRef<string[]>([]);
  const typedRef = useRef('');
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const openPanelId = useWorldStore((s) => s.openPanelId);
  const setOpenPanelId = useWorldStore((s) => s.setOpenPanelId);
  const setWorldReady = useWorldStore((s) => s.setWorldReady);

  useEffect(() => {
    setWorldReady(true);
  }, [setWorldReady]);

  // Global keyboard: ⌘K, Konami, "katamari" text
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundFx.click();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Don't track shortcuts when katamari is open
      if (katamariOpen) return;

      const key = e.key.toLowerCase();

      // Konami code
      konamiRef.current.push(key);
      if (konamiRef.current.length > KONAMI.length) {
        konamiRef.current = konamiRef.current.slice(-KONAMI.length);
      }
      if (konamiRef.current.join(',') === KONAMI.join(',')) {
        konamiRef.current = [];
        typedRef.current = '';
        setKatamariOpen(true);
        setKatamariHint(false);
        return;
      }

      // Type "katamari"
      if (key.length === 1) {
        typedRef.current = (typedRef.current + key).slice(-KATAMARI_SEQUENCE.length);
        if (typedRef.current === KATAMARI_SEQUENCE) {
          typedRef.current = '';
          konamiRef.current = [];
          setKatamariOpen(true);
          setKatamariHint(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [katamariOpen]);

  // Show Katamari hint after 45s if not yet discovered
  useEffect(() => {
    hintTimerRef.current = setTimeout(() => {
      if (!katamariOpen && !unlockedEggs.includes('katamari_found')) {
        setKatamariHint(true);
        setTimeout(() => setKatamariHint(false), 8000);
      }
    }, 45000);
    return () => clearTimeout(hintTimerRef.current);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
  };

  const handleUnlockSecret = (id: string) => {
    if (!unlockedEggs.includes(id)) {
      setUnlockedEggs((prev) => [...prev, id]);
    }
  };

  const openKatamari = () => {
    setKatamariOpen(true);
    setKatamariHint(false);
    handleUnlockSecret('katamari_found');
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100dvh', overflowX: 'hidden' }}>

      {/* ── Ambient background layer ── */}
      <div className="bg-ambient">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* ── Navbar ── */}
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenResume={() => setResumeModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* ── Main Portfolio Sections ── */}
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero
          onOpenResume={() => setResumeModalOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        <ProjectShowcase />

        <InteractiveSimulator />

        <ExperienceTimeline />

        <SkillsMatrix />

        <AchievementsSection
          unlockedEggs={unlockedEggs}
          onUnlockSecret={handleUnlockSecret}
        />

        <ContactSection />
      </main>

      {/* ── Katamari Easter-Egg Hint Toast ── */}
      {katamariHint && (
        <div
          onClick={openKatamari}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 200,
            background: 'rgba(8,8,16,0.95)',
            border: '1px solid rgba(245,166,35,0.4)',
            borderRadius: '14px',
            padding: '14px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 40px rgba(245,166,35,0.15)',
            backdropFilter: 'blur(16px)',
            animation: 'fade-up 0.4s ease',
            maxWidth: '340px',
          }}
        >
          <span style={{ fontSize: '28px' }}>☕</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>
              Psst... there's a secret!
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Type <strong style={{ color: 'var(--amber)' }}>katamari</strong> or press ↑↑↓↓←→←→BA
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setKatamariHint(false); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              fontSize: '16px',
              marginLeft: 'auto',
              padding: '0 4px',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Project Detail Drawer ── */}
      <ProjectDrawer
        projectId={openPanelId !== 'builder' ? openPanelId : null}
        onClose={() => setOpenPanelId(null)}
      />

      {/* ── Builder Dialogue Drawer ── */}
      <BuilderDialogueDrawer
        isOpen={openPanelId === 'builder'}
        onClose={() => setOpenPanelId(null)}
      />

      {/* ── Resume Modal ── */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />

      {/* ── Command Palette ── */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenResume={() => setResumeModalOpen(true)}
        onUnlockSecret={handleUnlockSecret}
        onOpenKatamari={openKatamari}
      />

      {/* ── 🎮 Katamari Secret Game ── */}
      <KatamariGame
        isOpen={katamariOpen}
        onClose={() => setKatamariOpen(false)}
      />

      {/* ── Katamari trigger button (floating, discreet) ── */}
      <button
        onClick={openKatamari}
        title="Secret Game (type 'katamari' or Konami code)"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 150,
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(8px)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(245,166,35,0.12)';
          e.currentTarget.style.borderColor = 'rgba(245,166,35,0.35)';
          e.currentTarget.style.color = 'var(--amber)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ☕
      </button>
    </div>
  );
}
