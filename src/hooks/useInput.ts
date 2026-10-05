// ─── HOOKS — KEYBOARD ─────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';

export interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  boost: boolean;
  map: boolean;
}

const INITIAL: KeyState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  boost: false,
  map: false,
};

export function useKeyboard() {
  const keys = useRef<KeyState>({ ...INITIAL });

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keys.current.forward = true;  break;
        case 'KeyS': case 'ArrowDown':  keys.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft':  keys.current.left = true;     break;
        case 'KeyD': case 'ArrowRight': keys.current.right = true;    break;
        case 'Space':
        case 'ShiftLeft': case 'ShiftRight': keys.current.boost = true; break;
        case 'KeyM': keys.current.map = true;      break;
      }
    };

    const onUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keys.current.forward = false;  break;
        case 'KeyS': case 'ArrowDown':  keys.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft':  keys.current.left = false;     break;
        case 'KeyD': case 'ArrowRight': keys.current.right = false;    break;
        case 'Space':
        case 'ShiftLeft': case 'ShiftRight': keys.current.boost = false; break;
        case 'KeyM': keys.current.map = false;      break;
      }
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  return keys;
}

// ─── HOOKS — GAMEPAD ──────────────────────────────────────────────────────────
export function useGamepad() {
  const gamepad = useRef<Gamepad | null>(null);
  const gamepadConnected = useRef(false);

  useEffect(() => {
    const onConnect = (e: GamepadEvent) => {
      gamepad.current = e.gamepad;
      gamepadConnected.current = true;
    };
    const onDisconnect = () => {
      gamepad.current = null;
      gamepadConnected.current = false;
    };
    window.addEventListener('gamepadconnected', onConnect);
    window.addEventListener('gamepaddisconnected', onDisconnect);
    return () => {
      window.removeEventListener('gamepadconnected', onConnect);
      window.removeEventListener('gamepaddisconnected', onDisconnect);
    };
  }, []);

  const getAxes = () => {
    if (!gamepadConnected.current) return null;
    const pads = navigator.getGamepads();
    if (!pads[0]) return null;
    return {
      leftX: pads[0].axes[0],
      leftY: pads[0].axes[1],
      rightX: pads[0].axes[2],
      rightY: pads[0].axes[3],
      a: pads[0].buttons[0]?.pressed,
      b: pads[0].buttons[1]?.pressed,
    };
  };

  return { getAxes, isConnected: gamepadConnected };
}
