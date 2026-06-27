"use client";

import Image from 'next/image';
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const StarryBackground = dynamic(() => import("@/components/StarryBackground"), { ssr: false });

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
    description: "MOHAV-II, our next-generation fixed-wing UAV, made a powerful impact at SAE Aero Design West 2025, earning an Overall World Rank of 6 and an exceptional World Rank 2 in Design. Boasting an impressive 180-inch wingspan and an all-up weight of 19 kg, MOHAV-II showcases a perfect balance of structural strength and aerodynamic finesse. As our second international entry, it builds significantly upon the foundation laid by its predecessor (MOHAV-I), introducing advanced design enhancements and performance upgrades across the board. MOHAV-II reflects our team's relentless pursuit of innovation and engineering excellence on the global stage.",
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
    description: "Shourya, our flagship fixed-wing UAV, achieved remarkable success, securing AIR 5 overall and AIR 1 in Technical Presentation. It set a record at SAEISS DDC by lifting four times its own weight, an unprecedented feat in the competition's history. With an empty weight of 4 kg, it effortlessly carried a 16 kg payload. Designed with a single-motor tractor configuration, its high-mount tapered wing spans an impressive 72 inches. The semi-monocoque fuselage, twin tail booms, and conventional tail structure showcase its advanced aerodynamics and efficiency.",
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

const scannerVariants = {
  hidden: { top: "-5%", opacity: 0 },
  visible: {
    top: "105%",
    opacity: [0, 1, 1, 0],
    transition: { duration: 1.4, ease: "easeInOut", delay: 0.2 }
  }
};

const colorOverlayVariants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.4, ease: "easeInOut", delay: 0.2 }
  }
};

function PlaneCard({ plane }: { plane: Plane }) {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="group rounded-2xl border border-border bg-card/25 backdrop-blur-sm overflow-hidden hover:border-[#DFBA73]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full shadow-lg"
    >
      {/* Plane Image with subtle gradient overlay */}
      <div className="relative h-64 w-full overflow-hidden image-subtle-overlay bg-muted/20">
        {plane.image ? (
          <>
            {/* Grayscale Base Image */}
            <Image
              src={plane.image}
              alt={plane.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale"
            />
            {/* Color Overlay Revealed on Scroll */}
            <motion.div
              variants={colorOverlayVariants}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <Image
                src={plane.image}
                alt={`${plane.name} Color`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
            {/* Scanning laser line sweeper */}
            <motion.div
              variants={scannerVariants}
              className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent shadow-[0_0_10px_#00ffff] z-20 pointer-events-none"
            />
          </>
        ) : plane.projects && plane.projects[0] ? (
          <>
            {/* Grayscale Base Image */}
            <Image
              src={plane.projects[0].image}
              alt={plane.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale"
            />
            {/* Color Overlay Revealed on Scroll */}
            <motion.div
              variants={colorOverlayVariants}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <Image
                src={plane.projects[0].image}
                alt={`${plane.name} Color`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
            {/* Scanning laser line sweeper */}
            <motion.div
              variants={scannerVariants}
              className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent shadow-[0_0_10px_#00ffff] z-20 pointer-events-none"
            />
          </>
        ) : (
          <div className="w-full h-full bg-muted/40 flex items-center justify-center text-muted-foreground text-xs font-sans font-light uppercase tracking-widest">
            No Image Available
          </div>
        )}
        
        {/* Year badge */}
        <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-sm border border-[#DFBA73]/20 rounded-full px-3 py-1 text-[10px] text-[#DFBA73] font-sans font-medium uppercase tracking-widest z-10">
          {plane.year}
        </div>
      </div>

      {/* Plane Body Content */}
      <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-2xl sm:text-3xl font-cormorant font-normal text-foreground mb-3">{plane.name}</h3>
          <p className="text-muted-foreground text-xs font-sans font-medium tracking-[0.18em] uppercase mb-4 text-[#DFBA73]">
            {plane.year} Season
          </p>
          <p className="text-muted-foreground text-sm font-sans font-light leading-relaxed mb-6">
            {plane.description}
          </p>
        </div>

        <div>
          {/* Projects sub-grid if NIDAR */}
          {plane.projects && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {plane.projects.map((proj, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-border/80 h-28">
                  <Image
                    src={proj.image}
                    alt={proj.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-[9px] font-sans font-medium tracking-wider text-[#DFBA73] uppercase">
                    {proj.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Specs List */}
          {plane.specs.wingspan !== "-" && (
            <div className="border-t border-border/60 pt-4 mt-auto">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[9px] text-[#DFBA73] font-sans font-medium uppercase tracking-widest block mb-1">Wingspan</span>
                  <span className="text-xs sm:text-sm font-sans font-semibold text-foreground">{plane.specs.wingspan}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#DFBA73] font-sans font-medium uppercase tracking-widest block mb-1">Empty Wt.</span>
                  <span className="text-xs sm:text-sm font-sans font-semibold text-foreground">{plane.specs.weight}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#DFBA73] font-sans font-medium uppercase tracking-widest block mb-1">Payload Wt.</span>
                  <span className="text-xs sm:text-sm font-sans font-semibold text-foreground">{plane.specs.maxSpeed}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function PlanesPage() {
  return (
    <>
      <div className="pt-24 pb-20 relative min-h-screen bg-background grid-pattern">
        <StarryBackground />
        
        <div className="container mx-auto px-6 relative z-10">

          {/* Page Header */}
          <div id="planes-header" className="text-center mb-20">
            <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.25em] font-sans">Engineering Fleet</span>
            <h1 className="text-4xl md:text-6xl font-cormorant font-normal text-foreground mt-2 mb-4">
              Our <span className="italic font-light text-[#DFBA73]">Aircraft</span>
            </h1>
            <div className="w-16 h-[1px] bg-[#DFBA73]/50 mx-auto mb-6" />
            <p className="text-muted-foreground text-sm tracking-wide max-w-xl mx-auto leading-relaxed font-sans font-light">
              "Every UAV we have designed, fabricated, and piloted on the national and global stage."
            </p>
          </div>

          {/* Fleet Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {planes.map((plane) => (
              <PlaneCard key={plane.id} plane={plane} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
