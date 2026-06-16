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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    
    // Set initial scroll
    setScrollY(window.scrollY);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 2, 5.5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        {/* The UAV Model that responds to scroll and mouse */}
        <group rotation={[Math.PI / 3.2, 0, 0]}>
          <UAVModel mouseX={mouse.x} mouseY={mouse.y} scrollY={scrollY} />
        </group>
        
        <Stars radius={120} depth={50} count={800} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      <div className="absolute inset-0 bg-radial-glow" />
    </div>
  );
}
