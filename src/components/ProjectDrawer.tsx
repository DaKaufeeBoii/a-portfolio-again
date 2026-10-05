import { useEffect, useState } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Play, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { PROJECTS as EXTENDED_PROJECTS } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

interface ProjectDrawerProps {
  projectId: string | null;
  onClose: () => void;
}

export const ProjectDrawer = ({ projectId, onClose }: ProjectDrawerProps) => {
  const project = EXTENDED_PROJECTS.find((p) => p.id === projectId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const [agentStep, setAgentStep] = useState(0);
  const [agentRunning, setAgentRunning] = useState(false);
  const [riskDays, setRiskDays] = useState(4);
  const [riskBugs, setRiskBugs] = useState(6);

  if (!project) return null;

  const runMiniAgent = () => {
    soundFx.processStep();
    setAgentRunning(true);
    setAgentStep(1);
    setTimeout(() => {
      soundFx.processStep();
      setAgentStep(2);
    }, 500);
    setTimeout(() => {
      soundFx.processStep();
      setAgentStep(3);
    }, 1000);
    setTimeout(() => {
      soundFx.achievement();
      setAgentStep(4);
      setAgentRunning(false);
    }, 1500);
  };

  const calculatedRisk = Math.min(95, Math.round(20 + (14 - riskDays) * 3 + riskBugs * 5));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'all 0.3s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFx.click();
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          backgroundColor: '#090B12',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'drawer-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(9, 11, 18, 0.95)',
            backdropFilter: 'blur(12px)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              className="pill"
              style={{
                color: project.accentColor,
                borderColor: `${project.accentColor}44`,
                fontWeight: 700,
                fontSize: '11px',
              }}
            >
              {project.category}
            </span>
            {project.featured && (
              <span className="pill hot" style={{ fontSize: '10px' }}>
                <Sparkles size={11} /> FEATURED
              </span>
            )}
          </div>

          <button
            onClick={() => { soundFx.click(); onClose(); }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Title & Tagline */}
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
              {project.name}
            </h2>
            <p style={{ color: 'var(--amber)', fontSize: '14px', fontWeight: 600, lineHeight: '1.5', marginBottom: '14px' }}>
              {project.tagline}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.7' }}>
              {project.description}
            </p>
          </div>

          {/* Action CTAs: Live Demo & GitHub */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.click()}
                className="btn btn-primary"
                style={{ flex: 1, minWidth: '140px' }}
              >
                <span>Open Live Demo</span>
                <ExternalLink size={14} />
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.click()}
                className="btn btn-secondary"
                style={{ flex: 1, minWidth: '130px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFF">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>GitHub Repo</span>
              </a>
            )}
          </div>

          {/* Key Metrics */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase' }}>
              System Capabilities &amp; Metrics
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.metrics.map((m) => (
                <span key={m} className="pill" style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
                  <CheckCircle2 size={12} color="var(--emerald)" />
                  <span>{m}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Architecture Blueprint Card */}
          <div
            style={{
              background: '#0D0F18',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Layers size={16} color="var(--cyan)" />
              <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#FFF' }}>
                ARCHITECTURE SPECIFICATION
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', fontFamily: 'var(--font-mono)' }}>
              <div>
                <span style={{ color: 'var(--cyan)' }}>Client Layer:</span>{' '}
                <span style={{ color: '#E2E8F0' }}>{project.architecture.client}</span>
              </div>
              <div>
                <span style={{ color: 'var(--amber)' }}>Engine / Inference:</span>{' '}
                <span style={{ color: '#E2E8F0' }}>{project.architecture.engine}</span>
              </div>
              <div>
                <span style={{ color: 'var(--emerald)' }}>Safety &amp; Storage:</span>{' '}
                <span style={{ color: '#E2E8F0' }}>{project.architecture.storageOrSafety}</span>
              </div>
            </div>
          </div>

          {/* Embedded Interactive Mini-Sandbox */}
          {project.simulatorType === 'agent-tool-calling' && (
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
                  ⚡ TEST LOCAL AGENT RUNTIME
                </span>
                <span className="pill" style={{ fontSize: '10px' }}>Ollama 100% Local</span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Prompt: <em>"Find all research papers on RAG in ~/Documents"</em>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {['1. Intent', '2. Safety Gate', '3. Tool Call', '4. Return JSON'].map((step, idx) => (
                  <div
                    key={step}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      background: agentStep > idx ? 'var(--emerald)' : agentStep === idx + 1 ? 'var(--cyan)' : 'rgba(255, 255, 255, 0.05)',
                      color: agentStep >= idx + 1 ? '#07080C' : 'var(--text-dim)',
                      fontWeight: 700,
                      transition: 'all 0.2s',
                    }}
                  >
                    {step}
                  </div>
                ))}
              </div>

              <button
                onClick={runMiniAgent}
                disabled={agentRunning}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                {agentRunning ? <RotateCcw size={14} className="animate-spin" /> : <Play size={14} />}
                <span>{agentRunning ? 'Executing...' : 'Run Tool-Calling Simulation'}</span>
              </button>
            </div>
          )}

          {project.simulatorType === 'risk-assessment' && (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>
                  ⚡ TEST MISTRAL RISK SCORER
                </span>
                <span className="pill hot" style={{ fontSize: '10px' }}>{calculatedRisk}% Risk</span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Sprint Deadline:</span>
                  <strong>{riskDays} Days Left</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={riskDays}
                  onChange={(e) => { soundFx.click(); setRiskDays(Number(e.target.value)); }}
                  style={{ width: '100%', accentColor: 'var(--amber)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Unresolved Blockers:</span>
                  <strong style={{ color: '#EF4444' }}>{riskBugs} Bugs</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={riskBugs}
                  onChange={(e) => { soundFx.click(); setRiskBugs(Number(e.target.value)); }}
                  style={{ width: '100%', accentColor: '#EF4444' }}
                />
              </div>
            </div>
          )}

          {/* Highlights */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase' }}>
              Key Contributions &amp; Highlights
            </div>
            <ul style={{ paddingLeft: '18px', color: '#CBD5E1', fontSize: '13px', lineHeight: '1.7' }}>
              {project.highlights.map((h, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>{h}</li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Tags */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase' }}>
              Technologies Utilized
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {project.tech.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#E2E8F0',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes drawer-slide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
