import { useState } from 'react';
import { Cpu, Search, Flame } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

const LEVEL_COLORS: Record<string, string> = {
  Expert: 'var(--amber)',
  Advanced: 'var(--cyan)',
  Proficient: 'var(--emerald)',
};

export const SkillsMatrix = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    skills: cat.skills.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => {
    if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
    return cat.skills.length > 0;
  });

  return (
    <section id="skills" className="section" style={{ position: 'relative' }}>
      <div className="container">

        {/* — Header — */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-tag">
            <Cpu size={12} />
            Technical Stack
          </div>
          <h2 className="section-title" style={{ marginBottom: '14px' }}>
            Skills & <span className="gradient-amber">Technology Matrix</span>
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Production-tested proficiencies across AI, backends, mobile edge inference, and reactive frontends.
          </p>
        </div>

        {/* — Search & Filter — */}
        <div style={{ maxWidth: '640px', margin: '0 auto 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills: FastAPI, RAG, Ollama, Kotlin..."
              className="input"
              style={{ paddingLeft: '42px', borderRadius: 'var(--r-full)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { soundFx.click(); setSelectedCategory('all'); }}
              className="pill"
              style={{
                cursor: 'pointer',
                padding: '5px 14px',
                fontSize: '12.5px',
                fontFamily: 'var(--font-sans)',
                fontWeight: selectedCategory === 'all' ? 700 : 500,
                ...(selectedCategory === 'all' ? { color: 'var(--amber)', background: 'rgba(245,166,35,0.1)', borderColor: 'rgba(245,166,35,0.3)' } : {}),
              }}
            >
              All Domains
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { soundFx.click(); setSelectedCategory(cat.id); }}
                className="pill"
                style={{
                  cursor: 'pointer',
                  padding: '5px 14px',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  ...(selectedCategory === cat.id ? { color: 'var(--amber)', background: 'rgba(245,166,35,0.1)', borderColor: 'rgba(245,166,35,0.3)' } : {}),
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* — Skills grid — */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '16px',
        }}>
          {filtered.map((cat) => (
            <div
              key={cat.id}
              className="card"
              style={{ padding: '24px', border: '1px solid var(--border-faint)' }}
            >
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: '4px',
              }}>
                {cat.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '16px' }}>
                {cat.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: 'var(--r-md)',
                      background: skill.hot
                        ? 'rgba(245,166,35,0.06)'
                        : 'rgba(255,255,255,0.025)',
                      border: skill.hot
                        ? '1px solid rgba(245,166,35,0.22)'
                        : '1px solid var(--border-faint)',
                      transition: 'all 0.18s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      soundFx.hover();
                      e.currentTarget.style.background = skill.hot
                        ? 'rgba(245,166,35,0.1)'
                        : 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = skill.hot
                        ? 'rgba(245,166,35,0.06)'
                        : 'rgba(255,255,255,0.025)';
                    }}
                  >
                    {skill.hot && <Flame size={12} color="var(--amber)" />}
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: skill.hot ? 'var(--text-primary)' : '#A0A8C0',
                    }}>
                      {skill.name}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      color: LEVEL_COLORS[skill.level] ?? 'var(--text-dim)',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                    }}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
