import { useState } from 'react';
import {
  ExternalLink,
  Sparkles,
  ChevronRight,
  Cpu,
  Shield,
  Layers,
  Zap
} from 'lucide-react';
import { Github } from './SocialIcons';
import { PROJECTS, type Project } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';
import { useWorldStore } from '../state/stores';

const categoryIcon = (cat: string) => {
  if (cat.includes('AI')) return <Cpu size={14} />;
  if (cat.includes('Mobile')) return <Zap size={14} />;
  if (cat.includes('Security')) return <Shield size={14} />;
  return <Layers size={14} />;
};

const accentStyle = (color: string, opacity = 0.12) => ({
  color,
  background: `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  borderColor: `${color}40`,
});

interface ProjectCardProps {
  project: Project;
  large?: boolean;
}

const ProjectCard = ({ project, large = false }: ProjectCardProps) => {
  const setOpenPanelId = useWorldStore((s) => s.setOpenPanelId);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="card"
      style={{
        padding: large ? '32px' : '26px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: `1px solid ${hovered ? project.accentColor + '30' : 'var(--border-faint)'}`,
        boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${project.accentColor}0D` : 'none',
        cursor: 'default',
        height: '100%',
      }}
      onMouseEnter={() => { setHovered(true); soundFx.hover(); }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Accent line top */}
      <div className="accent-line" style={{
        background: `linear-gradient(90deg, transparent, ${project.accentColor}, transparent)`,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.3s',
      }} />

      <div>
        {/* Meta header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span className="pill" style={accentStyle(project.accentColor, 0.08)}>
            {categoryIcon(project.category)}
            {project.category}
          </span>
          {project.featured && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10.5px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--amber)',
              letterSpacing: '0.06em',
            }}>
              <Sparkles size={11} />
              FEATURED
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: large ? 'clamp(1.4rem, 2.5vw, 1.9rem)' : '1.35rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          marginBottom: '10px',
          lineHeight: 1.15,
        }}>
          {project.name}
        </h3>

        {/* Tagline */}
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          marginBottom: '18px',
        }}>
          {project.description}
        </p>

        {/* Metric badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
          {project.metrics.map((m) => (
            <span key={m} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 9px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-faint)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: project.accentColor }} />
              {m}
            </span>
          ))}
        </div>

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '20px' }}>
          {project.tech.map((t) => (
            <span key={t} className="tech-chip">{t}</span>
          ))}
        </div>

        {/* Architecture snippet */}
        {large && (
          <div style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid var(--border-faint)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Architecture
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <div><span style={{ color: 'var(--cyan)' }}>Client:</span> <span style={{ color: 'var(--text-secondary)' }}>{project.architecture.client}</span></div>
              <div><span style={{ color: 'var(--amber)' }}>Engine:</span> <span style={{ color: 'var(--text-secondary)' }}>{project.architecture.engine}</span></div>
              <div><span style={{ color: 'var(--emerald)' }}>Storage:</span> <span style={{ color: 'var(--text-secondary)' }}>{project.architecture.storageOrSafety}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '8px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-faint)',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFx.click()}
            className="btn btn-primary btn-sm"
          >
            Live Demo
            <ExternalLink size={12} />
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFx.click()}
            className="btn btn-secondary btn-sm"
          >
            <Github size={13} />
            Source
          </a>
        )}
        <button
          onClick={() => { soundFx.click(); setOpenPanelId(project.id); }}
          className="btn btn-ghost btn-sm"
          style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: '12px', gap: '4px' }}
        >
          Details
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

export const ProjectShowcase = () => {
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'ai', label: 'AI & Agents' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'systems', label: 'Systems' },
  ];

  const filtered = PROJECTS.filter((p) => {
    if (filter === 'ai') return p.category.includes('AI');
    if (filter === 'fullstack') return p.category.includes('Full-Stack');
    if (filter === 'systems') return p.category.includes('Systems') || p.category.includes('Mobile') || p.category.includes('Simulation');
    return true;
  });

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <section id="projects" className="section" style={{ position: 'relative' }}>
      <div className="container">

        {/* — Section header — */}
        <div style={{ marginBottom: '48px' }}>
          <div className="section-tag">
            <Layers size={12} />
            Engineering Portfolio
          </div>
          <h2 className="section-title" style={{ marginBottom: '14px' }}>
            Featured <span className="gradient-amber">Systems & Projects</span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <p className="section-desc">
              Production AI pipelines, local agentic runtimes, and distributed platforms engineered for reliability.
            </p>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { soundFx.click(); setFilter(cat.id); }}
                  className="pill"
                  style={{
                    cursor: 'pointer',
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: filter === cat.id ? 700 : 500,
                    ...(filter === cat.id ? { color: 'var(--amber)', background: 'rgba(245,166,35,0.1)', borderColor: 'rgba(245,166,35,0.3)' } : {}),
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* — Featured projects bento — */}
        {featured.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: featured.length === 1 ? '1fr' : featured.length === 2 ? '1fr 1fr' : '1.2fr 0.8fr 1fr',
            gap: '16px',
            marginBottom: '16px',
          }}
            className="featured-bento"
          >
            {featured.map((p, i) => (
              <ProjectCard key={p.id} project={p} large={i === 0} />
            ))}
          </div>
        )}

        {/* — Non-featured grid — */}
        {rest.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}>
            {rest.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 900px) {
          .featured-bento {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
