"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, X } from "lucide-react";
import dynamic from "next/dynamic";

// Client-only dynamic import of the 3D Canvas component to prevent Next.js SSR crashes
const MiniDrone3D = dynamic(() => import("./mini-drone-3d"), { ssr: false });

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
                suppressHydrationWarning
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
          <MiniDrone3D isHovered={isHovered} scrollY={scrollY} />
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
