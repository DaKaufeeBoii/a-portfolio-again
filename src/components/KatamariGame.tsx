import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { X, Trophy, RotateCcw, Navigation, Zap } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import { KatamariIcon } from './KatamariIcon';

interface KatamariGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RollableNode {
  id: number;
  el: HTMLElement;
  text: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  color: string;
  bgColor: string;
  absorbed: boolean;
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
  "We are pleased! Roll up Sai Tarun's tech stack into a magnificent 3D celestial sphere!",
  "Oho! Look at that delicious Python backend badge spinning on the Katamari!",
  "CGPA 8.49 absorbed! Truly an intellectually dense Katamari!",
  "Look at that Ollama local agent tumbling around the sphere!",
  "Magnificent! Even the terminal emulator cannot escape our royal 3D gravity!",
  "Keep rolling! The Cosmos eagerly awaits this beautiful portfolio star!",
  "Delicious! A ProjectPulse Kanban board has joined the clump!",
  "Splendid work! We shall place this Katamari in the night sky as a constellation!"
];

const SECTIONS = [
  { id: 'hero', label: 'Hero', selector: 'header, #root > div > main > section:first-of-type' },
  { id: 'projects', label: 'Projects', selector: '#projects' },
  { id: 'sandbox', label: 'Sandbox', selector: '#ai-sandbox' },
  { id: 'experience', label: 'Timeline', selector: '#experience' },
  { id: 'skills', label: 'Skills', selector: '#skills' },
  { id: 'achievements', label: 'Awards', selector: '#achievements' },
  { id: 'contact', label: 'Contact', selector: '#contact' },
];

function circleIntersectsRect(
  cx: number,
  cy: number,
  r: number,
  left: number,
  top: number,
  right: number,
  bottom: number
): boolean {
  const closestX = Math.max(left, Math.min(cx, right));
  const closestY = Math.max(top, Math.min(cy, bottom));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= r * r;
}

// Generate dynamic 3D text badge mesh attached to the Katamari ball
function createAttached3DBadge(text: string, color: string, ballRadius: number, ballGroup: THREE.Group): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;

  // Rounded pill background
  ctx.fillStyle = 'rgba(10, 12, 20, 0.95)';
  ctx.beginPath();
  ctx.roundRect(4, 4, 172, 40, 20);
  ctx.fill();

  // Vibrant accent border
  ctx.lineWidth = 3;
  ctx.strokeStyle = color || '#F5A623';
  ctx.stroke();

  // Label text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.slice(0, 16), 90, 24);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    roughness: 0.35,
    side: THREE.DoubleSide,
  });

  const geo = new THREE.PlaneGeometry(ballRadius * 0.72, ballRadius * 0.22);
  const mesh = new THREE.Mesh(geo, mat);

  // Position on outer sphere surface
  const randomDir = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ).normalize();

  // Transform world direction to local coordinates of current ball orientation
  const localDir = randomDir.clone().applyQuaternion(ballGroup.quaternion.clone().invert());
  mesh.position.copy(localDir.multiplyScalar(ballRadius + 2 + Math.random() * 4));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), localDir);

  return mesh;
}

export const KatamariGame: React.FC<KatamariGameProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const [diameterDisplay, setDiameterDisplay] = useState('50cm 0mm');
  const [itemsCollected, setItemsCollected] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [kingQuote, setKingQuote] = useState(KING_QUOTES[0]);
  const [gameWon, setGameWon] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Core physics & game state
  // Ball radius is 50px (diameter 100px) which is ~7.8% of a 1280px screen (>5% of website size)
  const BALL_RADIUS = 50;

  const stateRef = useRef<{
    docX: number;
    docY: number;
    vx: number;
    vy: number;
    keys: Set<string>;
    nodes: RollableNode[];
    particles: Particle[];
    isBoosting: boolean;
    mouseTarget: { x: number; y: number; active: boolean; isDown: boolean };
    score: number;
    attachedMeshes: THREE.Mesh[];
  }>({
    docX: 0,
    docY: 0,
    vx: 0,
    vy: 0,
    keys: new Set(),
    nodes: [],
    particles: [],
    isBoosting: false,
    mouseTarget: { x: 0, y: 0, active: false, isDown: false },
    score: 0,
    attachedMeshes: [],
  });

  // Calculate formatted diameter based on items collected
  const getSimulatedDiameter = (score: number) => {
    const baseCm = 50.0;
    const addedCm = score * 4.2;
    const totalCm = baseCm + addedCm;

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

  // Scan live DOM elements on the portfolio
  // STRICT RULE: Only absorb atomic bite-sized items (tech pills, chips, tags, small buttons, code tokens)
  // Max size is at most 50% bigger than the ball (ballDiameter * 1.5 = 150px)
  // NEVER absorb layout cards, project containers, or full-blown website sections!
  const scanPortfolioElements = useCallback(() => {
    const selector = [
      '.tech-pill',
      '.skill-chip',
      '.hero-badge',
      '.badge',
      '.stat-val',
      'a.pill',
      'span.tag',
      'span.badge-text',
      'code',
      'kbd',
      'p strong',
      'p em',
      'li strong',
      'button:not(.btn-hero):not(.btn-large)',
      'span.label',
    ].join(', ');

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const validNodes: RollableNode[] = [];
    let idCounter = 0;

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    const ballDiameter = BALL_RADIUS * 2; // 100px
    const maxAllowedSize = ballDiameter * 1.5; // strictly at most 50% bigger than the ball (150px)
    const minAllowedSize = 8; // skip 0px or invisible items

    elements.forEach((el) => {
      // 1. Exclude Katamari game UI elements
      if (
        el.closest('.katamari-hud') ||
        el.closest('.katamari-layer') ||
        el.closest('.katamari-king-bubble') ||
        el.closest('.katamari-minimap')
      ) {
        return;
      }

      // 2. Reject ANY containers or elements containing child container blocks
      if (
        el.matches('section, article, main, header, footer, nav, aside, form, .project-card, .card, .stat-card, .metric-box, [class*="container"], [class*="wrapper"], [class*="grid"]') ||
        el.querySelector('div, section, article, p, ul, ol, table')
      ) {
        return;
      }

      const rect = el.getBoundingClientRect();
      const maxDim = Math.max(rect.width, rect.height);
      const minDim = Math.min(rect.width, rect.height);

      // 3. Dimensional constraint: must be smaller or at most 50% bigger than the Katamari ball
      if (minDim < minAllowedSize) return;
      if (maxDim > maxAllowedSize) return; // Never absorb items > 150px!
      if (rect.width * rect.height > maxAllowedSize * maxAllowedSize) return;

      const text = el.innerText?.trim().slice(0, 24) || el.tagName.toLowerCase();
      if (!text) return;

      const style = window.getComputedStyle(el);
      const color = style.color || '#FFFFFF';
      const bgColor = style.backgroundColor !== 'rgba(0, 0, 0, 0)'
        ? style.backgroundColor
        : 'rgba(245, 166, 35, 0.2)';

      const left = rect.left + scrollX;
      const top = rect.top + scrollY;

      validNodes.push({
        id: idCounter++,
        el,
        text,
        left,
        top,
        right: left + rect.width,
        bottom: top + rect.height,
        width: rect.width,
        height: rect.height,
        color,
        bgColor,
        absorbed: false,
      });
    });

    stateRef.current.nodes = validNodes;
    setTotalItems(Math.min(validNodes.length, 90));
  }, []);

  // Restore elements and reset game state
  const restoreElements = useCallback(() => {
    stateRef.current.nodes.forEach((item: RollableNode) => {
      item.el.classList.remove('katamari-absorbed');
    });

    // Remove attached 3D meshes
    stateRef.current.attachedMeshes.forEach((mesh) => {
      if (mesh.parent) mesh.parent.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    stateRef.current.attachedMeshes = [];

    stateRef.current.score = 0;
    setDiameterDisplay('50cm 0mm');
    setItemsCollected(0);
    setGameWon(false);
  }, []);

  // Warp ball directly to any section
  const warpToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId) || document.querySelector(`[href="#${sectionId}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      stateRef.current.docY = rect.top + scrollY + 120;
      stateRef.current.docX = window.innerWidth / 2;
      stateRef.current.vx = 0;
      stateRef.current.vy = 0;
      soundFx.boostRing();
    }
  };

  // Main Three.js Lifecycle & Game Loop
  useEffect(() => {
    if (!isOpen) {
      restoreElements();
      return;
    }

    // Disable CSS smooth-scroll so window.scrollTo tracking is 60fps instant
    const originalHtmlScroll = document.documentElement.style.scrollBehavior;
    const originalBodyScroll = document.body.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    // Spawn ball near center of current viewport
    const curScrollY = window.scrollY || window.pageYOffset;
    const s = stateRef.current;
    s.docX = window.innerWidth / 2;
    s.docY = curScrollY + window.innerHeight / 2;
    s.vx = 0;
    s.vy = 0;
    s.score = 0;
    s.attachedMeshes = [];
    s.keys.clear();

    scanPortfolioElements();
    soundFx.boostRing();

    // ── Setup Three.js Scene ──
    const canvas = canvasRef.current;
    const pCanvas = particleCanvasRef.current;
    if (!canvas || !pCanvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
    const pCtx = pCanvas.getContext('2d')!;

    // Orthographic camera for 1:1 screen pixel mapping
    const camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      -window.innerHeight / 2,
      1,
      1000
    );
    camera.position.set(0, 0, 400);

    const scene = new THREE.Scene();

    // Lighting (neutral ambient + directional highlight)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight.position.set(-180, 240, 350);
    scene.add(dirLight);

    const softFillLight = new THREE.DirectionalLight(0xfef3c7, 0.4);
    softFillLight.position.set(200, -150, 200);
    scene.add(softFillLight);

    // ── Create 3D Katamari Ball ──
    const ballGroup = new THREE.Group();
    scene.add(ballGroup);

    // 1. Core Sphere (faceted polygon look like the classic Katamari)
    const coreGeo = new THREE.IcosahedronGeometry(BALL_RADIUS, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf6f8fc,
      roughness: 0.35,
      metalness: 0.1,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    ballGroup.add(coreMesh);

    // 2. Iconic Knobs / Studs in all 3D directions (using icosahedron vertices)
    const knobColors = [
      0xef4444, // Red
      0xf97316, // Orange
      0xeab308, // Yellow
      0x22c55e, // Green
      0x06b6d4, // Cyan
      0x3b82f6, // Blue
      0x8b5cf6, // Violet
      0xec4899, // Pink
      0xf43f5e, // Rose
      0x14b8a6, // Teal
      0xa855f7, // Purple
      0xf59e0b, // Amber
    ];

    const vertexIco = new THREE.IcosahedronGeometry(BALL_RADIUS * 0.96, 0);
    const posAttr = vertexIco.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const normal = new THREE.Vector3(
        posAttr.getX(i),
        posAttr.getY(i),
        posAttr.getZ(i)
      ).normalize();

      // Stepped cylinder stud
      const knobGeo = new THREE.CylinderGeometry(
        BALL_RADIUS * 0.22,
        BALL_RADIUS * 0.34,
        BALL_RADIUS * 0.36,
        12
      );
      const knobMat = new THREE.MeshStandardMaterial({
        color: knobColors[i % knobColors.length],
        roughness: 0.3,
        metalness: 0.1,
      });
      const knobMesh = new THREE.Mesh(knobGeo, knobMat);

      knobMesh.position.copy(normal.clone().multiplyScalar(BALL_RADIUS * 0.98));
      knobMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // White ring tip (iconic concentric ring)
      const ringGeo = new THREE.TorusGeometry(BALL_RADIUS * 0.16, BALL_RADIUS * 0.045, 8, 16);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = BALL_RADIUS * 0.17;
      ringMesh.rotation.x = Math.PI / 2;
      knobMesh.add(ringMesh);

      ballGroup.add(knobMesh);
    }

    // 3. Soft ground contact shadow plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    sGrad.addColorStop(0, 'rgba(0,0,0,0.45)');
    sGrad.addColorStop(0.6, 'rgba(0,0,0,0.18)');
    sGrad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(BALL_RADIUS * 2.8, BALL_RADIUS * 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    scene.add(shadowMesh);

    // Resize handler
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.left = -window.innerWidth / 2;
      camera.right = window.innerWidth / 2;
      camera.top = window.innerHeight / 2;
      camera.bottom = -window.innerHeight / 2;
      camera.updateProjectionMatrix();

      if (particleCanvasRef.current) {
        particleCanvasRef.current.width = window.innerWidth;
        particleCanvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        s.keys.add(key);
      }
      if (e.shiftKey) s.isBoosting = true;
      if (e.key === 'Escape') onCloseRef.current();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      s.keys.delete(key);
      if (!e.shiftKey) s.isBoosting = false;
    };

    // Mouse steering
    const handleMouseMove = (e: MouseEvent) => {
      s.mouseTarget.x = e.clientX;
      s.mouseTarget.y = e.clientY;
      s.mouseTarget.active = true;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 || e.button === 2) {
        s.mouseTarget.isDown = true;
        s.mouseTarget.x = e.clientX;
        s.mouseTarget.y = e.clientY;
      }
    };

    const handleMouseUp = () => {
      s.mouseTarget.isDown = false;
    };

    // Touch controls
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

    // ── Main Game Loop ──
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const docWidth = document.documentElement.clientWidth || window.innerWidth;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );

      // --- 1. Movement & Input ---
      let ax = 0;
      let ay = 0;

      if (s.keys.has('arrowleft') || s.keys.has('a')) ax -= 1;
      if (s.keys.has('arrowright') || s.keys.has('d')) ax += 1;
      if (s.keys.has('arrowup') || s.keys.has('w')) ay -= 1;
      if (s.keys.has('arrowdown') || s.keys.has('s')) ay += 1;

      // Mouse steering
      if ((ax === 0 && ay === 0 && s.mouseTarget.isDown) || (s.mouseTarget.active && ax === 0 && ay === 0 && s.keys.size === 0)) {
        const curScroll = window.scrollY || window.pageYOffset;
        const screenBallX = s.docX;
        const screenBallY = s.docY - curScroll;
        const dx = s.mouseTarget.x - screenBallX;
        const dy = s.mouseTarget.y - screenBallY;
        const dist = Math.hypot(dx, dy);

        if (dist > BALL_RADIUS * 0.7) {
          const power = s.mouseTarget.isDown ? 1.0 : Math.min(dist / 260, 0.75);
          ax = (dx / dist) * power;
          ay = (dy / dist) * power;
        }
      }

      // Smooth acceleration with turbo boost
      const speedMultiplier = s.isBoosting ? 2.4 : 1.0;
      const baseAccel = 850 * speedMultiplier;
      const friction = 0.908;

      s.vx += ax * baseAccel * dt;
      s.vy += ay * baseAccel * dt;
      s.vx *= friction;
      s.vy *= friction;

      // Update position
      s.docX += s.vx * dt;
      s.docY += s.vy * dt;

      // Traversal Clamping
      s.docX = Math.max(BALL_RADIUS, Math.min(docWidth - BALL_RADIUS, s.docX));
      s.docY = Math.max(BALL_RADIUS, Math.min(docHeight - BALL_RADIUS, s.docY));

      // --- 2. True 3D Rolling Rotation on World Axis ---
      const speed = Math.hypot(s.vx, s.vy);
      if (speed > 0.5) {
        const rollDist = speed * dt;
        // Motion direction on screen: (+vx, +vy) -> In Three.js: (+vx, -vy)
        const moveDir = new THREE.Vector3(s.vx, -s.vy, 0).normalize();
        const rotAxis = new THREE.Vector3(-moveDir.y, moveDir.x, 0).normalize();
        ballGroup.rotateOnWorldAxis(rotAxis, rollDist / BALL_RADIUS);
      }

      // Position Three.js 3D Ball & Shadow in Screen Space
      const screenBallX = s.docX;
      const screenBallY = s.docY - window.scrollY;

      const threeX = screenBallX - window.innerWidth / 2;
      const threeY = -(screenBallY - window.innerHeight / 2);

      ballGroup.position.set(threeX, threeY, 0);
      shadowMesh.position.set(threeX, threeY - 6, -BALL_RADIUS + 2);

      // --- 3. Camera Tracking across all sections ---
      const maxScroll = Math.max(0, docHeight - window.innerHeight);
      const targetScrollY = Math.max(0, Math.min(maxScroll, s.docY - window.innerHeight / 2));
      window.scrollTo(0, targetScrollY);

      setScrollProgress(s.docY / docHeight);

      // --- 4. Collision Detection & 3D Element Pickup ---
      for (const node of s.nodes) {
        if (node.absorbed) continue;

        // Accurate geometric intersection with element rectangle
        const isTouching = circleIntersectsRect(
          s.docX,
          s.docY,
          BALL_RADIUS,
          node.left,
          node.top,
          node.right,
          node.bottom
        );

        if (isTouching) {
          // Absorb!
          node.absorbed = true;
          node.el.classList.add('katamari-absorbed');

          // Attach 3D badge directly as a child of the rotating 3D Katamari sphere
          const badgeMesh = createAttached3DBadge(node.text, node.color, BALL_RADIUS, ballGroup);
          ballGroup.add(badgeMesh);
          s.attachedMeshes.push(badgeMesh);

          s.score += 1;
          setDiameterDisplay(getSimulatedDiameter(s.score));
          setItemsCollected(s.score);

          soundFx.collect();

          // Particle burst
          for (let p = 0; p < 8; p++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 70 + Math.random() * 150;
            s.particles.push({
              x: screenBallX,
              y: screenBallY,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              life: 0.5,
              maxLife: 0.5,
              color: node.color || '#F5A623',
              size: 3 + Math.random() * 4,
            });
          }

          if (s.score % 6 === 0) {
            const quote = KING_QUOTES[(s.score / 6) % KING_QUOTES.length];
            setKingQuote(quote);
          }

          if (s.score >= 50) {
            setGameWon(true);
          }
        }
      }

      // --- 5. Render Particle Effects on 2D Overlay ---
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
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
        pCtx.beginPath();
        pCtx.arc(p.x, p.y - window.scrollY, p.size * alpha, 0, Math.PI * 2);
        pCtx.fillStyle = p.color;
        pCtx.globalAlpha = alpha;
        pCtx.fill();
        pCtx.globalAlpha = 1;
      }

      // Render Three.js Scene
      renderer.render(scene, camera);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.documentElement.style.scrollBehavior = originalHtmlScroll;
      document.body.style.scrollBehavior = originalBodyScroll;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      // Clean up Three.js WebGL resources
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      vertexIco.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();

      restoreElements();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={containerRef}>
      {/* ── Fixed Three.js WebGL Canvas Overlay ── */}
      <canvas
        ref={canvasRef}
        className="katamari-layer"
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9990 }}
      />

      {/* ── Fixed Particle Effects Canvas ── */}
      <canvas
        ref={particleCanvasRef}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9991 }}
      />

      {/* ── Top Katamari HUD Bar ── */}
      <div className="katamari-hud">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <KatamariIcon size={24} />
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
          onClick={() => onCloseRef.current()}
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

      {/* ── Vertical Interactive Document Mini-Map with Section Warps ── */}
      <div className="katamari-minimap" title="Portfolio Map">
        <Navigation size={12} style={{ color: 'var(--amber)', margin: '0 auto 4px' }} />
        
        {/* Section Jump Quick Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: 'auto 0' }}>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => warpToSection(sec.id)}
              title={`Warp to ${sec.label}`}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                fontSize: '7.5px',
                padding: '2px 0',
                cursor: 'pointer',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(245,166,35,0.3)';
                e.currentTarget.style.color = '#FFF';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {sec.label[0]}
            </button>
          ))}
        </div>

        {/* Position Indicator Marker */}
        <div style={{ position: 'relative', width: '100%', height: '30px' }}>
          <div
            className="katamari-minimap-marker"
            style={{ top: `${Math.min(90, Math.max(10, scrollProgress * 100))}%` }}
          >
            <KatamariIcon size={14} />
          </div>
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
            {' to roll through all sections!'}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={13} style={{ color: 'var(--amber)' }} />
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
            <div style={{ marginBottom: '16px' }}>
              <KatamariIcon size={64} animated />
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--amber)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              The Kaufee Constellation!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
              Magnificent! You rolled up <strong style={{ color: '#FFF' }}>{itemsCollected} engineering elements</strong> directly from Sai Tarun's portfolio into a glorious new 3D star in the heavens!
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
                onClick={() => onCloseRef.current()}
                className="btn btn-primary"
                style={{ padding: '10px 24px', borderRadius: 'var(--r-full)' }}
              >
                Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
