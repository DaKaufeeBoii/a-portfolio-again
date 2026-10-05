import { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Sliders, 
  Languages, 
  Mic, 
  Volume2,
  Lock
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

type SimulatorTab = 'kaufee-agent' | 'projectpulse-risk' | 'bharatvaani-edge';

export const InteractiveSimulator = () => {
  const [activeTab, setActiveTab] = useState<SimulatorTab>('kaufee-agent');

  // Agent State
  const agentPresets = [
    { label: 'File Search', query: 'Find all PDF research papers on RAG and vector embeddings in ~/Documents' },
    { label: 'System Diagnostics', query: 'Launch VSCode and monitor CPU core thermal metrics & memory saturation' },
    { label: 'Disk Organization', query: 'Scan ~/Downloads, categorize by MIME type, and report clutter' },
    { label: 'Financial Outlier', query: 'Inspect Hackveda equity data feeds and flag algorithmic trading anomalies' },
  ];
  const [selectedAgentQuery, setSelectedAgentQuery] = useState(agentPresets[0].query);
  const [isExecutingAgent, setIsExecutingAgent] = useState(false);
  const [agentStep, setAgentStep] = useState<number>(0);
  const [permissionGated, setPermissionGated] = useState(true);
  const [agentLog, setAgentLog] = useState<{ step: string; detail: string; status: 'ok' | 'gate' | 'done' }[]>([]);

  // ProjectPulse Risk State
  const [deadlineDays, setDeadlineDays] = useState(4);
  const [unresolvedBugs, setUnresolvedBugs] = useState(5);
  const [teamCapacity, setTeamCapacity] = useState(70);
  const [apiRisk, setApiRisk] = useState<'low' | 'high'>('high');

  // BharatVaani State
  const [selectedLanguage, setSelectedLanguage] = useState<'Hindi' | 'Telugu' | 'Tamil' | 'Marathi'>('Telugu');

  // Run Agent Simulation
  const handleExecuteAgent = () => {
    soundFx.processStep();
    setIsExecutingAgent(true);
    setAgentStep(1);
    setAgentLog([
      { step: '1. INTENT_PARSER', detail: `Parsing natural language intent via Ollama local runtime...`, status: 'ok' }
    ]);

    setTimeout(() => {
      soundFx.processStep();
      setAgentStep(2);
      setAgentLog(prev => [
        ...prev,
        { 
          step: '2. PERMISSION_GUARD', 
          detail: permissionGated 
            ? 'Access check passed. Local sandbox verified no destructive shell commands.' 
            : 'Permission check bypassed (Developer Override mode).',
          status: 'gate' 
        }
      ]);
    }, 600);

    setTimeout(() => {
      soundFx.processStep();
      setAgentStep(3);
      setAgentLog(prev => [
        ...prev,
        { 
          step: '3. TOOL_BINDING', 
          detail: `Invoking tool: fs_search({"query": "RAG", "ext": ".pdf", "max_results": 10})`, 
          status: 'ok' 
        }
      ]);
    }, 1200);

    setTimeout(() => {
      soundFx.achievement();
      setAgentStep(4);
      setAgentLog(prev => [
        ...prev,
        { 
          step: '4. SYNTHESIS_COMPLETE', 
          detail: 'Execution successful. Output formatted into structured JSON contract. Vosk TTS audio cue ready.', 
          status: 'done' 
        }
      ]);
      setIsExecutingAgent(false);
    }, 1800);
  };

  // Calculate ProjectPulse Risk Score
  const calculateRisk = () => {
    let score = 20;
    if (deadlineDays < 5) score += 30;
    if (unresolvedBugs > 4) score += 25;
    if (teamCapacity < 60) score += 20;
    if (apiRisk === 'high') score += 15;
    return Math.min(score, 98);
  };
  const currentRisk = calculateRisk();

  return (
    <section id="ai-sandbox" className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-tag cyan">
            <Sparkles size={14} />
            <span>Interactive Architecture Sandbox</span>
          </div>
          <h2 className="section-title">
            Test My <span className="gradient-text-cyan">Systems Live</span>
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Experience real-time simulated pipelines of my key engineering systems: 
            autonomous local tool calling, AI project risk prediction, and on-device offline translation.
          </p>
        </div>

        {/* Tab Controls */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => { soundFx.click(); setActiveTab('kaufee-agent'); }}
            className={`btn ${activeTab === 'kaufee-agent' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Cpu size={16} />
            <span>Kaufee-Home (Local Agent)</span>
          </button>

          <button
            onClick={() => { soundFx.click(); setActiveTab('projectpulse-risk'); }}
            className={`btn ${activeTab === 'projectpulse-risk' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Sliders size={16} />
            <span>ProjectPulse (AI Risk Engine)</span>
          </button>

          <button
            onClick={() => { soundFx.click(); setActiveTab('bharatvaani-edge'); }}
            className={`btn ${activeTab === 'bharatvaani-edge' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Languages size={16} />
            <span>BharatVaani (Edge Pipeline)</span>
          </button>
        </div>

        {/* Tab 1: Kaufee-Home Local Agent Simulator */}
        {activeTab === 'kaufee-agent' && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '32px', 
              border: '1px solid rgba(56, 189, 248, 0.25)',
              boxShadow: 'var(--shadow-glow-cyan)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF' }}>
                  Kaufee-Home: Autonomous Tool-Calling Loop
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Simulate local LLM tool dispatch with zero cloud latency and permission-gated shell safety.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pill" style={{ color: 'var(--cyan)' }}>
                  <Cpu size={12} /> Ollama (Local Llama-3)
                </span>
                <button
                  onClick={() => setPermissionGated(!permissionGated)}
                  className="pill"
                  style={{ 
                    cursor: 'pointer',
                    background: permissionGated ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    borderColor: permissionGated ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                    color: permissionGated ? 'var(--emerald)' : '#EF4444'
                  }}
                  title="Toggle security barrier"
                >
                  <Lock size={12} />
                  <span>Gate: {permissionGated ? 'Strict' : 'Bypassed'}</span>
                </button>
              </div>
            </div>

            {/* Presets */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '8px' }}>
                CHOOSE PRESET INTENT:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {agentPresets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { soundFx.click(); setSelectedAgentQuery(p.query); }}
                    style={{
                      background: selectedAgentQuery === p.query ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: selectedAgentQuery === p.query ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
                      color: selectedAgentQuery === p.query ? '#FFF' : 'var(--text-muted)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box & Trigger */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                <input
                  type="text"
                  value={selectedAgentQuery}
                  onChange={(e) => setSelectedAgentQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: '#090B12',
                    border: '1px solid var(--border-medium)',
                    color: '#FFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                  placeholder="Enter command for local agent..."
                />
              </div>

              <button
                onClick={handleExecuteAgent}
                disabled={isExecutingAgent}
                className="btn btn-primary"
                style={{ minWidth: '170px' }}
              >
                {isExecutingAgent ? (
                  <>
                    <RotateCcw size={16} className="animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Run Pipeline</span>
                  </>
                )}
              </button>
            </div>

            {/* Pipeline Visualizer */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              {[
                { title: '1. Intent Classifier', desc: 'Local Ollama model' },
                { title: '2. Safety Gate', desc: 'Permission-gated barrier' },
                { title: '3. Tool Execution', desc: 'JSON schema validation' },
                { title: '4. Voice & JSON', desc: 'Vosk / SQLite commit' },
              ].map((step, idx) => {
                const isActive = agentStep === idx + 1;
                const isPassed = agentStep > idx + 1;
                return (
                  <div
                    key={step.title}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: isPassed 
                        ? 'rgba(16, 185, 129, 0.08)' 
                        : isActive 
                        ? 'rgba(56, 189, 248, 0.12)' 
                        : 'rgba(255, 255, 255, 0.02)',
                      border: isPassed 
                        ? '1px solid rgba(16, 185, 129, 0.3)' 
                        : isActive 
                        ? '1px solid var(--cyan)' 
                        : '1px solid var(--border-subtle)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {isPassed ? (
                        <CheckCircle2 size={14} color="var(--emerald)" />
                      ) : (
                        <div 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            background: isActive ? 'var(--cyan)' : 'var(--text-dim)' 
                          }} 
                        />
                      )}
                      <span style={{ fontSize: '12px', fontWeight: 700, color: isActive ? 'var(--cyan)' : isPassed ? 'var(--emerald)' : 'var(--text-muted)' }}>
                        {step.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {step.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Execution Trace Terminal */}
            <div className="code-container" style={{ maxHeight: '180px' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '11px', marginBottom: '8px' }}>
                // AGENT TELEMETRY LOG STREAM
              </div>
              {agentLog.length === 0 ? (
                <div style={{ color: 'var(--text-dim)' }}>Click "Run Pipeline" to watch the real-time agent trace...</div>
              ) : (
                agentLog.map((log, i) => (
                  <div key={i} style={{ marginBottom: '6px' }}>
                    <span style={{ color: log.status === 'done' ? 'var(--emerald)' : 'var(--cyan)', fontWeight: 600 }}>
                      {log.step}:
                    </span>{' '}
                    <span style={{ color: '#E2E8F0' }}>{log.detail}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: ProjectPulse Risk Engine */}
        {activeTab === 'projectpulse-risk' && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '32px', 
              border: '1px solid rgba(245, 158, 11, 0.25)',
              boxShadow: 'var(--shadow-glow-amber)' 
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF' }}>
                ProjectPulse: Mistral AI Risk Scoring &amp; Heuristic Fallback
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Adjust real-world sprint constraints to see how the risk assessment engine evaluates bottlenecks and triggers fallback mitigation.
              </p>
            </div>

            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '32px',
                alignItems: 'center',
              }}
            >
              {/* Sliders Column */}
              <div>
                {/* Deadline */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Sprint Deadline Proximity:</span>
                    <strong style={{ color: 'var(--amber)' }}>{deadlineDays} Days Remaining</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={deadlineDays}
                    onChange={(e) => { soundFx.click(); setDeadlineDays(Number(e.target.value)); }}
                    style={{ width: '100%', accentColor: 'var(--amber)' }}
                  />
                </div>

                {/* Unresolved Blockers */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Critical Unresolved Bugs:</span>
                    <strong style={{ color: '#EF4444' }}>{unresolvedBugs} Issues</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={unresolvedBugs}
                    onChange={(e) => { soundFx.click(); setUnresolvedBugs(Number(e.target.value)); }}
                    style={{ width: '100%', accentColor: '#EF4444' }}
                  />
                </div>

                {/* Team Capacity */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Engineering Team Velocity:</span>
                    <strong style={{ color: 'var(--emerald)' }}>{teamCapacity}%</strong>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={teamCapacity}
                    onChange={(e) => { soundFx.click(); setTeamCapacity(Number(e.target.value)); }}
                    style={{ width: '100%', accentColor: 'var(--emerald)' }}
                  />
                </div>

                {/* External API Risk */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Third-Party Dependency Flakiness:</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => { soundFx.click(); setApiRisk('low'); }}
                      className="pill"
                      style={{
                        cursor: 'pointer',
                        background: apiRisk === 'low' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                        borderColor: apiRisk === 'low' ? 'var(--emerald)' : 'var(--border-subtle)',
                        color: apiRisk === 'low' ? 'var(--emerald)' : 'var(--text-dim)',
                      }}
                    >
                      Stable
                    </button>
                    <button
                      onClick={() => { soundFx.click(); setApiRisk('high'); }}
                      className="pill"
                      style={{
                        cursor: 'pointer',
                        background: apiRisk === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                        borderColor: apiRisk === 'high' ? '#EF4444' : 'var(--border-subtle)',
                        color: apiRisk === 'high' ? '#EF4444' : 'var(--text-dim)',
                      }}
                    >
                      High Latency
                    </button>
                  </div>
                </div>
              </div>

              {/* Assessment Output Card */}
              <div 
                style={{
                  background: '#090B12',
                  border: `1px solid ${currentRisk > 65 ? 'rgba(239, 68, 68, 0.4)' : currentRisk > 40 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color={currentRisk > 65 ? '#EF4444' : currentRisk > 40 ? 'var(--amber)' : 'var(--emerald)'} />
                    <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      EVALUATION RESULT
                    </span>
                  </div>
                  <span 
                    className="pill"
                    style={{
                      color: currentRisk > 65 ? '#EF4444' : currentRisk > 40 ? 'var(--amber)' : 'var(--emerald)',
                      borderColor: 'currentColor',
                      fontWeight: 700,
                    }}
                  >
                    {currentRisk > 65 ? 'CRITICAL RISK' : currentRisk > 40 ? 'MODERATE RISK' : 'LOW RISK'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: '#FFF', lineHeight: 1 }}>
                    {currentRisk}%
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Calculated Project Failure Probability
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '16px' }}>
                  {currentRisk > 65 ? (
                    <>
                      <strong>Mistral AI Diagnostic:</strong> Severe critical path blockage. With only {deadlineDays} days remaining and {unresolvedBugs} unresolved defects, delivery probability is compromised. 
                    </>
                  ) : currentRisk > 40 ? (
                    <>
                      <strong>Mistral AI Diagnostic:</strong> Velocity acceptable, but technical debt buffer required. Monitor API flakiness closely.
                    </>
                  ) : (
                    <>
                      <strong>Mistral AI Diagnostic:</strong> Safe delivery trajectory. Team velocity is sufficient to absorb remaining sprint backlog.
                    </>
                  )}
                </div>

                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px dashed var(--border-subtle)',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--amber-light)',
                  }}
                >
                  <div>// RULE-BASED FALLBACK POLICY:</div>
                  <div>→ Reallocate 2 frontend resources to critical defect resolution.</div>
                  <div>→ Mock external latency sensitive endpoints until stable.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: BharatVaani Edge Pipeline */}
        {activeTab === 'bharatvaani-edge' && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '32px', 
              border: '1px solid rgba(16, 185, 129, 0.25)',
              boxShadow: 'var(--shadow-glow-cyan)' 
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF' }}>
                BharatVaani: 100% Offline Edge Translation Architecture
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                How on-device Vosk acoustic models and Google ML Kit translation achieve zero data consumption and instant response.
              </p>
            </div>

            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '24px',
              }}
            >
              {[
                {
                  icon: <Mic size={20} color="var(--emerald)" />,
                  title: '1. Offline Speech-to-Text',
                  desc: 'Vosk acoustic model runs locally on ARM/x86 Android threads without transmitting voice samples to any server.',
                  badge: 'Vosk Engine • 0ms Cloud Latency',
                },
                {
                  icon: <Cpu size={20} color="var(--cyan)" />,
                  title: '2. On-Device Translation',
                  desc: 'Google ML Kit local neural translation models decode English to regional Indian languages offline.',
                  badge: '5 Languages • Zero Bandwidth',
                },
                {
                  icon: <Volume2 size={20} color="var(--amber)" />,
                  title: '3. Native Audio Synthesis',
                  desc: 'Android system TTS synthesizes translated speech with natural phonetics for bidirectional communication.',
                  badge: 'MVVM + Clean Architecture',
                },
              ].map((card) => (
                <div 
                  key={card.title}
                  style={{
                    background: '#090B12',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>{card.icon}</div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
                    {card.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '14px' }}>
                    {card.desc}
                  </p>
                  <span className="pill" style={{ fontSize: '11px' }}>{card.badge}</span>
                </div>
              ))}
            </div>

            {/* Language preview selector */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-md)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>
                  TARGET REGIONAL MODEL:
                </span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {(['Telugu', 'Hindi', 'Tamil', 'Marathi'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { soundFx.click(); setSelectedLanguage(lang); }}
                      className="pill"
                      style={{
                        cursor: 'pointer',
                        background: selectedLanguage === lang ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                        borderColor: selectedLanguage === lang ? 'var(--emerald)' : 'var(--border-subtle)',
                        color: selectedLanguage === lang ? '#FFF' : 'var(--text-muted)',
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                  OFFLINE MODEL INTEGRITY:
                </div>
                <div style={{ color: 'var(--emerald)', fontWeight: 700, fontSize: '13px' }}>
                  ✓ Bundled with Hilt DI &amp; Repository Pattern
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
