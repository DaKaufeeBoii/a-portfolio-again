import { useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  FileText, 
  Rocket, 
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useWorldStore, useUIStore } from '../state/stores';
import { DISTRICTS, type DistrictId } from '../lib/constants';
import { soundFx } from '../utils/soundEffects';
import { VirtualJoystick } from './VirtualJoystick';
import { executeInteraction } from '../world/WorldInteractions';

interface CyberHUDProps {
  onOpenCommandPalette: () => void;
  onOpenResume: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  viewMode: '3d-world' | 'executive';
  onToggleViewMode: () => void;
}

export const CyberHUD = ({
  onOpenCommandPalette,
  onOpenResume,
  soundEnabled,
  onToggleSound,
  viewMode,
  onToggleViewMode,
}: CyberHUDProps) => {
  const activeDistrict = useWorldStore((s) => s.activeDistrict);
  const dronePos = useWorldStore((s) => s.dronePosition);
  const droneSpeed = useWorldStore((s) => s.droneSpeed);
  const setTeleportTarget = useWorldStore((s) => s.setTeleportTarget);
  const activePackage = useWorldStore((s) => s.activeDeliveryPackage);
  const completedDeliveries = useWorldStore((s) => s.completedDeliveries);
  const collectedBeans = useWorldStore((s) => s.collectedBeans);
  const ringsPassed = useWorldStore((s) => s.ringsPassed);
  const interactionHint = useUIStore((s) => s.interactionHint);
  const toastQueue = useUIStore((s) => s.toastQueue);
  const popToast = useUIStore((s) => s.popToast);

  // Toast timer
  useEffect(() => {
    if (toastQueue.length === 0) return;
    const timer = setTimeout(popToast, 3500);
    return () => clearTimeout(timer);
  }, [toastQueue, popToast]);

  const districtList: { id: DistrictId; label: string; coords: [number, number, number] }[] = [
    { id: 'plaza', label: 'Harbour', coords: [0, 1.2, 0] },
    { id: 'ailab', label: 'AI Valley', coords: [0, 4.2, -38] },
    { id: 'projectcity', label: 'Cargo Port', coords: [38, 2.0, 0] },
    { id: 'arcade', label: 'Neon Arcade', coords: [-36, 1.8, 0] },
    { id: 'archive', label: 'Ancient Oasis', coords: [0, -0.8, 38] },
    { id: 'lighthouse', label: 'Lighthouse', coords: [33, 6.5, -33] },
  ];

  const handleTeleport = (coords: [number, number, number]) => {
    soundFx.processStep();
    setTeleportTarget(coords);
  };

  return (
    <>
      {/* ── Top Floating Navigation Bar (Colonia Zacamil & Agrumea hybrid) ── */}
      <header
        style={{
          position: 'fixed',
          top: 14,
          left: 14,
          right: 14,
          zIndex: 60,
          pointerEvents: 'none',
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(8, 10, 16, 0.85)',
          }}
        >
          {/* Brand Logo & Telemetry */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(56, 189, 248, 0.3))',
                border: '1px solid var(--amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--amber)',
                fontSize: '15px',
                boxShadow: '0 0 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              K
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: '#FFF' }}>Kaufee World 3D</span>
                <span className="pill hot" style={{ fontSize: '10px', padding: '2px 6px' }}>v2.5</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--emerald)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="status-dot" style={{ width: 6, height: 6 }} />
                <span>FlyRank AI Intern</span>
              </div>
            </div>
          </div>

          {/* District Teleport Jump Bar (Colonia Zacamil style) */}
          <div
            className="district-teleport-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(18, 22, 34, 0.7)',
              padding: '4px 6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {districtList.map((d) => {
              const isHere = activeDistrict === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleTeleport(d.coords)}
                  title={`Teleport drone to ${d.label}`}
                  style={{
                    background: isHere ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    border: isHere ? '1px solid var(--amber)' : '1px solid transparent',
                    color: isHere ? '#FFF' : 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: isHere ? 700 : 500,
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  onMouseEnter={() => soundFx.hover()}
                >
                  <MapPin size={11} color={isHere ? 'var(--amber)' : 'var(--text-dim)'} />
                  <span>{d.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* View Mode Toggle: 3D Exploration vs Executive Portfolio */}
            <button
              onClick={() => { soundFx.click(); onToggleViewMode(); }}
              className={`btn btn-sm ${viewMode === 'executive' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '12px' }}
              title="Switch between 3D Drone Flight and Classic Executive Portfolio"
            >
              {viewMode === '3d-world' ? (
                <>
                  <Layers size={13} />
                  <span className="hidden-mobile">Executive View</span>
                </>
              ) : (
                <>
                  <Rocket size={13} />
                  <span className="hidden-mobile">Fly Drone 3D</span>
                </>
              )}
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => { soundFx.click(); onToggleSound(); }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: soundEnabled ? 'var(--amber)' : 'var(--text-dim)',
                padding: '7px 9px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Toggle sound effects"
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            {/* Resume PDF */}
            <button
              onClick={() => { soundFx.click(); onOpenResume(); }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px' }}
            >
              <FileText size={13} />
              <span className="hidden-mobile">Resume</span>
            </button>

            {/* Command Palette */}
            <button
              onClick={() => { soundFx.click(); onOpenCommandPalette(); }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                padding: '7px 10px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
              }}
              title="Press ⌘K for command palette"
            >
              ⌘K
            </button>
          </div>
        </div>
      </header>

      {/* ── Achievement Toast (Top Right) ── */}
      {toastQueue.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            right: 24,
            zIndex: 70,
            animation: 'toast-in 0.3s ease',
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '14px 20px',
              border: '1px solid var(--amber)',
              backgroundColor: 'rgba(10, 12, 20, 0.95)',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '20px' }}>{toastQueue[0].icon}</div>
            <div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--amber)', textTransform: 'uppercase' }}>
                ACHIEVEMENT UNLOCKED
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>
                {toastQueue[0].title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {toastQueue[0].description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── In-Flight Telemetry & HUD (Visible only during 3D World Mode) ── */}
      {viewMode === '3d-world' && (
        <>
          {/* Proximity Interaction Hint (Center Bottom) */}
          {interactionHint && (
            <div
              style={{
                position: 'fixed',
                bottom: 95,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 50,
                pointerEvents: 'auto',
                animation: 'hint-bounce 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => {
                executeInteraction();
              }}
            >
              <div
                className="glass-panel"
                style={{
                  padding: '10px 22px',
                  border: '1px solid var(--amber)',
                  backgroundColor: 'rgba(12, 14, 22, 0.9)',
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 800,
                    background: 'var(--amber)',
                    color: '#07080C',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  PRESS [E]
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
                  {interactionHint.label}
                </div>
                <ExternalLink size={13} color="var(--amber)" />
              </div>
            </div>
          )}

          {/* ── Abeto Messenger Delivery & Collectibles Card (Top Left below nav) ── */}
          <div
            className="hidden-mobile"
            style={{
              position: 'fixed',
              top: 72,
              left: 24,
              zIndex: 40,
              pointerEvents: 'none',
            }}
          >
            <div
              className="glass-panel"
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(10, 14, 24, 0.85)',
                border: '1px solid var(--border-medium)',
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              {/* Active Delivery Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>📦</span>
                <div>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontWeight: 800 }}>
                    {activePackage ? 'ACTIVE MESSENGER DELIVERY' : 'MESSENGER STATUS'}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFF' }}>
                    {activePackage ? activePackage.title : 'Ready for next dispatch'}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    {activePackage ? `Deliver to: ${activePackage.recipient}` : 'Pick up parcels at Town Postbox [E]'}
                  </div>
                </div>
              </div>

              {/* Collectibles Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '6px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span style={{ color: '#FCD34D' }}>☕ Beans: {collectedBeans.length}/10</span>
                <span style={{ color: '#38BDF8' }}>⚡ Rings: {ringsPassed.length}/9</span>
                <span style={{ color: '#4ADE80' }}>📬 Deliveries: {completedDeliveries.length}/5</span>
              </div>
            </div>
          </div>

          {/* Mini-Radar / Compass (Bottom Left) */}
          <div
            className="hidden-mobile"
            style={{
              position: 'fixed',
              bottom: 24,
              left: 24,
              zIndex: 40,
              pointerEvents: 'none',
            }}
          >
            <div
              className="glass-panel"
              style={{
                width: 130,
                height: 130,
                borderRadius: '50%',
                backgroundColor: 'rgba(8, 10, 16, 0.8)',
                border: '1px solid var(--border-medium)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              }}
            >
              {/* Radar rings */}
              <div style={{ position: 'absolute', width: '70%', height: '70%', borderRadius: '50%', border: '1px dashed rgba(255, 255, 255, 0.08)' }} />
              <div style={{ position: 'absolute', width: '38%', height: '38%', borderRadius: '50%', border: '1px solid rgba(245, 158, 11, 0.15)' }} />

              {/* Drone center blip */}
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)', zIndex: 2 }} />

              {/* Active Delivery Target ping */}
              {activePackage && (
                (() => {
                  const dx = (activePackage.targetPos[0] - dronePos[0]) * 0.9;
                  const dz = (activePackage.targetPos[2] - dronePos[2]) * 0.9;
                  const dist = Math.sqrt(dx * dx + dz * dz);
                  const maxR = 52;
                  const scale = dist > maxR ? maxR / dist : 1;
                  return (
                    <div
                      title={`Target: ${activePackage.recipient}`}
                      style={{
                        position: 'absolute',
                        transform: `translate(${dx * scale}px, ${dz * scale}px)`,
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        background: '#EF4444',
                        boxShadow: '0 0 10px #EF4444',
                        zIndex: 3,
                        animation: 'pulse 1s infinite',
                      }}
                    />
                  );
                })()
              )}

              {/* District markers on radar */}
              {districtList.map((d) => {
                const dx = (d.coords[0] - dronePos[0]) * 0.9;
                const dz = (d.coords[2] - dronePos[2]) * 0.9;
                const dist = Math.sqrt(dx * dx + dz * dz);
                const maxR = 52;
                const scale = dist > maxR ? maxR / dist : 1;
                const isCurrent = activeDistrict === d.id;

                return (
                  <div
                    key={d.id}
                    title={d.label}
                    style={{
                      position: 'absolute',
                      transform: `translate(${dx * scale}px, ${dz * scale}px)`,
                      width: isCurrent ? 7 : 5,
                      height: isCurrent ? 7 : 5,
                      borderRadius: '50%',
                      background: isCurrent ? 'var(--amber)' : '#808080',
                      boxShadow: isCurrent ? '0 0 8px var(--amber)' : 'none',
                    }}
                  />
                );
              })}

              <div style={{ position: 'absolute', bottom: 6, fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                {DISTRICTS[activeDistrict]?.label || 'RADAR'}
              </div>
            </div>
          </div>

          {/* Flight Telemetry Speedometer (Bottom Right) */}
          <div
            className="hidden-mobile"
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 40,
              pointerEvents: 'none',
            }}
          >
            <div
              className="glass-panel"
              style={{
                padding: '12px 18px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'rgba(8, 10, 16, 0.8)',
                minWidth: '180px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                  DRONE SPEED
                </span>
                <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#FFF' }}>
                  {droneSpeed}{' '}
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>KM/H</span>
                </span>
              </div>

              {/* Speed Bar */}
              <div style={{ width: '100%', height: 4, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (droneSpeed / 22) * 100)}%`,
                    background: droneSpeed > 14 ? 'var(--amber)' : 'var(--cyan)',
                    transition: 'width 0.1s ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                <span>WASD: MOVE</span>
                <span>SHIFT/SPACE: BOOST</span>
              </div>
            </div>
          </div>

          {/* Mobile Virtual Joystick */}
          <VirtualJoystick />
        </>
      )}

      <style>{`
        @media (max-width: 800px) {
          .district-teleport-bar {
            display: none !important;
          }
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
