"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, X } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 3D Advanced Hexacopter Drone Model component rendered inside Canvas
function MiniDroneModel({ isHovered, scrollY }: { isHovered: boolean; scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const propRefs = useRef<(THREE.Group | null)[]>([]);
  const cameraPodRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const lastScrollY = useRef(0);
  const scrollActivity = useRef(0);

  // We track scroll velocity inside the render loop to spin props faster and tilt drone
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Bobbing height offset
    const bobbing = Math.sin(time * 2.0) * 0.07;
    groupRef.current.position.y = bobbing + (isHovered ? 0.05 : 0);

    // Continuous slow yaw rotation
    groupRef.current.rotation.y = time * 0.4;

    // Gimbal camera pod scans around slowly
    if (cameraPodRef.current) {
      cameraPodRef.current.rotation.y = Math.sin(time * 1.5) * 0.35;
      cameraPodRef.current.rotation.x = Math.sin(time * 0.8) * 0.15;
    }

    // Telemetry radar beam pulses
    if (beamRef.current) {
      beamRef.current.scale.x = 1.0 + Math.sin(time * 4.0) * 0.08;
      beamRef.current.scale.z = 1.0 + Math.sin(time * 4.0) * 0.08;
      (beamRef.current.material as THREE.Material).opacity = 0.03 + Math.sin(time * 2.0) * 0.015;
    }

    // Detect scroll change
    const deltaScroll = Math.abs(scrollY - lastScrollY.current);
    lastScrollY.current = scrollY;

    // Accumulate scroll activity and slowly decay it
    scrollActivity.current = THREE.MathUtils.lerp(scrollActivity.current, deltaScroll * 0.15, 0.08);

    // Propeller spin speed increases with scroll or hover
    const baseSpeed = isHovered ? 2.8 : 1.3;
    const propSpeed = baseSpeed + Math.min(2.5, scrollActivity.current);

    // Propeller spinning animation (hexacopter uses alternating directions)
    propRefs.current.forEach((prop, idx) => {
      if (prop) {
        prop.rotation.y += idx % 2 === 0 ? propSpeed : -propSpeed;
      }
    });

    // Pitch/roll tilt based on hover and scroll activity
    const pitchTilt = isHovered ? Math.PI / 12 : 0;
    const rollTilt = Math.sin(time * 1.5) * 0.04 + (scrollActivity.current * 0.1);
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pitchTilt, 0.08);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, rollTilt, 0.08);
  });

  // Matte and metallic materials matching Jetly's premium theme
  const bodyMat = new THREE.MeshStandardMaterial({
    color: "#1C1917", // stone-900 (slate/charcoal)
    metalness: 0.85,
    roughness: 0.25,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: "#DFBA73", // aerospace gold
    metalness: 0.9,
    roughness: 0.15,
  });

  const blackMetalMat = new THREE.MeshStandardMaterial({
    color: "#0C0A09", // stone-950
    metalness: 0.95,
    roughness: 0.15,
  });

  const transparentPropMat = new THREE.MeshStandardMaterial({
    color: "#27272A", // zinc-800
    transparent: true,
    opacity: 0.65,
    roughness: 0.4,
  });

  const beamMat = new THREE.MeshBasicMaterial({
    color: "#DFBA73",
    transparent: true,
    opacity: 0.04,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  // Hex Arms configuration (6 arms at 60 degree increments)
  const hexAngles = [0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3];

  return (
    <group ref={groupRef} scale={0.9} position={[0, -0.02, 0]}>
      {/* 1. Hexagonal Center Canopy */}
      {/* Upper shell */}
      <mesh material={bodyMat} position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.08, 6]} />
      </mesh>
      
      {/* Gold Trim Ring */}
      <mesh material={goldAccentMat} position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.012, 8, 24]} />
      </mesh>
      
      {/* Upper Dome Cover */}
      <mesh material={bodyMat} position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.13, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      
      {/* Gold cap on dome */}
      <mesh material={goldAccentMat} position={[0, 0.20, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
      </mesh>

      {/* GPS Puck Antenna */}
      <mesh position={[0, 0.16, -0.06]} material={blackMetalMat}>
        <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
      </mesh>
      <mesh position={[0, 0.23, -0.06]} material={goldAccentMat}>
        <cylinderGeometry args={[0.038, 0.038, 0.012, 12]} />
      </mesh>

      {/* 2. Panning Gimbal Camera Pod (Front-Bottom) */}
      <group position={[0, -0.04, 0.1]} ref={cameraPodRef}>
        {/* Gimbal frame */}
        <mesh material={blackMetalMat}>
          <cylinderGeometry args={[0.01, 0.01, 0.04, 8]} />
        </mesh>
        {/* Camera body sphere */}
        <mesh position={[0, -0.04, 0]} material={bodyMat}>
          <sphereGeometry args={[0.05, 12, 12]} />
        </mesh>
        {/* Gold camera lens rim */}
        <mesh position={[0, -0.04, 0.045]} rotation={[Math.PI / 2, 0, 0]} material={goldAccentMat}>
          <cylinderGeometry args={[0.018, 0.018, 0.015, 12]} />
        </mesh>
        {/* Camera lens glass */}
        <mesh position={[0, -0.04, 0.052]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.002, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* 3. Rectangular Battery Pack (Rear-Bottom) */}
      <mesh position={[0, -0.03, -0.08]} material={blackMetalMat}>
        <boxGeometry args={[0.1, 0.06, 0.15]} />
      </mesh>
      <mesh position={[0, -0.03, -0.15]} material={goldAccentMat}>
        <boxGeometry args={[0.04, 0.03, 0.01]} />
      </mesh>

      {/* 4. Scanning Telemetry Light Cone */}
      <mesh ref={beamRef} position={[0, -0.4, 0]} material={beamMat}>
        <cylinderGeometry args={[0.01, 0.35, 0.8, 16, 1, true]} />
      </mesh>

      {/* 5. Hex Arms & Motors */}
      {hexAngles.map((angle, idx) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const armLength = 0.52;
        const armX = sin * armLength;
        const armZ = cos * armLength;

        return (
          <group key={idx}>
            {/* Bent Carbon-Fiber composite arm */}
            {/* Inner arm segment */}
            <mesh 
              position={[armX * 0.45, 0.02, armZ * 0.45]} 
              rotation={[0, -angle + Math.PI / 2, 0]}
              material={blackMetalMat}
            >
              <cylinderGeometry args={[0.015, 0.015, armLength * 0.8, 8]} />
            </mesh>
            {/* Upward joint and outer arm segment */}
            <mesh 
              position={[armX * 0.85, 0.04, armZ * 0.85]} 
              rotation={[0, -angle + Math.PI / 2, 0.08]}
              material={blackMetalMat}
            >
              <cylinderGeometry args={[0.012, 0.012, armLength * 0.4, 8]} />
            </mesh>

            {/* Motor Housing */}
            <mesh position={[armX, 0.07, armZ]} material={bodyMat}>
              <cylinderGeometry args={[0.038, 0.038, 0.06, 12]} />
            </mesh>

            {/* Gold accents on motor casing caps */}
            <mesh position={[armX, 0.1, armZ]} material={goldAccentMat}>
              <cylinderGeometry args={[0.018, 0.018, 0.008, 8]} />
            </mesh>

            {/* Navigation LEDs under motor arms */}
            <mesh position={[armX, -0.01, armZ]}>
              <sphereGeometry args={[0.014, 8, 8]} />
              {/* Front, sides, and rear navigation colors */}
              <meshBasicMaterial 
                color={
                  idx === 0 || idx === 1 
                    ? "#DFBA73" // Front Gold
                    : idx === 2 || idx === 3
                    ? "#FFFFFF" // Sides White
                    : "#C5A059" // Rear Amber
                } 
              />
            </mesh>

            {/* Rotor Setup */}
            <group 
              position={[armX, 0.11, armZ]}
              ref={(el) => {
                if (el) propRefs.current[idx] = el as any;
              }}
            >
              {/* Propeller hub */}
              <mesh material={blackMetalMat}>
                <cylinderGeometry args={[0.008, 0.008, 0.016, 8]} />
              </mesh>
              {/* Propeller blades */}
              <mesh material={transparentPropMat}>
                <boxGeometry args={[0.3, 0.004, 0.022]} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

interface PageInfo {
  title: string;
  tagline: string;
  description: string;
}

// Function to resolve contextual details based on location and scroll offset
const getContextualInfo = (pathname: string, scrollY: number): PageInfo => {
  if (pathname === "/") {
    if (scrollY < 500) {
      return {
        title: "Telemetry Command",
        tagline: "Home Base / UAS Mission",
        description: "Welcome to the Team Maverick India portal. We design, manufacture, and fly heavy-lift autonomous tactical UAVs representing India globally.",
      };
    } else if (scrollY >= 500 && scrollY < 1300) {
      return {
        title: "Aviation Dynamics",
        tagline: "Research & Development stats",
        description: "Our student-led division boasts 40+ active engineers, 12+ podium finishes, and over 5 years of continuous aeronautical research.",
      };
    } else if (scrollY >= 1300 && scrollY < 2300) {
      return {
        title: "Wolves Workshop",
        tagline: "Advanced Fabrication Lab",
        description: "Composite layup, mechanical milling, and avionics programming are performed here to ensure peak aerodynamic efficiency of all airfoils.",
      };
    } else {
      return {
        title: "Command Legacy",
        tagline: "Maverick Leadership",
        description: "Honoring our alumni and founders whose vision of technical excellence keeps driving the next generation of aerospace engineers.",
      };
    }
  }

  if (pathname === "/planes") {
    return {
      title: "Hangar Directory",
      tagline: "Active Fleet Specifications",
      description: "Browse our legacy of competitive heavy-lifters, tactical fixed-wing designs, and VTOL prototype configurations built for international SAE Aero Design competitions.",
    };
  }

  if (pathname === "/team") {
    return {
      title: "Crew Database",
      tagline: "Sky Wolves Departments",
      description: "Our personnel is divided into specialized divisions: Aerodynamics, Structures, Propulsion, Avionics, Logistical Control, and Media.",
    };
  }

  if (pathname === "/support_us" || pathname === "/sponsors") {
    return {
      title: "Support Hub",
      tagline: "Flight Sponsorship & Funding",
      description: "Support our research, carbon-fiber composite procurement, avionics testing, and logistics for representing India in international competitions.",
    };
  }

  if (pathname === "/contact") {
    return {
      title: "Communication Node",
      tagline: "Direct Telemetry Link",
      description: "Connect with our managing board for recruitment, business partnerships, sponsorship proposals, or media inquiries.",
    };
  }

  // Default fallback
  return {
    title: "Maverick Assistant",
    tagline: "UAV Telemetry Node Active",
    description: "Systems online. Exploring Team Maverick India's official web console. Select navigation paths above to explore other departments.",
  };
};

export default function MiniDroneTour() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // Mount logic to prevent SSR canvas crash
  useEffect(() => {
    setMounted(true);
    setScrollY(window.scrollY);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Open info box temporarily when navigating pages to nudge user
  useEffect(() => {
    setIsOpen(true);
  }, [pathname]);

  const info = getContextualInfo(pathname, scrollY);

  return (
    <div className="fixed bottom-6 right-6 z-[999] pointer-events-none flex flex-col md:flex-row items-end md:items-center justify-end gap-3 font-jost">
      {/* --- CONTEXT INFO PANEL --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="pointer-events-auto p-4 rounded-xl border border-[#DFBA73]/30 bg-black/95 dark:bg-black/90 backdrop-blur-md shadow-2xl text-white w-[280px] sm:w-[320px] relative overflow-hidden"
          >
            {/* Tech grid texture background for sub-theme */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-[#DFBA73]/20 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#DFBA73] animate-spin" style={{ animationDuration: "12s" }} />
                <span className="text-[10px] font-sans font-semibold text-[#DFBA73] uppercase tracking-[0.18em]">
                  Telemetry Feed
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-[#DFBA73] transition-colors p-0.5 rounded hover:bg-white/5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Animate text content change on scroll/page changes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-[9px] uppercase tracking-widest text-[#DFBA73]/70 font-semibold block mb-0.5">
                  {info.tagline}
                </span>
                <h4 className="text-sm font-cormorant font-normal text-white mb-2 leading-tight uppercase tracking-wider">
                  {info.title}
                </h4>
                <p className="text-[11px] text-gray-300 leading-relaxed text-justify">
                  {info.description}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* Status light */}
            <div className="mt-3 pt-2 border-t border-[#DFBA73]/10 flex items-center justify-between text-[9px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                SYSTEM ONLINE
              </span>
              <span className="font-mono tracking-widest">
                MAV-0390
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 3D DRONE INTERACTIVE CONTAINER --- */}
      <div 
        className="w-24 h-24 pointer-events-auto cursor-pointer relative flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Glow backdrop behind the 3D Canvas */}
        <div 
          className={`absolute w-12 h-12 rounded-full bg-[#DFBA73] blur-lg opacity-10 transition-all duration-500 pointer-events-none ${
            isHovered ? "scale-125 opacity-15" : "scale-100"
          }`}
        />
        {/* Resting spinning rings around the drone for telemetry assistant vibe */}
        <div 
          className={`absolute w-20 h-20 rounded-full border border-dashed border-[#DFBA73]/15 animate-spin pointer-events-none transition-opacity duration-300 ${
            isOpen ? "opacity-25" : "opacity-50"
          }`} 
          style={{ animationDuration: "16s" }} 
        />
        
        {mounted && (
          <Canvas camera={{ position: [0, 0.12, 1.3], fov: 40 }} style={{ background: "transparent" }}>
            <ambientLight intensity={1.8} />
            <directionalLight position={[3, 5, 2]} intensity={2.5} />
            <pointLight position={[-2, -1, 1]} intensity={1.5} color="#DFBA73" />
            <MiniDroneModel isHovered={isHovered} scrollY={scrollY} />
          </Canvas>
        )}

        {/* Small notification badge to show telemetry info is available when closed */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 bg-[#DFBA73] text-black w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] border border-black shadow-[0_0_8px_#DFBA73] animate-pulse">
            ?
          </div>
        )}
      </div>
    </div>
  );
}
