import { useState, useRef, type TouchEvent } from 'react';
import { useWorldStore } from '../state/stores';
import { Zap } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export const VirtualJoystick = () => {
  const setVirtualJoystick = useWorldStore((s) => s.setVirtualJoystick);
  const joystickRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [boosting, setBoosting] = useState(false);

  const radius = 45;

  const handleTouchStart = (e: TouchEvent) => {
    setActive(true);
    updateJoystick(e);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!active) return;
    updateJoystick(e);
  };

  const handleTouchEnd = () => {
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    setVirtualJoystick({ x: 0, y: 0, active: false, boost: boosting });
  };

  const updateJoystick = (e: TouchEvent) => {
    if (!joystickRef.current) return;
    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const distance = Math.min(radius, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    setKnobPos({ x, y });
    setVirtualJoystick({
      x: x / radius,
      y: y / radius,
      active: true,
      boost: boosting,
    });
  };

  const toggleBoost = (state: boolean) => {
    soundFx.click();
    setBoosting(state);
    const store = useWorldStore.getState();
    setVirtualJoystick({
      ...store.virtualJoystick,
      boost: state,
    });
  };

  return (
    <div className="mobile-controls-container" style={{ position: 'fixed', bottom: 30, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'none', zIndex: 40 }}>
      
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 18, 28, 0.65)',
          border: '2px solid rgba(245, 158, 11, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: active ? 'var(--amber)' : 'rgba(245, 158, 11, 0.7)',
            boxShadow: active ? '0 0 15px var(--amber)' : 'none',
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: active ? 'none' : 'transform 0.15s ease',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Boost Touch Button */}
      <button
        onTouchStart={() => toggleBoost(true)}
        onTouchEnd={() => toggleBoost(false)}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: boosting ? 'var(--amber)' : 'rgba(20, 23, 36, 0.75)',
          border: '2px solid rgba(245, 158, 11, 0.5)',
          color: boosting ? '#07080C' : '#FFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          boxShadow: boosting ? '0 0 20px var(--amber)' : 'none',
          cursor: 'pointer',
        }}
      >
        <Zap size={20} />
        <span style={{ fontSize: 9, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>BOOST</span>
      </button>

      <style>{`
        @media (min-width: 900px) {
          .mobile-controls-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
