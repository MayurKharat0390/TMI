"use client";

import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Info, X, Zap, Cpu, Activity, Disc, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTheme } from "next-themes";

interface Hotspot {
  id: string;
  name: string;
  position: [number, number, number]; // 3D coordinates
  title: string;
  description: string;
  specs: string[];
}

const aircraftData: Record<
  string,
  {
    name: string;
    tagline: string;
    description: string;
    specs: { label: string; value: string }[];
    hotspots: Hotspot[];
  }
> = {
  mohav: {
    name: "Mohav-II",
    tagline: "Heavy-Cargo Competitor UAV",
    description:
      "Designed for international flight competitions, featuring a robust twin-boom configuration optimized for high load capacity and heavy cargo release drop missions.",
    specs: [
      { label: "Wingspan", value: "3.2 meters" },
      { label: "Empty Weight", value: "7.8 kg" },
      { label: "Max Payload", value: "12.0 kg" },
      { label: "Flight Time", value: "45 minutes" },
    ],
    hotspots: [
      {
        id: "m_propulsion",
        name: "Pusher Propulsion",
        position: [0, -0.6, 0.25],
        title: "Pusher Propulsion",
        description:
          "A rear-mounted high-torque motor configuration that maximizes aerodynamic flow over the fuselage, improving cruise efficiency.",
        specs: ["T-Motor U8 Lite Motor", "22\" Pusher Propeller", "120A Flame ESC"],
      },
      {
        id: "m_wing",
        name: "High-Lift Main Wing",
        position: [1.8, 0.4, 0],
        title: "High-Lift Wing Surface",
        description:
          "Optimized high-lift airfoil sections designed to sustain flight at heavy payloads, equipped with carbon-spar reinforcing.",
        specs: ["Balsa ribs with carbon spar", "Selig 1223 high-lift airfoil", "Dual-actuated large area flaps"],
      },
      {
        id: "m_avionics",
        name: "Avionics Core",
        position: [0, 0, 0.25],
        title: "Avionics & Telemetry",
        description:
          "Contains the primary autopilot flight computer, redundant receivers, and sensor suite.",
        specs: ["Pixhawk 6X Autopilot", "Here 3+ RTK GPS", "915MHz Telemetry Module"],
      },
      {
        id: "m_payload",
        name: "Payload Release System",
        position: [0, 0.7, -0.2],
        title: "Mission Payload Bay",
        description:
          "Designed with a servo-actuated drop mechanism to deploy survival kits or target packages during simulation tasks.",
        specs: ["Automatic drop triggering", "Carbon composite payload box", "Adjustable CG rails"],
      },
      {
        id: "m_booms",
        name: "Twin-Boom Tail",
        position: [0.45, -1.3, 0],
        title: "Carbon Tail Booms",
        description:
          "Dual carbon fiber booms connecting the main wing section to the horizontal and vertical stabilizers, reducing torsion.",
        specs: ["30mm carbon tubes", "CNC aluminum mounts", "Dual rudder linkage"],
      },
    ],
  },
  vayutej: {
    name: "Vayutej",
    tagline: "High-Speed Aerodynamic Trainer",
    description:
      "Built for speed and precision, Vayutej features a clean tractor-propeller design with single fuselage, providing outstanding stability and agile flight dynamics.",
    specs: [
      { label: "Wingspan", value: "2.4 meters" },
      { label: "Empty Weight", value: "4.5 kg" },
      { label: "Max Speed", value: "120 km/h" },
      { label: "Flight Time", value: "30 minutes" },
    ],
    hotspots: [
      {
        id: "v_propulsion",
        name: "Tractor Propulsion",
        position: [0, 1.45, 0.0],
        title: "Tractor Propulsion System",
        description:
          "Front-mounted brushless motor and propeller setup, optimized for rapid acceleration and consistent airflow over control surfaces.",
        specs: ["Brushless Motor 5050", "15x8 APC Propeller", "80A ESC with Active Braking"],
      },
      {
        id: "v_wing",
        name: "Swept-Back Wing",
        position: [1.3, 0.3, 0],
        title: "Sleek High-Speed Wing",
        description:
          "A low-drag main wing sweeping back to optimize lift distribution and lateral stability at high cruise speeds.",
        specs: ["Fully sheeted balsa wing", "Semi-symmetrical Clark Y airfoil", "Integrated high-speed ailerons"],
      },
      {
        id: "v_avionics",
        name: "Integrated Autopilot",
        position: [0, 0.2, 0.2],
        title: "Canopy Avionics Hatch",
        description:
          "Quick-release canopy hatch housing the flight controller and battery pack, allowing rapid swaps between heats.",
        specs: ["Pixhawk Cube Orange", "RFD900x Ultra-Long Telemetry", "Quick-swap battery tray"],
      },
      {
        id: "v_tail",
        name: "T-Tail Elevator",
        position: [0, -1.3, 0.35],
        title: "Conventional T-Tail Assembly",
        description:
          "Raised horizontal stabilizer to keep the control surfaces in clean air, avoiding the wake of the wing and propeller.",
        specs: ["High-authority elevator", "Oversized vertical stabilizer", "CNC-horn linkages"],
      },
    ],
  },
  daredevil: {
    name: "Daredevil VTOL",
    tagline: "Hybrid Vertical Take-off & Cruise",
    description:
      "Combining the vertical takeoff flexibility of a multirotor with the long-range cruise efficiency of a fixed-wing aircraft.",
    specs: [
      { label: "Wingspan", value: "2.8 meters" },
      { label: "Empty Weight", value: "9.2 kg" },
      { label: "Multirotor Thrust", value: "24.0 kg" },
      { label: "Flight Time", value: "50 minutes" },
    ],
    hotspots: [
      {
        id: "d_vtol",
        name: "VTOL Lift Rotors",
        position: [0.8, 0.4, 0.15],
        title: "Quad Vertical Lift System",
        description:
          "Four brushless lift motors mounted on carbon booms run vertically to provide vertical takeoff, hovering, and landing.",
        specs: ["4x 4114 Brushless Motors", "16\" Carbon Lift Propellers", "Independent quad-motor ESCs"],
      },
      {
        id: "d_pusher",
        name: "Cruise Pusher Motor",
        position: [0, -1.0, 0.25],
        title: "Cruise Propulsion System",
        description:
          "A rear-mounted motor that activates during transition to provide forward thrust, allowing the wing to generate lift.",
        specs: ["T-Motor U10 Cruise Motor", "18\" Folding Propeller", "Autonomous transition logic"],
      },
      {
        id: "d_transition",
        name: "Transition Controller",
        position: [0, 0.1, 0.25],
        title: "Transition Flight Controller",
        description:
          "Advanced flight control algorithms coordinating the transition between vertical hover and horizontal winged flight.",
        specs: ["ArduPlane VTOL Autopilot", "Airspeed Sensor integration", "Redundant barometers"],
      },
      {
        id: "d_tilt",
        name: "Main Wing Surface",
        position: [1.6, 0.3, 0],
        title: "Fixed-Wing Lift System",
        description:
          "Thick airfoil wings providing the main lift during forward flight, allowing the VTOL lift motors to completely shut down to conserve energy.",
        specs: ["Carbon-fiber composite D-box", "MH-32 transition airfoil", "High-torque metal gear servos"],
      },
    ],
  },
};

// 3D Procedural UAV Model rendering different geometries based on type
function InteractiveUAV({
  type,
  onHotspotClick,
  activeHotspotId,
}: {
  type: string;
  onHotspotClick: (spot: Hotspot) => void;
  activeHotspotId: string | undefined;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mainPropRef = useRef<THREE.Mesh>(null);
  const liftPropRefs = useRef<(THREE.Mesh | null)[]>([]);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const wireframeColor = isDark ? "#DFBA73" : "#1E3A8A";
  const accentWireframeColor = isDark ? "#00E5FF" : "#0066FF";

  // Spin propellers
  useFrame((state) => {
    if (mainPropRef.current) {
      mainPropRef.current.rotation.x += 0.8;
    }
    liftPropRefs.current.forEach((prop) => {
      if (prop) {
        prop.rotation.z += 1.2;
      }
    });
  });

  const currentUav = aircraftData[type];

  // Helper to render HTML Hotspot in 3D
  const renderHotspotHtml = (spot: Hotspot) => {
    const isActive = activeHotspotId === spot.id;
    return (
      <Html key={spot.id} position={spot.position} distanceFactor={5} center>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHotspotClick(spot);
          }}
          className="relative flex items-center justify-center p-2 focus:outline-none pointer-events-auto group"
        >
          {/* Animated ping ring */}
          <span
            className={`absolute inset-0 rounded-full bg-[#DFBA73] opacity-25 scale-150 animate-ping group-hover:bg-yellow-400`}
          />
          <span
            className={`relative flex items-center justify-center w-6 h-6 rounded-full border bg-black/90 transition-all duration-300 ${
              isActive
                ? "border-yellow-400 scale-110 shadow-[0_0_15px_rgba(212,163,72,0.8)]"
                : "border-[#DFBA73] shadow-[0_0_10px_rgba(212,163,72,0.4)]"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                isActive ? "bg-yellow-400" : "bg-[#DFBA73] group-hover:bg-yellow-400"
              }`}
            />
          </span>
          {/* Hotspot label */}
          <span className="absolute left-8 px-2 py-0.5 rounded bg-black/85 border border-[#DFBA73]/20 text-[9px] font-bold tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {spot.name}
          </span>
        </button>
      </Html>
    );
  };

  return (
    <group ref={groupRef}>
      {/* --- MODEL 1: MOHAV-II (Twin-Boom Pusher) --- */}
      {type === "mohav" && (
        <group>
          {/* Main Fuselage */}
          <mesh>
            <cylinderGeometry args={[0.2, 0.05, 2.6, 8, 4]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <coneGeometry args={[0.2, 0.4, 8]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.4} />
          </mesh>

          {/* Main Wing */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[4.2, 0.04, 0.6]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>

          {/* Twin Booms */}
          <mesh position={[-0.45, -0.4, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.02, 1.8, 4]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.2} />
          </mesh>
          <mesh position={[0.45, -0.4, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.02, 1.8, 4]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.2} />
          </mesh>

          {/* Tail assembly */}
          <mesh position={[0, -1.3, 0]}>
            <boxGeometry args={[1.1, 0.02, 0.3]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>
          <mesh position={[-0.45, -1.2, 0.1]}>
            <boxGeometry args={[0.02, 0.35, 0.2]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>
          <mesh position={[0.45, -1.2, 0.1]}>
            <boxGeometry args={[0.02, 0.35, 0.2]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>

          {/* Pusher Propeller (Spinning) */}
          <mesh ref={mainPropRef} position={[0, -1.35, 0]}>
            <boxGeometry args={[1.0, 0.02, 0.05]} />
            <meshBasicMaterial color={wireframeColor} />
          </mesh>
        </group>
      )}

      {/* --- MODEL 2: VAYUTEJ (Tractor Single Engine) --- */}
      {type === "vayutej" && (
        <group>
          {/* Main Fuselage */}
          <mesh>
            <cylinderGeometry args={[0.16, 0.04, 2.8, 8, 4]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <coneGeometry args={[0.16, 0.3, 8]} />
            <meshBasicMaterial color={accentWireframeColor} wireframe transparent opacity={0.5} />
          </mesh>

          {/* Main Wing */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[3.6, 0.03, 0.5]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>

          {/* Tail vertical fin & Horizontal stabilizer */}
          <mesh position={[0, -1.3, 0]}>
            <boxGeometry args={[0.9, 0.02, 0.25]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>
          <mesh position={[0, -1.2, 0.1]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.25, 0.4, 0.02]} />
            <meshBasicMaterial color={accentWireframeColor} wireframe transparent opacity={0.4} />
          </mesh>

          {/* Tractor Propeller (Front Spinning) */}
          <mesh ref={mainPropRef} position={[0, 1.58, 0]}>
            <boxGeometry args={[0.9, 0.02, 0.04]} />
            <meshBasicMaterial color={accentWireframeColor} />
          </mesh>
        </group>
      )}

      {/* --- MODEL 3: DAREDEVIL (Hybrid VTOL) --- */}
      {type === "daredevil" && (
        <group>
          {/* Main Fuselage */}
          <mesh>
            <cylinderGeometry args={[0.22, 0.06, 2.6, 8, 4]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>

          {/* Main Wing */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[3.8, 0.04, 0.6]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>

          {/* Quad Booms */}
          <mesh position={[-0.8, -0.1, 0.05]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.04, 1.8, 0.04]} />
            <meshBasicMaterial color={accentWireframeColor} wireframe transparent opacity={0.3} />
          </mesh>
          <mesh position={[0.8, -0.1, 0.05]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.04, 1.8, 0.04]} />
            <meshBasicMaterial color={accentWireframeColor} wireframe transparent opacity={0.3} />
          </mesh>

          {/* Four lift props */}
          {[
            [-0.8, 0.8, 0.1],
            [-0.8, -1.0, 0.1],
            [0.8, 0.8, 0.1],
            [0.8, -1.0, 0.1],
          ].map((pos, idx) => (
            <group key={idx} position={pos as [number, number, number]}>
              <mesh>
                <cylinderGeometry args={[0.03, 0.03, 0.1, 4]} />
                <meshBasicMaterial color={wireframeColor} />
              </mesh>
              {/* Spinning prop */}
              <mesh
                ref={(el) => {
                  liftPropRefs.current[idx] = el;
                }}
                position={[0, 0, 0.06]}
              >
                <boxGeometry args={[0.4, 0.015, 0.02]} />
                <meshBasicMaterial color={accentWireframeColor} />
              </mesh>
            </group>
          ))}

          {/* Tail Horizontal assembly */}
          <mesh position={[0, -1.2, 0.1]}>
            <boxGeometry args={[1.5, 0.02, 0.3]} />
            <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
          </mesh>

          {/* Pusher Cruise Prop (Spinning) */}
          <mesh ref={mainPropRef} position={[0, -1.35, 0]}>
            <boxGeometry args={[0.9, 0.02, 0.04]} />
            <meshBasicMaterial color={wireframeColor} />
          </mesh>
        </group>
      )}

      {/* Render 3D-attached HTML hotspots */}
      {currentUav.hotspots.map((spot) => renderHotspotHtml(spot))}
    </group>
  );
}

export default function UAVHotspots() {
  const [selectedAircraft, setSelectedAircraft] = useState("mohav");
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Clear selected hotspot when changing aircraft
  const handleAircraftChange = (type: string) => {
    setSelectedAircraft(type);
    setSelectedHotspot(null);
  };

  const currentUav = aircraftData[selectedAircraft];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch w-full max-w-6xl mx-auto px-4 md:px-0">
      {/* Left: Aircraft Selector Hangar Panel */}
      <div className="w-full lg:w-[280px] bg-card/70 dark:bg-black/50 border border-[#DFBA73]/20 p-6 rounded-2xl flex flex-col gap-6 backdrop-blur-md shadow-2xl relative z-20">
        <div className="flex items-center gap-2 border-b border-[#DFBA73]/20 pb-3">
          <Activity className="w-4 h-4 text-[#DFBA73]" />
          <h3 className="font-mono text-xs font-bold tracking-widest text-[#DFBA73] uppercase">
            Hangar Selector
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {Object.keys(aircraftData).map((key) => {
            const isActive = selectedAircraft === key;
            return (
              <button
                key={key}
                onClick={() => handleAircraftChange(key)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 font-mono ${
                  isActive
                    ? "bg-[#DFBA73]/10 border-[#DFBA73] text-foreground dark:text-white shadow-[0_0_15px_rgba(212,163,72,0.1)]"
                    : "bg-background/40 dark:bg-black/60 border-border dark:border-white/5 text-muted-foreground dark:text-white/50 hover:border-foreground/25 dark:hover:border-white/20 hover:text-foreground dark:hover:text-white"
                }`}
              >
                <div>
                  <div className="font-bold uppercase text-xs tracking-wider">
                    {aircraftData[key].name}
                  </div>
                  <div className="text-[9px] opacity-70 mt-0.5">
                    {key === "daredevil" ? "Hybrid VTOL" : "Fixed-Wing"}
                  </div>
                </div>
                {isActive && <Target className="w-4 h-4 text-[#DFBA73] animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* Specifications panel */}
        <div className="mt-auto border-t border-[#DFBA73]/10 pt-4 flex flex-col gap-3">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Hangar Specifications
          </div>
          <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
            {currentUav.specs.map((spec, i) => (
              <div key={i} className="flex flex-col bg-accent/40 dark:bg-white/5 p-2.5 rounded border border-border dark:border-white/5">
                <span className="text-muted-foreground uppercase">{spec.label}</span>
                <span className="text-foreground font-bold mt-0.5">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle: 3D Hangar Canvas (Full pointer interaction) */}
      <div className="flex-1 h-[450px] lg:h-[600px] bg-gradient-to-b from-slate-100 to-slate-50 dark:from-black/60 dark:to-black/20 border border-[#DFBA73]/15 rounded-2xl overflow-hidden backdrop-blur-md relative shadow-2xl">
        {/* Title HUD Overlay inside canvas frame */}
        <div className="absolute top-4 left-4 z-20 font-mono text-[9px] text-[#DFBA73]/70 flex items-center gap-2 pointer-events-none">
          <Disc className="w-3.5 h-3.5 animate-spin" />
          <span>ROTATING 3D SCHEMATIC MODEL // ORBIT_CONTROL: ACTIVE</span>
        </div>

        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 2.2, 4.8], fov: 55 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[6, 6, 6]} intensity={1.5} />
            
            <group rotation={[Math.PI / 3.2, 0, 0]}>
              <InteractiveUAV
                type={selectedAircraft}
                onHotspotClick={(spot) => setSelectedHotspot(spot)}
                activeHotspotId={selectedHotspot?.id}
              />
            </group>
            
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
          </Canvas>
        </div>

        {/* Center pointer HUD Bracket decorations */}
        <div className="absolute inset-x-8 inset-y-8 border border-white/5 pointer-events-none rounded">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#DFBA73]/30" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#DFBA73]/30" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#DFBA73]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#DFBA73]/30" />
        </div>
      </div>

      {/* Right: Technical Diagnostic Info Panel */}
      <div className="w-full lg:w-[320px] pointer-events-auto relative z-20 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {selectedHotspot ? (
            <motion.div
              key={selectedHotspot.id}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="bg-card/90 dark:bg-black/85 backdrop-blur-xl border border-yellow-500/30 p-6 rounded-2xl shadow-[0_0_25px_rgba(212,163,72,0.15)] text-foreground dark:text-white h-full flex flex-col"
            >
              <div className="flex justify-between items-start border-b border-[#DFBA73]/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400">
                    DIAGNOSTIC DATA
                  </span>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-extrabold text-[#DFBA73] mb-2 tracking-wide font-montserrat uppercase">
                {selectedHotspot.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-light">
                {selectedHotspot.description}
              </p>

              <div className="mt-auto">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-3 font-mono">
                  Core Modules & Components
                </h4>
                <ul className="space-y-2">
                  {selectedHotspot.specs.map((spec, i) => (
                    <li
                      key={i}
                      className="text-xs font-mono flex items-start gap-2 text-foreground bg-accent/40 dark:bg-white/5 p-2 rounded border border-border dark:border-white/5"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#DFBA73] mt-0.5 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card/60 dark:bg-black/55 backdrop-blur-md border border-[#DFBA73]/15 p-6 rounded-2xl text-center flex flex-col justify-center items-center h-full gap-4 text-xs tracking-wider text-muted-foreground shadow-xl border-dashed"
            >
              <div className="w-10 h-10 rounded-full border border-[#DFBA73]/30 flex items-center justify-center bg-[#DFBA73]/5">
                <Info className="w-5 h-5 text-[#DFBA73]" />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1 uppercase tracking-widest font-mono">
                  Diagnostics Offline
                </h4>
                <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-mono max-w-[200px] mx-auto">
                  CLICK ON THE GLOWING HOTSPOTS MOUNTED ON THE 3D MODEL TO LOAD DETAILED COMPONENT SYSTEMS.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
