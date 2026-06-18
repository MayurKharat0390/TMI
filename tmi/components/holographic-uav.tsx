"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

// Glowing particle dust drifting around the hangar
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const particleColor = isDark ? "#D4A348" : "#1E3A8A";
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.05;
    }
  });

  const count = 150;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={particleColor}
        size={isDark ? 0.06 : 0.045}
        sizeAttenuation
        transparent
        opacity={isDark ? 0.6 : 0.2}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

// Glowing cybernetic laser scanner sweeping the UAV
function ScanningLaser({ active, themeColor }: { active: boolean; themeColor: "gold" | "cyan" }) {
  const laserRef = useRef<THREE.Mesh>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const laserColor = themeColor === "gold"
    ? (isDark ? "#D4A348" : "#E28B00")
    : (isDark ? "#00E5FF" : "#0066FF");
  const blendingMode = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
  
  useFrame((state) => {
    if (laserRef.current) {
      if (active) {
        laserRef.current.position.y = 0;
        const scale = 1.0 + Math.sin(state.clock.getElapsedTime() * 20) * 0.45;
        laserRef.current.scale.set(scale, scale, scale);
      } else {
        laserRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.8) * 1.5;
        laserRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <mesh ref={laserRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.23, 0.26, 32]} />
      <meshBasicMaterial 
        color={laserColor} 
        transparent 
        opacity={active ? 0.95 : 0.8} 
        side={THREE.DoubleSide}
        blending={blendingMode}
      />
    </mesh>
  );
}

// 3D Waving Team Maverick India Flag
function WavingFlag({ themeColor }: { themeColor: "gold" | "cyan" }) {
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const wireframeColor = themeColor === "gold"
    ? (isDark ? "#D4A348" : "#1E3A8A")
    : (isDark ? "#00E5FF" : "#0066FF");
  const blendingMode = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
  const wireframeOpacity = isDark ? 0.6 : 0.8;
  const flagColor = isDark ? "#151515" : "#f1f5f9";

  useFrame((state) => {
    if (geomRef.current) {
      const pos = geomRef.current.attributes.position;
      const time = state.clock.getElapsedTime() * 6.5;
      
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        // Amplitude is 0 at the flagpole attachment (x = -0.7) and increases to the right
        const factor = (x + 0.7) / 1.4;
        const wave = Math.sin(time - x * 4.2) * 0.12 * factor;
        pos.setZ(i, wave);
      }
      pos.needsUpdate = true;
      geomRef.current.computeVertexNormals();
    }
  });

  return (
    <group position={[-1.6, 0.2, 0.1]}>
      {/* Flagpole */}
      <mesh position={[-0.7, -0.4, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.8, 8]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Waving Flag Surface (Futuristic Gold Wireframe + Solid backing) */}
      <mesh>
        <planeGeometry ref={geomRef} args={[1.4, 0.8, 12, 12]} />
        <meshStandardMaterial 
          color={flagColor} 
          metalness={0.8} 
          roughness={0.3} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      <mesh scale={[1.01, 1.01, 1.01]}>
        <planeGeometry ref={geomRef} args={[1.4, 0.8, 12, 12]} />
        <meshStandardMaterial 
          color={wireframeColor} 
          wireframe 
          transparent 
          opacity={wireframeOpacity} 
          side={THREE.DoubleSide}
          blending={blendingMode}
        />
      </mesh>
    </group>
  );
}

// Sub-component for individual parts, combining metallic body and glowing wireframe overlay
function UAVPart({ geometry, position, rotation, scale, viewMode, themeColor }: { 
  geometry: THREE.BufferGeometry; 
  position?: [number, number, number]; 
  rotation?: [number, number, number]; 
  scale?: [number, number, number];
  viewMode: "wireframe" | "solid" | "particles";
  themeColor: "gold" | "cyan";
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const wireframeColor = themeColor === "gold"
    ? (isDark ? "#D4A348" : "#1E3A8A")
    : (isDark ? "#00E5FF" : "#0066FF");
  const blendingMode = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
  const wireframeOpacity = isDark ? 0.35 : 0.55;
  const bodyColor = isDark ? "#151515" : "#e2e8f0";

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {viewMode === "solid" && (
        <mesh geometry={geometry}>
          <meshStandardMaterial 
            color={bodyColor} 
            metalness={0.9} 
            roughness={0.25}
            flatShading
          />
        </mesh>
      )}
      
      {(viewMode === "wireframe" || viewMode === "solid") && (
        <mesh geometry={geometry} scale={[1.01, 1.01, 1.01]}>
          <meshBasicMaterial 
            color={wireframeColor} 
            wireframe 
            transparent 
            opacity={viewMode === "wireframe" ? wireframeOpacity : 0.2} 
            blending={blendingMode}
          />
        </mesh>
      )}

      {viewMode === "particles" && (
        <points geometry={geometry}>
          <pointsMaterial 
            color={wireframeColor} 
            size={0.045} 
            sizeAttenuation 
            transparent 
            opacity={0.8} 
            blending={blendingMode}
          />
        </points>
      )}
    </group>
  );
}

// Helper component to render the gold Maverick logo as a flat texture decal on plane surfaces
function UAVEmblem({ position, rotation, scale = [1, 1, 1] }: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  scale?: [number, number, number];
}) {
  const logoTexture = useTexture("/images/logo.png");
  
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[0.35, 0.35]} />
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

function UAVModel({ 
  mouseX, 
  mouseY, 
  scrollY, 
  onIntroComplete,
  onDroneClick,
  viewMode,
  themeColor,
  rotationSpeed
}: { 
  mouseX: number; 
  mouseY: number; 
  scrollY: number;
  onIntroComplete?: () => void;
  onDroneClick?: () => void;
  viewMode: "wireframe" | "solid" | "particles";
  themeColor: "gold" | "cyan";
  rotationSpeed: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const propRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const spinOffsetRef = useRef(0);
  
  const barrelRollRef = useRef({
    active: false,
    progress: 0,
  });

  // Track hover and change browser cursor style
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'auto';
      }
    };
  }, [hovered]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!introRef.current.completed) return; // Ignore clicks during launch
    if (!barrelRollRef.current.active) {
      barrelRollRef.current.active = true;
      barrelRollRef.current.progress = 0;
      if (onDroneClick) {
        onDroneClick();
      }
    }
  };

  // Track intro takeoff progress (0 to 1)
  const introRef = useRef({
    progress: 0,
    completed: false
  });

  const geometries = React.useMemo(() => ({
    fuselage: new THREE.CylinderGeometry(0.2, 0.05, 3.2, 8, 4),
    nose: new THREE.ConeGeometry(0.2, 0.4, 8),
    wing: new THREE.BoxGeometry(4.4, 0.04, 0.6),
    boom: new THREE.CylinderGeometry(0.03, 0.02, 1.8, 4),
    tailHoriz: new THREE.BoxGeometry(1.2, 0.02, 0.3),
    tailVert: new THREE.BoxGeometry(0.02, 0.4, 0.25),
    propHub: new THREE.SphereGeometry(0.08, 8, 8),
    propBlade: new THREE.BoxGeometry(1.0, 0.02, 0.05)
  }), []);

  useFrame((state) => {
    // Increment intro progress
    if (!introRef.current.completed) {
      introRef.current.progress += 0.007; // Takes about 140 frames (~2.3s)
      if (introRef.current.progress >= 1) {
        introRef.current.progress = 1;
        introRef.current.completed = true;
        if (onIntroComplete) {
          onIntroComplete();
        }
      }
    }

    const p = introRef.current.progress;
    // Cubic ease out transition
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    const ease = easeOutCubic(p);

    if (groupRef.current) {
      const baseRotationY = state.clock.getElapsedTime() * rotationSpeed;
      const maxScroll = typeof window !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1000;
      const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

      const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;

      // 1. Positioning based on scroll position
      let targetX = 0;
      let targetY = 0.25;
      let targetZ = 0;

      if (scrollPercent < 0.25) {
        targetX = isMobile ? 0 : 1.7;
        targetY = isMobile ? 0.45 : 0.85;
        targetZ = isMobile ? 0 : 1.35;
      } else if (scrollPercent >= 0.25 && scrollPercent < 0.55) {
        targetX = isMobile ? 1.2 : 1.9;
        targetY = -0.3;
        targetZ = -0.6;
      } else if (scrollPercent >= 0.55 && scrollPercent < 0.8) {
        targetX = isMobile ? -1.2 : -1.9;
        targetY = 0.1;
        targetZ = -0.4;
      } else {
        targetX = 0;
        targetY = 0.4;
        targetZ = 1.1;
      }

      // Interpolate from start (left-to-right fly-in) positions
      const currentTargetX = THREE.MathUtils.lerp(-10.0, targetX, ease); // Fly in from left (-10) to targetX
      const currentTargetY = THREE.MathUtils.lerp(1.2, targetY, ease);   // Swoop from slightly higher altitude (1.2) to targetY
      const currentTargetZ = THREE.MathUtils.lerp(-1.5, targetZ, ease);  // Fly from slightly further back
      const currentScale = THREE.MathUtils.lerp(0.5, 1.0, ease);        // Scale from mid-size to full size

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, currentTargetX, 0.045);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, currentTargetY, 0.045);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, currentTargetZ, 0.045);
      groupRef.current.scale.setScalar(currentScale);

      // 2. Responsive mouse-tracking rotations
      // Fly-in rotation behavior: bank/roll as it speeds in from the left
      const flyInRoll = (1 - ease) * -0.9;     // Strong banking to the left (wing dipped)
      const flyInPitch = (1 - ease) * -0.15;   // Slight nose-down attitude during fast entry
      const flyInYaw = (1 - ease) * 1.2;       // Yaw pointing to the right (direction of travel)

      let targetRoll = (-mouseX * 0.65 * ease) + flyInRoll;
      if (groupRef.current.position.x < targetX) targetRoll += 0.35;
      else if (groupRef.current.position.x > targetX) targetRoll -= 0.35;

      const targetPitch = (mouseY * 0.45 * ease) + flyInPitch;
      let targetYaw = baseRotationY - (scrollPercent * Math.PI * 0.7) + (mouseX * 0.3 * ease) + flyInYaw + spinOffsetRef.current;

      // Showcase Yaw Spin Maneuver Animation (Y-axis 360 degree rotation)
      if (barrelRollRef.current.active) {
        barrelRollRef.current.progress += 0.015; // Spins slightly slower for a premium look (~1.1s)
        const rollP = barrelRollRef.current.progress;
        if (rollP >= 1) {
          barrelRollRef.current.active = false;
          barrelRollRef.current.progress = 0;
          spinOffsetRef.current += Math.PI * 2;
        } else {
          // Use smooth ease-in-out sine to execute a 360-degree horizontal spin (2 * Math.PI)
          const easeSpin = Math.sin(rollP * Math.PI - Math.PI / 2) * 0.5 + 0.5;
          targetYaw += easeSpin * Math.PI * 2;
        }
      }

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll, 0.05);
    }

    if (propRef.current) {
      const propSpeed = barrelRollRef.current.active ? 2.5 : 0.85;
      propRef.current.rotation.x += propSpeed;
    }
  });

  return (
    <group 
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Scanning Laser HUD Ring */}
      <ScanningLaser active={barrelRollRef.current.active} themeColor={themeColor} />

      {/* Flag component attached to the UAV Hangar Platform */}
      <WavingFlag themeColor={themeColor} />

      {/* Fuselage */}
      <UAVPart geometry={geometries.fuselage} viewMode={viewMode} themeColor={themeColor} />
      
      {/* Nose Cone */}
      <UAVPart geometry={geometries.nose} position={[0, 1.7, 0]} viewMode={viewMode} themeColor={themeColor} />

      {/* Main Wing */}
      <UAVPart geometry={geometries.wing} position={[0, 0.4, 0]} viewMode={viewMode} themeColor={themeColor} />
      {viewMode !== "particles" && (
        <>
          <UAVEmblem position={[-1.0, 0.421, 0.0]} rotation={[-Math.PI / 2, 0, 0]} />
          <UAVEmblem position={[1.0, 0.421, 0.0]} rotation={[-Math.PI / 2, 0, 0]} />
        </>
      )}

      {/* Tail Booms */}
      <UAVPart geometry={geometries.boom} position={[-0.45, -0.7, 0]} viewMode={viewMode} themeColor={themeColor} />
      <UAVPart geometry={geometries.boom} position={[0.45, -0.7, 0]} viewMode={viewMode} themeColor={themeColor} />

      {/* Horizontal Stabilizer */}
      <UAVPart geometry={geometries.tailHoriz} position={[0, -1.5, 0]} viewMode={viewMode} themeColor={themeColor} />

      {/* Vertical Stabilizers */}
      <UAVPart geometry={geometries.tailVert} position={[-0.45, -1.4, 0.1]} viewMode={viewMode} themeColor={themeColor} />
      <UAVPart geometry={geometries.tailVert} position={[0.45, -1.4, 0.1]} viewMode={viewMode} themeColor={themeColor} />
      {viewMode !== "particles" && (
        <>
          <UAVEmblem position={[-0.462, -1.4, 0.1]} rotation={[0, -Math.PI / 2, 0]} scale={[0.55, 0.55, 1]} />
          <UAVEmblem position={[0.462, -1.4, 0.1]} rotation={[0, Math.PI / 2, 0]} scale={[0.55, 0.55, 1]} />
        </>
      )}

      {/* Propeller Hub */}
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={themeColor === "gold" ? "#D4A348" : "#00E5FF"} wireframe />
      </mesh>

      {/* Propeller Blades */}
      <mesh ref={propRef} position={[0, 1.95, 0]}>
        <boxGeometry args={[1.0, 0.02, 0.05]} />
        <meshStandardMaterial color={themeColor === "gold" ? "#D4A348" : "#00E5FF"} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function HolographicUAV() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [clickActive, setClickActive] = useState(false);

  // Simulation Console States
  const [modelViewMode, setModelViewMode] = useState<"wireframe" | "solid" | "particles">("wireframe");
  const [themeColor, setThemeColor] = useState<"gold" | "cyan">("gold");
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.06);

  const [hudStats, setHudStats] = useState({
    pitch: 0,
    roll: 0,
    yaw: 0,
    speed: 0,
    altitude: 0,
    thrust: 0,
    status: "LAUNCHING",
  });

  const handleDroneClick = () => {
    setClickActive(true);
    setTimeout(() => {
      setClickActive(false);
    }, 1500);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    setScrollY(window.scrollY);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const pitchDeg = Math.round(mouse.y * 25);
    const rollDeg = Math.round(-mouse.x * 35);
    const maxScroll = typeof window !== "undefined" ? document.documentElement.scrollHeight - window.innerHeight : 1000;
    const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
    const yawDeg = Math.round((scrollY * 0.15) % 360);
    
    let speedVal = !introDone 
      ? parseFloat((Math.random() * 20).toFixed(1))
      : scrollPercent < 0.1 
        ? 0.0 
        : parseFloat((14.2 + Math.sin(scrollY * 0.005) * 2.8 + Math.random() * 0.2).toFixed(1));
    
    const altVal = parseFloat((scrollY * 0.08).toFixed(1));
    
    let thrustVal = !introDone
      ? 100
      : scrollPercent < 0.1 
        ? 0 
        : Math.round(75 + Math.sin(scrollY * 0.005) * 12 + Math.random() * 2);

    let flightStatus = "LAUNCHING";
    if (introDone) {
      flightStatus = "STANDBY";
      if (scrollPercent > 0.05) {
        flightStatus = mouse.x > 0.5 || mouse.x < -0.5 || mouse.y > 0.5 || mouse.y < -0.5
          ? "ATTITUDE_CORRECT"
          : "CRUISE_AUTO";
      }
    }

    if (clickActive && introDone) {
      flightStatus = "EVASIVE_ROLL";
      speedVal = parseFloat((120.4 + Math.random() * 15.2).toFixed(1));
      thrustVal = 150;
    }

    setHudStats({
      pitch: clickActive ? Math.round(pitchDeg + Math.sin(Date.now() * 0.05) * 15) : pitchDeg,
      roll: clickActive ? Math.round(rollDeg + Math.cos(Date.now() * 0.05) * 25) : rollDeg,
      yaw: yawDeg,
      speed: speedVal,
      altitude: altVal,
      thrust: thrustVal,
      status: flightStatus,
    });
  }, [mouse, scrollY, introDone, clickActive]);

  const hudOpacity = Math.max(0, 1 - scrollY / 600);

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 2, 5.5], fov: 50 }}
        gl={{ antialias: true }}
        style={{ pointerEvents: "auto" }}
      >
        <React.Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <directionalLight 
            position={[6, 12, 6]} 
            intensity={2.5} 
            color={themeColor === "gold" ? "#D4A348" : "#00E5FF"} 
          />
          <pointLight 
            position={[-6, -4, -3]} 
            intensity={3.5} 
            color={themeColor === "gold" ? "#00E5FF" : "#D4A348"} 
          />
          <spotLight position={[0, 10, 2]} angle={0.4} penumbra={1} intensity={2} color="#FFFFFF" />
          
          <group rotation={[Math.PI / 3.2, 0, 0]}>
            <UAVModel 
              mouseX={mouse.x} 
              mouseY={mouse.y} 
              scrollY={scrollY} 
              onIntroComplete={() => setIntroDone(true)}
              onDroneClick={handleDroneClick}
              viewMode={modelViewMode}
              themeColor={themeColor}
              rotationSpeed={rotationSpeed}
            />
          </group>

          <ParticleField />
        </React.Suspense>
        
        {isDark && <Stars radius={120} depth={50} count={800} factor={4} saturation={0} fade speed={1} />}
      </Canvas>
      <div className="absolute inset-0 bg-radial-glow" />

      {/* --- CINEMATIC INITIAL BLACKOUT OVERLAY --- */}
      <div 
        className={`fixed inset-0 bg-black z-50 transition-opacity ease-out pointer-events-none ${
          mounted ? "opacity-0" : "opacity-100"
        }`}
        style={{ transitionDuration: "1500ms" }}
      />

      {/* --- HUD OVERLAY --- */}
      {hudOpacity > 0 && (
        <div 
          className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 font-mono transition-opacity duration-300 pointer-events-none select-none text-[10px] md:text-xs tracking-wider z-20"
          style={{ opacity: hudOpacity }}
        >
          {/* Top Panel */}
          <div className="flex justify-between items-start w-full border-b border-[#D4A348]/20 pb-4 bg-gradient-to-b from-black/40 to-transparent px-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A348] animate-ping" />
                <span className="text-[#D4A348] font-bold">LINK STATUS: ONLINE</span>
              </div>
              <span className="text-white/40">SYS_CONSOLE: V3.89_MAVERIK</span>
            </div>
            
            <div className="text-center hidden md:block">
              <span className="text-white/60">AUTOPILOT: </span>
              <span className="text-[#D4A348] font-semibold">{hudStats.status}</span>
            </div>

            <div className="text-right">
              <span className="text-white/40">FREQ: 915.00 MHz</span>
              <div className="text-[#D4A348] font-semibold">SIG: 98% (EXCELLENT)</div>
            </div>
          </div>

          {/* Center Crosshair Reticle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-[#D4A348] rounded-full" />
            <div className="absolute top-0 w-[1px] h-3 bg-[#D4A348]/40" />
            <div className="absolute bottom-0 w-[1px] h-3 bg-[#D4A348]/40" />
            <div className="absolute left-0 w-3 h-[1px] bg-[#D4A348]/40" />
            <div className="absolute right-0 w-3 h-[1px] bg-[#D4A348]/40" />
            
            <div className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-[#D4A348]/30" />
            <div className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-[#D4A348]/30" />
            <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-[#D4A348]/30" />
            <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-[#D4A348]/30" />
          </div>

          {/* Mid-screen HUD */}
          <div className="flex justify-between items-start w-full px-2 md:px-12 pointer-events-none">
            {/* Left Box */}
            <div className="bg-black/50 border border-[#D4A348]/20 p-4 rounded backdrop-blur-md flex flex-col gap-2 min-w-[120px] md:min-w-[160px] shadow-[0_0_15px_rgba(212,163,72,0.05)]">
              <div className="border-b border-[#D4A348]/10 pb-1 text-[#D4A348] font-bold text-[11px] md:text-sm">FLIGHT DATA</div>
              <div className="flex justify-between">
                <span className="text-white/40">AIRSPEED:</span>
                <span className="text-white font-bold">{hudStats.speed} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">ALTITUDE:</span>
                <span className="text-white font-bold">{hudStats.altitude} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">THRUST:</span>
                <span className="text-white font-bold">{hudStats.thrust}%</span>
              </div>
            </div>

            {/* Right Container (Gyroscope + Sim Control Panel) */}
            <div className="flex flex-col">
              {/* Gyroscope Box */}
              <div className="bg-black/50 border border-[#D4A348]/20 p-4 rounded backdrop-blur-md flex flex-col gap-2 min-w-[120px] md:min-w-[160px] shadow-[0_0_15px_rgba(212,163,72,0.05)]">
                <div className="border-b border-[#D4A348]/10 pb-1 text-[#D4A348] font-bold text-[11px] md:text-sm">GYROSCOPE</div>
                <div className="flex justify-between">
                  <span className="text-white/40">PITCH:</span>
                  <span className={hudStats.pitch >= 0 ? "text-green-400" : "text-red-400"}>
                    {hudStats.pitch > 0 ? `+${hudStats.pitch}` : hudStats.pitch}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">ROLL:</span>
                  <span className={hudStats.roll >= 0 ? "text-green-400" : "text-red-400"}>
                    {hudStats.roll > 0 ? `+${hudStats.roll}` : hudStats.roll}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">YAW (HDG):</span>
                  <span className="text-white font-bold">{hudStats.yaw}°</span>
                </div>
              </div>

              {/* Simulation Interactive Control Panel */}
              <div className="bg-black/85 border border-[#D4A348]/25 p-3 rounded backdrop-blur-md flex flex-col gap-2.5 min-w-[120px] md:min-w-[160px] shadow-[0_0_20px_rgba(212,163,72,0.1)] pointer-events-auto mt-4 transition-all z-30">
                <div className="border-b border-[#D4A348]/20 pb-0.5 text-[#D4A348] font-bold text-[9px] md:text-[10px] tracking-wider uppercase">SIM_CONTROL</div>
                
                {/* Mesh Mode */}
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-[7px] md:text-[8px] uppercase">MESH MODE</span>
                  <div className="grid grid-cols-3 gap-0.5 md:gap-1">
                    {(["solid", "wireframe", "particles"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setModelViewMode(mode)}
                        className={`px-0.5 py-0.5 rounded text-[6.5px] md:text-[8px] border transition-all uppercase ${
                          modelViewMode === mode
                            ? "bg-[#D4A348]/20 border-[#D4A348] text-[#D4A348] font-bold"
                            : "bg-black/40 border-white/5 text-white/50 hover:border-white/20"
                        }`}
                      >
                        {mode === "wireframe" ? "wire" : mode === "particles" ? "part" : "solid"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Beacon Color */}
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-[7px] md:text-[8px] uppercase">LASER COLOR</span>
                  <div className="grid grid-cols-2 gap-0.5 md:gap-1">
                    {(["gold", "cyan"] as const).map((color) => (
                      <button
                        key={color}
                        onClick={() => setThemeColor(color)}
                        className={`px-1 py-0.5 rounded text-[6.5px] md:text-[8px] border transition-all uppercase ${
                          themeColor === color
                            ? color === "gold"
                              ? "bg-[#D4A348]/20 border-[#D4A348] text-[#D4A348] font-bold"
                              : "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] font-bold"
                            : "bg-black/40 border-white/5 text-white/50 hover:border-white/20"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rotation toggle */}
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-[7px] md:text-[8px] uppercase">ROTATION</span>
                  <button
                    onClick={() => setRotationSpeed(rotationSpeed === 0 ? 0.06 : 0)}
                    className={`w-full py-0.5 rounded text-[6.5px] md:text-[8px] border transition-all uppercase ${
                      rotationSpeed > 0
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold"
                        : "bg-red-500/10 border-red-500/30 text-red-400 font-bold"
                    }`}
                  >
                    {rotationSpeed > 0 ? "SPIN: ON" : "SPIN: OFF"}
                  </button>
                </div>

                {/* Stunt trigger */}
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-[7px] md:text-[8px] uppercase">MANEUVER</span>
                  <button
                    onClick={handleDroneClick}
                    className="w-full py-0.5 md:py-1 rounded text-[6.5px] md:text-[8px] border border-[#D4A348]/40 hover:border-[#D4A348] bg-[#D4A348]/10 hover:bg-[#D4A348]/20 text-[#D4A348] font-bold uppercase transition-all"
                  >
                    ROLL STUNT
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="flex justify-between items-end w-full border-t border-[#D4A348]/20 pt-4 bg-gradient-to-t from-black/40 to-transparent px-4">
            <div>
              <span className="text-white/40">SYS_TEMP: </span>
              <span className="text-green-400">32.4°C (STABLE)</span>
            </div>
            <div className="hidden sm:block text-center text-white/30 text-[9px]">
              TMI UAV HANGAR SYSTEM INC. // PUNE, IN // 18°39'N 73°50'E
            </div>
            <div className="text-right">
              <span className="text-white/40">POWER: </span>
              <span className="text-white font-bold">22.8V [LI-PO]</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
