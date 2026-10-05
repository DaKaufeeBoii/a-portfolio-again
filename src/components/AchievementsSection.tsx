import { Trophy, Sparkles, CheckCircle2, Lock, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ACHIEVEMENTS, EASTER_EGG_ACHIEVEMENTS } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

interface AchievementsProps {
  unlockedEggs: string[];
  onUnlockSecret: (id: string) => void;
}

export const AchievementsSection = ({ unlockedEggs, onUnlockSecret }: AchievementsProps) => {
  const triggerConfetti = () => {
    soundFx.achievement();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#F5A623', '#3ECFCF', '#22D3AE', '#A78BFA'],
    });
  };

  const handleEggClick = (id: string) => {
    if (!unlockedEggs.includes(id)) {
      onUnlockSecret(id);
    }
    triggerConfetti();
  };

  return (
    <section id="achievements" className="section" style={{ position: 'relative' }}>
      <div className="container">

        {/* — Header — */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-tag">
            <Trophy size={12} />
            Honors & Recognition
          </div>
          <h2 className="section-title" style={{ marginBottom: '14px' }}>
            Achievements & <span className="gradient-amber">Accolades</span>
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Recognized for project execution, academic excellence, and competitive technical problem-solving.
          </p>
        </div>

        {/* — Achievement cards — */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {ACHIEVEMENTS.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '28px',
                border: '1px solid rgba(245,166,35,0.2)',
              }}
              onMouseEnter={() => soundFx.hover()}
            >
              <div className="accent-line" style={{ background: 'linear-gradient(90deg, var(--amber), transparent)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="pill amber" style={{ fontWeight: 700, fontSize: '12px' }}>
                  {item.badge}
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                  {item.year}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '6px' }}>
                {item.title}
              </h3>
              <div style={{ fontSize: '13px', color: 'var(--amber)', fontWeight: 600, marginBottom: '12px' }}>
                {item.organization}
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* — Easter egg discovery panel — */}
        <div style={{
          background: 'rgba(255,255,255,0.015)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--r-xl)',
          padding: '28px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Gift size={15} style={{ color: 'var(--cyan)' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Discovery Badges ({unlockedEggs.length} / {EASTER_EGG_ACHIEVEMENTS.length})
                </h4>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                Interactive secrets hidden in the console and interface. Click any to celebrate!
              </p>
            </div>

            <button
              onClick={triggerConfetti}
              className="btn btn-secondary btn-sm"
            >
              <Sparkles size={13} style={{ color: 'var(--amber)' }} />
              Celebrate
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
            {EASTER_EGG_ACHIEVEMENTS.map((egg) => {
              const unlocked = unlockedEggs.includes(egg.id);
              return (
                <div
                  key={egg.id}
                  onClick={() => handleEggClick(egg.id)}
                  style={{
                    padding: '13px',
                    borderRadius: 'var(--r-md)',
                    background: unlocked ? 'rgba(62,207,207,0.06)' : 'rgba(255,255,255,0.02)',
                    border: unlocked ? '1px solid rgba(62,207,207,0.25)' : '1px solid var(--border-faint)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    soundFx.hover();
                    e.currentTarget.style.background = unlocked
                      ? 'rgba(62,207,207,0.1)'
                      : 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = unlocked
                      ? 'rgba(62,207,207,0.06)'
                      : 'rgba(255,255,255,0.02)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                    {unlocked
                      ? <CheckCircle2 size={13} style={{ color: 'var(--cyan)' }} />
                      : <Lock size={13} style={{ color: 'var(--text-dim)' }} />
                    }
                    <span style={{ fontSize: '12px', fontWeight: 700, color: unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {egg.name}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                    {egg.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
