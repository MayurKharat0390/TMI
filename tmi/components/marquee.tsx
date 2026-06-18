"use client";

import React from "react";
import Image from "next/image";

interface Sponsor {
  name: string;
  logo: string;
  tier: string;
}

const marqueeSponsors: Sponsor[] = [
  { name: "Dassault Systemes", logo: "/images/sponsors/platinum/dassault.png", tier: "platinum" },
  { name: "Altium Designer", logo: "/images/sponsors/platinum/altium_designer.png", tier: "platinum" },
  { name: "Ansys", logo: "/images/sponsors/platinum/ansys.png", tier: "platinum" },
  { name: "APC Propellers", logo: "/images/sponsors/platinum/APC.png", tier: "platinum" },
  { name: "Solidworks", logo: "/images/sponsors/platinum/Solidworks.png", tier: "platinum" },
  { name: "Mathworks", logo: "/images/sponsors/platinum/mathworks.png", tier: "platinum" },
  { name: "T-Motor", logo: "/images/sponsors/gold/tmotor.png", tier: "gold" },
  { name: "HiTec RCD", logo: "/images/sponsors/gold/hitech.png", tier: "gold" },
  { name: "Simscale", logo: "/images/sponsors/gold/simscale.png", tier: "gold" },
  { name: "Tattu UAV", logo: "/images/sponsors/silver/tattu.png", tier: "silver" },
  { name: "DU-BRO", logo: "/images/sponsors/silver/dubro.png", tier: "silver" },
];

export default function InfiniteMarquee() {
  return (
    <div className="relative w-full overflow-hidden bg-black/40 border-y border-[#DFBA73]/10 py-10 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Moving track */}
      <div className="flex w-[200%] animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused] gap-16 items-center">
        {/* Track 1 */}
        <div className="flex justify-around items-center w-1/2 gap-16">
          {marqueeSponsors.map((sponsor, idx) => (
            <div key={`track1-${idx}`} className="flex-shrink-0 group relative flex items-center justify-center h-16 w-32 filter grayscale contrast-125 dark:brightness-200 hover:grayscale-0 transition-all duration-300">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                sizes="(max-width: 120px) 100vw"
                className="object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        {/* Track 2 (Clone of Track 1 for infinite seamless wrap) */}
        <div className="flex justify-around items-center w-1/2 gap-16">
          {marqueeSponsors.map((sponsor, idx) => (
            <div key={`track2-${idx}`} className="flex-shrink-0 group relative flex items-center justify-center h-16 w-32 filter grayscale contrast-125 dark:brightness-200 hover:grayscale-0 transition-all duration-300">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                sizes="(max-width: 120px) 100vw"
                className="object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
