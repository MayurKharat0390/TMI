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

const sponsors: Sponsor[] = [
  { id: 1, name: "Dassult Systemes", logo: "/images/sponsors/platinum/dassault.png", link: "https://www.3ds.com/", tier: "platinum" },
  { id: 2, name: "Trade Syndicate", logo: "/images/sponsors/gold/tradesyndicate.png", link: "http://tradesyndicate.co.in/", tier: "gold" },
  { id: 3, name: "Tattu UAV", logo: "/images/sponsors/silver/tattu.png", link: "https://genstattu.com/", tier: "silver" },
  { id: 4, name: "3D Wizard", logo: "/images/sponsors/bronze/3d.png", link: "https://3dwizardstudio.com/", tier: "bronze" },
  { id: 5, name: "Altium Designer", logo: "/images/sponsors/platinum/altium_designer.png", link: "https://www.altium.com/in", tier: "platinum" },
  { id: 6, name: "Ansys", logo: "/images/sponsors/platinum/ansys.png", link: "https://www.ansys.com/", tier: "platinum" },
  { id: 7, name: "APC Propellers", logo: "/images/sponsors/platinum/APC.png", link: "https://www.apcprop.com/", tier: "platinum" },
  { id: 8, name: "Solidworks", logo: "/images/sponsors/platinum/Solidworks.png", link: "https://www.solidworks.com/", tier: "platinum" },
  { id: 9, name: "Mathworks", logo: "/images/sponsors/platinum/mathworks.png", link: "https://in.mathworks.com/", tier: "platinum" },
  { id: 10, name: "T-Motor", logo: "/images/sponsors/gold/tmotor.png", link: "https://uav-en.tmotor.com/", tier: "gold" },
  { id: 11, name: "HiTec RCD", logo: "/images/sponsors/gold/hitech.png", link: "https://hitecrcd.com/", tier: "gold" },
  { id: 12, name: "Synopsis India", logo: "/images/sponsors/gold/synopsisindia.png", tier: "gold", link: "https://www.synopsisindia.co.in/" },
  { id: 13, name: "Simscale", logo: "/images/sponsors/gold/simscale.png", link: "https://www.simscale.com/", tier: "gold" },
  { id: 14, name: "Onyx Technology", logo: "/images/sponsors/gold/onyx.png", link: "https://www.onyxtechnology.in/", tier: "gold" },
  { id: 15, name: "XPS Precision Screws", logo: "/images/sponsors/silver/xps.png", link: "https://xpsindia.com/", tier: "silver" },
  { id: 16, name: "DU-BRO", logo: "/images/sponsors/silver/dubro.png", link: "https://www.dubro.com/", tier: "silver" },
  { id: 17, name: "Art Adds", logo: "/images/sponsors/silver/artadds.png", tier: "silver" },
  { id: 18, name: "E-Calc", logo: "/images/sponsors/silver/ecalc.png", link: "https://www.ecalc.ch/", tier: "silver" },
  { id: 19, name: "PackSquare", logo: "/images/sponsors/bronze/packsquare.png", link: "https://packsquare.in/", tier: "bronze" },
  { id: 20, name: "Chetan Enterprises", logo: "/images/sponsors/bronze/chetan.png", tier: "bronze" },
  { id: 21, name: "Horizon Engineers", logo: "/images/sponsors/bronze/horizon.png", link: "https://horizonengineers.in/", tier: "bronze" },
  { id: 22, name: "Mitter Fastners", logo: "/images/sponsors/bronze/mitter.png", link: "http://www.mitterfasteners.com/", tier: "bronze" },
  { id: 23, name: "Shreeyash Enterprises", logo: "/images/sponsors/bronze/shreeyash.png", tier: "bronze" },
  { id: 24, name: "Cad & Cart", logo: "/images/sponsors/bronze/cadncart.png", link: "http://cadandcart.com/", tier: "bronze" },
  { id: 25, name: "Elite", logo: "/images/sponsors/silver/elite.png", link: "https://www.esmwindia.com/", tier: "silver" }
];

export default function SponsorsList() {
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

  return (
    <div className="space-y-32">
      {tierOrder.map((tierKey) => {
        const tierSponsors = sponsorsByTier[tierKey];
        if (tierSponsors.length === 0) return null;

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
  const headingStyles = "font-bold uppercase tracking-widest text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]";
  const dividerStyles = "bg-yellow-400/30 mx-auto mt-3";

  switch (tier) {
    case 'platinum':
      return (
        <div className="text-center mb-12">
          <h3 className={cn("text-3xl", headingStyles)}>
            TITLE SPONSOR
          </h3>
          <div className={cn("w-20 h-[2px]", dividerStyles)} />
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
        ? "h-56 p-10 border border-border bg-card/60 shadow-xl dark:shadow-black/40 backdrop-blur-sm hover:scale-105 hover:translate-y-[-4px] hover:border-[#D4A348]/40 hover:shadow-2xl hover:shadow-black/50"
        : isPlatinum
          ? "h-48 p-8 border border-border/80 bg-card/40 shadow-lg dark:shadow-black/30 hover:scale-105 hover:translate-y-[-3px] hover:border-[#D4A348]/30 hover:shadow-xl hover:shadow-black/40"
          : "h-40 p-6 border border-border/60 bg-card/30 shadow-md dark:shadow-black/20 hover:scale-105 hover:border-[#D4A348]/20 hover:shadow-lg hover:shadow-black/30"
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
