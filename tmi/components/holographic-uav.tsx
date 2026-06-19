"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

// Glowing particle dust drifting around the hangar
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const particleColor = isDark ? "#DFBA73" : "#C5A059";
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  const count = 60;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
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
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.25}
      />
    </points>
  );
}

// CrewMember diorama component deleted for futuristic drone profile

function DroneModel({ 
  mouseX, 
  mouseY, 
  scrollY, 
  onIntroComplete,
  onDroneClick,
  rotationSpeed
}: { 
  mouseX: number; 
  mouseY: number; 
  scrollY: number;
  onIntroComplete?: () => void;
  onDroneClick?: () => void;
  rotationSpeed: number;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { clock } = useThree();

  // Load Maverick branding logo texture
  const logoTexture = useTexture("/images/logo.png");

  // Colors matching Team Maverick Official identity: Carbon Black + Aerospace Gold
  const mainChassisColor = isDark ? "#121214" : "#222326";  // Matte Carbon Black
  const canopyColor = isDark ? "#232429" : "#32343A";       // Stealth Titanium Canopy
  const goldAccentColor = "#DFBA73";                        // Premium Gold trim lines
  const whiteAccent = isDark ? "#FFFFFF" : "#F3F4F6";       // Clean White structural details
  const armColor = "#0B0C0E";                               // Dark carbon rods
  const metalColor = isDark ? "#48494E" : "#62646A";        // Anodized gunmetal motor housings
  const windingColor = "#E6A83C";                           // Copper coils inside motors
  const rotorColor = "rgba(40, 44, 52, 0.7)";               // Smoked prop blades
  const strapColor = "#1D1E22";                             // Carbon composite battery straps

  const groupRef = useRef<THREE.Group>(null);
  
  // Propeller refs to animate rotation
  const propRefs = useRef<(THREE.Group | null)[]>([]);

  const [hovered, setHovered] = useState(false);
  
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

  const introRef = useRef({
    progress: 0,
    completed: false
  });

  // Reusable Geometries
  const geometries = React.useMemo(() => ({
    chassisCenter: new THREE.BoxGeometry(0.55, 0.08, 0.55),
    battery: new THREE.BoxGeometry(0.12, 0.08, 0.35),
    canopy: new THREE.SphereGeometry(0.16, 32, 16),
    armRod: new THREE.CylinderGeometry(0.012, 0.012, 1.0, 8),
    motor: new THREE.CylinderGeometry(0.045, 0.045, 0.1, 16),
    propHub: new THREE.CylinderGeometry(0.012, 0.012, 0.03, 8),
    propBlade: new THREE.BoxGeometry(0.48, 0.006, 0.035),
    skid: new THREE.BoxGeometry(0.015, 0.015, 0.68),
    strut: new THREE.CylinderGeometry(0.008, 0.008, 0.18, 8),
    gimbalStrut: new THREE.CylinderGeometry(0.01, 0.01, 0.08, 8),
    gimbalBody: new THREE.SphereGeometry(0.07, 16, 16),
    gimbalLens: new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12),
    gpsMast: new THREE.CylinderGeometry(0.006, 0.006, 0.16, 8),
    gpsPuck: new THREE.CylinderGeometry(0.05, 0.05, 0.018, 12),
    sensorPod: new THREE.SphereGeometry(0.022, 12, 12),
  }), []);

  // Hexacopter Arm Positions & Configurations
  const hexArms = React.useMemo(() => {
    // 6 angles for a hexacopter (in radians)
    // Front-Right (30°), Right (90°), Rear-Right (150°), Rear-Left (-150°), Left (-90°), Front-Left (-30°)
    const angles = [
      Math.PI / 6,
      Math.PI / 2,
      5 * Math.PI / 6,
      -5 * Math.PI / 6,
      -Math.PI / 2,
      -Math.PI / 6
    ];

    return angles.map((angle, index) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const motorR = 0.85;
      const armLength = 0.85;
      
      return {
        id: `arm-${index}`,
        angle,
        armLength,
        motorPos: [sin * motorR, 0.05, cos * motorR] as [number, number, number],
        armPos: [(sin * armLength) / 2, 0.025, (cos * armLength) / 2] as [number, number, number],
        // Cohesive professional telemetry color scheme: front & side are Ice Blue, rear are white
        ledColor: index === 0 || index === 5 || index === 1 || index === 4 ? "#00E5FF" : "#FFFFFF",
      };
    });
  }, []);

  useFrame((state) => {
    // Increment intro progress
    if (!introRef.current.completed) {
      introRef.current.progress += 0.008;
      if (introRef.current.progress >= 1) {
        introRef.current.progress = 1;
        introRef.current.completed = true;
        if (onIntroComplete) {
          onIntroComplete();
        }
      }
    }

    const p = introRef.current.progress;
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    const ease = easeOutCubic(p);

    if (groupRef.current) {
      const baseRotationY = state.clock.getElapsedTime() * rotationSpeed;
      const maxScroll = typeof window !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1000;
      const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
      const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;

      // Position logic on scroll - Alternating Swap Layout (Hero on Right, Hangar on Left)
      let targetX = 0;
      let targetY = 0.25;
      let targetZ = 0;

      if (scrollPercent < 0.25) {
        targetX = isMobile ? 0 : 1.6;     // Hero: Data on Left, Drone on Right
        targetY = isMobile ? 0.4 : 0.25;  // Lowered to prevent crop
        targetZ = isMobile ? 0 : 1.2;     // Scaled down slightly to fit nicely
      } else if (scrollPercent >= 0.25 && scrollPercent < 0.60) {
        targetX = isMobile ? -1.0 : -1.6; // Hangar: Data on Right, Drone on Left
        targetY = isMobile ? 0.1 : 0.05;  // Position inside the workbench frame nicely
        targetZ = isMobile ? 0 : 1.2;
      } else {
        targetX = 0;
        targetY = 0.6;
        targetZ = 1.0;
      }

      const currentTargetX = THREE.MathUtils.lerp(-8.0, targetX, ease);
      const currentTargetY = THREE.MathUtils.lerp(1.5, targetY, ease);
      const currentTargetZ = THREE.MathUtils.lerp(-1.5, targetZ, ease);
      const currentScale = THREE.MathUtils.lerp(0.4, 1.15, ease);

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, currentTargetX, 0.045);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, currentTargetY, 0.045);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, currentTargetZ, 0.045);
      groupRef.current.scale.setScalar(currentScale);

      // Rotations
      const basePitch = Math.PI / 12; // tilted nose-down
      const baseYaw = -Math.PI / 3;   // beautiful 3/4 view angle
      const baseRoll = -Math.PI / 32; // slight side tilt

      const flyInRoll = (1 - ease) * -0.6;
      const flyInPitch = (1 - ease) * -0.1;
      const flyInYaw = (1 - ease) * 0.8;

      let targetRoll = baseRoll + (-mouseX * 0.45 * ease) + flyInRoll;
      if (groupRef.current.position.x < targetX) targetRoll += 0.15;
      else if (groupRef.current.position.x > targetX) targetRoll -= 0.15;

      const targetPitch = basePitch + (mouseY * 0.35 * ease) + flyInPitch;
      const targetYaw = baseYaw + baseRotationY - (scrollPercent * Math.PI * 0.6) + (mouseX * 0.2 * ease) + flyInYaw;

      // Stunt Roll Flip
      let stuntRoll = 0;
      if (barrelRollRef.current.active) {
        barrelRollRef.current.progress += 0.022; // Quick roll flip
        const rollP = barrelRollRef.current.progress;
        if (rollP >= 1) {
          barrelRollRef.current.active = false;
          barrelRollRef.current.progress = 0;
        } else {
          const easeFlip = Math.sin(rollP * Math.PI - Math.PI / 2) * 0.5 + 0.5;
          stuntRoll = easeFlip * Math.PI * 2;
        }
      }

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll + stuntRoll, 0.05);
    }

    // Spin Propellers (Hexacopter Loop)
    const spinFactor = barrelRollRef.current.active ? 2.8 : 1.2;
    propRefs.current.forEach((ref, index) => {
      if (ref) {
        if (index % 2 === 0) {
          ref.rotation.y += spinFactor;
        } else {
          ref.rotation.y -= spinFactor;
        }
      }
    });
  });

  return (
    <group 
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 1. CHASSIS CENTER */}
      <mesh geometry={geometries.chassisCenter}>
        <meshStandardMaterial color={mainChassisColor} metalness={0.7} roughness={0.35} />
      </mesh>

      {/* 2. DUAL SIDE-MOUNTED BATTERY PACKS */}
      {/* Left Battery */}
      <mesh geometry={geometries.battery} position={[-0.14, 0.07, -0.05]}>
        <meshStandardMaterial color="#16161A" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Right Battery */}
      <mesh geometry={geometries.battery} position={[0.14, 0.07, -0.05]}>
        <meshStandardMaterial color="#16161A" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Glowing Power Indicator lines */}
      <mesh position={[-0.14, 0.115, -0.05]} scale={[0.06, 0.005, 0.28]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#DFBA73" />
      </mesh>
      <mesh position={[0.14, 0.115, -0.05]} scale={[0.06, 0.005, 0.28]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#DFBA73" />
      </mesh>
      {/* Carbon battery tie strap bands */}
      <mesh position={[-0.14, 0.07, -0.05]} scale={[1.05, 1.05, 0.4]}>
        <boxGeometry args={[0.12, 0.08, 0.35]} />
        <meshStandardMaterial color={strapColor} roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh position={[0.14, 0.07, -0.05]} scale={[1.05, 1.05, 0.4]}>
        <boxGeometry args={[0.12, 0.08, 0.35]} />
        <meshStandardMaterial color={strapColor} roughness={0.65} metalness={0.1} />
      </mesh>

      {/* 3. FUTURISTIC STEALTH CANOPY SHELL */}
      <group position={[0, 0.08, 0.04]}>
        {/* Center angular ridge ridge */}
        <mesh scale={[1, 0.6, 1.3]}>
          <boxGeometry args={[0.22, 0.14, 0.45]} />
          <meshStandardMaterial color={canopyColor} metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Left faceted wing panel */}
        <mesh position={[-0.14, -0.01, 0.02]} rotation={[0, 0, Math.PI / 6]} scale={[1, 0.5, 1.1]}>
          <boxGeometry args={[0.08, 0.12, 0.38]} />
          <meshStandardMaterial color={mainChassisColor} metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Right faceted wing panel */}
        <mesh position={[0.14, -0.01, 0.02]} rotation={[0, 0, -Math.PI / 6]} scale={[1, 0.5, 1.1]}>
          <boxGeometry args={[0.08, 0.12, 0.38]} />
          <meshStandardMaterial color={mainChassisColor} metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Sloped front nose noseplate */}
        <mesh position={[0, 0.035, 0.22]} rotation={[Math.PI / 6, 0, 0]} scale={[1, 0.4, 0.8]}>
          <boxGeometry args={[0.2, 0.1, 0.2]} />
          <meshStandardMaterial color={canopyColor} metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Gold accent nose pinstripe */}
        <mesh position={[0, 0.05, 0.25]} rotation={[Math.PI / 6, 0, 0]} scale={[0.8, 0.05, 0.9]}>
          <boxGeometry args={[0.2, 0.01, 0.1]} />
          <meshStandardMaterial color={goldAccentColor} metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Gold trim lines on wings */}
        <mesh position={[-0.142, 0.01, 0.02]} rotation={[0, 0, Math.PI / 6]} scale={[1, 0.05, 1.1]}>
          <boxGeometry args={[0.082, 0.01, 0.382]} />
          <meshStandardMaterial color={goldAccentColor} metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.142, 0.01, 0.02]} rotation={[0, 0, -Math.PI / 6]} scale={[1, 0.05, 1.1]}>
          <boxGeometry args={[0.082, 0.01, 0.382]} />
          <meshStandardMaterial color={goldAccentColor} metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Cyber glowing status strips */}
        <mesh position={[-0.11, 0.04, 0.18]} scale={[0.015, 0.01, 0.12]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
        <mesh position={[0.11, 0.04, 0.18]} scale={[0.015, 0.01, 0.12]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>

        {/* TEAM MAVERICK LOGO DECAL ON TOP CENTER */}
        <mesh position={[0, 0.043, 0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.16, 0.22, 1.0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial 
            map={logoTexture} 
            transparent 
            roughness={0.2}
            metalness={0.1}
            depthWrite={true}
          />
        </mesh>
      </group>

      {/* 4. DIAGONAL ARMS (DUAL ROD CARBON TRUSS) */}
      {hexArms.map((arm) => (
        <group key={`arm-rods-${arm.id}`} position={[0, 0.025, 0]} rotation={[0, arm.angle, 0]}>
          {/* Top rod */}
          <mesh 
            geometry={geometries.armRod} 
            position={[0, 0, arm.armLength / 2]} 
            rotation={[Math.PI / 2, 0, 0]}
            scale={[1, arm.armLength, 1]}
          >
            <meshStandardMaterial color={armColor} metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Bottom rod */}
          <mesh 
            geometry={geometries.armRod} 
            position={[0, -0.05, arm.armLength / 2]} 
            rotation={[Math.PI / 2, 0, 0]}
            scale={[1, arm.armLength, 1]}
          >
            <meshStandardMaterial color={armColor} metalness={0.8} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* 5. ADVANCED TELEMETRY WINGLETS */}
      {/* Left rear fin */}
      <mesh position={[-0.14, 0.12, -0.2]} rotation={[Math.PI / 6, -Math.PI / 12, 0]}>
        <boxGeometry args={[0.008, 0.14, 0.08]} />
        <meshStandardMaterial color={mainChassisColor} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Right rear fin */}
      <mesh position={[0.14, 0.12, -0.2]} rotation={[Math.PI / 6, Math.PI / 12, 0]}>
        <boxGeometry args={[0.008, 0.14, 0.08]} />
        <meshStandardMaterial color={mainChassisColor} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 6. OBSTACLE AVOIDANCE SENSORS */}
      {/* Front sensor lenses */}
      <mesh geometry={geometries.sensorPod} position={[-0.08, 0.11, 0.22]}>
        <meshStandardMaterial color="#111113" metalness={0.9} roughness={0.08} />
      </mesh>
      <mesh geometry={geometries.sensorPod} position={[0.08, 0.11, 0.22]}>
        <meshStandardMaterial color="#111113" metalness={0.9} roughness={0.08} />
      </mesh>
      {/* Rear sensor pod */}
      <mesh geometry={geometries.sensorPod} position={[0, 0.1, -0.19]}>
        <meshStandardMaterial color="#111113" metalness={0.9} roughness={0.08} />
      </mesh>

      {/* 7. MOTORS, GUARDS & PROPELLERS LOOP */}
      {hexArms.map((arm, index) => (
        <group key={`motor-group-${arm.id}`} position={arm.motorPos}>
          {/* Motor Body */}
          <mesh geometry={geometries.motor}>
            <meshStandardMaterial color={metalColor} metalness={0.95} roughness={0.15} />
          </mesh>
          
          {/* Rotor Guard Ring */}
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.008, 8, 32]} />
            <meshStandardMaterial color={armColor} metalness={0.8} roughness={0.4} />
          </mesh>

          {/* Glowing Thruster Halo Ring */}
          <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.004, 6, 24]} />
            <meshBasicMaterial color={isDark ? "#00e5ff" : "#d4a348"} transparent opacity={0.6} />
          </mesh>

          {/* Copper winding accent ring inside motor */}
          <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.045, 0.005, 8, 24]} />
            <meshStandardMaterial color={windingColor} metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Propeller */}
          <group 
            ref={(el) => {
              propRefs.current[index] = el;
            }} 
            position={[0, 0.07, 0]}
          >
            <mesh geometry={geometries.propHub}>
              <meshStandardMaterial color={metalColor} metalness={0.8} />
            </mesh>
            <mesh geometry={geometries.propBlade} position={[0, 0.015, 0]}>
              <meshStandardMaterial color={rotorColor} transparent opacity={0.85} roughness={0.2} />
            </mesh>
          </group>

          {/* Navigation LED at the bottom of the motor */}
          <mesh position={[0, -0.03, 0]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial 
              color={arm.ledColor} 
              transparent={arm.ledColor === "#FFFFFF"}
              opacity={arm.ledColor === "#FFFFFF" ? (Math.sin(clock.getElapsedTime() * 8) > 0 ? 1 : 0.2) : 1}
            />
          </mesh>
        </group>
      ))}

      {/* 9. LANDING SKIDS & STRUTS */}
      {/* Struts FL & RL */}
      <mesh geometry={geometries.strut} position={[-0.18, -0.11, 0.2]} rotation={[0, 0, Math.PI / 12]}>
        <meshStandardMaterial color={armColor} metalness={0.7} />
      </mesh>
      <mesh geometry={geometries.strut} position={[-0.18, -0.11, -0.2]} rotation={[0, 0, Math.PI / 12]}>
        <meshStandardMaterial color={armColor} metalness={0.7} />
      </mesh>
      {/* Struts FR & RR */}
      <mesh geometry={geometries.strut} position={[0.18, -0.11, 0.2]} rotation={[0, 0, -Math.PI / 12]}>
        <meshStandardMaterial color={armColor} metalness={0.7} />
      </mesh>
      <mesh geometry={geometries.strut} position={[0.18, -0.11, -0.2]} rotation={[0, 0, -Math.PI / 12]}>
        <meshStandardMaterial color={armColor} metalness={0.7} />
      </mesh>
      {/* Skids */}
      <mesh geometry={geometries.skid} position={[-0.2, -0.2, 0]}>
        <meshStandardMaterial color="#2E3033" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh geometry={geometries.skid} position={[0.2, -0.2, 0]}>
        <meshStandardMaterial color="#2E3033" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 10. ADVANCED TRIPLE-LENS SENSOR TURRET */}
      <group position={[0, -0.06, 0.18]}>
        <mesh geometry={geometries.gimbalStrut} position={[0, -0.04, 0]}>
          <meshStandardMaterial color="#111113" metalness={0.9} />
        </mesh>
        {/* Futuristic Hexagonal Sensor Pod Body */}
        <mesh position={[0, -0.1, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 1.2, 1]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 6]} />
          <meshStandardMaterial color="#1E1E22" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glowing sensor band */}
        <mesh position={[0, -0.1, 0]} scale={[1.05, 0.15, 1.05]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 6]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        {/* Primary Optical Zoom Lens (Gold coated glass) */}
        <mesh geometry={geometries.gimbalLens} position={[-0.03, -0.11, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#DFBA73" metalness={0.95} roughness={0.05} />
        </mesh>
        {/* Secondary FLIR Thermal Infrared Lens (Red coated glass) */}
        <mesh geometry={geometries.gimbalLens} position={[0.03, -0.11, 0.055]} rotation={[Math.PI / 2, 0, 0]} scale={[0.8, 1.0, 0.8]}>
          <meshStandardMaterial color="#ff3333" metalness={0.95} roughness={0.05} />
        </mesh>
        {/* LiDAR / Rangefinder Lens (Cyan glass) */}
        <mesh geometry={geometries.gimbalLens} position={[0, -0.06, 0.05]} rotation={[Math.PI / 2, 0, 0]} scale={[0.6, 1.0, 0.6]}>
          <meshStandardMaterial color="#00ffff" metalness={0.95} roughness={0.05} />
        </mesh>
      </group>

      {/* 12. 3D CREW DIORAMA REMOVED */}
    </group>
  );
}

export default function HolographicUAV() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  const maxScroll = typeof window !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1000;
  const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

  // Determine fixed canvas opacity and z-index based on active section scroll bounds
  let opacityClass = "opacity-100 z-0";
  if (isMobile) {
    opacityClass = "opacity-40 z-0";
  } else {
    if (scrollPercent < 0.22) {
      opacityClass = "opacity-100 z-0";
    } else if (scrollPercent >= 0.22 && scrollPercent < 0.48) {
      opacityClass = "opacity-0 z-0 pointer-events-none"; // Faded out during wireframe interactive showcase
    } else if (scrollPercent >= 0.48 && scrollPercent < 0.60) {
      opacityClass = "opacity-100 z-0"; // Faded back in on the left for Virtual Hangar workbench
    } else {
      opacityClass = "opacity-0 z-0 pointer-events-none"; // Faded out for testimonials/sponsors
    }
  }

  return (
    <div className={`fixed inset-0 w-screen h-screen transition-all duration-500 pointer-events-none ${opacityClass}`}>
      <Canvas
        camera={{ position: [0, 1.8, 5.0], fov: 48 }}
        gl={{ antialias: true }}
        style={{ pointerEvents: "none" }}
      >
        <React.Suspense fallback={null}>
          <ambientLight intensity={isDark ? 0.6 : 1.3} />
          <hemisphereLight intensity={isDark ? 0.7 : 1.1} color="#ffffff" groundColor={isDark ? "#111115" : "#e2e8f0"} />
          <directionalLight 
            position={[8, 12, 8]} 
            intensity={isDark ? 3.5 : 4.5} 
            color="#ffffff" 
          />
          <pointLight 
            position={[-8, -6, -4]} 
            intensity={isDark ? 3.0 : 2.0} 
            color={isDark ? "#DFBA73" : "#F3F4F6"} 
          />
          <spotLight position={[0, 8, 4]} angle={0.5} penumbra={1} intensity={isDark ? 3 : 4} color="#FFFFFF" />
          
          <group rotation={[0, 0, 0]}>
            <DroneModel 
              mouseX={mouse.x} 
              mouseY={mouse.y} 
              scrollY={scrollY} 
              rotationSpeed={0.04}
            />
          </group>

          <ParticleField />
          <Environment preset="studio" />
        </React.Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-radial-glow" />

      {/* --- CINEMATIC INITIAL WHITEOUT OVERLAY --- */}
      <div 
        className={`fixed inset-0 bg-background z-50 transition-opacity ease-out pointer-events-none ${
          mounted ? "opacity-0" : "opacity-100"
        }`}
        style={{ transitionDuration: "1200ms" }}
      />
    </div>
  );
}
