"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  ChevronRight, 
  HelpCircle, 
  Navigation, 
  Compass,
  Volume2,
  VolumeX
} from "lucide-react";
import { Button } from "./ui/button";

interface TourStep {
  id: string;
  title: string;
  content: string;
  path: string;
  selector: string;
  droneOffset: { x: number; y: number };
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome aboard, Maverick!",
    content: "I am your automated flight assistant. I will guide you through the key sections of our telemetry and development hub.",
    path: "/",
    selector: "#hero-data",
    droneOffset: { x: 180, y: -100 },
  },
  {
    id: "hero",
    title: "Aviation Mission",
    content: "Our mission is to design, manufacture, and fly advanced autonomous UAVs. All design and fabrication are carried out by our team.",
    path: "/",
    selector: "#hero-data",
    droneOffset: { x: 180, y: -60 },
  },
  {
    id: "showcase",
    title: "Interactive 3D Showcase",
    content: "Interact with our custom hexacopter model! Rotate, hover, and click on hotspots to inspect structural systems.",
    path: "/",
    selector: "#showcase-section",
    droneOffset: { x: 220, y: -120 },
  },
  {
    id: "hangar",
    title: "Virtual Hangar Console",
    content: "Step inside our fabrication lab and inspect the 3D model placed inside the holographic workbench.",
    path: "/",
    selector: "#hangar-section",
    droneOffset: { x: -220, y: -60 },
  },
  {
    id: "planes",
    title: "Advanced Aircraft Fleet",
    content: "Explore the fleet directory! View our historical fixed-wing models, VTOL prototypes, and competition airframes.",
    path: "/planes",
    selector: "#planes-header",
    droneOffset: { x: 200, y: -80 },
  },
  {
    id: "team",
    title: "Meet the Sky Wolves",
    content: "Our team consists of aerodynamics, structural, avionics, and logistics departments. Filter through members by role and year.",
    path: "/team",
    selector: "#team-header",
    droneOffset: { x: 200, y: -80 },
  },
  {
    id: "team-filters",
    title: "Role & Year Filters",
    content: "Search for specific engineers or switch seasons to see our alumni and founding members.",
    path: "/team",
    selector: "#team-filters",
    droneOffset: { x: 220, y: -60 },
  },
  {
    id: "support",
    title: "Support Our Flight",
    content: "Learn how you can fund our research, material acquisition, and international competition travel.",
    path: "/support_us",
    selector: "#support-header",
    droneOffset: { x: 200, y: -80 },
  },
  {
    id: "contact",
    title: "Contact & Collaboration Hub",
    content: "Have questions, feedback, or sponsorship proposals? Get in touch with us here, we respond instantly!",
    path: "/contact",
    selector: "#contact-header",
    droneOffset: { x: 200, y: -80 },
  }
];

export default function MiniDroneTour() {
  const router = useRouter();
  const pathname = usePathname();

  const [active, setActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dronePos, setDronePos] = useState({ x: 0, y: 0 });
  const [resting, setResting] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const step = tourSteps[currentStepIndex];

  // Play audio sound effects
  const playBeep = (freq = 800, type: OscillatorType = "sine", duration = 0.08) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  // Check mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync state from localStorage on mount
  useEffect(() => {
    const savedActive = localStorage.getItem("maverick_tour_active") === "true";
    const savedStep = localStorage.getItem("maverick_tour_step");
    if (savedActive && savedStep) {
      setActive(true);
      setResting(false);
      setCurrentStepIndex(parseInt(savedStep, 10));
    }
  }, []);

  // Update drone position on scroll, resize, or step change
  useEffect(() => {
    if (resting || !active) {
      // Set to resting position (bottom right corner)
      if (typeof window !== "undefined") {
        setDronePos({
          x: window.innerWidth - (isMobile ? 70 : 100),
          y: window.innerHeight - (isMobile ? 120 : 150)
        });
      }
      return;
    }

    const updatePosition = () => {
      if (pathname !== step.path) {
        // Drone floats in the corner indicating destination page
        setDronePos({
          x: window.innerWidth - (isMobile ? 75 : 120),
          y: window.innerHeight / 2 - 100
        });
        return;
      }

      const el = document.querySelector(step.selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        
        // Calculate raw coords based on offset
        let x = rect.left + rect.width / 2 + step.droneOffset.x;
        let y = rect.top + rect.height / 2 + step.droneOffset.y;

        // Visual checks to keep drone within bounds
        const padX = isMobile ? 60 : 150;
        const padY = isMobile ? 100 : 150;
        x = Math.max(padX, Math.min(window.innerWidth - padX, x));
        y = Math.max(padY, Math.min(window.innerHeight - padY, y));

        setDronePos({ x, y });
      } else {
        // Fallback: Center-Right floating
        setDronePos({
          x: window.innerWidth - (isMobile ? 80 : 180),
          y: window.innerHeight / 2 - 50
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [active, resting, currentStepIndex, pathname, step, isMobile]);

  // Handle route change sync
  useEffect(() => {
    if (active && pathname === step.path) {
      setLoadingRoute(false);
      // Wait for layout rendering and scroll to element
      const timer = setTimeout(() => {
        const el = document.querySelector(step.selector);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pathname, active, step]);

  const startTour = () => {
    playBeep(900, "sine", 0.15);
    setActive(true);
    setResting(false);
    setCurrentStepIndex(0);
    setMenuOpen(false);
    localStorage.setItem("maverick_tour_active", "true");
    localStorage.setItem("maverick_tour_step", "0");

    // Scroll to first step if on home
    if (pathname === "/") {
      setTimeout(() => {
        const el = document.querySelector(tourSteps[0].selector);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
    } else {
      router.push("/");
    }
  };

  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextStep = tourSteps[nextIndex];
      playBeep(1000, "triangle", 0.08);

      setCurrentStepIndex(nextIndex);
      localStorage.setItem("maverick_tour_step", nextIndex.toString());

      if (pathname !== nextStep.path) {
        setLoadingRoute(true);
        router.push(nextStep.path);
      } else {
        // Scroll target into view
        setTimeout(() => {
          const el = document.querySelector(nextStep.selector);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    } else {
      // Tour completed
      endTour();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      const prevStep = tourSteps[prevIndex];
      playBeep(700, "triangle", 0.08);

      setCurrentStepIndex(prevIndex);
      localStorage.setItem("maverick_tour_step", prevIndex.toString());

      if (pathname !== prevStep.path) {
        setLoadingRoute(true);
        router.push(prevStep.path);
      } else {
        setTimeout(() => {
          const el = document.querySelector(prevStep.selector);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    }
  };

  const endTour = () => {
    playBeep(600, "sawtooth", 0.2);
    setActive(false);
    setResting(true);
    localStorage.removeItem("maverick_tour_active");
    localStorage.removeItem("maverick_tour_step");
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      // Trigger instant sound feedback to verify
      setTimeout(() => playBeep(1200, "sine", 0.1), 100);
    }
  };

  const handleRestingClick = () => {
    playBeep(850, "sine", 0.1);
    setMenuOpen(true);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[999]">
      
      {/* --- FLOATING MINI DRONE GRAPHIC --- */}
      <motion.div
        animate={{
          x: dronePos.x - 30, // center offset
          y: dronePos.y - 30,
        }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 18,
          mass: 0.8
        }}
        className="absolute w-16 h-16 pointer-events-auto cursor-pointer"
        style={{ originX: 0.5, originY: 0.5 }}
        onClick={resting ? handleRestingClick : undefined}
      >
        {/* Drone hover floating effect */}
        <motion.div
          animate={{
            y: [-4, 4, -4],
            rotateZ: resting ? [0, 0, 0] : [-1.5, 1.5, -1.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
        >
          {/* Mini Drone SVG Markup */}
          <svg viewBox="0 0 100 100" className="w-14 h-14 overflow-visible">
            {/* Hexacopter Carbon Chassis Arms */}
            {/* Rear-Left & Front-Right */}
            <line x1="20" y1="20" x2="80" y2="80" stroke="#1F2937" strokeWidth="6" strokeLinecap="round" />
            {/* Left & Right */}
            <line x1="10" y1="50" x2="90" y2="50" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
            {/* Front-Left & Rear-Right */}
            <line x1="20" y1="80" x2="80" y2="20" stroke="#1F2937" strokeWidth="6" strokeLinecap="round" />

            {/* Glowing Motors (Red/Green Front, White Rear) */}
            {/* Front-Left (top left in SVG orientation) */}
            <circle cx="20" cy="20" r="6" fill="#000" />
            <circle cx="20" cy="20" r="3.5" fill="#FF0055" className="animate-pulse" />
            
            {/* Front-Right */}
            <circle cx="80" cy="20" r="6" fill="#000" />
            <circle cx="80" cy="20" r="3.5" fill="#00FF66" className="animate-pulse" />
            
            {/* Side-Left */}
            <circle cx="10" cy="50" r="6.5" fill="#000" />
            <circle cx="10" cy="50" r="3.5" fill="#00E5FF" />
            
            {/* Side-Right */}
            <circle cx="90" cy="50" r="6.5" fill="#000" />
            <circle cx="90" cy="50" r="3.5" fill="#00E5FF" />

            {/* Rear-Left */}
            <circle cx="20" cy="80" r="6" fill="#000" />
            <circle cx="20" cy="80" r="3" fill="#FFFFFF" />

            {/* Rear-Right */}
            <circle cx="80" cy="80" r="6" fill="#000" />
            <circle cx="80" cy="80" r="3" fill="#FFFFFF" />

            {/* SPINNING PROPELLERS */}
            {/* Front-Left Propeller */}
            <g transform="translate(20, 20)">
              <ellipse rx="18" ry="2.5" fill="rgba(156, 163, 175, 0.4)" stroke="#9CA3AF" strokeWidth="0.5" className="origin-center" style={{ animation: "spin 0.25s linear infinite" }} />
              <circle cx="0" cy="0" r="2" fill="#D4A348" />
            </g>

            {/* Front-Right Propeller */}
            <g transform="translate(80, 20)">
              <ellipse rx="18" ry="2.5" fill="rgba(156, 163, 175, 0.4)" stroke="#9CA3AF" strokeWidth="0.5" className="origin-center" style={{ animation: "spin 0.25s linear infinite" }} />
              <circle cx="0" cy="0" r="2" fill="#D4A348" />
            </g>

            {/* Side-Left Propeller */}
            <g transform="translate(10, 50)">
              <ellipse rx="20" ry="2.5" fill="rgba(156, 163, 175, 0.4)" stroke="#9CA3AF" strokeWidth="0.5" className="origin-center" style={{ animation: "spin 0.2s linear infinite" }} />
              <circle cx="0" cy="0" r="2.5" fill="#D4A348" />
            </g>

            {/* Side-Right Propeller */}
            <g transform="translate(90, 50)">
              <ellipse rx="20" ry="2.5" fill="rgba(156, 163, 175, 0.4)" stroke="#9CA3AF" strokeWidth="0.5" className="origin-center" style={{ animation: "spin 0.2s linear infinite" }} />
              <circle cx="0" cy="0" r="2.5" fill="#D4A348" />
            </g>

            {/* Rear-Left Propeller */}
            <g transform="translate(20, 80)">
              <ellipse rx="18" ry="2.5" fill="rgba(156, 163, 175, 0.4)" stroke="#9CA3AF" strokeWidth="0.5" className="origin-center" style={{ animation: "spin 0.3s linear infinite" }} />
              <circle cx="0" cy="0" r="2" fill="#D4A348" />
            </g>

            {/* Rear-Right Propeller */}
            <g transform="translate(80, 80)">
              <ellipse rx="18" ry="2.5" fill="rgba(156, 163, 175, 0.4)" stroke="#9CA3AF" strokeWidth="0.5" className="origin-center" style={{ animation: "spin 0.3s linear infinite" }} />
              <circle cx="0" cy="0" r="2" fill="#D4A348" />
            </g>

            {/* STEALTH DRONE CENTER CANOPY BODY */}
            <polygon points="50,22 68,36 68,64 50,78 32,64 32,36" fill="#1E1E22" stroke="#D4A348" strokeWidth="2.5" />
            {/* Glowing status plate */}
            <polygon points="50,30 62,40 62,60 50,70 38,60 38,40" fill="#2E3033" />
            <circle cx="50" cy="50" r="6" fill="#00E5FF" className="animate-pulse" />
            <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />
            
            {/* Swept-back small tail winglets */}
            <polygon points="50,78 45,92 50,86 55,92" fill="#D4A348" />
          </svg>

          {/* Rotary Spin CSS Inject */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}} />

          {/* Resting status ring */}
          {resting && (
            <span className="absolute inset-0 rounded-full border border-dashed border-[#DFBA73]/50 animate-spin opacity-50" style={{ animationDuration: "12s" }} />
          )}
        </motion.div>
        
        {/* Help Badge on resting state */}
        {resting && !menuOpen && (
          <div className="absolute -top-1 -right-1 bg-[#DFBA73] text-black w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] border border-black shadow-[0_0_8px_#DFBA73]">
            ?
          </div>
        )}
      </motion.div>

      {/* --- INACTIVE / RESTING GUIDE PROMPT --- */}
      <AnimatePresence>
        {resting && !menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute p-2.5 bg-black/85 border border-[#DFBA73]/30 backdrop-blur-md rounded-xl text-white pointer-events-auto shadow-2xl"
            style={{
              right: isMobile ? 80 : 170,
              bottom: isMobile ? 32 : 44,
              maxWidth: "200px"
            }}
          >
            <p className="text-[11px] font-semibold text-[#DFBA73] tracking-wide mb-1 flex items-center gap-1.5 font-montserrat">
              <Compass className="w-3.5 h-3.5 animate-pulse" />
              FLIGHT ASSISTANT
            </p>
            <p className="text-[10px] text-gray-300 leading-relaxed mb-2 font-medium">Click me to start a guided tour of the sky wolves hub!</p>
            <button
              onClick={startTour}
              className="text-[9px] font-bold text-black bg-[#DFBA73] px-2.5 py-1 rounded hover:bg-[#DFBA73]/90 transition-colors uppercase tracking-widest block w-full text-center"
            >
              Start Tour
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- RESTING MISSION CONTROL MENU --- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Click-out backdrop */}
            <div 
              className="fixed inset-0 pointer-events-auto bg-black/45 backdrop-blur-xs z-[997]" 
              onClick={() => { playBeep(500, "sine", 0.05); setMenuOpen(false); }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="fixed z-[998] pointer-events-auto glass-panel border border-[#DFBA73]/30 bg-black/95 dark:bg-black/90 p-5 rounded-2xl text-white shadow-2xl w-full max-w-sm"
              style={{
                right: isMobile ? "12px" : "40px",
                bottom: isMobile ? "90px" : "110px",
              }}
            >
              <div className="flex items-center justify-between border-b border-[#DFBA73]/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#DFBA73] animate-spin" style={{ animationDuration: "10s" }} />
                  <span className="font-montserrat font-bold text-xs uppercase tracking-widest text-[#DFBA73]">Mission Console</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleSound}
                    className="p-1 rounded hover:bg-[#DFBA73]/10 text-gray-400 hover:text-white transition-colors"
                    title={soundEnabled ? "Disable Sound" : "Enable Sound"}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => { playBeep(500, "sine", 0.05); setMenuOpen(false); }}
                    className="p-1 rounded hover:bg-[#DFBA73]/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Select Flight Mode:</p>
                
                <button
                  onClick={startTour}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-[#DFBA73]/20 bg-[#DFBA73]/10 hover:bg-[#DFBA73]/20 text-white transition-all text-left group"
                >
                  <div>
                    <p className="text-xs font-bold text-[#DFBA73] group-hover:translate-x-1 transition-transform">Full Guided Site Tour</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Let the drone fly you through all key sections.</p>
                  </div>
                  <Play className="w-4 h-4 text-[#DFBA73]" />
                </button>

                <div className="h-px bg-border/40 dark:bg-white/5 my-3" />
                
                <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Fly Directly To:</p>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setActive(true);
                      setResting(false);
                      setCurrentStepIndex(1); // Hero
                      localStorage.setItem("maverick_tour_active", "true");
                      localStorage.setItem("maverick_tour_step", "1");
                      if (pathname !== "/") router.push("/");
                    }}
                    className="p-2 rounded bg-white/5 border border-white/5 hover:border-[#DFBA73]/30 hover:bg-[#DFBA73]/5 text-[10px] font-semibold text-gray-300 text-left transition-colors truncate"
                  >
                    Home Mission
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setActive(true);
                      setResting(false);
                      setCurrentStepIndex(2); // Showcase
                      localStorage.setItem("maverick_tour_active", "true");
                      localStorage.setItem("maverick_tour_step", "2");
                      if (pathname !== "/") router.push("/");
                    }}
                    className="p-2 rounded bg-white/5 border border-white/5 hover:border-[#DFBA73]/30 hover:bg-[#DFBA73]/5 text-[10px] font-semibold text-gray-300 text-left transition-colors truncate"
                  >
                    3D Showcase
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setActive(true);
                      setResting(false);
                      setCurrentStepIndex(3); // Hangar
                      localStorage.setItem("maverick_tour_active", "true");
                      localStorage.setItem("maverick_tour_step", "3");
                      if (pathname !== "/") router.push("/");
                    }}
                    className="p-2 rounded bg-white/5 border border-white/5 hover:border-[#DFBA73]/30 hover:bg-[#DFBA73]/5 text-[10px] font-semibold text-gray-300 text-left transition-colors truncate"
                  >
                    Virtual Hangar
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setActive(true);
                      setResting(false);
                      setCurrentStepIndex(4); // Planes
                      localStorage.setItem("maverick_tour_active", "true");
                      localStorage.setItem("maverick_tour_step", "4");
                      if (pathname !== "/planes") router.push("/planes");
                    }}
                    className="p-2 rounded bg-white/5 border border-white/5 hover:border-[#DFBA73]/30 hover:bg-[#DFBA73]/5 text-[10px] font-semibold text-gray-300 text-left transition-colors truncate"
                  >
                    Aircraft Fleet
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setActive(true);
                      setResting(false);
                      setCurrentStepIndex(5); // Team
                      localStorage.setItem("maverick_tour_active", "true");
                      localStorage.setItem("maverick_tour_step", "5");
                      if (pathname !== "/team") router.push("/team");
                    }}
                    className="p-2 rounded bg-white/5 border border-white/5 hover:border-[#DFBA73]/30 hover:bg-[#DFBA73]/5 text-[10px] font-semibold text-gray-300 text-left transition-colors truncate"
                  >
                    Sky Wolves Crew
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setActive(true);
                      setResting(false);
                      setCurrentStepIndex(7); // Support
                      localStorage.setItem("maverick_tour_active", "true");
                      localStorage.setItem("maverick_tour_step", "7");
                      if (pathname !== "/support_us") router.push("/support_us");
                    }}
                    className="p-2 rounded bg-white/5 border border-white/5 hover:border-[#DFBA73]/30 hover:bg-[#DFBA73]/5 text-[10px] font-semibold text-gray-300 text-left transition-colors truncate"
                  >
                    Support Hub
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- ACTIVE TOUR DIALOG SPEECH BUBBLE --- */}
      <AnimatePresence>
        {active && !resting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              // Float speech bubble near the drone
              x: isMobile 
                ? (window.innerWidth - 270) / 2  // center on mobile screen
                : Math.max(20, Math.min(window.innerWidth - 360, dronePos.x + (step.droneOffset.x > 0 ? -370 : 60))),
              y: isMobile
                ? window.innerHeight - 230  // keep at bottom on mobile
                : Math.max(20, Math.min(window.innerHeight - 250, dronePos.y - 60))
            }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 18
            }}
            className="fixed z-[996] pointer-events-auto p-4 rounded-2xl border border-[#DFBA73]/30 bg-black/90 dark:bg-black/85 backdrop-blur-md shadow-2xl text-white font-jost"
            style={{
              width: isMobile ? "270px" : "320px"
            }}
          >
            {/* Tech scanning HUD overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px] rounded-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#DFBA73]/20 pb-2 mb-2.5">
              <span className="text-[10px] font-bold text-[#DFBA73] uppercase tracking-[0.2em] flex items-center gap-1.5 font-montserrat">
                <Navigation className="w-3 h-3 animate-pulse" />
                Step {currentStepIndex + 1} of {tourSteps.length}
              </span>
              <button 
                onClick={endTour}
                className="text-gray-400 hover:text-[#DFBA73] transition-colors p-0.5 rounded hover:bg-white/5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-xs font-extrabold uppercase tracking-wide text-white mb-1.5 font-montserrat">{step.title}</h4>
            
            {loadingRoute ? (
              <div className="py-4 text-center">
                <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#DFBA73] animate-spin mx-auto mb-2" />
                <p className="text-[9px] uppercase tracking-wider text-gray-400">Flying to {step.path}...</p>
              </div>
            ) : (
              <>
                <p className="text-[11px] text-gray-300 leading-relaxed text-justify mb-4">
                  {pathname !== step.path ? (
                    <span>Let's navigate over to our <strong>{step.path.replace("_", " ").replace("/", "").toUpperCase()}</strong> page. Ready for takeoff?</span>
                  ) : (
                    step.content
                  )}
                </p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    disabled={currentStepIndex === 0}
                    className="text-[9px] font-extrabold text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors uppercase tracking-widest flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={endTour}
                      variant="ghost"
                      className="h-7 px-2.5 text-[9px] text-gray-400 hover:text-white uppercase tracking-widest border border-white/5 hover:bg-white/5 rounded"
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={handleNext}
                      size="sm"
                      className="h-7 bg-[#DFBA73] hover:bg-[#DFBA73]/90 text-black font-bold text-[9px] uppercase tracking-widest rounded flex items-center gap-1"
                    >
                      {pathname !== step.path ? (
                        <>Takeoff <Navigation className="w-2.5 h-2.5 rotate-45" /></>
                      ) : currentStepIndex === tourSteps.length - 1 ? (
                        <>Finish <X className="w-2.5 h-2.5" /></>
                      ) : (
                        <>Next <ArrowRight className="w-2.5 h-2.5" /></>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
