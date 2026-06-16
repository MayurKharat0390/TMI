"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Hotspot {
  id: string;
  name: string;
  x: string; // % from left
  y: string; // % from top
  title: string;
  description: string;
  specs: string[];
}

const hotspots: Hotspot[] = [
  {
    id: "propulsion",
    name: "Propulsion",
    x: "50%",
    y: "18%",
    title: "Propulsion System",
    description: "High-torque brushless electric motors paired with custom carbon fiber propellers, engineered to produce max thrust for heavy lift payloads.",
    specs: ["BLDC Motor", "Carbon Fiber Propeller", "120A High-Performance ESC"],
  },
  {
    id: "wings",
    name: "Wings / Aero",
    x: "15%",
    y: "35%",
    title: "Aerodynamics & Wings",
    description: "High-lift airfoils designed for high payload-to-weight ratio. Optimized wingtip winglets minimize induced drag, extending range and battery efficiency.",
    specs: ["Wingspan: 72\"-180\"", "High-Lift Airfoil", "Optimized Winglets"],
  },
  {
    id: "fuselage",
    name: "Fuselage",
    x: "52%",
    y: "48%",
    title: "Fuselage & Chassis",
    description: "Monocoque composite carbon-fiber and balsa wood structure, combining structural rigidity and lightest empty weight to sustain extreme flight loads.",
    specs: ["Carbon-Composite Layup", "Balsa-Reinforced ribs", "Modular Nose Cone"],
  },
  {
    id: "avionics",
    name: "Avionics / Battery",
    x: "80%",
    y: "50%",
    title: "Avionics & Telemetry",
    description: "Integrated flight controller with real-time GPS telemetry, long-range RF receivers, and dual redundant power distribution systems.",
    specs: ["Pixhawk Flight Controller", "915MHz Telemetry link", "Redundant power rails"],
  },
  {
    id: "payload",
    name: "Payload System",
    x: "48%",
    y: "75%",
    title: "Mission Payload Bay",
    description: "Specialized modular payload release mechanism. Configured to carry and safely drop supply packages during disaster relief simulations.",
    specs: ["Servo-actuated drop mechanism", "Up to 16 kg cargo capacity", "Center-of-gravity aligned"],
  },
];

// Simple stationary wireframe model for the showcase
function StaticUAV() {
  return (
    <group rotation={[Math.PI / 4, Math.PI / 4, 0]}>
      <mesh>
        <cylinderGeometry args={[0.2, 0.05, 3.2, 8, 4]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[4.2, 0.04, 0.6]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh position={[-0.45, -0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.02, 1.8, 4]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.2} />
      </mesh>
      <mesh position={[0.45, -0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.02, 1.8, 4]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.3]} />
        <meshBasicMaterial color="#D4A348" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function UAVHotspots() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="relative w-full h-[500px] md:h-[650px] bg-black/40 border border-[#D4A348]/10 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* 3D Canvas in background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 4.5], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <StaticUAV />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* HTML Overlays for Hotspots */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => setSelectedHotspot(spot)}
            className="absolute p-2 pointer-events-auto group focus:outline-none"
            style={{ left: spot.x, top: spot.y, transform: "translate(-50%, -50%)" }}
          >
            {/* Glowing ring */}
            <span className="absolute inset-0 rounded-full bg-[#D4A348] opacity-20 scale-150 animate-ping group-hover:bg-yellow-400 group-hover:opacity-40" />
            <span className="relative flex items-center justify-center w-6 h-6 rounded-full border border-[#D4A348] bg-black/90 shadow-[0_0_12px_rgba(212,163,72,0.6)] group-hover:border-yellow-400 transition-colors duration-300">
              <span className="w-2 h-2 rounded-full bg-[#D4A348] group-hover:bg-yellow-400" />
            </span>
            {/* Small label */}
            <span className="absolute left-8 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-black/80 border border-[#D4A348]/20 text-xs font-semibold tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {spot.name}
            </span>
          </button>
        ))}
      </div>

      {/* Floating Glass Panel */}
      <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8 z-20 w-[90%] md:w-[380px] pointer-events-auto">
        <AnimatePresence mode="wait">
          {selectedHotspot ? (
            <motion.div
              key={selectedHotspot.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-black/80 backdrop-blur-xl border border-[#D4A348]/40 p-6 rounded-xl shadow-[0_0_25px_rgba(212,163,72,0.15)] text-white relative"
            >
              <button
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-[#D4A348] mb-2 tracking-wide font-montserrat">
                {selectedHotspot.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {selectedHotspot.description}
              </p>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Key Specifications
                </h4>
                <ul className="space-y-1">
                  {selectedHotspot.specs.map((spec, i) => (
                    <li key={i} className="text-xs flex items-center gap-2 text-gray-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A348]" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-md border border-[#D4A348]/20 p-4 rounded-xl text-center text-xs tracking-wider text-gray-300 shadow-lg"
            >
              <Info className="w-4 h-4 mx-auto mb-1.5 text-[#D4A348] animate-bounce" />
              CLICK ON THE GLOWING HOTSPOTS TO EXPLORE VEHICLE SYSTEMS
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
