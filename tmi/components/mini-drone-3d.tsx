"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 3D Advanced Hexacopter Drone Model component
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
      const opacity = 0.03 + Math.sin(time * 2.0) * 0.015;
      if (Array.isArray(beamRef.current.material)) {
        beamRef.current.material.forEach((m: any) => { m.opacity = opacity; });
      } else if (beamRef.current.material) {
        (beamRef.current.material as any).opacity = opacity;
      }
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
              <meshBasicMaterial 
                color={
                  idx === 0 || idx === 1 
                    ? "#DFBA73" 
                    : idx === 2 || idx === 3
                    ? "#FFFFFF" 
                    : "#C5A059" 
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

export default function MiniDrone3D({ isHovered, scrollY }: { isHovered: boolean; scrollY: number }) {
  return (
    <Canvas camera={{ position: [0, 0.12, 1.3], fov: 40 }} style={{ background: "transparent" }}>
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 5, 2]} intensity={2.5} />
      <pointLight position={[-2, -1, 1]} intensity={1.5} color="#DFBA73" />
      <MiniDroneModel isHovered={isHovered} scrollY={scrollY} />
    </Canvas>
  );
}
