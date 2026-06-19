"use client";

import StarryBackground from "@/components/StarryBackground";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/tilt-card";
import { Shield, Plane, AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Plane3DCanvas = dynamic(() => import("./Plane3DCanvas"), { ssr: false });

function RealityOverlay({
  src,
  alt,
  isMini = false,
  active
}: {
  src: string;
  alt: string;
  isMini?: boolean;
  active: boolean;
}) {
  const [showReality, setShowReality] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (active || isMobile) {
      const timer = setTimeout(() => {
        setShowReality(true);
      }, isMobile ? 0 : 600);
      return () => clearTimeout(timer);
    } else {
      setShowReality(false);
    }
  }, [active, isMobile]);

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-none z-10 origin-center",
        !isMobile && "group-hover/canvas:opacity-0 group-hover/canvas:scale-105 group-hover/canvas:translate-x-0 group-hover/canvas:rotate-0 group-hover/canvas:duration-300",
        (showReality || isMobile)
          ? "opacity-100 scale-100 translate-x-0 rotate-0" 
          : "opacity-0 scale-90 -translate-x-8 -rotate-2"
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      
      {!isMini && (
        <div className="absolute bottom-3 left-3 bg-[#DFBA73]/90 text-black text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded flex items-center gap-1 shadow-[0_0_8px_rgba(212,163,72,0.4)]">
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          Physical UAV
        </div>
      )}
      {isMini && (
        <div className="absolute bottom-2 right-2 bg-[#DFBA73]/90 text-black text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 shadow-[0_0_8px_rgba(212,163,72,0.4)]">
          Reality
        </div>
      )}
    </div>
  );
}

function SciFiHUD({ active }: { active: boolean }) {
  return (
    <div className={cn(
      "absolute inset-0 w-full h-full pointer-events-none z-20 transition-all duration-500",
      active ? "opacity-100 scale-100" : "opacity-0 scale-95"
    )}>
      {/* Corner Brackets */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#DFBA73]/80 transition-all duration-500 group-hover/canvas:translate-x-[-2px] group-hover/canvas:translate-y-[-2px]" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#DFBA73]/80 transition-all duration-500 group-hover/canvas:translate-x-[2px] group-hover/canvas:translate-y-[2px]" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#DFBA73]/80 transition-all duration-500 group-hover/canvas:translate-x-[-2px] group-hover/canvas:translate-y-[2px]" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#DFBA73]/80 transition-all duration-500 group-hover/canvas:translate-x-[2px] group-hover/canvas:translate-y-[2px]" />
      
      {/* Scanning laser line - only visible on hover */}
      <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#DFBA73]/80 to-transparent shadow-[0_0_10px_rgba(212,163,72,0.6)] opacity-0 group-hover/canvas:opacity-100 animate-tech-scan pointer-events-none" />

      {/* Floating telemetries (only visible on hover) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-sm border border-[#DFBA73]/40 px-2.5 py-0.5 rounded text-[8px] text-[#DFBA73] font-mono tracking-widest uppercase opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 z-30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        SYS DIAGNOSTIC: INSPECTING
      </div>
      
      <div className="absolute bottom-3 left-3 text-[7px] text-[#DFBA73]/60 font-mono tracking-widest uppercase opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-300">
        TELEMETRY: ACTIVE
      </div>
      <div className="absolute bottom-3 right-3 text-[7px] text-[#DFBA73]/60 font-mono tracking-widest uppercase opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-300 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-emerald-500" />
        LINK: OK
      </div>
    </div>
  );
}

interface Project {
  name: string;
  image: string;
  modelType?: "vtol" | "hexacopter";
}

interface PlaneSpec {
  wingspan: string;
  weight: string;
  maxSpeed: string;
}

interface Plane {
  id: number;
  name: string;
  year: string;
  description: string;
  image: string;
  isAchievement?: boolean;
  modelType?: "tractor" | "twin-boom" | "vtol" | "hexacopter";
  specs: PlaneSpec;
  projects?: Project[];
}

const planes: Plane[] = [
  {
    id: 1,
    name: "NIDAR Competition 2026",
    year: "2026",
    description: "Team Maverick India secured All India Rank 2 in Disaster Management at NIDAR 2026.",
    image: "",
    isAchievement: true,
    specs: {
      wingspan: "-",
      weight: "-",
      maxSpeed: "-"
    },
    projects: [
      {
        name: "VTOL UAV",
        image: "/images/planes/vtol.webp",
        modelType: "vtol" as const,
      },
      {
        name: "Hexacopter UAV",
        image: "/images/planes/hexacopter.webp",
        modelType: "hexacopter" as const,
      }
    ]
  },
  {
    id: 2,
    name: "MOHAV-II*",
    year: "2025",
    description: `MOHAV-II, our next-generation fixed-wing UAV, made a powerful impact at SAE Aero Design West 2025, earning an Overall World Rank of 6 and an exceptional World Rank 2 in Design. Boasting an impressive 180-inch wingspan and an all-up weight of 19 kg, MOHAV-II showcases a perfect balance of structural strength and aerodynamic finesse. As our second international entry, it builds significantly upon the foundation laid by its predecessor (MOHAV-I), introducing advanced design enhancements and performance upgrades across the board. MOHAV-II reflects our team's relentless pursuit of innovation and engineering excellence on the global stage.`,
    image: "/images/planes/daredevil.webp",
    modelType: "twin-boom" as const,
    specs: {
      wingspan: "180 in",
      weight: "13 kg",
      maxSpeed: "19 kg"
    }
  },
  {
    id: 3,
    name: "Shourya",
    year: "2024",
    description: `Shourya, our flagship fixed-wing UAV, achieved remarkable success, securing AIR 5 overall and AIR 1 in Technical Presentation. It set a record at SAEISS DDC by lifting four times its own weight, an unprecedented feat in the competition's history. With an empty weight of 4 kg, it effortlessly carried a 16 kg payload. Designed with a single-motor tractor configuration, its high-mount tapered wing spans an impressive 72 inches. The semi-monocoque fuselage, twin tail booms, and conventional tail structure showcase its advanced aerodynamics and efficiency.`,
    image: "/images/planes/shourya.webp",
    modelType: "tractor" as const,
    specs: {
      wingspan: "72 in",
      weight: "4 kg",
      maxSpeed: "16 kg"
    }
  },
  {
    id: 4,
    name: "MOHAV-I",
    year: "2024",
    description: "MOHAV-I marked the team's first international success, ranking 10th globally and 4th in mission requirements. As one of the largest aircraft built by the team, it boasts a 170-inch wingspan and a sturdy 13.5 kg frame. With a semi-monocoque fuselage and twin tail booms, MOHAV-I was designed for unparalleled stability and aerodynamic efficiency, excelling in global competitions.",
    image: "/images/planes/mohav.webp",
    modelType: "twin-boom" as const,
    specs: {
      wingspan: "170 in",
      weight: "13.5 kg",
      maxSpeed: "25 kg"
    }
  },
  {
    id: 5,
    name: "Vayutej",
    year: "2023",
    description: "Vayutej achieved AIR 1 overall and 1st place in Technical Presentation at SAEISS DDC 2023. This 4 kg UAV lifted 12 kg, demonstrating its remarkable payload capacity at three times its weight. Built with a 72-inch wingspan, a high-mount wing design, and a semi-monocoque fuselage, it balanced aerodynamic efficiency and structural durability, making it a standout performer.",
    image: "/images/planes/vayutej.webp",
    modelType: "tractor" as const,
    specs: {
      wingspan: "72 in",
      weight: "4 kg",
      maxSpeed: "12 kg"
    }
  },
  {
    id: 6,
    name: "Trailblazer",
    year: "2022",
    description: "Trailblazer, the team's second aircraft and first competition entry, lifted 15 kg—three times its own weight—while setting benchmarks for the shortest takeoff and landing distances in its category. With a focus on lightweight design and robust aerodynamics, Trailblazer proved to be a milestone in the team's journey, pushing the limits of UAV performance.",
    image: "/images/planes/trailblazer.webp",
    modelType: "tractor" as const,
    specs: {
      wingspan: "80 in",
      weight: "5 kg",
      maxSpeed: "15 kg"
    }
  },
  {
    id: 7,
    name: "Prototype - 1",
    year: "2021",
    description: "Prototype-1 was the team's first-ever aircraft, built as a learning project to master RC aircraft design and aerodynamics. With an empty weight of 3.5 kg, it carried a 3.5 kg payload, doubling its weight. This aircraft laid the foundation for future innovations, demonstrating a balanced and efficient flight design.",
    image: "/images/planes/prototype.webp",
    modelType: "tractor" as const,
    specs: {
      wingspan: "60 in",
      weight: "3.5 kg",
      maxSpeed: "7 kg"
    }
  }
];

function ProjectSubCard({ 
  project, 
  isActive, 
  onHover 
}: { 
  project: Project; 
  isActive: boolean; 
  onHover: (hovered: boolean) => void;
}) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-background/80 dark:bg-black/60 transition-all duration-300 hover:border-[#DFBA73]/30 p-2 h-48 sm:h-52 group/canvas",
        isActive ? "z-20" : "z-10"
      )}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {project.modelType ? (
        <div className="w-full h-full relative rounded-lg overflow-hidden">
          {/* Dom anchor placeholder for WebGL positioning */}
          <div id={`plane-placeholder-1-${project.modelType}`} className="w-full h-full" />
          
          {project.image && (
            <RealityOverlay src={project.image} alt={project.name} isMini active={isActive} />
          )}
          
          <SciFiHUD active={isActive} />
          
          {/* Small overlay badge with name */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm border border-[#DFBA73]/30 px-2 py-0.5 rounded text-[11px] text-[#DFBA73] font-bold z-20 pointer-events-none">
            {project.name}
          </div>
        </div>
      ) : (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-background/90 dark:bg-black/80 flex flex-col items-center justify-center text-center p-3 z-10 border border-[#DFBA73]/10 rounded-lg">
            <p className="text-[#DFBA73] font-bold text-sm mb-1">{project.name}</p>
            <p className="text-foreground/80 dark:text-white/80 text-[10px] font-medium tracking-wide">Autonomous VTOL System</p>
            <p className="text-muted-foreground/50 dark:text-white/40 text-[9px] uppercase tracking-widest mt-1">Pending Launch</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PlaneTimelineItem({ 
  plane, 
  index, 
  activeTargetId, 
  onHover 
}: { 
  plane: Plane; 
  index: number; 
  activeTargetId: string; 
  onHover: (hovered: boolean) => void;
}) {
  const isMainActive = activeTargetId === plane.id.toString();
  const isAnyActive = isMainActive || (plane.projects?.some(p => activeTargetId === `1-${p.modelType}`) ?? false);

  return (
    <div className="relative">
      {/* Timeline dot */}
      <div className={`absolute ${index % 2 === 0 ? 'md:left-1/2 right-1/2' : 'md:left-1/2'} left-4
        w-4 h-4 rounded-full bg-background border border-[#DFBA73] transform -translate-x-1/2 -translate-y-1/2
        shadow-[0_0_12px_rgba(212,163,72,0.8)] z-10
      `} />

      <div className={`md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 ml-10 md:ml-0`}>
        <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-14' : 'md:pl-14'}`}>
          
          <TiltCard className={cn(
            "glass-panel text-foreground overflow-hidden relative flex flex-col h-full border border-[#DFBA73]/15 dark:border-white/5 shadow-2xl transition-all duration-300",
            isAnyActive ? "z-20" : "z-10"
          )}>
            
            {/* 3D Canvas / Image */}
            {plane.modelType ? (
              <div 
                className="relative h-64 sm:h-80 w-full overflow-hidden group/canvas"
                onMouseEnter={() => onHover(true)}
                onMouseLeave={() => onHover(false)}
              >
                {/* Dom anchor placeholder for WebGL positioning */}
                <div id={`plane-placeholder-${plane.id}`} className="w-full h-full" />
                
                {plane.image && (
                  <RealityOverlay src={plane.image} alt={plane.name} active={isMainActive} />
                )}
                
                <SciFiHUD active={isMainActive} />
                
                {/* Year badge on canvas — mobile only */}
                <div className="md:hidden absolute top-3 right-3 bg-black/80 backdrop-blur-sm border border-[#DFBA73]/40 rounded-full px-3 py-1 z-10 pointer-events-none">
                  <span className="text-[#DFBA73] text-xs font-bold tracking-widest">{plane.year}</span>
                </div>
              </div>
            ) : plane.image ? (
              <div className="relative h-64 sm:h-80 w-full overflow-hidden group">
                <Image
                  src={plane.image}
                  alt={plane.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Year badge on image — mobile only */}
                <div className="md:hidden absolute top-3 right-3 bg-black/80 backdrop-blur-sm border border-[#DFBA73]/40 rounded-full px-3 py-1">
                  <span className="text-[#DFBA73] text-xs font-bold tracking-widest">{plane.year}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
            ) : null}

            {/* Card body */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-foreground font-montserrat">{plane.name}</h3>
                <span className="hidden md:inline-block bg-[#DFBA73]/10 text-[#DFBA73] text-xs font-bold tracking-widest px-3 py-1 rounded border border-[#DFBA73]/20">
                  {plane.year}
                </span>
              </div>
              <p className="text-[#DFBA73]/75 text-xs font-bold tracking-[0.2em] uppercase mb-5">{plane.year} Season</p>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">{plane.description}</p>

              {plane.projects && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-8">
                  {plane.projects.map((project, idx) => (
                    <ProjectSubCard 
                      key={idx} 
                      project={project} 
                      isActive={activeTargetId === `1-${project.modelType}`}
                      onHover={onHover}
                    />
                  ))}
                </div>
              )}

              <div className="h-px bg-border/40 dark:bg-white/5 mb-5" />

              {/* Specs */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-muted-foreground/80 text-[9px] font-bold tracking-[0.18em] uppercase mb-1">Wingspan</p>
                  <p className="text-foreground text-sm sm:text-base font-semibold">{plane.specs.wingspan}</p>
                </div>
                <div>
                  <p className="text-muted-foreground/80 text-[9px] font-bold tracking-[0.18em] uppercase mb-1">Empty Wt.</p>
                  <p className="text-foreground text-sm sm:text-base font-semibold">{plane.specs.weight}</p>
                </div>
                <div>
                  <p className="text-muted-foreground/80 text-[9px] font-bold tracking-[0.18em] uppercase mb-1">All-Up Wt.</p>
                  <p className="text-foreground text-sm sm:text-base font-semibold">{plane.specs.maxSpeed}</p>
                </div>
              </div>
            </div>
            
          </TiltCard>
        </div>
        {/* Empty space container for timeline balance */}
        <div className={cn(
          "hidden md:block w-1/2",
          index % 2 === 0 ? "md:pl-14" : "md:pr-14"
        )}>
          {plane.id === 1 ? (
            // NIDAR sub-hangars side-by-side
            <div className="grid grid-cols-2 gap-4 h-full items-center">
              {plane.projects?.map((proj, idx) => (
                <div 
                  key={idx}
                  className="group relative overflow-hidden h-48 sm:h-52 group/canvas"
                  onMouseEnter={() => onHover(true)}
                  onMouseLeave={() => onHover(false)}
                >
                  <div id={`plane-placeholder-1-${proj.modelType}-empty`} className="w-full h-full" />
                  <SciFiHUD active={activeTargetId === `1-${proj.modelType}`} />
                </div>
              ))}
            </div>
          ) : (
            // Main plane hangar
            <div 
              className={cn(
                "group relative overflow-hidden h-64 sm:h-80 w-full group/canvas",
                activeTargetId === plane.id.toString() ? "z-20" : "z-10"
              )}
              onMouseEnter={() => onHover(true)}
              onMouseLeave={() => onHover(false)}
            >
              <div id={`plane-placeholder-${plane.id}-empty`} className="w-full h-full" />
              <SciFiHUD active={activeTargetId === plane.id.toString()} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default function PlanesPage() {
  const [activeTargetId, setActiveTargetId] = useState<string>("1-hexacopter");
  const [activeModelType, setActiveModelType] = useState<"tractor" | "twin-boom" | "vtol" | "hexacopter">("hexacopter");
  const [canvasInteractive, setCanvasInteractive] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      let closestId = "1-hexacopter";
      let closestType: "tractor" | "twin-boom" | "vtol" | "hexacopter" = "hexacopter";
      let minDistance = Infinity;

      // Check sub-projects of NIDAR
      const nidar = planes[0];
      nidar.projects?.forEach((proj) => {
        const id = `1-${proj.modelType}`;
        const element = document.getElementById(`plane-placeholder-${id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
          if (distance < minDistance) {
            minDistance = distance;
            closestId = id;
            closestType = proj.modelType || "vtol";
          }
        }
      });

      // Check main planes
      planes.slice(1).forEach((plane) => {
        const id = plane.id.toString();
        const element = document.getElementById(`plane-placeholder-${id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
          if (distance < minDistance) {
            minDistance = distance;
            closestId = id;
            closestType = plane.modelType || "tractor";
          }
        }
      });

      setActiveTargetId(closestId);
      setActiveModelType(closestType);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Trigger scroll check after layout finishes rendering
    const loadTimer = setTimeout(() => {
      handleScroll();
    }, 600);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(loadTimer);
    };
  }, []);

  return (
    <>
      <div className="pt-24 pb-20 relative min-h-screen bg-background scanlines grid-pattern">
        <StarryBackground />
        
        {/* Keyframe scan animation stylesheet */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes tech-scan {
            0% { top: 0%; }
            100% { top: 100%; }
          }
          .animate-tech-scan {
            animation: tech-scan 2.5s linear infinite;
          }
        `}} />

        {/* Viewport-fixed background WebGL canvas tracking active cards - disabled on mobile to prevent scroll hijacking */}
        {!isMobile && (
          <div 
            className="fixed inset-0 w-screen h-screen z-0 transition-all duration-300 pointer-events-none"
            style={{ pointerEvents: canvasInteractive ? "auto" : "none" }}
          >
            <Plane3DCanvas type={activeModelType} activeId={activeTargetId} isHovered={canvasInteractive} />
          </div>
        )}

        <div className="container mx-auto px-6 relative z-10">

          {/* Page Header */}
          <div id="planes-header" className="text-center mb-20">
            <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.25em]">Engineering Fleet</span>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wide text-foreground mt-2 mb-4 font-montserrat">
              OUR <span className="text-[#DFBA73] text-gold-glow">AIRCRAFT</span>
            </h1>
            <div className="w-24 h-1 bg-[#DFBA73] mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground text-sm tracking-wide max-w-xl mx-auto leading-relaxed">
              "Every UAV we have designed, fabricated, and piloted on the national and global stage."
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Centre timeline line — desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#DFBA73]/10 via-[#DFBA73]/40 to-[#DFBA73]/10 -translate-x-1/2" />
            {/* Mobile timeline line */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-[2px] bg-[#DFBA73]/40 -translate-x-1/2" />

            <div className="space-y-20">
              {planes.map((plane, index) => (
                <PlaneTimelineItem 
                  key={plane.id} 
                  plane={plane} 
                  index={index} 
                  activeTargetId={activeTargetId}
                  onHover={(hovered) => setCanvasInteractive(hovered)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
