// ─── PLAYER — DRONE ───────────────────────────────────────────────────────────
// Scout/survey drone aesthetic. Not a toy, not a spaceship.
// Hexagonal body, four arms, blurred propellers, indicator lights.

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody, RapierRigidBody, BallCollider } from '@react-three/rapier';
import { DRONE, CAMERA, PALETTE, DISTRICTS } from '../../lib/constants';
import { useWorldStore } from '../../state/stores';
import { useKeyboard } from '../../hooks/useInput';

// ─── Drone Geometry (visual only — separate from physics body) ────────────────

export function DroneModel({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  const activePackage = useWorldStore((s) => s.activeDeliveryPackage);
  const propRef1 = useRef<THREE.Mesh>(null!);
  const propRef2 = useRef<THREE.Mesh>(null!);
  const propRef3 = useRef<THREE.Mesh>(null!);
  const propRef4 = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Spin propellers
    const spd = 25;
    propRef1.current.rotation.y = t * spd;
    propRef2.current.rotation.y = -t * spd;
    propRef3.current.rotation.y = t * spd;
    propRef4.current.rotation.y = -t * spd;
    // Pulsing indicator lights
    if (lightRef.current) {
      lightRef.current.emissiveIntensity = 0.8 + Math.sin(t * 3.0) * 0.3;
    }
  });

  const armPositions: [number, number, number][] = [
    [0.38, 0, 0.38],
    [-0.38, 0, 0.38],
    [0.38, 0, -0.38],
    [-0.38, 0, -0.38],
  ];
  const propRefs = [propRef1, propRef2, propRef3, propRef4];

  return (
    <group ref={groupRef}>
      {/* ── Body — hexagonal prism, slightly flattened ─────────────── */}
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.1, 6]} />
        <meshStandardMaterial color="#2A2A32" roughness={0.55} metalness={0.7} />
      </mesh>
      {/* Body top detail */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.03, 6]} />
        <meshStandardMaterial color="#343440" roughness={0.5} metalness={0.75} />
      </mesh>
      {/* Undercarriage sensor ring */}
      <mesh position={[0, -0.07, 0]}>
        <torusGeometry args={[0.12, 0.018, 5, 12]} />
        <meshStandardMaterial color="#404850" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* ── Arms ───────────────────────────────────────────────────── */}
      {armPositions.map((armPos, i) => {
        const angle = Math.atan2(armPos[2], armPos[0]);
        return (
          <mesh
            key={i}
            position={[armPos[0] * 0.5, 0, armPos[2] * 0.5]}
            rotation={[0, -angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.55, 0.04, 0.04]} />
            <meshStandardMaterial color="#353540" roughness={0.5} metalness={0.75} />
          </mesh>
        );
      })}

      {/* ── Propellers (blurred disc) ──────────────────────────────── */}
      {armPositions.map((armPos, i) => (
        <mesh key={i} ref={propRefs[i]} position={armPos}>
          <cylinderGeometry args={[0.2, 0.2, 0.015, 8]} />
          <meshStandardMaterial
            color="#606870"
            roughness={0.3}
            metalness={0.6}
            transparent
            opacity={0.45}
          />
        </mesh>
      ))}

      {/* ── Forward indicator lights ("eyes") ─────────────────────── */}
      <mesh position={[0.1, 0, 0.24]}>
        <boxGeometry args={[0.05, 0.025, 0.015]} />
        <meshStandardMaterial
          ref={lightRef}
          color={PALETTE.screenBlue}
          emissive={PALETTE.screenBlue}
          emissiveIntensity={0.8}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.1, 0, 0.24]}>
        <boxGeometry args={[0.05, 0.025, 0.015]} />
        <meshStandardMaterial
          color={PALETTE.screenBlue}
          emissive={PALETTE.screenBlue}
          emissiveIntensity={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* ── Side indicator strips ──────────────────────────────────── */}
      {[-0.22, 0.22].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0]}>
          <boxGeometry args={[0.04, 0.02, 0.18]} />
          <meshStandardMaterial
            color={PALETTE.lampAmber}
            emissive={PALETTE.lampAmber}
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ── Suspended Delivery Parcel (Abeto Messenger Mode) ────────── */}
      {activePackage && (
        <group position={[0, -0.28, 0]}>
          {/* Parcel Box */}
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.2, 0.22]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#D97706"
              emissiveIntensity={0.5}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
          {/* Package ribbon */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.27, 0.03, 0.04]} />
            <meshStandardMaterial color="#B45309" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 0.03, 0.23]} />
            <meshStandardMaterial color="#B45309" />
          </mesh>
          {/* Magnetic tractor beam rays */}
          {[-0.1, 0.1].map((bx, i) => (
            <mesh key={i} position={[bx, 0.14, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.26, 4]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.8} />
            </mesh>
          ))}
          <pointLight color="#FDE047" intensity={1.5} distance={2.5} />
        </group>
      )}

      {/* ── Drone Forward Headlight & Ground Illumination ───────────── */}
      <spotLight
        position={[0, 0.05, 0.25]}
        target-position={[0, -0.6, 3.0]}
        color="#E0F2FE"
        intensity={18}
        distance={18}
        angle={Math.PI / 4.0}
        penumbra={0.7}
      />
      <pointLight
        position={[0, -0.08, 0]}
        color={PALETTE.screenBlue}
        intensity={8}
        distance={6}
        decay={1.8}
      />
    </group>
  );
}


// ─── Drone Controller (physics + movement) ────────────────────────────────────

export function DroneController() {
  const keys = useKeyboard();
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const visualFacingRef = useRef<THREE.Group>(null!);
  const visualTiltRef = useRef<THREE.Group>(null!);
  const modelRef = useRef<THREE.Group>(null!);
  const { camera, gl } = useThree();
  const setDronePosition = useWorldStore((s) => s.setDronePosition);
  const cameraMode = useWorldStore((s) => s.cameraMode);
  const activeDistrict = useWorldStore((s) => s.activeDistrict);
  const teleportTarget = useWorldStore((s) => s.teleportTarget);
  const setTeleportTarget = useWorldStore((s) => s.setTeleportTarget);
  const virtualJoystick = useWorldStore((s) => s.virtualJoystick);
  const setDroneSpeed = useWorldStore((s) => s.setDroneSpeed);

  // Velocity for smooth movement
  const vel = useRef(new THREE.Vector3());
  const cameraAngleRef = useRef(0); // horizontal camera rotation
  const groundYRef = useRef(0);

  // Mouse look
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cameraMode !== 'explore') return;
      cameraAngleRef.current -= e.movementX * 0.003;
    };
    const onPointerLockChange = () => {
      if (document.pointerLockElement === gl.domElement) {
        document.addEventListener('mousemove', onMouseMove);
      } else {
        document.removeEventListener('mousemove', onMouseMove);
      }
    };
    const onCanvasClick = () => gl.domElement.requestPointerLock();
    document.addEventListener('pointerlockchange', onPointerLockChange);
    gl.domElement.addEventListener('click', onCanvasClick);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      gl.domElement.removeEventListener('click', onCanvasClick);
    };
  }, [cameraMode, gl]);

  useFrame(() => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    // Handle instant teleportation (e.g. from top district nav)
    if (teleportTarget) {
      rb.setTranslation({ x: teleportTarget[0], y: teleportTarget[1] + 1.5, z: teleportTarget[2] }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      vel.current.set(0, 0, 0);
      setTeleportTarget(null);
      return;
    }

    // Wake up if asleep
    if (rb.isSleeping()) rb.wakeUp();

    const k = keys.current;
    const joy = virtualJoystick;
    const isBoosting = k.boost || joy.boost;
    const boost = isBoosting ? DRONE.boostMultiplier : 1;
    const spd = DRONE.speed * boost;

    // Movement direction relative to camera angle
    const camAngle = cameraAngleRef.current;
    const fwd = new THREE.Vector3(-Math.sin(camAngle), 0, -Math.cos(camAngle));
    const right = new THREE.Vector3(Math.cos(camAngle), 0, -Math.sin(camAngle));

    const inputDir = new THREE.Vector3();
    if (cameraMode === 'explore') {
      if (k.forward) inputDir.addScaledVector(fwd, 1);
      if (k.backward) inputDir.addScaledVector(fwd, -1);
      if (k.left) inputDir.addScaledVector(right, -1);
      if (k.right) inputDir.addScaledVector(right, 1);

      // Mobile touch joystick input
      if (joy.active) {
        inputDir.addScaledVector(fwd, -joy.y);
        inputDir.addScaledVector(right, joy.x);
      }
    }
    if (inputDir.length() > 0) inputDir.normalize();

    // Smooth velocity
    const targetVel = new THREE.Vector3().copy(inputDir).multiplyScalar(spd);
    vel.current.lerp(targetVel, 0.16);

    // Update real-time speed in store
    setDroneSpeed(Math.round(vel.current.length() * 2.2));

    // Hover oscillation + terrain elevation adaptation + aerodynamic boost climb
    const t = performance.now() / 1000;
    const targetGroundY = DISTRICTS[activeDistrict]?.elevation ?? 0;
    groundYRef.current = THREE.MathUtils.lerp(groundYRef.current, targetGroundY, 0.08);
    const boostLift = isBoosting ? 1.0 : 0;
    const targetY = groundYRef.current + DRONE.height + boostLift + Math.sin(t * DRONE.hoverFrequency) * DRONE.hoverAmplitude;
    
    const currentPos = rb.translation();
    const vy = Math.max(-6, Math.min(6, (targetY - currentPos.y) * 4)); // clamped vertical velocity

    // Apply linear velocity with continuous collision detection enabled
    rb.setLinvel({ x: vel.current.x, y: vy, z: vel.current.z }, true);

    // Drone facing (toward movement)
    if (vel.current.length() > 0.2) {
      const targetAngle = Math.atan2(vel.current.x, vel.current.z);
      visualFacingRef.current.rotation.y = THREE.MathUtils.lerp(
        visualFacingRef.current.rotation.y, targetAngle, 0.14
      );
    }

    // Drone tilt (pitch/roll based on movement)
    if (visualTiltRef.current) {
      const movingFwd = vel.current.dot(fwd);
      const movingRight = vel.current.dot(right);
      visualTiltRef.current.rotation.x = THREE.MathUtils.lerp(
        visualTiltRef.current.rotation.x, -movingFwd * DRONE.tiltAmount / spd, 0.12
      );
      visualTiltRef.current.rotation.z = THREE.MathUtils.lerp(
        visualTiltRef.current.rotation.z, -movingRight * DRONE.rollAmount / spd, 0.12
      );
    }

    // Update global position store
    setDronePosition([currentPos.x, currentPos.y, currentPos.z]);

    // ── Camera follow ────────────────────────────────────────────────
    if (cameraMode === 'explore') {
      const targetCamPos = new THREE.Vector3(
        currentPos.x + Math.sin(camAngle) * CAMERA.followDistance,
        currentPos.y + CAMERA.followHeight,
        currentPos.z + Math.cos(camAngle) * CAMERA.followDistance
      );
      camera.position.lerp(targetCamPos, CAMERA.followLag);
      camera.lookAt(currentPos.x, currentPos.y + 0.5, currentPos.z);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders={false}
      gravityScale={0}
      enabledRotations={[false, false, false]}
      position={[0, 1.8, 0]}
      linearDamping={1.2}
      angularDamping={1.0}
      ccd={true}
    >
      <BallCollider args={[DRONE.colliderRadius]} friction={0.1} restitution={0.0} />
      {/* Outer visual group for Y rotation (facing direction) */}
      <group ref={visualFacingRef} scale={DRONE.visualScale}>
        {/* Inner visual group for X/Z tilt */}
        <group ref={visualTiltRef}>
          <DroneModel groupRef={modelRef} />
        </group>
      </group>
    </RigidBody>
  );
}
