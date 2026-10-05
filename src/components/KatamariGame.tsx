import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Trophy, RotateCcw, Navigation, MousePointer, Keyboard } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface KatamariGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RollableNode {
  id: number;
  el: HTMLElement;
  text: string;
  docX: number;
  docY: number;
  width: number;
  height: number;
  vol: number;
  radius: number;
  color: string;
  bgColor: string;
  absorbed: boolean;
  // Attached 3D spherical coordinates relative to ball center
  orbitDist: number;
  theta: number; // latitude
  phi: number;   // longitude
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const KING_QUOTES = [
  "We are pleased! Roll up Kaufee's tech stack into a magnificent celestial sphere!",
  "Oho! Look at that delicious Python backend badge spinning around!",
  "CGPA 8.49 absorbed! Truly an intellectually dense Katamari!",
  "Look at that Ollama local agent spinning around the sphere!",
  "Magnificent! Even the terminal emulator cannot escape our royal gravity!",
  "Keep rolling! The Cosmos eagerly awaits this beautiful portfolio star!",
  "Delicious! A ProjectPulse Kanban board has been rolled up!",
  "Splendid work! We shall place this Katamari in the night sky as a constellation!"
];

export const KatamariGame: React.FC<KatamariGameProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const attachedContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const [diameterDisplay, setDiameterDisplay] = useState('24cm 6mm');
  const [itemsCollected, setItemsCollected] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [kingQuote, setKingQuote] = useState(KING_QUOTES[0]);
  const [gameWon, setGameWon] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [controlMode, setControlMode] = useState<'keyboard' | 'mouse'>('keyboard');

  // Internal physics & gameplay state
  const stateRef = useRef<{
    docX: number;
    docY: number;
    vx: number;
    vy: number;
    radius: number;
    vol: number;
    rollTh: number;  // Direction heading
    rollPhi: number; // Pitch rotation
    keys: Set<string>;
    nodes: RollableNode[];
    attached: RollableNode[];
    particles: Particle[];
    isBoosting: boolean;
    mouseTarget: { x: number; y: number; active: boolean; isDown: boolean };
    score: number;
  }>({
    docX: 0,
    docY: 0,
    vx: 0,
    vy: 0,
    radius: 28, // initial radius in pixels (~24cm)
    vol: (4 * Math.PI * Math.pow(28, 3)) / 3,
    rollTh: 0,
    rollPhi: 0,
    keys: new Set(),
    nodes: [],
    attached: [],
    particles: [],
    isBoosting: false,
    mouseTarget: { x: 0, y: 0, active: false, isDown: false },
    score: 0,
  });

  // Calculate formatted Katamari diameter (cm, m, km)
  const formatDiameter = (radiusPx: number) => {
    // 28px ~= 24.6 cm
    const totalCm = (radiusPx / 28) * 24.6;
    if (totalCm < 100) {
      const cm = Math.floor(totalCm);
      const mm = Math.floor((totalCm - cm) * 10);
      return `${cm}cm ${mm}mm`;
    } else if (totalCm < 10000) {
      const meters = totalCm / 100;
      return `${meters.toFixed(2)}m`;
    } else {
      const km = totalCm / 100000;
      return `${km.toFixed(2)}km`;
    }
  };

  // Scan and register DOM elements across the portfolio (Kathack-style)
  const scanPortfolioElements = useCallback(() => {
    const selector = [
      '.tech-pill',
      '.badge',
      '.metric-box',
      '.hero-badge',
      '.skill-chip',
      'button',
      'h1',
      'h2',
      'h3',
      'h4',
      '.project-card',
      '.glass-panel',
      '.stat-card',
      'code',
      'a.pill',
      'span.tag'
    ].join(', ');

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const validNodes: RollableNode[] = [];
    let idCounter = 0;

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    elements.forEach((el) => {
      // Exclude Katamari UI elements
      if (
        el.closest('.katamari-hud') ||
        el.closest('.katamari-layer') ||
        el.closest('.katamari-king-bubble') ||
        el.closest('.katamari-minimap') ||
        el.closest('.katamari-attached-container')
      ) {
        return;
      }

      const rect = el.getBoundingClientRect();
      if (rect.width > 12 && rect.height > 10 && rect.width < 1200 && rect.height < 900) {
        const text = el.innerText?.trim().slice(0, 28) || el.tagName.toLowerCase();
        if (!text) return;

        const style = window.getComputedStyle(el);
        const color = style.color || '#FFFFFF';
        const bgColor = style.backgroundColor !== 'rgba(0, 0, 0, 0)'
          ? style.backgroundColor
          : 'rgba(245, 166, 35, 0.2)';

        const w = rect.width;
        const h = rect.height;
        // Volume formula based on Kathack: w * h * min(w, h)
        const vol = w * h * Math.min(w, h);
        const radius = Math.max(12, Math.hypot(w, h) / 2);

        validNodes.push({
          id: idCounter++,
          el,
          text,
          docX: rect.left + scrollX + w / 2,
          docY: rect.top + scrollY + h / 2,
          width: w,
          height: h,
          vol,
          radius,
          color,
          bgColor,
          absorbed: false,
          orbitDist: 0,
          theta: (Math.random() - 0.5) * Math.PI,
          phi: Math.random() * Math.PI * 2,
        });
      }
    });

    stateRef.current.nodes = validNodes;
    setTotalItems(Math.min(validNodes.length, 80));
  }, []);

  // Restore any hidden / absorbed elements cleanly
  const restoreElements = useCallback(() => {
    stateRef.current.nodes.forEach((item: RollableNode) => {
      item.el.classList.remove('katamari-absorbed');
    });
    stateRef.current.attached = [];
    stateRef.current.score = 0;
    stateRef.current.radius = 28;
    stateRef.current.vol = (4 * Math.PI * Math.pow(28, 3)) / 3;
    setDiameterDisplay('24cm 6mm');
    setItemsCollected(0);
    setGameWon(false);

    if (attachedContainerRef.current) {
      attachedContainerRef.current.innerHTML = '';
    }
  }, []);

  // Setup game loop & event listeners
  useEffect(() => {
    if (!isOpen) {
      restoreElements();
      return;
    }

    // Initialize position centered in current viewport
    const curScrollY = window.scrollY || window.pageYOffset;
    const s = stateRef.current;
    s.docX = window.innerWidth / 2;
    s.docY = curScrollY + window.innerHeight / 2;
    s.vx = 0;
    s.vy = 0;
    s.radius = 28;
    s.vol = (4 * Math.PI * Math.pow(28, 3)) / 3;
    s.score = 0;
    s.attached = [];
    s.keys.clear();

    scanPortfolioElements();
    soundFx.boostRing();

    // Canvas resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        s.keys.add(key);
        setControlMode('keyboard');
      }
      if (e.shiftKey) s.isBoosting = true;
      if (e.key === 'Escape') onClose();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      s.keys.delete(key);
      if (!e.shiftKey) s.isBoosting = false;
    };

    // Mouse / Pointer steering
    const handleMouseMove = (e: MouseEvent) => {
      s.mouseTarget.x = e.clientX;
      s.mouseTarget.y = e.clientY;
      s.mouseTarget.active = true;
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Left or Right click accelerates towards cursor
      if (e.button === 0 || e.button === 2) {
        s.mouseTarget.isDown = true;
        s.mouseTarget.x = e.clientX;
        s.mouseTarget.y = e.clientY;
        setControlMode('mouse');
      }
    };

    const handleMouseUp = () => {
      s.mouseTarget.isDown = false;
    };

    // Touch controls for mobile / tablets
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        s.mouseTarget.x = e.touches[0].clientX;
        s.mouseTarget.y = e.touches[0].clientY;
        s.mouseTarget.active = true;
        s.mouseTarget.isDown = true;
      }
    };

    const handleTouchEnd = () => {
      s.mouseTarget.isDown = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Game loop
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const docWidth = document.documentElement.clientWidth || window.innerWidth;
      const docHeight = Math.max(document.documentElement.scrollHeight, 6000);

      // --- 1. Physics & Acceleration ---
      let ax = 0;
      let ay = 0;

      // Keyboard input
      if (s.keys.has('arrowleft') || s.keys.has('a')) ax -= 1;
      if (s.keys.has('arrowright') || s.keys.has('d')) ax += 1;
      if (s.keys.has('arrowup') || s.keys.has('w')) ay -= 1;
      if (s.keys.has('arrowdown') || s.keys.has('s')) ay += 1;

      // Mouse steering: if mouse is clicked or moved without keys
      if ((ax === 0 && ay === 0 && s.mouseTarget.isDown) || (s.mouseTarget.active && ax === 0 && ay === 0 && s.keys.size === 0)) {
        const curScroll = window.scrollY || window.pageYOffset;
        const screenBallX = s.docX;
        const screenBallY = s.docY - curScroll;
        const dx = s.mouseTarget.x - screenBallX;
        const dy = s.mouseTarget.y - screenBallY;
        const dist = Math.hypot(dx, dy);

        // Deadzone around ball
        if (dist > s.radius * 0.8) {
          const power = s.mouseTarget.isDown ? 1.0 : Math.min(dist / 300, 0.7);
          ax = (dx / dist) * power;
          ay = (dy / dist) * power;
        }
      }

      // Acceleration and speed based on Katamari size
      const speedMultiplier = s.isBoosting ? 1.8 : 1.0;
      const baseAccel = (580 + Math.min(s.radius * 2, 400)) * speedMultiplier;
      const friction = 0.915;

      s.vx += ax * baseAccel * dt;
      s.vy += ay * baseAccel * dt;
      s.vx *= friction;
      s.vy *= friction;

      // Position update
      s.docX += s.vx * dt;
      s.docY += s.vy * dt;

      // Katamari 3D rotation angles
      const speed = Math.hypot(s.vx, s.vy);
      if (speed > 1) {
        s.rollTh = Math.atan2(s.vy, s.vx);
        s.rollPhi -= (speed / s.radius) * dt;
      }

      // Page boundary clamps
      if (s.docX < s.radius) { s.docX = s.radius; s.vx = -s.vx * 0.4; }
      if (s.docX > docWidth - s.radius) { s.docX = docWidth - s.radius; s.vx = -s.vx * 0.4; }
      if (s.docY < s.radius) { s.docY = s.radius; s.vy = -s.vy * 0.4; }
      if (s.docY > docHeight - s.radius) { s.docY = docHeight - s.radius; s.vy = -s.vy * 0.4; }

      // --- 2. Camera Tracking (Kathack smooth camera) ---
      const targetScrollY = s.docY - window.innerHeight / 2;
      const currentScrollY = window.scrollY || window.pageYOffset;
      const smoothScrollY = currentScrollY + (targetScrollY - currentScrollY) * 0.16;
      window.scrollTo(0, Math.max(0, Math.min(docHeight - window.innerHeight, smoothScrollY)));

      // Mini-map scroll progress
      setScrollProgress(s.docY / docHeight);

      // --- 3. Collision Detection with Portfolio Elements ---
      for (const node of s.nodes) {
        if (node.absorbed) continue;

        // Kathack volume check: ball volume must be >= node volume * 0.75
        const canAbsorb = s.vol >= node.vol * 0.75 || s.radius >= node.radius * 0.55;

        const dist = Math.hypot(s.docX - node.docX, s.docY - node.docY);
        if (dist < s.radius + node.radius) {
          if (canAbsorb) {
            // Absorb!
            node.absorbed = true;
            node.el.classList.add('katamari-absorbed');

            // Attach to ball surface at impact coordinates
            node.orbitDist = s.radius + Math.min(node.radius * 0.35, 18);
            node.phi = -s.rollPhi + (Math.random() - 0.5) * 0.4;
            node.theta = (Math.random() - 0.5) * Math.PI * 0.8;

            s.attached.push(node);
            s.score += 1;

            // Kathack growth formula: newVol = getVol() + nodeVol * VOL_MULT
            const volMult = 0.85;
            s.vol += node.vol * volMult;
            // Radius derived from volume: (vol * 3 / 4pi)^(1/3)
            const newRadius = Math.pow((s.vol * 3) / (4 * Math.PI), 1 / 3);
            s.radius = Math.min(Math.max(newRadius, s.radius + 1.5), 260);

            // Update HUD
            setDiameterDisplay(formatDiameter(s.radius));
            setItemsCollected(s.score);

            // Play pickup sound
            soundFx.collect();

            // Spawn celebration particles
            const screenX = s.docX;
            const screenY = s.docY - window.scrollY;
            for (let p = 0; p < 8; p++) {
              const a = Math.random() * Math.PI * 2;
              const spd = 70 + Math.random() * 150;
              s.particles.push({
                x: screenX,
                y: screenY,
                vx: Math.cos(a) * spd,
                vy: Math.sin(a) * spd,
                life: 0.5,
                maxLife: 0.5,
                color: node.color || '#F5A623',
                size: 3 + Math.random() * 4,
              });
            }

            // King of All Cosmos commentary
            if (s.score % 6 === 0) {
              const quote = KING_QUOTES[(s.score / 6) % KING_QUOTES.length];
              setKingQuote(quote);
            }

            if (s.score >= 50) {
              setGameWon(true);
            }
          } else {
            // Node is too heavy: bounce back gently
            const nx = (s.docX - node.docX) / dist;
            const ny = (s.docY - node.docY) / dist;
            s.vx += nx * 140;
            s.vy += ny * 140;
          }
        }
      }

      // --- 4. Render Canvas Overlay ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const screenBallX = s.docX;
      const screenBallY = s.docY - window.scrollY;

      // Draw burst particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) {
          s.particles.splice(i, 1);
          continue;
        }
        const alpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Katamari Ambient Aura
      const aura = ctx.createRadialGradient(
        screenBallX, screenBallY, s.radius * 0.5,
        screenBallX, screenBallY, s.radius * 2.3
      );
      aura.addColorStop(0, 'rgba(245, 166, 35, 0.32)');
      aura.addColorStop(1, 'rgba(245, 166, 35, 0)');
      ctx.beginPath();
      ctx.arc(screenBallX, screenBallY, s.radius * 2.3, 0, Math.PI * 2);
      ctx.fillStyle = aura;
      ctx.fill();

      // Draw attached items in the back (behind the sphere)
      drawAttachedLayer(ctx, s, screenBallX, screenBallY, false);

      // --- Draw 3D-Shaded Katamari Ball ---
      ctx.save();
      ctx.translate(screenBallX, screenBallY);

      // Multi-layer Katamari Sphere
      const sphereGrad = ctx.createRadialGradient(
        -s.radius * 0.35, -s.radius * 0.35, s.radius * 0.08,
        0, 0, s.radius
      );
      sphereGrad.addColorStop(0, '#FFFBEB');
      sphereGrad.addColorStop(0.25, '#F5A623');
      sphereGrad.addColorStop(0.7, '#D97706');
      sphereGrad.addColorStop(1, '#78350F');

      ctx.beginPath();
      ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.stroke();

      // Iconic colorful Katamari bumps orbiting in 3D
      const bumpColors = ['#EC4899', '#38BDF8', '#10B981', '#A855F7', '#F59E0B', '#EF4444'];
      const numBumps = 14;
      for (let b = 0; b < numBumps; b++) {
        const phi = (b / numBumps) * Math.PI * 2 + s.rollPhi;
        const theta = ((b % 5) - 2) * 0.6;

        const bx = Math.cos(phi) * Math.cos(theta) * (s.radius * 0.78);
        const by = Math.sin(theta) * (s.radius * 0.78);
        const bz = Math.sin(phi) * Math.cos(theta);

        if (bz > -0.25) {
          const bumpRadius = Math.max(4, s.radius * 0.13) * (0.8 + bz * 0.3);
          ctx.beginPath();
          ctx.arc(bx, by, bumpRadius, 0, Math.PI * 2);
          ctx.fillStyle = bumpColors[b % bumpColors.length];
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Center coffee logo stamp ☕
      ctx.font = `${Math.max(16, s.radius * 0.5)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('☕', 0, 0);

      ctx.restore();

      // Draw attached items in front (in front of the sphere)
      drawAttachedLayer(ctx, s, screenBallX, screenBallY, true);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      restoreElements();
    };
  }, [isOpen, scanPortfolioElements, restoreElements, onClose]);

  // Render items physically stuck and tumbling around the Katamari ball in 3D
  const drawAttachedLayer = (
    ctx: CanvasRenderingContext2D,
    s: typeof stateRef.current,
    cx: number,
    cy: number,
    frontLayer: boolean
  ) => {
    for (const item of s.attached) {
      const currentPhi = item.phi + s.rollPhi;
      const currentTheta = item.theta;

      const px = Math.cos(currentPhi) * Math.cos(currentTheta) * item.orbitDist;
      const py = Math.sin(currentTheta) * item.orbitDist;
      const pz = Math.sin(currentPhi) * Math.cos(currentTheta);

      const isFront = pz >= 0;
      if (isFront !== frontLayer) continue;

      ctx.save();
      ctx.translate(cx + px, cy + py);

      const scale = Math.max(0.4, 0.72 + pz * 0.35);
      ctx.scale(scale, scale);
      ctx.rotate(currentPhi + Math.PI / 4);

      const badgeW = Math.min(Math.max(item.width * 0.45, 44), 110);
      const badgeH = 20;

      // Dark badge backing
      ctx.fillStyle = 'rgba(12, 14, 22, 0.94)';
      ctx.beginPath();
      ctx.roundRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 10);
      ctx.fill();

      // Border matching element's color
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = item.color || '#F5A623';
      ctx.stroke();

      // Label text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.text.slice(0, 14), 0, 0);

      ctx.restore();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ── Fixed Transparent Canvas Overlay ── */}
      <canvas
        ref={canvasRef}
        className="katamari-layer"
        style={{ pointerEvents: 'none' }}
      />

      {/* ── Top Katamari HUD Bar ── */}
      <div className="katamari-hud">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>☕</span>
          <span style={{ fontWeight: 800, color: 'var(--amber)', letterSpacing: '0.04em' }}>
            KATAMARI PORTFOLIO
          </span>
        </div>

        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

        {/* Real Diameter Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Trophy size={14} style={{ color: 'var(--amber)' }} />
          <span style={{ color: '#FFF', fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em' }}>
            {diameterDisplay}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>diameter</span>
        </div>

        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

        {/* Absorbed counter & progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>
            {itemsCollected} / {totalItems}
          </span>
          <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, (itemsCollected / totalItems) * 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--amber), var(--cyan))',
                borderRadius: '3px',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        </div>

        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

        {/* Control mode badge */}
        <div
          title="Switch control mode (WASD or Mouse)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {controlMode === 'keyboard' ? <Keyboard size={12} /> : <MousePointer size={12} />}
          <span>{controlMode === 'keyboard' ? 'WASD / Keys' : 'Mouse Follow'}</span>
        </div>

        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

        {/* Reset / Restore Button */}
        <button
          onClick={restoreElements}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--text-secondary)',
            padding: '5px 11px',
            borderRadius: 'var(--r-full)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#FFF')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <RotateCcw size={12} />
          Reset Page
        </button>

        {/* Exit Button */}
        <button
          onClick={onClose}
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#F87171',
            padding: '5px 13px',
            borderRadius: 'var(--r-full)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
        >
          <X size={12} />
          Exit (Esc)
        </button>
      </div>

      {/* ── King of All Cosmos Dialogue ── */}
      <div className="katamari-king-bubble">
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #A855F7, #EC4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
          }}
        >
          👑
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color: 'var(--purple)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            King of All Cosmos
          </div>
          <div style={{ fontSize: '12px', color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.4 }}>
            "{kingQuote}"
          </div>
        </div>
      </div>

      {/* ── Vertical Document Mini-Map ── */}
      <div className="katamari-minimap" title="Portfolio Map Scroll Position">
        <Navigation size={12} style={{ color: 'var(--amber)', margin: '0 auto' }} />
        <div style={{ position: 'relative', flex: 1, width: '100%', margin: '8px 0' }}>
          <div
            className="katamari-minimap-marker"
            style={{ top: `${Math.min(95, Math.max(5, scrollProgress * 100))}%` }}
          >
            ☕
          </div>
        </div>
        <div style={{ fontSize: '8px', color: 'var(--text-dim)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
          MAP
        </div>
      </div>

      {/* ── Controls Helper Overlay ── */}
      {showHint && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(8, 8, 14, 0.92)',
            border: '1px solid rgba(245, 166, 35, 0.3)',
            borderRadius: 'var(--r-full)',
            padding: '10px 24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            zIndex: 9999,
            whiteSpace: 'nowrap',
          }}
        >
          <span>
            <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#FFF' }}>WASD</kbd>
            {' or '}
            <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#FFF' }}>Mouse Drag</kbd>
            {' to roll across the portfolio!'}
          </span>
          <span>•</span>
          <span>
            <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#FFF' }}>Shift</kbd>
            {' Turbo'}
          </span>
          <span>•</span>
          <button
            onClick={() => setShowHint(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '14px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Victory Celebration Modal ── */}
      {gameWon && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(6, 6, 10, 0.85)',
            backdropFilter: 'blur(14px)',
            zIndex: 10000,
            animation: 'fade-in 0.4s ease',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '48px 40px',
              background: 'rgba(12, 12, 18, 0.96)',
              border: '1px solid rgba(245, 166, 35, 0.4)',
              borderRadius: '24px',
              boxShadow: '0 0 80px rgba(245, 166, 35, 0.25)',
              maxWidth: '520px',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✨👑✨</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--amber)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              The Kaufee Constellation!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
              Magnificent! You rolled up <strong style={{ color: '#FFF' }}>{itemsCollected} engineering elements</strong> directly from the portfolio into a glorious new star in the heavens!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={restoreElements}
                className="btn btn-secondary"
                style={{ padding: '10px 20px', borderRadius: 'var(--r-full)' }}
              >
                Roll Again
              </button>
              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{ padding: '10px 24px', borderRadius: 'var(--r-full)' }}
              >
                Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
