import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Terminal,
  Copy,
  Check,
  FileDown,
  Sparkles,
  Code2,
  ExternalLink
} from 'lucide-react';
import { Github, Linkedin } from './SocialIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

interface HeroProps {
  onOpenResume: () => void;
  onOpenCommandPalette: () => void;
}

const codeSnippets = {
  agent: `// Kaufee-Home: Local Tool-Calling Pipeline
const agent = new LocalAgent({
  model: "llama3:latest",
  inference: "100% on-device",
  guard: PermissionGatekeeper.STRICT
});

await agent.invoke({
  task: "Audit trading data & risk",
  tools: [fs_search, python_repl, watchdog],
  fallback: "deterministic_rules"
});`,
  telemetry: `{
  "engineer": "Sai Tarun Reddy Velagala",
  "role": "Backend AI Engineer Intern",
  "company": "FlyRank AI",
  "specialties": [
    "RAG", "Tool Calling", "LLM Evals"
  ],
  "metrics": {
    "correctness":    "0.967",
    "hallucination":  "< 0.012",
    "p95_latency_ms": 310
  }
}`,
  evals: `def audit_agent(trace, rubric) -> Score:
    schema_ok = validate_contract(
        trace.structured_output
    )
    f1 = calc_tool_f1(trace.tool_calls)

    assert schema_ok, "Contract violated"
    return Score(precision=f1, ok=True)`,
};

export const Hero: React.FC<HeroProps> = ({ onOpenResume, onOpenCommandPalette }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'agent' | 'telemetry' | 'evals'>('agent');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle orbit canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let t = 0;
    const W = canvas.width = 480;
    const H = canvas.height = 480;

    const particles = Array.from({ length: 60 }, (_, i) => ({
      angle: (i / 60) * Math.PI * 2,
      radius: 60 + Math.random() * 120,
      speed: 0.002 + Math.random() * 0.004,
      size: 1 + Math.random() * 2.5,
      hue: Math.random() > 0.5 ? 38 : 180,
    }));

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      t += 0.008;

      // Center glow
      const grd = ctx!.createRadialGradient(W/2, H/2, 0, W/2, H/2, 100);
      grd.addColorStop(0, 'rgba(245, 166, 35, 0.10)');
      grd.addColorStop(1, 'rgba(245, 166, 35, 0)');
      ctx!.fillStyle = grd;
      ctx!.beginPath();
      ctx!.arc(W/2, H/2, 100, 0, Math.PI * 2);
      ctx!.fill();

      // Outer ring
      ctx!.strokeStyle = 'rgba(245, 166, 35, 0.08)';
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.arc(W/2, H/2, 180, 0, Math.PI * 2);
      ctx!.stroke();

      ctx!.strokeStyle = 'rgba(62, 207, 207, 0.05)';
      ctx!.beginPath();
      ctx!.arc(W/2, H/2, 140, 0, Math.PI * 2);
      ctx!.stroke();

      // Particles
      for (const p of particles) {
        p.angle += p.speed;
        const x = W/2 + Math.cos(p.angle + t * 0.3) * p.radius;
        const y = H/2 + Math.sin(p.angle + t * 0.3) * (p.radius * 0.4);
        ctx!.beginPath();
        ctx!.arc(x, y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.hue === 38
          ? `rgba(245, 166, 35, ${0.3 + Math.sin(p.angle * 3 + t) * 0.2})`
          : `rgba(62, 207, 207, ${0.2 + Math.sin(p.angle * 2 + t) * 0.15})`;
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Tab auto-cycle
  useEffect(() => {
    const tabs = ['agent', 'telemetry', 'evals'] as const;
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % tabs.length;
      setActiveTab(tabs[idx]);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    soundFx.click();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '100px',
        paddingBottom: '80px',
        overflow: 'hidden',
      }}
    >
      {/* — Hero radial spotlight — */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        width: '1000px',
        height: '600px',
        background: 'radial-gradient(ellipse, rgba(245,166,35,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="container" style={{ width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 480px',
          gap: '64px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
          className="hero-grid"
        >
          {/* ── Left: Headline ── */}
          <div>
            {/* Top status */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '32px',
              alignItems: 'center',
            }}>
              <div className="live-badge">
                <span className="live-dot" />
                <span>FlyRank AI · Backend AI Intern</span>
              </div>
              <div className="pill amber">
                <Sparkles size={12} />
                Local Edge AI
              </div>
              <div className="pill" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                CGPA: 8.49 · CSE AI/ML
              </div>
            </div>

            {/* Pre-label */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--amber)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Code2 size={14} />
              Architecting Intelligent Software
            </div>

            {/* Main headline */}
            <h1 style={{
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 0.95,
              fontVariationSettings: '"opsz" 32',
              marginBottom: '28px',
              color: 'var(--text-primary)',
            }}>
              Sai Tarun
              <br />
              <span className="gradient-amber">Velagala</span>
            </h1>

            {/* Tagline */}
            <p style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: '520px',
              marginBottom: '36px',
            }}>
              Backend AI Engineer & Full-Stack Developer specializing in{' '}
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>production server-side AI systems</strong>,{' '}
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>local agentic tool calling</strong>,
              structured outputs, and resilient offline-first software.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
              <a
                href="#projects"
                onClick={() => soundFx.click()}
                className="btn btn-primary"
              >
                Featured Work
                <ArrowRight size={16} />
              </a>
              <a
                href="#ai-sandbox"
                onClick={() => soundFx.click()}
                className="btn btn-secondary"
              >
                <Terminal size={15} style={{ color: 'var(--cyan)' }} />
                AI Sandbox
              </a>
              <button
                onClick={() => { soundFx.click(); onOpenResume(); }}
                className="btn btn-ghost"
              >
                <FileDown size={15} />
                Resume
              </button>
            </div>

            {/* Contact row */}
            <div style={{
              paddingTop: '28px',
              borderTop: '1px solid var(--border-faint)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center',
            }}>
              <button
                onClick={() => copyToClipboard(PERSONAL_INFO.email, 'email')}
                className="pill"
                style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '6px 12px' }}
                title="Copy email"
              >
                {copiedField === 'email' ? <Check size={12} style={{ color: 'var(--emerald)' }} /> : <Copy size={12} />}
                {PERSONAL_INFO.email}
              </button>
              <button
                onClick={() => copyToClipboard(PERSONAL_INFO.phone, 'phone')}
                className="pill"
                style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '6px 12px' }}
                title="Copy phone"
              >
                {copiedField === 'phone' ? <Check size={12} style={{ color: 'var(--emerald)' }} /> : <Copy size={12} />}
                {PERSONAL_INFO.phone}
              </button>

              <a href={PERSONAL_INFO.socials.github} target="_blank" rel="noreferrer" onClick={() => soundFx.click()} className="pill" style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '12px' }}>
                <Github size={12} />
                GitHub
              </a>
              <a href={PERSONAL_INFO.socials.linkedin} target="_blank" rel="noreferrer" onClick={() => soundFx.click()} className="pill" style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '12px' }}>
                <Linkedin size={12} />
                LinkedIn
              </a>
              <div className="pill" style={{ fontSize: '12px' }}>
                📍 {PERSONAL_INFO.location}
              </div>
            </div>
          </div>

          {/* ── Right: Orbit Canvas + Code Terminal ── */}
          <div style={{ position: 'relative' }}  className="hero-right">
            {/* Orbit visualization */}
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '480px',
              height: '480px',
              opacity: 0.7,
              pointerEvents: 'none',
              zIndex: 0,
            }}>
              <canvas ref={canvasRef} width={480} height={480} style={{ width: '480px', height: '480px' }} />
            </div>

            {/* Code terminal */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                background: 'rgba(6, 6, 10, 0.95)',
                border: '1px solid rgba(245,166,35,0.25)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(245,166,35,0.08)',
              }}
            >
              {/* Terminal chrome */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ marginLeft: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)' }}>
                    kaufee-core v3 · {activeTab}.ts
                  </span>
                </div>

                {/* Tab switcher */}
                <div style={{ display: 'flex', gap: '3px' }}>
                  {(['agent', 'telemetry', 'evals'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { soundFx.click(); setActiveTab(tab); }}
                      style={{
                        background: activeTab === tab ? 'rgba(245,166,35,0.12)' : 'transparent',
                        color: activeTab === tab ? 'var(--amber)' : 'var(--text-dim)',
                        border: activeTab === tab ? '1px solid rgba(245,166,35,0.25)' : '1px solid transparent',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code body */}
              <div style={{
                padding: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                lineHeight: '1.7',
                background: 'transparent',
                overflowX: 'auto',
                minHeight: '220px',
              }}>
                <pre style={{ margin: 0, color: '#C8D0E8', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  <code dangerouslySetInnerHTML={{
                    __html: codeSnippets[activeTab]
                      .replace(/\/\/.+/g, m => `<span style="color:#4A5270">${m}</span>`)
                      .replace(/"([^"]+)"/g, (_m, g) => `<span style="color:#A8D8A8">"${g}"</span>`)
                      .replace(/\b(const|let|await|function|return|def|assert)\b/g, m => `<span style="color:#C792EA">${m}</span>`)
                      .replace(/\b(new|True|False)\b/g, m => `<span style="color:#F78C6C">${m}</span>`)
                  }} />
                </pre>
              </div>

              {/* Status footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.015)',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 6px var(--emerald)' }} />
                  Pipeline: Optimal · Ollama: Ready
                </div>
                <button
                  onClick={() => { soundFx.click(); onOpenCommandPalette(); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--cyan)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    transition: 'opacity 0.15s',
                  }}
                >
                  ⌘K for interactive shell
                  <ExternalLink size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Scroll hint ── */}
        <div style={{
          marginTop: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--text-dim)',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
        }}>
          <div style={{
            width: '40px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--border-subtle))',
          }} />
          <span>scroll to explore</span>
          <div style={{
            width: '1px',
            height: '24px',
            background: 'linear-gradient(to bottom, var(--border-subtle), transparent)',
          }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .hero-right {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};
