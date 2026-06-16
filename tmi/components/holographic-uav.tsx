"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function UAVModel({ mouseX, mouseY, scrollY }: { mouseX: number; mouseY: number; scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const propRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Base constant slow rotation
      const baseRotationY = state.clock.getElapsedTime() * 0.08;
      
      // Calculate target parameters based on scroll position (scrollY)
      // Normalize scrollY (usually 0 to ~3000 depending on page height)
      const maxScroll = typeof window !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1000;
      const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

      // 1. Position tracking (make the UAV fly across the screen as you scroll)
      let targetX = 0;
      let targetY = 0.2;
      let targetZ = 0;

      if (scrollPercent < 0.25) {
        // Hero section: centered
        targetX = 0;
        targetY = 0.2;
        targetZ = 0;
      } else if (scrollPercent >= 0.25 && scrollPercent < 0.55) {
        // About Section: slide to the right side (X = 1.8), descend slightly
        targetX = 1.8;
        targetY = -0.3;
        targetZ = -0.5;
      } else if (scrollPercent >= 0.55 && scrollPercent < 0.8) {
        // Stats/Testimonials Section: slide to the left side (X = -1.8)
        targetX = -1.8;
        targetY = 0;
        targetZ = -0.3;
      } else {
        // Bottom: fly closer to center and zoom in
        targetX = 0;
        targetY = 0.3;
        targetZ = 1.0;
      }

      // Smoothly interpolate positions
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.04);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.04);

      // 2. Rotation / Flight Maneuvers based on scroll and mouse
      // Z-axis (roll / bank)
      let targetRoll = -mouseX * 0.3;
      if (groupRef.current.position.x < targetX) {
        targetRoll += 0.4; // Bank right when moving right
      } else if (groupRef.current.position.x > targetX) {
        targetRoll -= 0.4; // Bank left when moving left
      }

      // X-axis (pitch / climb)
      let targetPitch = mouseY * 0.2;
      if (groupRef.current.position.y < targetY) {
        targetPitch += 0.25; // Pitch up when climbing
      } else if (groupRef.current.position.y > targetY) {
        targetPitch -= 0.25; // Pitch down when descending
      }

      // Y-axis (yaw / heading)
      const targetYaw = baseRotationY - (scrollPercent * Math.PI * 0.8);

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll, 0.05);
    }

    if (propRef.current) {
      propRef.current.rotation.x += 0.8; // Fast rotating propeller
    }
  });

  return (
    <group ref={groupRef}>
      {/* Fuselage (Main Body) */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.05, 3.2, 8, 4]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.65} />
      </mesh>
      
      {/* Nose Cone */}
      <mesh position={[0, 1.7, 0]}>
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.8} />
      </mesh>

      {/* Main Wing */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[4.2, 0.04, 0.6]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Tail Booms */}
      <mesh position={[-0.45, -0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.02, 1.8, 4]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.45, -0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.02, 1.8, 4]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.5} />
      </mesh>

      {/* Horizontal Stabilizer */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.3]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Vertical Stabilizers */}
      <mesh position={[-0.45, -1.4, 0.1]}>
        <boxGeometry args={[0.02, 0.4, 0.25]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.45, -1.4, 0.1]}>
        <boxGeometry args={[0.02, 0.4, 0.25]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Propeller Hub */}
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" wireframe />
      </mesh>

      {/* Propeller Blades */}
      <mesh ref={propRef} position={[0, 1.95, 0]}>
        <boxGeometry args={[1.0, 0.02, 0.05]} />
        <meshBasicMaterial color="#D4A348" />
      </mesh>
    </group>
  );
}

export default function HolographicUAV() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [hudStats, setHudStats] = useState({
    pitch: 0,
    roll: 0,
    yaw: 0,
    speed: 0,
    altitude: 0,
    thrust: 0,
    status: "STANDBY",
  });

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
    // Calculate live telemetry values based on mouse and scroll positions
    const pitchDeg = Math.round(mouse.y * 15);
    const rollDeg = Math.round(-mouse.x * 25);
    const maxScroll = typeof window !== "undefined" ? document.documentElement.scrollHeight - window.innerHeight : 1000;
    const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
    const yawDeg = Math.round((scrollY * 0.15) % 360);
    
    const speedVal = scrollPercent < 0.1 
      ? 0.0 
      : parseFloat((14.2 + Math.sin(scrollY * 0.005) * 2.8 + Math.random() * 0.2).toFixed(1));
    
    const altVal = parseFloat((scrollY * 0.08).toFixed(1));
    
    const thrustVal = scrollPercent < 0.1 
      ? 0 
      : Math.round(75 + Math.sin(scrollY * 0.005) * 12 + Math.random() * 2);

    let flightStatus = "STANDBY";
    if (scrollPercent > 0.05) {
      flightStatus = mouse.x > 0.5 || mouse.x < -0.5 || mouse.y > 0.5 || mouse.y < -0.5
        ? "ATTITUDE_CORRECT"
        : "CRUISE_AUTO";
    }

    setHudStats({
      pitch: pitchDeg,
      roll: rollDeg,
      yaw: yawDeg,
      speed: speedVal,
      altitude: altVal,
      thrust: thrustVal,
      status: flightStatus,
    });
  }, [mouse, scrollY]);

  // Calculate HUD opacity: fades out completely after scrolling down 600px
  const hudOpacity = Math.max(0, 1 - scrollY / 600);

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 2, 5.5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <group rotation={[Math.PI / 3.2, 0, 0]}>
          <UAVModel mouseX={mouse.x} mouseY={mouse.y} scrollY={scrollY} />
        </group>
        
        <Stars radius={120} depth={50} count={800} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      <div className="absolute inset-0 bg-radial-glow" />

      {/* --- FUTURISTIC COCKPIT HUD OVERLAY --- */}
      {hudOpacity > 0 && (
        <div 
          className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 font-mono transition-opacity duration-300 pointer-events-none select-none text-[10px] md:text-xs tracking-wider"
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
            {/* Center target dot */}
            <div className="w-1 h-1 bg-[#D4A348] rounded-full" />
            {/* Crosshair ticks */}
            <div className="absolute top-0 w-[1px] h-3 bg-[#D4A348]/40" />
            <div className="absolute bottom-0 w-[1px] h-3 bg-[#D4A348]/40" />
            <div className="absolute left-0 w-3 h-[1px] bg-[#D4A348]/40" />
            <div className="absolute right-0 w-3 h-[1px] bg-[#D4A348]/40" />
            
            {/* Corner Bracket decorations */}
            <div className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-[#D4A348]/30" />
            <div className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-[#D4A348]/30" />
            <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-[#D4A348]/30" />
            <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-[#D4A348]/30" />
          </div>

          {/* Mid-screen HUD Left & Right indicators */}
          <div className="flex justify-between items-center w-full px-2 md:px-12 pointer-events-none">
            {/* Left Box: Speed & Altitude */}
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

            {/* Right Box: Attitude Yaw, Pitch, Roll */}
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
