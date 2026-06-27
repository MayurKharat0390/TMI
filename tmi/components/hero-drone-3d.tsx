"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTheme } from "next-themes";

// Drifting glowing dust particles in the background
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.012;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.04) * 0.04;
    }
  });

  const count = 90;
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
        color="#DFBA73"
        size={0.032}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
}

interface ModelPartProps {
  geometry: THREE.BufferGeometry;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  progress: number;
  color?: string;
  wireframeColor?: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}

// Reusable part component that handles wireframe to solid interpolation
function ModelPart({
  geometry,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  progress,
  color = "#1C1917",
  wireframeColor = "#DFBA73",
  metalness = 0.85,
  roughness = 0.25,
  emissive = "#000000",
  emissiveIntensity = 0
}: ModelPartProps) {
  const solidOpacity = progress;
  // Keeps wireframe slightly visible at the end for technical/blueprint aesthetic (opacity 1.0 -> 0.18)
  const wireframeOpacity = 1.0 - progress * 0.82;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {solidOpacity > 0.01 && (
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color={color}
            metalness={metalness}
            roughness={roughness}
            transparent={true}
            opacity={solidOpacity}
            emissive={new THREE.Color(emissive)}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      )}
      {wireframeOpacity > 0.01 && (
        <mesh geometry={geometry} scale={[1.012, 1.012, 1.012]}>
          <meshBasicMaterial
            color={wireframeColor}
            wireframe={true}
            transparent={true}
            opacity={wireframeOpacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

interface HotspotInfo {
  id: string;
  name: string;
  desc: string;
  position: [number, number, number];
}

const hotspotsList: HotspotInfo[] = [
  {
    id: "canopy",
    name: "STEALTH CARBON CANOPY",
    desc: "Aerodynamic fuselage shell protecting core Pixhawk avionics and telemetry links.",
    position: [0, 0.22, 0.04]
  },
  {
    id: "propulsion",
    name: "BRUSHLESS PROPULSION CORE",
    desc: "High-torque motors driving alternating carbon-fiber rotors for maximum thrust.",
    position: [-0.68, 0.16, 0.68]
  },
  {
    id: "sensors",
    name: "TRIPLE-LENS SENSOR POD",
    desc: "Integrated LiDAR rangefinder, FLIR thermal, and optical zoom camera turret.",
    position: [0, -0.22, 0.14]
  },
  {
    id: "battery",
    name: "REDUNDANT POWER PACKS",
    desc: "Dual high-density LiPo power cores with real-time bus telemetry checks.",
    position: [0.26, 0.08, -0.05]
  },
  {
    id: "truss",
    name: "DUAL-ROD CARBON TRUSS",
    desc: "Ultra-rigid double-rod composite arms designed to eliminate motor vibrations.",
    position: [-0.6, 0.04, -0.6]
  }
];

function HotspotMarker({ info }: { info: HotspotInfo }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Html position={info.position} center distanceFactor={2.5}>
      <div className="relative group flex items-center justify-center font-jost pointer-events-auto">
        {/* Pulsing button */}
        <button
          className="w-4 h-4 rounded-full bg-[#DFBA73] border-2 border-black flex items-center justify-center relative z-20 cursor-pointer shadow-[0_0_10px_rgba(223,186,115,0.7)] transition-transform hover:scale-125 duration-300"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
          <span className="absolute inset-0 rounded-full border border-[#DFBA73] animate-ping opacity-75" />
        </button>

        {/* Technical Callout Card */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-56 p-3 rounded-lg border border-[#DFBA73]/30 bg-black/95 dark:bg-black/90 backdrop-blur-md shadow-2xl text-left z-30 pointer-events-none"
            >
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rotate-45 border-l border-b border-[#DFBA73]/30 bg-black" />
              <p className="text-[10px] font-sans font-bold text-[#DFBA73] uppercase tracking-[0.15em] mb-1">
                {info.name}
              </p>
              <p className="text-[9px] text-gray-300 font-light leading-relaxed">
                {info.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Html>
  );
}

interface DroneAssemblyModelProps {
  mouseX: number;
  mouseY: number;
  isMobile: boolean;
  onAssemblyComplete?: () => void;
  onTransitionProgress?: (p: number) => void;
}

function DroneAssemblyModel({
  mouseX,
  mouseY,
  isMobile,
  onAssemblyComplete,
  onTransitionProgress
}: DroneAssemblyModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const propRefs = useRef<(THREE.Group | null)[]>([]);
  const gimbalRef = useRef<THREE.Group>(null);
  
  // Load texture inside useEffect to avoid Suspense rendering skips
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/images/logo.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setLogoTexture(tex);
    });
  }, []);

  // Assembly and transition status refs
  const assemblyProgress = useRef(0);
  const transitionProgress = useRef(0);
  
  const [currentAssemblyT, setCurrentAssemblyT] = useState(0);
  const [currentTransitionT, setCurrentTransitionT] = useState(0);

  const isAssembled = useRef(false);
  const isTransitioned = useRef(false);

  // Reusable Geometries
  const geometries = React.useMemo(() => ({
    chassisCenter: new THREE.BoxGeometry(0.5, 0.06, 0.5),
    fusionCore: new THREE.SphereGeometry(0.07, 16, 16),
    battery: new THREE.BoxGeometry(0.12, 0.08, 0.32),
    canopyCenter: new THREE.BoxGeometry(0.2, 0.12, 0.42),
    canopyLeft: new THREE.BoxGeometry(0.08, 0.1, 0.34),
    canopyRight: new THREE.BoxGeometry(0.08, 0.1, 0.34),
    canopyNose: new THREE.BoxGeometry(0.18, 0.08, 0.18),
    gpsMast: new THREE.CylinderGeometry(0.006, 0.006, 0.14, 8),
    gpsPuck: new THREE.CylinderGeometry(0.038, 0.038, 0.012, 12),
    armRod: new THREE.CylinderGeometry(0.012, 0.012, 0.78, 8),
    motor: new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12),
    propHub: new THREE.CylinderGeometry(0.01, 0.01, 0.024, 8),
    propBladeSingle: new THREE.BoxGeometry(0.2, 0.005, 0.022),
    skid: new THREE.BoxGeometry(0.012, 0.012, 0.62),
    strut: new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8),
    gimbalStrut: new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8),
    gimbalBody: new THREE.CylinderGeometry(0.06, 0.06, 0.1, 6),
    gimbalLens: new THREE.CylinderGeometry(0.024, 0.024, 0.03, 10),
  }), []);

  // 6 Arm angles
  const hexArms = React.useMemo(() => {
    const angles = [
      Math.PI / 6, Math.PI / 2, 5 * Math.PI / 6,
      -5 * Math.PI / 6, -Math.PI / 2, -Math.PI / 6
    ];

    return angles.map((angle, idx) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const motorRadius = 0.8;
      const armLength = 0.78;
      
      return {
        id: `arm-${idx}`,
        angle,
        armLength,
        motorPos: [sin * motorRadius, 0.04, cos * motorRadius] as [number, number, number],
        armPos: [(sin * armLength) / 2, 0.01, (cos * armLength) / 2] as [number, number, number],
        ledColor: idx === 0 || idx === 5 || idx === 1 || idx === 4 ? "#00ffff" : "#DFBA73",
      };
    });
  }, []);

  useFrame((state, delta) => {
    // 1. Assembly sequence (takes ~3.0s)
    if (assemblyProgress.current < 1) {
      assemblyProgress.current = Math.min(assemblyProgress.current + delta * 0.33, 1);
      setCurrentAssemblyT(assemblyProgress.current);

      if (assemblyProgress.current >= 1 && !isAssembled.current) {
        isAssembled.current = true;
        if (onAssemblyComplete) {
          onAssemblyComplete();
        }
      }
    } 
    // 2. Transition sequence to side (takes ~1.2s for slow elegant glide)
    else if (transitionProgress.current < 1) {
      transitionProgress.current = Math.min(transitionProgress.current + delta * 0.8, 1);
      setCurrentTransitionT(transitionProgress.current);
      if (onTransitionProgress) {
        onTransitionProgress(transitionProgress.current);
      }
      if (transitionProgress.current >= 1) {
        isTransitioned.current = true;
      }
    }

    const t = assemblyProgress.current;
    const easeAssembly = 1 - Math.pow(1 - t, 3);

    const tr = transitionProgress.current;
    // Elegant ease-in-out transition curve for the shift
    const easeTransition = tr < 0.5 ? 4 * tr * tr * tr : 1 - Math.pow(-2 * tr + 2, 3) / 2;

    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Scale: start large (centered), shrink to a safe, perfectly framed sidebar size (no clipping)
      const startScale = isMobile ? 1.2 : 1.6;
      const endScale = isMobile ? 0.8 : 0.95; // slightly smaller endScale to prevent any window clipping
      const scale = THREE.MathUtils.lerp(startScale, endScale, easeTransition);
      groupRef.current.scale.setScalar(scale);

      // Position: start centered. Desktop slides to X=0.9 (nicely framed inside grid spacer), mobile floats back
      const startPos = [0, 0, 0];
      const endPos = isMobile ? [0, 0.42, 0.05] : [0.92, 0.05, 0.1];
      const posX = THREE.MathUtils.lerp(startPos[0], endPos[0], easeTransition);
      const posY = THREE.MathUtils.lerp(startPos[1], endPos[1], easeTransition);
      const posZ = THREE.MathUtils.lerp(startPos[2], endPos[2], easeTransition);

      if (t >= 1) {
        // Idle bobbing + slight tilt drift to simulate real aerodynamic hover countering
        const bob = Math.sin(time * 1.4) * 0.06;
        groupRef.current.position.set(posX, posY + bob, posZ);

        // Yaw rotates slowly automatically, combined with mouse position influence
        const autoYaw = time * 0.12;
        const targetYaw = autoYaw + mouseX * 0.3;
        const targetPitch = mouseY * 0.2 - 0.04;
        const targetRoll = -mouseX * 0.15 + Math.sin(time * 1.5) * 0.02; // slight wind roll sway

        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 0.06);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 0.06);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll, 0.06);

        // Slow camera gimbal scanning check
        if (gimbalRef.current) {
          gimbalRef.current.rotation.y = Math.sin(time * 0.9) * 0.35;
          gimbalRef.current.rotation.x = Math.cos(time * 0.6) * 0.12;
        }
      } else {
        // Assembly entry positions & spiral rotation
        groupRef.current.position.set(0, THREE.MathUtils.lerp(-0.5, 0, easeAssembly), 0);
        
        const spinAngle = (1 - easeAssembly) * Math.PI * 1.5;
        groupRef.current.rotation.set(
          THREE.MathUtils.lerp(-Math.PI / 10, -0.04, easeAssembly),
          spinAngle + mouseX * 0.15,
          0
        );
      }
    }

    // Rotor spinning logic: Alternating rotation directions for hexacopter stability
    const basePropSpeed = t >= 1 ? 1.35 : easeAssembly * 0.45;
    propRefs.current.forEach((ref, idx) => {
      if (ref) {
        ref.rotation.y += idx % 2 === 0 ? basePropSpeed : -basePropSpeed;
      }
    });
  });

  const ease = 1 - Math.pow(1 - currentAssemblyT, 3);
  const invEase = 1 - ease;

  // Parts offset calculations based on assembly progress
  // Helical entry for canopy: spins in spirals as it drops
  const canopyY = 0.06 + invEase * 1.8;
  const canopyZ = 0.02 + invEase * 0.3;
  const canopyRotY = invEase * Math.PI * 2.0;

  const t = currentAssemblyT;

  // Delayed logo flight: stays in front for the first 20% of build, then flies back
  const logoT = Math.max((t - 0.2) / 0.8, 0);
  const logoEase = 1 - Math.pow(1 - logoT, 3);

  // Batteries: slide from sides
  const batteryXOffset = invEase * 1.2;

  // Landing gear: slides up from bottom
  const landingYOffset = -invEase * 1.5;

  // Gimbal camera: slides backward from front
  const gimbalZOffset = invEase * 1.0;
  const gimbalYOffset = -invEase * 0.5;

  const scanY = 2.0 - currentAssemblyT * 2.8;
  const timeSecs = typeof window !== "undefined" ? performance.now() * 0.001 : 0;

  // Colors
  const chassisColor = "#121214";
  const bodyColor = "#1C1917";
  const goldColor = "#DFBA73";
  const metalColor = "#3A3A3C";

  return (
    <group ref={groupRef}>
      {/* Laser scanner ring during assembly */}
      {currentAssemblyT < 0.99 && (
        <group position={[0, scanY, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[1.18, 1.22, 32]} />
            <meshBasicMaterial
              color="#00ffff"
              transparent
              opacity={Math.sin(currentAssemblyT * Math.PI) * 0.95}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[0, 1.18, 32]} />
            <meshBasicMaterial
              color="#00ffff"
              transparent
              opacity={Math.sin(currentAssemblyT * Math.PI) * 0.16}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}

      {/* RENDER HTML HOTSPOTS (Once drone is fully assembled and transitioned to the side) */}
      {currentTransitionT >= 0.95 && (
        <group>
          {hotspotsList.map((info) => (
            <HotspotMarker key={info.id} info={info} />
          ))}
        </group>
      )}

      {/* 1. CENTRAL CHASSIS & GLOWING FUSION CORE */}
      <ModelPart
        geometry={geometries.chassisCenter}
        progress={currentAssemblyT}
        color={chassisColor}
        wireframeColor="#00ffff"
      />
      {/* Pulse glowing fusion core in the center of chassis gaps */}
      <ModelPart
        geometry={geometries.fusionCore}
        position={[0, 0.015, 0]}
        progress={currentAssemblyT}
        color={goldColor}
        wireframeColor="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={0.8 + Math.sin(timeSecs * 5.0) * 0.25}
      />

      {/* 2. DUAL SIDE BATTERIES */}
      <ModelPart
        geometry={geometries.battery}
        position={[-0.14 - batteryXOffset, 0.06, -0.04]}
        progress={currentAssemblyT}
        color="#18181B"
        wireframeColor="#00ffff"
      />
      <ModelPart
        geometry={geometries.battery}
        position={[0.14 + batteryXOffset, 0.06, -0.04]}
        progress={currentAssemblyT}
        color="#18181B"
        wireframeColor="#00ffff"
      />
      <ModelPart
        geometry={geometries.chassisCenter}
        position={[-0.14 - batteryXOffset, 0.105, -0.04]}
        scale={[0.16, 0.04, 0.48]}
        progress={currentAssemblyT}
        color={goldColor}
        wireframeColor="#00ffff"
      />
      <ModelPart
        geometry={geometries.chassisCenter}
        position={[0.14 + batteryXOffset, 0.105, -0.04]}
        scale={[0.16, 0.04, 0.48]}
        progress={currentAssemblyT}
        color={goldColor}
        wireframeColor="#00ffff"
      />

      {/* 3. CANOPY (SPINS INTO PLACE helically) */}
      <group position={[0, canopyY, canopyZ]} rotation={[0, canopyRotY, 0]}>
        <ModelPart
          geometry={geometries.canopyCenter}
          progress={currentAssemblyT}
          color={bodyColor}
          wireframeColor={goldColor}
        />
        <ModelPart
          geometry={geometries.canopyLeft}
          position={[-0.12, -0.01, 0.01]}
          rotation={[0, 0, Math.PI / 6]}
          progress={currentAssemblyT}
          color={chassisColor}
          wireframeColor={goldColor}
        />
        <ModelPart
          geometry={geometries.canopyRight}
          position={[0.12, -0.01, 0.01]}
          rotation={[0, 0, -Math.PI / 6]}
          progress={currentAssemblyT}
          color={chassisColor}
          wireframeColor={goldColor}
        />
        <ModelPart
          geometry={geometries.canopyNose}
          position={[0, 0.02, 0.18]}
          rotation={[Math.PI / 6, 0, 0]}
          progress={currentAssemblyT}
          color={bodyColor}
          wireframeColor={goldColor}
        />
        <ModelPart
          geometry={geometries.canopyNose}
          position={[0, 0.032, 0.2]}
          rotation={[Math.PI / 6, 0, 0]}
          scale={[0.4, 0.05, 0.8]}
          progress={currentAssemblyT}
          color={goldColor}
          wireframeColor={goldColor}
        />

        {/* GPS Antenna Mast & Puck mounted on top-rear */}
        <ModelPart
          geometry={geometries.gpsMast}
          position={[0, 0.08, -0.06]}
          progress={currentAssemblyT}
          color={metalColor}
          wireframeColor={goldColor}
        />
        <ModelPart
          geometry={geometries.gpsPuck}
          position={[0, 0.15, -0.06]}
          progress={currentAssemblyT}
          color={goldColor}
          wireframeColor={goldColor}
          emissive={goldColor}
          emissiveIntensity={0.2}
        />

        {/* Flying logo is now rendered outside the canopy group to allow independent flight physics */}
      </group>

      {/* --- FLYING BRAND LOGO TRANSITION --- */}
      {logoTexture && (
        <group 
          position={[0, THREE.MathUtils.lerp(0.6, canopyY + 0.062, logoEase), THREE.MathUtils.lerp(1.2, canopyZ + 0.02, logoEase)]} 
          rotation={[THREE.MathUtils.lerp(0, -Math.PI / 2, logoEase), THREE.MathUtils.lerp(0, canopyRotY, logoEase), 0]} 
          scale={[THREE.MathUtils.lerp(0.42, 0.14, logoEase), THREE.MathUtils.lerp(0.58, 0.18, logoEase), 1.0]}
        >
          <mesh>
            <planeGeometry args={[1, 1]} />
            {t < 0.99 ? (
              // Self-lit basic material during flight to show the logo in full color and clear visibility
              <meshBasicMaterial
                map={logoTexture}
                transparent={true}
                opacity={THREE.MathUtils.lerp(0.95, 1.0, logoEase)}
                side={THREE.DoubleSide}
                depthWrite={true}
              />
            ) : (
              // Standard shaded material when attached to canopy for realistic lighting integration
              <meshStandardMaterial
                map={logoTexture}
                transparent={true}
                opacity={1.0}
                roughness={0.2}
                metalness={0.15}
                depthWrite={true}
              />
            )}
          </mesh>

          {/* Outer Holographic Ring (visible only during flight) */}
          {t < 0.99 && (
            <mesh scale={[1.25, 1.25, 1.0]}>
              <ringGeometry args={[0.46, 0.48, 32]} />
              <meshBasicMaterial
                color="#00ffff"
                transparent
                opacity={(1 - logoEase) * 0.7 * (0.8 + Math.sin(timeSecs * 8) * 0.2)}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      )}

      {/* 4. RADIAL ARMS (carbon tubes with gold CNC reinforcement brackets and telemetry stripes) */}
      {hexArms.map((arm) => {
        const armScaleFactor = 1.0 + invEase * 1.6;
        const [ax, ay, az] = arm.armPos;
        const armExplodedX = ax * armScaleFactor;
        const armExplodedZ = az * armScaleFactor;
        const armExplodedY = ay + invEase * 0.8;

        // Arm rotates/screws slightly around its Y axis as it slots in
        const armTwistRot = invEase * 0.4;

        return (
          <group key={`arm-group-${arm.id}`} rotation={[0, armTwistRot, 0]}>
            {/* Top rod */}
            <ModelPart
              geometry={geometries.armRod}
              position={[armExplodedX, armExplodedY, armExplodedZ]}
              rotation={[Math.PI / 2, 0, -arm.angle]}
              scale={[1, arm.armLength, 1]}
              progress={currentAssemblyT}
              color="#0B0C0E"
              wireframeColor="#00ffff"
            />
            {/* Bottom rod */}
            <ModelPart
              geometry={geometries.armRod}
              position={[armExplodedX, armExplodedY - 0.04, armExplodedZ]}
              rotation={[Math.PI / 2, 0, -arm.angle]}
              scale={[1, arm.armLength, 1]}
              progress={currentAssemblyT}
              color="#0B0C0E"
              wireframeColor="#00ffff"
            />

            {/* CNC Metal mount sleeve at arm base */}
            <ModelPart
              geometry={geometries.motor}
              position={[armExplodedX * 0.3, armExplodedY - 0.02, armExplodedZ * 0.3]}
              rotation={[Math.PI / 2, 0, -arm.angle]}
              scale={[0.3, 0.4, 0.3]}
              progress={currentAssemblyT}
              color={metalColor}
              wireframeColor="#00ffff"
            />

            {/* Gold telemetry accent ring wrapped around the arm */}
            <ModelPart
              geometry={geometries.motor}
              position={[armExplodedX * 0.65, armExplodedY - 0.02, armExplodedZ * 0.65]}
              rotation={[Math.PI / 2, 0, -arm.angle]}
              scale={[0.26, 0.1, 0.26]}
              progress={currentAssemblyT}
              color={goldColor}
              wireframeColor={goldColor}
              emissive={goldColor}
              emissiveIntensity={0.35}
            />
          </group>
        );
      })}

      {/* 5. MOTOR & TRIPLE-BLADE PROPELLERS (SLOT-IN FROM ABOVE) */}
      {hexArms.map((arm, index) => {
        const armScaleFactor = 1.0 + invEase * 1.6;
        const [mx, my, mz] = arm.motorPos;
        const motorExplodedX = mx * armScaleFactor;
        const motorExplodedZ = mz * armScaleFactor;
        
        const motorY = my + invEase * 1.2;
        const propY = motorY + 0.06 + invEase * 1.6;

        return (
          <group key={`motor-prop-group-${arm.id}`}>
            {/* Motor Housing */}
            <ModelPart
              geometry={geometries.motor}
              position={[motorExplodedX, motorY, motorExplodedZ]}
              progress={currentAssemblyT}
              color={metalColor}
              wireframeColor="#00ffff"
            />
            {/* Glowing Motor Cap Ring */}
            <ModelPart
              geometry={geometries.motor}
              position={[motorExplodedX, motorY + 0.04, motorExplodedZ]}
              scale={[1.05, 0.15, 1.05]}
              progress={currentAssemblyT}
              color={goldColor}
              wireframeColor="#00ffff"
              emissive={goldColor}
              emissiveIntensity={0.6}
            />
            
            {/* TRIPLE-BLADE propeller assembly */}
            <group
              ref={(el) => {
                propRefs.current[index] = el;
              }}
              position={[motorExplodedX, propY, motorExplodedZ]}
            >
              {/* Hub */}
              <ModelPart
                geometry={geometries.propHub}
                progress={currentAssemblyT}
                color={metalColor}
                wireframeColor={goldColor}
              />
              {/* 3 Blades radiating at 120 deg angles */}
              {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, bIdx) => (
                <group key={bIdx} rotation={[0, angle, 0]}>
                  <ModelPart
                    geometry={geometries.propBladeSingle}
                    position={[0.1, 0.012, 0]}
                    progress={currentAssemblyT}
                    color="rgba(25, 25, 30, 0.9)"
                    wireframeColor={goldColor}
                    metalness={0.9}
                    roughness={0.15}
                  />
                </group>
              ))}
            </group>
            
            {/* Under-motor navigation LED */}
            <mesh position={[motorExplodedX, motorY - 0.05, motorExplodedZ]}>
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshBasicMaterial
                color={arm.ledColor}
                transparent
                opacity={currentAssemblyT * (index % 2 === 0 ? 0.95 : 0.6)}
              />
            </mesh>
          </group>
        );
      })}

      {/* 6. LANDING SKIDS */}
      <group position={[0, landingYOffset, 0]}>
        <ModelPart
          geometry={geometries.strut}
          position={[-0.18, -0.08, 0.16]}
          rotation={[0, 0, Math.PI / 10]}
          progress={currentAssemblyT}
          color="#0B0C0E"
          wireframeColor="#00ffff"
        />
        <ModelPart
          geometry={geometries.strut}
          position={[-0.18, -0.08, -0.16]}
          rotation={[0, 0, Math.PI / 10]}
          progress={currentAssemblyT}
          color="#0B0C0E"
          wireframeColor="#00ffff"
        />
        <ModelPart
          geometry={geometries.strut}
          position={[0.18, -0.08, 0.16]}
          rotation={[0, 0, -Math.PI / 10]}
          progress={currentAssemblyT}
          color="#0B0C0E"
          wireframeColor="#00ffff"
        />
        <ModelPart
          geometry={geometries.strut}
          position={[0.18, -0.08, -0.16]}
          rotation={[0, 0, -Math.PI / 10]}
          progress={currentAssemblyT}
          color="#0B0C0E"
          wireframeColor="#00ffff"
        />
        <ModelPart
          geometry={geometries.skid}
          position={[-0.2, -0.16, 0]}
          progress={currentAssemblyT}
          color={chassisColor}
          wireframeColor="#00ffff"
        />
        <ModelPart
          geometry={geometries.skid}
          position={[0.2, -0.16, 0]}
          progress={currentAssemblyT}
          color={chassisColor}
          wireframeColor="#00ffff"
        />
      </group>

      {/* 7. FRONT GIMBAL CAMERA (SCANS ENVIRONMENT IN IDLE) */}
      <group 
        ref={gimbalRef}
        position={[0, -0.05 + gimbalYOffset, 0.14 + gimbalZOffset]}
      >
        <ModelPart
          geometry={geometries.gimbalStrut}
          position={[0, -0.03, 0]}
          progress={currentAssemblyT}
          color="#0B0C0E"
          wireframeColor="#00ffff"
        />
        <ModelPart
          geometry={geometries.gimbalBody}
          position={[0, -0.09, 0]}
          rotation={[0, Math.PI / 6, 0]}
          progress={currentAssemblyT}
          color={chassisColor}
          wireframeColor={goldColor}
        />
        <ModelPart
          geometry={geometries.gimbalLens}
          position={[-0.024, -0.1, 0.05]}
          rotation={[Math.PI / 2, 0, 0]}
          progress={currentAssemblyT}
          color={goldColor}
          wireframeColor={goldColor}
        />
        <ModelPart
          geometry={geometries.gimbalLens}
          position={[0.024, -0.1, 0.05]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.7, 1.0, 0.7]}
          progress={currentAssemblyT}
          color="#00ffff"
          wireframeColor="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </group>
    </group>
  );
}

function HeroDroneFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#DFBA73] animate-spin" />
      <span className="text-[10px] text-[#DFBA73] uppercase tracking-widest font-sans font-medium">Connecting Telemetry Link...</span>
    </div>
  );
}

interface HeroDrone3DProps {
  onAssemblyComplete?: () => void;
  onTransitionComplete?: () => void;
}

export default function HeroDrone3D({ onAssemblyComplete, onTransitionComplete }: HeroDrone3DProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [hasStartedTransition, setHasStartedTransition] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (!mounted) {
    return <HeroDroneFallback />;
  }

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] select-none pointer-events-auto">
      {/* Ambient background blur */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0.6, 2.3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <React.Suspense fallback={null}>
          <ambientLight intensity={isDark ? 0.6 : 1.2} />
          <hemisphereLight intensity={isDark ? 0.7 : 1.1} color="#ffffff" groundColor={isDark ? "#111115" : "#e2e8f0"} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={isDark ? 3.0 : 4.0}
            color="#ffffff"
          />
          <pointLight
            position={[-5, -4, -3]}
            intensity={isDark ? 2.5 : 1.5}
            color={isDark ? "#DFBA73" : "#F3F4F6"}
          />
          <spotLight
            position={[0, 6, 2]}
            angle={0.6}
            penumbra={1}
            intensity={isDark ? 2.0 : 3.0}
            color="#ffffff"
          />

          <DroneAssemblyModel
            mouseX={mouse.x}
            mouseY={mouse.y}
            isMobile={isMobile}
            onAssemblyComplete={() => {
              setHasStartedTransition(true);
              if (onAssemblyComplete) onAssemblyComplete();
            }}
            onTransitionProgress={(p) => {
              if (p >= 0.99 && onTransitionComplete) {
                onTransitionComplete();
              }
            }}
          />

          <ParticleField />
          <Environment preset="studio" />
        </React.Suspense>
      </Canvas>

      {/* --- TELEMETRY PROGRESS HUD (visible only during assembly) --- */}
      {!hasStartedTransition && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 bg-black/75 dark:bg-black/90 backdrop-blur-md border border-[#00ffff]/30 px-6 py-3 rounded-xl flex flex-col items-center space-y-2 shadow-[0_0_20px_rgba(0,255,255,0.1)] w-[260px] sm:w-[300px]">
          <div className="flex items-center space-x-2 text-[10px] font-sans font-bold tracking-[0.25em] text-[#00ffff] uppercase animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff]" />
            <span>Constructing UAV Core</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00ffff] shadow-[0_0_8px_#00ffff]" 
              style={{
                width: "100%",
                animation: "grow 3s linear forwards"
              }}
            />
          </div>
          <span className="text-[8px] font-sans font-bold tracking-[0.1em] text-white/50 uppercase">
            STAGE_BUILD // TELEMETRY LINKED
          </span>

          <style jsx>{`
            @keyframes grow {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
