"use client";

import StarryBackground from "@/components/StarryBackground";
import Head from 'next/head';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/tilt-card";
import { Shield, Plane, AlertTriangle } from "lucide-react";

const planes = [
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
      },
      {
        name: "Hexacopter UAV",
        image: "/images/planes/hexacopter.webp",
      }
    ]
  },
  {
    id: 2,
    name: "MOHAV-II*",
    year: "2025",
    description: `MOHAV-II, our next-generation fixed-wing UAV, made a powerful impact at SAE Aero Design West 2025, earning an Overall World Rank of 6 and an exceptional World Rank 2 in Design. Boasting an impressive 180-inch wingspan and an all-up weight of 19 kg, MOHAV-II showcases a perfect balance of structural strength and aerodynamic finesse. As our second international entry, it builds significantly upon the foundation laid by its predecessor (MOHAV-I), introducing advanced design enhancements and performance upgrades across the board. MOHAV-II reflects our team's relentless pursuit of innovation and engineering excellence on the global stage.`,
    image: "/images/planes/daredevil.webp",
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
    specs: {
      wingspan: "60 in",
      weight: "3.5 kg",
      maxSpeed: "7 kg"
    }
  }
];

export default function PlanesPage() {
  return (
    <>
      <Head>
        <title>Our Aircraft | Team Maverick India</title>
        <meta
          name="description"
          content="Explore the cutting-edge UAVs engineered by Team Maverick India—from Prototype-1 to the world-class MOHAV-II. Discover how each aircraft advanced our innovation in aerospace."
        />
        <meta
          name="keywords"
          content="Team Maverick India aircraft, UAV designs, MOHAV-II, Shourya, MOHAV-I, Vayutej, Trailblazer, Prototype-1"
        />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      </Head>

      <div className="pt-24 pb-20 relative min-h-screen bg-background scanlines grid-pattern">
        <StarryBackground />
        <div className="container mx-auto px-6 relative z-10">

          {/* Page Header */}
          <div className="text-center mb-20">
            <span className="text-[#D4A348] text-xs font-bold uppercase tracking-[0.25em]">Engineering Fleet</span>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wide text-white mt-2 mb-4 font-montserrat">
              OUR <span className="text-[#D4A348] text-gold-glow">AIRCRAFT</span>
            </h1>
            <div className="w-24 h-1 bg-[#D4A348] mx-auto rounded-full mb-6" />
            <p className="text-white/60 text-sm tracking-wide max-w-xl mx-auto leading-relaxed">
              "Every UAV we have designed, fabricated, and piloted on the national and global stage."
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Centre timeline line — desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4A348]/10 via-[#D4A348]/40 to-[#D4A348]/10 -translate-x-1/2" />
            {/* Mobile timeline line */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-[2px] bg-[#D4A348]/40 -translate-x-1/2" />

            <div className="space-y-20">
              {planes.map((plane, index) => (
                <div key={plane.id} className="relative">

                  {/* Timeline dot */}
                  <div className={`absolute ${index % 2 === 0 ? 'md:left-1/2 right-1/2' : 'md:left-1/2'} left-4
                    w-4 h-4 rounded-full bg-black border border-[#D4A348] transform -translate-x-1/2 -translate-y-1/2
                    shadow-[0_0_12px_rgba(212,163,72,0.8)] z-10
                  `} />

                  <div className={`md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 ml-10 md:ml-0`}>
                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-14' : 'md:pl-14'}`}>
                      
                      <TiltCard className="glass-panel text-white overflow-hidden relative flex flex-col h-full border border-white/5 shadow-2xl">
                        
                        {/* Image */}
                        {plane.image && (
                          <div className="relative h-64 sm:h-80 w-full overflow-hidden group">
                            <Image
                              src={plane.image}
                              alt={plane.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                            {/* Year badge on image — mobile only */}
                            <div className="md:hidden absolute top-3 right-3 bg-black/80 backdrop-blur-sm border border-[#D4A348]/40 rounded-full px-3 py-1">
                              <span className="text-[#D4A348] text-xs font-bold tracking-widest">{plane.year}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                          </div>
                        )}

                        {/* Card body */}
                        <div className="p-6 sm:p-8">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white font-montserrat">{plane.name}</h3>
                            <span className="hidden md:inline-block bg-[#D4A348]/10 text-[#D4A348] text-xs font-bold tracking-widest px-3 py-1 rounded border border-[#D4A348]/20">
                              {plane.year}
                            </span>
                          </div>
                          <p className="text-[#D4A348]/75 text-xs font-bold tracking-[0.2em] uppercase mb-5">{plane.year} Season</p>

                          <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6">{plane.description}</p>

                          {plane.projects && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-8">
                              {plane.projects.map((project, idx) => (
                                <div key={idx} className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/60 transition-all duration-300 hover:border-[#D4A348]/30 p-2">
                                  <div className="relative aspect-video overflow-hidden rounded-lg">
                                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-3 z-10 border border-[#D4A348]/10 rounded-lg">
                                      <p className="text-[#D4A348] font-bold text-sm mb-1">{project.name}</p>
                                      <p className="text-white/80 text-[10px] font-medium tracking-wide">Autonomous VTOL System</p>
                                      <p className="text-white/40 text-[9px] uppercase tracking-widest mt-1">Pending Launch</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="h-px bg-white/5 mb-5" />

                          {/* Specs */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-white/40 text-[9px] font-bold tracking-[0.18em] uppercase mb-1">Wingspan</p>
                              <p className="text-white text-sm sm:text-base font-semibold">{plane.specs.wingspan}</p>
                            </div>
                            <div>
                              <p className="text-white/40 text-[9px] font-bold tracking-[0.18em] uppercase mb-1">Empty Wt.</p>
                              <p className="text-white text-sm sm:text-base font-semibold">{plane.specs.weight}</p>
                            </div>
                            <div>
                              <p className="text-white/40 text-[9px] font-bold tracking-[0.18em] uppercase mb-1">All-Up Wt.</p>
                              <p className="text-white text-sm sm:text-base font-semibold">{plane.specs.maxSpeed}</p>
                            </div>
                          </div>
                        </div>
                        
                      </TiltCard>
                    </div>
                    {/* Empty placeholder for timeline balance */}
                    <div className="hidden md:block w-1/2" />
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}