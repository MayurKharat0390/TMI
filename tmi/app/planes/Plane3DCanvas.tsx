"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
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
function TractorModel() {
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
    if (propRef.current) propRef.current.rotation.x += 0.8;
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
function TwinBoomModel() {
  const propRef = useRef<THREE.Mesh>(null);
  
  const geometries = React.useMemo(() => ({
    pod: new THREE.CylinderGeometry(0.14, 0.08, 1.1, 8),
    wing: new THREE.BoxGeometry(2.6, 0.03, 0.38),
    boom: new THREE.CylinderGeometry(0.02, 0.012, 1.4, 4),
    tailHoriz: new THREE.BoxGeometry(0.75, 0.015, 0.16),
    tailVert: new THREE.BoxGeometry(0.012, 0.25, 0.16),
  }), []);

  useFrame(() => {
    if (propRef.current) propRef.current.rotation.x += 0.8;
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
function VTOLModel() {
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
    if (pusherPropRef.current) pusherPropRef.current.rotation.x += 0.8;
    vtolProps.forEach((prop) => {
      if (prop.current) prop.current.rotation.y += 1.4;
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
function HexacopterModel() {
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
      if (prop.current) prop.current.rotation.y += 1.6;
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

// Group that slowly auto-rotates
function SpinningScene({ type, isMobile }: { type: "tractor" | "twin-boom" | "vtol" | "hexacopter"; isMobile: boolean }) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      // Slow showcase yaw spin
      modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.22;
      // Slight aerodynamic hover pitch wobble
      modelRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.06;
    }
  });

  const scale = isMobile ? 0.75 : 1.0;

  return (
    <group ref={modelRef} scale={[scale, scale, scale]} rotation={[0.08, -Math.PI / 6, 0.05]}>
      {type === "tractor" && <TractorModel />}
      {type === "twin-boom" && <TwinBoomModel />}
      {type === "vtol" && <VTOLModel />}
      {type === "hexacopter" && <HexacopterModel />}
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
  onReady
}: {
  type: "tractor" | "twin-boom" | "vtol" | "hexacopter";
  onReady?: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="w-full h-full relative bg-slate-900/10 dark:bg-black/20 overflow-hidden flex items-center justify-center">
      {/* Tech grid blueprint markings in backdrop */}
      <div className="absolute inset-0 bg-radial-glow opacity-80" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,rgba(212,163,72,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,163,72,0.1)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0.9, 2.3], fov: 45 }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%", pointerEvents: "auto", touchAction: "pan-y" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 8, 4]} intensity={2.0} color="#D4A348" />
        <pointLight position={[-4, -4, -3]} intensity={1.5} color="#00E5FF" />
        
        <React.Suspense fallback={null}>
          <SpinningScene type={type} isMobile={isMobile} />
          {onReady && <SuspenseTrigger onReady={onReady} />}
        </React.Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxDistance={3.5}
          minDistance={1.4}
        />
      </Canvas>
      
      {/* Help tooltip overlay */}
      <div className="absolute bottom-3 right-3 text-[9px] uppercase tracking-wider text-muted-foreground bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded pointer-events-none select-none">
        Drag to rotate • Pinch to zoom
      </div>
    </div>
  );
}
