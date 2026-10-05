import { useState, useEffect } from 'react';
import { Terminal, FileText, Volume2, VolumeX, Menu, X } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenResume: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar = ({
  onOpenCommandPalette,
  onOpenResume,
  soundEnabled,
  onToggleSound,
}: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'Sandbox', href: '#ai-sandbox' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    soundFx.click();
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: scrolled ? '10px 0' : '16px 0',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Floating pill nav container */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: scrolled ? '10px 18px' : '12px 20px',
              borderRadius: scrolled ? '16px' : '20px',
              background: scrolled
                ? 'rgba(8, 8, 12, 0.90)'
                : 'rgba(8, 8, 12, 0.50)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid',
              borderColor: scrolled
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: scrolled
                ? '0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04) inset'
                : 'none',
              transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* ── Brand ── */}
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); soundFx.click(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                padding: 0,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, rgba(245,166,35,0.25), rgba(62,207,207,0.15))',
                  border: '1px solid rgba(245,166,35,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '15px',
                  color: 'var(--amber)',
                  boxShadow: '0 0 12px rgba(245,166,35,0.2)',
                  flexShrink: 0,
                }}
              >
                K
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                    Kaufee
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--amber)',
                    opacity: 0.8,
                    background: 'rgba(245,166,35,0.08)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                  }}>
                    v3
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  AI Engineer
                </div>
              </div>
            </button>

            {/* ── Desktop Nav Links ── */}
            <nav className="desktop-nav" style={{
              display: 'none',
              alignItems: 'center',
              gap: '2px',
            }}>
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  onMouseEnter={() => soundFx.hover()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    padding: '6px 13px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    letterSpacing: '-0.01em',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* ── Action Buttons ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* ⌘K */}
              <button
                onClick={() => { soundFx.click(); onOpenCommandPalette(); }}
                title="Command Palette (⌘K)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  padding: '6px 10px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11.5px',
                  transition: 'all 0.18s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)';
                  e.currentTarget.style.color = 'var(--amber)';
                  e.currentTarget.style.background = 'rgba(245,166,35,0.06)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
              >
                <Terminal size={13} />
                <span className="hidden-mobile">⌘K</span>
              </button>

              {/* Sound toggle */}
              <button
                onClick={() => { soundFx.click(); onToggleSound(); }}
                title={soundEnabled ? 'Mute' : 'Unmute'}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: soundEnabled ? 'var(--amber)' : 'var(--text-dim)',
                  padding: '6px 9px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.18s ease',
                }}
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>

              {/* Resume */}
              <button
                onClick={() => { soundFx.click(); onOpenResume(); }}
                className="btn btn-primary btn-sm hidden-mobile"
                style={{ gap: '6px' }}
              >
                <FileText size={13} />
                Resume
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => { soundFx.click(); setMobileMenuOpen(!mobileMenuOpen); }}
                className="mobile-menu-btn"
                style={{
                  display: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  padding: '7px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                }}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '24px',
            right: '24px',
            background: 'rgba(8, 8, 14, 0.96)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            backdropFilter: 'blur(24px)',
            boxShadow: 'var(--shadow-lg)',
          }}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontWeight: 600,
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  letterSpacing: '-0.02em',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {link.label}
              </button>
            ))}
            <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-faint)', marginTop: '4px' }}>
              <a href={PERSONAL_INFO.socials.github} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                GitHub
              </a>
              <a href={PERSONAL_INFO.socials.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                LinkedIn
              </a>
              <button onClick={() => { soundFx.click(); onOpenResume(); }} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Resume
              </button>
            </div>
          </div>
        )}

        <style>{`
          @media (min-width: 860px) {
            .desktop-nav { display: flex !important; }
          }
          @media (max-width: 859px) {
            .mobile-menu-btn { display: flex !important; }
            .hidden-mobile { display: none !important; }
          }
        `}</style>
      </header>
    </>
  );
};
