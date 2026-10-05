import { Briefcase, Calendar, MapPin, Award, GraduationCap } from 'lucide-react';
import { WORK_EXPERIENCE, PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

export const ExperienceTimeline = () => {
  return (
    <section id="experience" className="section" style={{ position: 'relative' }}>
      <div className="container">

        {/* — Section header — */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="section-tag emerald">
            <Briefcase size={12} />
            Career
          </div>
          <h2 className="section-title" style={{ marginBottom: '14px' }}>
            Experience & <span className="gradient-amber">Background</span>
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Production AI engineering, financial data science, and academic rigor across internships and research.
          </p>
        </div>

        {/* — Timeline — */}
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative' }}>

          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            top: '16px',
            bottom: '16px',
            left: '20px',
            width: '2px',
            background: 'linear-gradient(to bottom, var(--amber), var(--emerald), var(--cyan))',
            opacity: 0.2,
          }} className="timeline-line-vis" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Work items */}
            {WORK_EXPERIENCE.map((exp) => (
              <div
                key={exp.id}
                className="card"
                style={{
                  marginLeft: '56px',
                  padding: '28px',
                  position: 'relative',
                  border: exp.status === 'Current'
                    ? '1px solid rgba(245,166,35,0.25)'
                    : '1px solid var(--border-faint)',
                }}
                onMouseEnter={() => soundFx.hover()}
              >
                {/* Timeline node */}
                <div style={{
                  position: 'absolute',
                  top: '26px',
                  left: '-40px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: exp.status === 'Current' ? 'var(--amber)' : '#1C1C28',
                  border: '3px solid var(--bg-core)',
                  boxShadow: exp.status === 'Current' ? '0 0 14px rgba(245,166,35,0.6)' : 'none',
                  zIndex: 1,
                }} />

                {/* Accent line */}
                {exp.status === 'Current' && (
                  <div className="accent-line" style={{ background: 'linear-gradient(90deg, var(--amber), transparent)' }} />
                )}

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '3px' }}>
                      {exp.role}
                    </h3>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--amber)' }}>
                      {exp.company}
                    </div>
                  </div>

                  {exp.status === 'Current' ? (
                    <div className="live-badge">
                      <span className="live-dot" />
                      Current
                    </div>
                  ) : (
                    <div className="pill">Completed</div>
                  )}
                </div>

                {/* Period & Location */}
                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-dim)', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={12} />
                    {exp.period}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={12} />
                    {exp.location}
                  </span>
                </div>

                {/* Summary */}
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.65, marginBottom: '14px' }}>
                  {exp.summary}
                </p>

                {/* Highlights */}
                <ul style={{ padding: '0 0 0 18px', color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.7, marginBottom: '18px' }}>
                  {exp.highlights.map((h, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}>{h}</li>
                  ))}
                </ul>

                {/* Tech pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {exp.tech.map((t) => (
                    <span key={t} className="tech-chip">{t}</span>
                  ))}
                </div>
              </div>
            ))}

            {/* Education */}
            <div
              className="card"
              style={{
                marginLeft: '56px',
                padding: '28px',
                position: 'relative',
                border: '1px solid rgba(62,207,207,0.2)',
              }}
              onMouseEnter={() => soundFx.hover()}
            >
              <div className="accent-line" style={{ background: 'linear-gradient(90deg, var(--cyan), transparent)' }} />

              {/* Timeline node */}
              <div style={{
                position: 'absolute',
                top: '26px',
                left: '-40px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'var(--cyan)',
                border: '3px solid var(--bg-core)',
                boxShadow: '0 0 14px rgba(62,207,207,0.5)',
                zIndex: 1,
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '3px' }}>
                    {PERSONAL_INFO.education.degree}
                  </h3>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cyan)' }}>
                    {PERSONAL_INFO.education.institution}
                  </div>
                </div>
                <div className="pill cyan" style={{ fontWeight: 700 }}>
                  <Award size={12} />
                  CGPA: {PERSONAL_INFO.education.cgpa}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', color: 'var(--text-dim)', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={12} />
                  {PERSONAL_INFO.education.period}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={12} />
                  {PERSONAL_INFO.education.location}
                </span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.65 }}>
                Strong academic foundation in Computer Science with deep specialization in AI/ML. Coursework covering Distributed Systems, Data Structures, Neural Networks, NLP, and Database Systems.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                <GraduationCap size={15} style={{ color: 'var(--cyan)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Graduating Class of 2027</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .timeline-line-vis { display: none; }
        }
      `}</style>
    </section>
  );
};
