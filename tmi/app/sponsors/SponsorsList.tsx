"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

type Sponsor = {
  id: number;
  name: string;
  logo: string;
  link?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
};

type SponsorsByTier = {
  platinum: Sponsor[];
  gold: Sponsor[];
  silver: Sponsor[];
  bronze: Sponsor[];
};

export default function SponsorsList() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSponsors = async () => {
    try {
      const res = await fetch('/api/sponsors');
      if (res.ok) {
        const data = await res.json();
        setSponsors(data);
      }
    } catch (e) {
      console.error("Failed to load sponsors", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const sponsorsByTier: SponsorsByTier = sponsors.reduce((acc, sponsor) => {
    if (!acc[sponsor.tier]) {
      acc[sponsor.tier] = [];
    }
    acc[sponsor.tier].push(sponsor);
    return acc;
  }, {
    platinum: [],
    gold: [],
    silver: [],
    bronze: []
  } as SponsorsByTier);

  const tierOrder: (keyof SponsorsByTier)[] = ['platinum', 'gold', 'silver', 'bronze'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-16">
        <div className="w-8 h-8 rounded-full border-2 border-[#DFBA73] border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#DFBA73]">Loading Sponsors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-32">
      {tierOrder.map((tierKey) => {
        const tierSponsors = sponsorsByTier[tierKey];
        if (!tierSponsors || tierSponsors.length === 0) return null;

        return (
          <div key={tierKey}>
            <TierHeading tier={tierKey} />
            <div className="flex flex-wrap justify-center gap-8">
              {tierSponsors.map((sponsor) => (
                <SponsorCard
                  key={sponsor.id}
                  sponsor={sponsor}
                />
               ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TierHeading({ tier }: { tier: keyof SponsorsByTier }) {
  const headingStyles = "font-cormorant font-normal tracking-[0.1em] text-[#DFBA73] uppercase";
  const dividerStyles = "bg-[#DFBA73]/30 mx-auto mt-3";

  switch (tier) {
    case 'platinum':
      return (
        <div className="text-center mb-12">
          <h3 className={cn("text-3xl", headingStyles)}>
            TITLE SPONSOR
          </h3>
          <div className={cn("w-12 h-[1px]", dividerStyles)} />
        </div>
      );
    case 'gold':
      return (
        <div className="text-center mb-10">
          <h3 className={cn("text-2xl", headingStyles)}>
            PLATINUM SPONSOR
          </h3>
          <div className={cn("w-16 h-[1px]", dividerStyles)} />
        </div>
      );
    case 'silver':
      return (
        <div className="text-center mb-10">
          <h3 className={cn("text-xl", headingStyles)}>
            GOLD SPONSOR
          </h3>
          <div className={cn("w-16 h-[1px]", dividerStyles)} />
        </div>
      );
    case 'bronze':
      return (
        <div className="text-center mb-10">
          <h3 className={cn("text-xl", headingStyles)}>
            SILVER SPONSOR
          </h3>
          <div className={cn("w-16 h-[1px]", dividerStyles)} />
        </div>
      );
  }
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const isDiamond = sponsor.tier === 'platinum';
  const isPlatinum = sponsor.tier === 'gold';

  const CardContent = (
    <div className={cn(
      "w-full rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden",
      "flex items-center justify-center",
      "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-foreground/5 before:to-transparent before:pointer-events-none before:z-10",

      isDiamond
        ? "h-56 p-10 border border-border bg-card/60 shadow-xl backdrop-blur-sm hover:scale-105 hover:translate-y-[-4px] hover:border-[#DFBA73]/40 hover:shadow-2xl"
        : isPlatinum
          ? "h-48 p-8 border border-border/80 bg-card/40 shadow-lg hover:scale-105 hover:translate-y-[-3px] hover:border-[#DFBA73]/30 hover:shadow-xl"
          : "h-40 p-6 border border-border/60 bg-card/30 shadow-md hover:scale-105 hover:border-[#DFBA73]/20 hover:shadow-lg"
    )}>
      <Image
        src={sponsor.logo}
        alt={sponsor.name}
        width={400}
        height={400}
        loading="lazy"
        decoding="async"
        quality={85}
        className={cn(
          "object-contain grayscale dark:brightness-200 transition duration-300 ease-in-out relative z-20",
          "group-hover:grayscale-0 group-hover:brightness-100 group-hover:dark:brightness-110",
          isDiamond ? "max-h-28" : "max-h-24"
        )}
      />
    </div>
  );

  return (
    <div className={cn(
      "w-full min-w-[280px]",
      isDiamond ? "sm:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] max-w-[400px]" : "sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[350px]"
    )}>
      {sponsor.link ? (
        <a
          href={sponsor.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {CardContent}
        </a>
      ) : (
        CardContent
      )}
    </div>
  );
}
