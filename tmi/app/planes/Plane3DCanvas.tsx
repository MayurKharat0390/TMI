"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

// Decal emblem for the wing
function DecalEmblem({ position, rotation, scale = [1, 1, 1] }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
}) {
  const logoTexture = useTexture("/images/logo.png");

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[0.3, 0.3]} />
      <meshBasicMaterial
        map={logoTexture}
        transparent
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-4}
      />
    </mesh>
  );
}

// Reusable parts
function ModelPart({ geometry, position, rotation, scale }: {
  geometry: THREE.BufferGeometry;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const bodyColor = isDark ? "#151515" : "#e2e8f0";
  const wireframeColor = isDark ? "#D4A348" : "#1E3A8A";
  const blendingMode = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
  const wireframeOpacity = isDark ? 0.35 : 0.55;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.9}
          roughness={0.25}
          flatShading
        />
      </mesh>
      <mesh geometry={geometry} scale={[1.02, 1.02, 1.02]}>
        <meshBasicMaterial
          color={wireframeColor}
          wireframe
          transparent
          opacity={wireframeOpacity}
          blending={blendingMode}
        />
      </mesh>
    </group>
  );
}

// Tractor model (Vayutej, Shourya, etc.)
function TractorModel({ speedMultiplier }: { speedMultiplier: React.MutableRefObject<number> }) {
  const propRef = useRef<THREE.Mesh>(null);
  
  const geometries = React.useMemo(() => ({
    fuselage: new THREE.CylinderGeometry(0.12, 0.04, 1.8, 8, 4),
    nose: new THREE.ConeGeometry(0.12, 0.25, 8),
    wing: new THREE.BoxGeometry(2.4, 0.03, 0.35),
    tailHoriz: new THREE.BoxGeometry(0.65, 0.02, 0.15),
    tailVert: new THREE.BoxGeometry(0.015, 0.28, 0.15),
    propBlade: new THREE.BoxGeometry(0.7, 0.015, 0.03),
  }), []);

  useFrame(() => {
    if (propRef.current) propRef.current.rotation.x += 0.8 * speedMultiplier.current;
  });

  return (
    <group>
      {/* Fuselage aligned along Z-axis */}
      <ModelPart geometry={geometries.fuselage} rotation={[Math.PI / 2, 0, 0]} />
      <ModelPart geometry={geometries.nose} position={[0, 0, 1.02]} rotation={[Math.PI / 2, 0, 0]} />

      {/* Main Wing */}
      <ModelPart geometry={geometries.wing} position={[0, 0.08, 0.2]} />
      <DecalEmblem position={[-0.6, 0.1, 0.2]} rotation={[-Math.PI / 2, 0, 0]} />
      <DecalEmblem position={[0.6, 0.1, 0.2]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* Tail stabilizers */}
      <ModelPart geometry={geometries.tailHoriz} position={[0, 0.08, -0.75]} />
      <ModelPart geometry={geometries.tailVert} position={[0, 0.18, -0.75]} />

      {/* Propeller */}
      <mesh ref={propRef} position={[0, 0, 1.15]}>
        <boxGeometry args={[0.7, 0.015, 0.03]} />
        <meshStandardMaterial color="#D4A348" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Twin Boom model (Mohav-I, Mohav-II)
function TwinBoomModel({ speedMultiplier }: { speedMultiplier: React.MutableRefObject<number> }) {
  const propRef = useRef<THREE.Mesh>(null);
  
  const geometries = React.useMemo(() => ({
    pod: new THREE.CylinderGeometry(0.14, 0.08, 1.1, 8),
    wing: new THREE.BoxGeometry(2.6, 0.03, 0.38),
    boom: new THREE.CylinderGeometry(0.02, 0.012, 1.4, 4),
    tailHoriz: new THREE.BoxGeometry(0.75, 0.015, 0.16),
    tailVert: new THREE.BoxGeometry(0.012, 0.25, 0.16),
  }), []);

  useFrame(() => {
    if (propRef.current) propRef.current.rotation.x += 0.8 * speedMultiplier.current;
  });

  return (
    <group>
      {/* Central pod */}
      <ModelPart geometry={geometries.pod} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.15]} />

      {/* Main Wing */}
      <ModelPart geometry={geometries.wing} position={[0, 0.1, 0.2]} />
      <DecalEmblem position={[-0.6, 0.12, 0.2]} rotation={[-Math.PI / 2, 0, 0]} />
      <DecalEmblem position={[0.6, 0.12, 0.2]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* Booms */}
      <ModelPart geometry={geometries.boom} position={[-0.32, -0.05, -0.4]} rotation={[Math.PI / 2, 0, 0]} />
      <ModelPart geometry={geometries.boom} position={[0.32, -0.05, -0.4]} rotation={[Math.PI / 2, 0, 0]} />

      {/* Tail surfaces */}
      <ModelPart geometry={geometries.tailHoriz} position={[0, -0.05, -1.1]} />
      <ModelPart geometry={geometries.tailVert} position={[-0.32, 0.08, -1.1]} />
      <ModelPart geometry={geometries.tailVert} position={[0.32, 0.08, -1.1]} />

      {/* Rear pusher propeller */}
      <mesh ref={propRef} position={[0, 0, -0.45]}>
        <boxGeometry args={[0.6, 0.015, 0.03]} />
        <meshStandardMaterial color="#D4A348" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// VTOL model (Daredevil/NIDAR VTOL)
function VTOLModel({ speedMultiplier }: { speedMultiplier: React.MutableRefObject<number> }) {
  const pusherPropRef = useRef<THREE.Mesh>(null);
  const vtolProps = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null)
  ];

  const geometries = React.useMemo(() => ({
    fuselage: new THREE.CylinderGeometry(0.12, 0.04, 1.8, 8),
    wing: new THREE.BoxGeometry(2.4, 0.03, 0.35),
    vtolBoom: new THREE.BoxGeometry(0.02, 0.02, 0.85),
    motor: new THREE.CylinderGeometry(0.025, 0.025, 0.06, 6),
    blade: new THREE.BoxGeometry(0.24, 0.005, 0.015),
    pusherProp: new THREE.BoxGeometry(0.5, 0.015, 0.03),
    tailHoriz: new THREE.BoxGeometry(0.65, 0.02, 0.15),
    tailVert: new THREE.BoxGeometry(0.015, 0.28, 0.15)
  }), []);

  useFrame(() => {
    if (pusherPropRef.current) pusherPropRef.current.rotation.x += 0.8 * speedMultiplier.current;
    vtolProps.forEach((prop) => {
      if (prop.current) prop.current.rotation.y += 1.4 * speedMultiplier.current;
    });
  });

  return (
    <group>
      {/* Fuselage */}
      <ModelPart geometry={geometries.fuselage} rotation={[Math.PI / 2, 0, 0]} />

      {/* Main Wing */}
      <ModelPart geometry={geometries.wing} position={[0, 0.08, 0.1]} />
      <DecalEmblem position={[-0.7, 0.1, 0.1]} rotation={[-Math.PI / 2, 0, 0]} />
      <DecalEmblem position={[0.7, 0.1, 0.1]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* VTOL Quad motor booms */}
      <ModelPart geometry={geometries.vtolBoom} position={[-0.45, 0.05, 0.1]} />
      <ModelPart geometry={geometries.vtolBoom} position={[0.45, 0.05, 0.1]} />

      {/* 4 Motors + Propellers */}
      {/* Left Front */}
      <ModelPart geometry={geometries.motor} position={[-0.45, 0.08, 0.45]} />
      <mesh ref={vtolProps[0]} position={[-0.45, 0.11, 0.45]}>
        <boxGeometry args={[0.24, 0.005, 0.015]} />
        <meshBasicMaterial color="#D4A348" />
      </mesh>
      {/* Left Rear */}
      <ModelPart geometry={geometries.motor} position={[-0.45, 0.08, -0.25]} />
      <mesh ref={vtolProps[1]} position={[-0.45, 0.11, -0.25]}>
        <boxGeometry args={[0.24, 0.005, 0.015]} />
        <meshBasicMaterial color="#D4A348" />
      </mesh>
      {/* Right Front */}
      <ModelPart geometry={geometries.motor} position={[0.45, 0.08, 0.45]} />
      <mesh ref={vtolProps[2]} position={[0.45, 0.11, 0.45]}>
        <boxGeometry args={[0.24, 0.005, 0.015]} />
        <meshBasicMaterial color="#D4A348" />
      </mesh>
      {/* Right Rear */}
      <ModelPart geometry={geometries.motor} position={[0.45, 0.08, -0.25]} />
      <mesh ref={vtolProps[3]} position={[0.45, 0.11, -0.25]}>
        <boxGeometry args={[0.24, 0.005, 0.015]} />
        <meshBasicMaterial color="#D4A348" />
      </mesh>

      {/* Tail stabilizers */}
      <ModelPart geometry={geometries.tailHoriz} position={[0, 0.08, -0.75]} />
      <ModelPart geometry={geometries.tailVert} position={[0, 0.18, -0.75]} />

      {/* Pusher propeller */}
      <mesh ref={pusherPropRef} position={[0, 0, -0.92]}>
        <boxGeometry args={[0.5, 0.015, 0.03]} />
        <meshStandardMaterial color="#D4A348" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Hexacopter Model (NIDAR Hexacopter)
function HexacopterModel({ speedMultiplier }: { speedMultiplier: React.MutableRefObject<number> }) {
  const motorProps = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null)
  ];

  const geometries = React.useMemo(() => ({
    hub: new THREE.CylinderGeometry(0.2, 0.2, 0.06, 6),
    arm: new THREE.CylinderGeometry(0.015, 0.015, 0.7, 4),
    motor: new THREE.CylinderGeometry(0.025, 0.025, 0.05, 6),
    blade: new THREE.BoxGeometry(0.32, 0.005, 0.015)
  }), []);

  useFrame(() => {
    motorProps.forEach((prop) => {
      if (prop.current) prop.current.rotation.y += 1.6 * speedMultiplier.current;
    });
  });

  // 6 arms extending radially every 60 degrees (pi / 3)
  const armsData = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI) / 3;
    const x = Math.sin(angle) * 0.35;
    const z = Math.cos(angle) * 0.35;
    return { angle, x, z };
  });

  return (
    <group>
      {/* Central Hub */}
      <ModelPart geometry={geometries.hub} />
      <DecalEmblem position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.8, 0.8, 1]} />

      {/* Radial arms + motors + propellers */}
      {armsData.map((arm, i) => (
        <group key={i}>
          {/* Arm cylinder aligned outwards */}
          <ModelPart
            geometry={geometries.arm}
            position={[arm.x, 0, arm.z]}
            rotation={[Math.PI / 2, 0, -arm.angle]}
          />
          {/* Motor at arm tip */}
          <ModelPart
            geometry={geometries.motor}
            position={[arm.x * 2.0, 0.04, arm.z * 2.0]}
          />
          {/* Propeller blade */}
          <mesh
            ref={motorProps[i]}
            position={[arm.x * 2.0, 0.07, arm.z * 2.0]}
          >
            <boxGeometry args={[0.32, 0.005, 0.015]} />
            <meshBasicMaterial color="#D4A348" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

interface SpinningSceneProps {
  type: "tractor" | "twin-boom" | "vtol" | "hexacopter";
  activeId: string;
  isHovered: boolean;
  isMobile: boolean;
  userRotation: React.MutableRefObject<{ x: number; y: number }>;
  isDragging: React.MutableRefObject<boolean>;
}

// Camera lookAt setup helper
function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// Group that flies between placeholders and auto-rotates/banks
function SpinningScene({
  type,
  activeId,
  isHovered,
  isMobile,
  userRotation,
  isDragging
}: SpinningSceneProps) {
  const modelRef = useRef<THREE.Group>(null);
  
  const lastActiveId = useRef<string | null>(null);
  const targetWorldPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentWorldPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const prevWorldPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  
  const flightVelocity = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const flightInfluence = useRef(0);
  const autoRotationY = useRef(0);

  // Flight height arc & hover depth refs
  const flightStartPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const flightTotalDist = useRef<number>(0);
  const currentBaseZ = useRef(-0.45);
  const speedMultiplier = useRef(1.0);
  
  // Transition model scale when type swaps
  const [renderedType, setRenderedType] = useState(type);
  const typeScale = useRef(1);
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (type !== renderedType) {
      isTransitioning.current = true;
    }
  }, [type, renderedType]);

  useFrame((state, delta) => {
    // 1. Swapping/Morphing Transition Scale
    if (isTransitioning.current) {
      typeScale.current = THREE.MathUtils.lerp(typeScale.current, 0, 0.15);
      if (typeScale.current < 0.05) {
        setRenderedType(type);
        isTransitioning.current = false;
      }
    } else {
      typeScale.current = THREE.MathUtils.lerp(typeScale.current, 1, 0.15);
    }

    // 2. Track DOM Position & Map to 3D World space
    // On desktop (screen >= 768px), we target the hangar in the empty side space.
    // On mobile, we fall back to targeting the card placeholder.
    const suffix = (window.innerWidth >= 768) ? "-empty" : "";
    const el = document.getElementById(`plane-placeholder-${activeId}${suffix}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      
      // Center coordinates of placeholder in client screen
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      // Map to Normalized Device Coordinates (NDC)
      const ndcX = (cx / window.innerWidth) * 2 - 1;
      const ndcY = -(cy / window.innerHeight) * 2 + 1;
      
      // Unproject to world coordinates at Z=0
      const ndcVec = new THREE.Vector3(ndcX, ndcY, 0.5);
      ndcVec.unproject(state.camera);
      
      const camPos = state.camera.position;
      const dir = ndcVec.sub(camPos).normalize();
      
      if (Math.abs(dir.z) > 0.0001) {
        const t = -camPos.z / dir.z;
        targetWorldPos.current.set(
          camPos.x + t * dir.x,
          camPos.y + t * dir.y,
          0
        );
      }
    }

    // 3. Move the model to the target position
    if (lastActiveId.current === null && el) {
      // First frame load: snap position directly to prevent initial fly-in
      currentWorldPos.current.copy(targetWorldPos.current);
      prevWorldPos.current.copy(targetWorldPos.current);
      lastActiveId.current = activeId;
    }

    // Capture starting parameters when activeTarget changes to trigger flight arc
    if (activeId !== lastActiveId.current && lastActiveId.current !== null) {
      flightStartPos.current.copy(currentWorldPos.current);
      // We calculate 2D distance on XY plane for flight arc progress
      const p1 = new THREE.Vector2(currentWorldPos.current.x, currentWorldPos.current.y);
      const p2 = new THREE.Vector2(targetWorldPos.current.x, targetWorldPos.current.y);
      flightTotalDist.current = p1.distanceTo(p2);
      lastActiveId.current = activeId;
    }

    // Store previous position for velocity calculation
    prevWorldPos.current.copy(currentWorldPos.current);

    // Interpolate current position to target position (XY plane)
    // X interpolates faster so the plane quickly slides into the empty side column and glides down it
    currentWorldPos.current.x = THREE.MathUtils.lerp(currentWorldPos.current.x, targetWorldPos.current.x, 0.20);
    currentWorldPos.current.y = THREE.MathUtils.lerp(currentWorldPos.current.y, targetWorldPos.current.y, 0.06);

    // Calculate flight arc Z lift & takeoff/landing pitch
    let zLift = 0;
    let liftPitch = 0;
    
    if (flightTotalDist.current > 0.1) {
      const pos2D = new THREE.Vector2(currentWorldPos.current.x, currentWorldPos.current.y);
      const target2D = new THREE.Vector2(targetWorldPos.current.x, targetWorldPos.current.y);
      const currentDist = pos2D.distanceTo(target2D);
      
      if (currentDist < 0.03) {
        // Settled at destination
        flightTotalDist.current = 0;
      } else {
        // Progress of flight: 0 (start) to 1 (destination)
        const progress = Math.max(0, Math.min(1, 1 - (currentDist / flightTotalDist.current)));
        // Lift plane closer to user (camera is at Z=2.3, so lift towards +Z)
        // This makes the plane look like it flies "up" out of the card and drops back in
        zLift = Math.sin(progress * Math.PI) * 0.95;
        // Takeoff/landing pitch: cos is positive during takeoff -> pitch nose up.
        // cos is negative during landing -> pitch nose down.
        liftPitch = Math.cos(progress * Math.PI) * 0.35;
      }
    }

    // Interpolate base Z position based on hover inspection state
    // When inactive or not hovered, plane stays settled deep in the card (-0.45)
    // When hovered for inspection, it pops up slightly (0.05) to be close to user
    const targetBaseZ = isHovered ? 0.05 : -0.45;
    currentBaseZ.current = THREE.MathUtils.lerp(currentBaseZ.current, targetBaseZ, 0.08);
    currentWorldPos.current.z = currentBaseZ.current + zLift;

    // Calculate instantaneous velocity in world units
    const vx = currentWorldPos.current.x - prevWorldPos.current.x;
    const vy = currentWorldPos.current.y - prevWorldPos.current.y;
    
    // Smooth the velocity
    flightVelocity.current.x = THREE.MathUtils.lerp(flightVelocity.current.x, vx, 0.2);
    flightVelocity.current.y = THREE.MathUtils.lerp(flightVelocity.current.y, vy, 0.2);

    const speed = flightVelocity.current.length();

    // 4. Update the Model Position & Rotations
    if (modelRef.current) {
      modelRef.current.position.copy(currentWorldPos.current);
      
      // Slight hover wobble when speed is low
      const hoverWobble = Math.sin(state.clock.getElapsedTime() * 1.8) * 0.04;
      modelRef.current.position.y += hoverWobble;

      // Flight Rotation Dynamics (Roll, Pitch, Yaw)
      // When flying, the plane rolls into horizontal turns and pitches into vertical ascents/descents
      // If speed is high, blend out showcase spin and blend in flight rotation
      const targetFlightInfluence = Math.min(speed * 30, 1);
      flightInfluence.current = THREE.MathUtils.lerp(flightInfluence.current, targetFlightInfluence, 0.1);

      // Manual User Drag Rotation Damping
      if (!isDragging.current) {
        userRotation.current.x = THREE.MathUtils.lerp(userRotation.current.x, 0, 0.08);
        userRotation.current.y = THREE.MathUtils.lerp(userRotation.current.y, 0, 0.08);
      }

      // Base yaw (showcase auto-rotation)
      autoRotationY.current += delta * 0.22;

      // Calculate flight rotations
      // Roll: bank left/right proportional to horizontal velocity
      const flightRoll = -flightVelocity.current.x * 2.8; 
      
      // Pitch: pitch nose up/down proportional to vertical velocity + lift pitch
      const flightPitch = -flightVelocity.current.y * 2.0 + liftPitch;

      // Yaw: face the direction of travel during flight
      const flightYaw = -Math.PI / 6 + flightVelocity.current.x * 1.5;

      // Blend showcase rotation and flight rotation
      const currentYaw = THREE.MathUtils.lerp(
        autoRotationY.current - Math.PI / 6, 
        flightYaw, 
        flightInfluence.current
      );
      const currentPitch = THREE.MathUtils.lerp(
        0.08, 
        flightPitch, 
        flightInfluence.current
      );
      const currentRoll = THREE.MathUtils.lerp(
        0.05, 
        flightRoll, 
        flightInfluence.current
      );

      // Apply rotations including user dragging
      modelRef.current.rotation.set(
        currentPitch + userRotation.current.x,
        currentYaw + userRotation.current.y,
        currentRoll - userRotation.current.y * 0.1
      );

      // Apply morph scale and mobile scaling
      // Use slightly smaller scales so it fits perfectly inside placeholder boundaries
      const baseScale = isMobile ? 0.45 : 0.65;
      const activeScale = baseScale * typeScale.current;
      modelRef.current.scale.set(activeScale, activeScale, activeScale);
    }
    
    // Interpolate propeller speed multiplier based on hover state
    const targetSpeedMult = isHovered ? 2.8 : 1.0;
    speedMultiplier.current = THREE.MathUtils.lerp(speedMultiplier.current, targetSpeedMult, 0.08);
  });

  return (
    <group ref={modelRef} rotation={[0.08, -Math.PI / 6, 0.05]}>
      {renderedType === "tractor" && <TractorModel speedMultiplier={speedMultiplier} />}
      {renderedType === "twin-boom" && <TwinBoomModel speedMultiplier={speedMultiplier} />}
      {renderedType === "vtol" && <VTOLModel speedMultiplier={speedMultiplier} />}
      {renderedType === "hexacopter" && <HexacopterModel speedMultiplier={speedMultiplier} />}
    </group>
  );
}

function SuspenseTrigger({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

// Main Canvas wrapper
export default function Plane3DCanvas({
  type,
  activeId,
  isHovered,
  onReady
}: {
  type: "tractor" | "twin-boom" | "vtol" | "hexacopter";
  activeId: string;
  isHovered: boolean;
  onReady?: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const userRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevPointer.current.x;
    const deltaY = e.clientY - prevPointer.current.y;
    prevPointer.current = { x: e.clientX, y: e.clientY };

    // Update user rotation offsets
    userRotation.current.y += deltaX * 0.007;
    userRotation.current.x += deltaY * 0.007;
    
    // Clamp vertical rotation to prevent flipping
    userRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, userRotation.current.x));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="w-full h-full relative bg-slate-900/10 dark:bg-black/20 overflow-hidden flex items-center justify-center">
      {/* Tech grid blueprint markings in backdrop */}
      <div className="absolute inset-0 bg-radial-glow opacity-80" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,rgba(212,163,72,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,163,72,0.1)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0.9, 2.3], fov: 45 }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%", pointerEvents: "auto", touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 8, 4]} intensity={2.0} color="#D4A348" />
        <pointLight position={[-4, -4, -3]} intensity={1.5} color="#00E5FF" />
        
        <CameraSetup />
        
        <React.Suspense fallback={null}>
          <SpinningScene
            type={type}
            activeId={activeId}
            isHovered={isHovered}
            isMobile={isMobile}
            userRotation={userRotation}
            isDragging={isDragging}
          />
          {onReady && <SuspenseTrigger onReady={onReady} />}
        </React.Suspense>
      </Canvas>
      
      {/* Help tooltip overlay */}
      <div className="absolute bottom-3 right-3 text-[9px] uppercase tracking-wider text-muted-foreground bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded pointer-events-none select-none">
        Drag to rotate
      </div>
    </div>
  );
}
