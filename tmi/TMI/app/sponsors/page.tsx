import { Card } from "@/components/ui/card";
import StarryBackground from "@/components/StarryBackground";
import Head from 'next/head';

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
  {
    id: 1,
    name: "Dassult Systemes",
    logo: "/images/sponsors/platinum/dassault.png",
    link: "https://www.3ds.com/",
    tier: "platinum"
  },
  {
    id: 2,
    name: "Trade Syndicate",
    logo: "/images/sponsors/gold/tradesyndicate.png",
    link: "http://tradesyndicate.co.in/",
    tier: "gold"
  },
  {
    id: 3,
    name: "Tattu UAV",
    logo: "/images/sponsors/silver/tattu.png",
    link: "https://genstattu.com/",
    tier: "silver"
  },
  {
    id: 4,
    name: "3D Wizard",
    logo: "/images/sponsors/bronze/3d.png",
    link: "https://3dwizardstudio.com/",
    tier: "bronze"
  },
  {
    id: 5,
    name: "Altium Designer",
    logo: "/images/sponsors/platinum/altium_designer.png",
    link: "https://www.altium.com/in",
    tier: "platinum"
  },
  {
    id: 6,
    name: "Ansys",
    logo: "/images/sponsors/platinum/ansys.png",
    link: "https://www.ansys.com/",
    tier: "platinum"
  },
  {
    id: 7,
    name: "APC Propellers",
    logo: "/images/sponsors/platinum/APC.png",
    link: "https://www.apcprop.com/",
    tier: "platinum"
  },
  {
    id: 8,
    name: "Solidworks",
    logo: "/images/sponsors/platinum/Solidworks.png",
    link: "https://www.solidworks.com/",
    tier: "platinum"
  },
  {
    id: 9,
    name: "Mathworks",
    logo: "/images/sponsors/platinum/mathworks.png",
    link: "https://in.mathworks.com/",
    tier: "platinum"
  },
  {
    id: 10,
    name: "T-Motor",
    logo: "/images/sponsors/gold/tmotor.png",
    link: "https://uav-en.tmotor.com/",
    tier: "gold"
  },
  {
    id: 11,
    name: "HiTec RCD",
    logo: "/images/sponsors/gold/hitech.png",
    link: "https://hitecrcd.com/",
    tier: "gold"
  },
  {
    id: 12,
    name: "Synopsis India",
    logo: "/images/sponsors/gold/synopsisindia.png",
    tier: "gold",
    link: "https://www.synopsisindia.co.in/"
  },
  {
    id: 13,
    name: "Simscale",
    logo: "/images/sponsors/gold/simscale.png",
    link: "https://www.simscale.com/",
    tier: "gold"
  },
  {
    id: 14,
    name: "Onyx Technology",
    logo: "/images/sponsors/gold/onyx.png",
    link: "https://www.onyxtechnology.in/",
    tier: "gold"
  },
  {
    id: 15,
    name: "XPS Precision Screws",
    logo: "/images/sponsors/silver/xps.png",
    link: "https://xpsindia.com/",
    tier: "silver"
  },
  {
    id: 16,
    name: "DU-BRO",
    logo: "/images/sponsors/silver/dubro.png",
    link: "https://www.dubro.com/",
    tier: "silver"
  },
  {
    id: 17,
    name: "Art Adds",
    logo: "/images/sponsors/silver/artadds.png",
    tier: "silver"
  },
  {
    id: 18,
    name: "E-Calc",
    logo: "/images/sponsors/silver/ecalc.png",
    link: "https://www.ecalc.ch/",
    tier: "silver"
  },
  {
    id: 19,
    name: "PackSquare",
    logo: "/images/sponsors/bronze/packsquare.png",
    link: "https://packsquare.in/",
    tier: "bronze"
  },
  {
    id: 20,
    name: "Chetan Enterprises",
    logo: "/images/sponsors/bronze/chetan.png",
    tier: "bronze"
  },
  {
    id: 21,
    name: "Horizon Engineers",
    logo: "/images/sponsors/bronze/horizon.png",
    link: "https://horizonengineers.in/",
    tier: "bronze"
  },
  {
    id: 22,
    name: "Mitter Fastners",
    logo: "/images/sponsors/bronze/mitter.png",
    link: "http://www.mitterfasteners.com/",
    tier: "bronze"
  },
  {
    id: 23,
    name: "Shreeyash Enterprises",
    logo: "/images/sponsors/bronze/shreeyash.png",
    tier: "bronze"
  },
  {
    id: 24,
    name: "Cad & Cart",
    logo: "/images/sponsors/bronze/cadncart.png",
    link: "http://cadandcart.com/",
    tier: "bronze"
  },
  {
    id: 25,
    name: "Elite",
    logo: "/images/sponsors/silver/elite.png",
    link: "https://www.esmwindia.com/",
    tier: "silver"
  }
];

export default function SponsorsPage() {
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

  const renderSponsorTier = (tier: string, sponsors: Sponsor[]) => (
    <div key={tier} className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center capitalize">{tier} Sponsors</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {sponsors.map(sponsor => (
          <Card
            key={sponsor.id}
            className="w-full sm:w-[calc(33.333%-1rem)] min-w-[280px] max-w-[350px] overflow-hidden transition-shadow transform hover:scale-105 hover:shadow-[0_0_15px_rgba(128,128,128,0.8)] transition-shadow duration-300"
          >
            {sponsor.link ? (
              <a
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <SponsorContent sponsor={sponsor} />
              </a>
            ) : (
              <SponsorContent sponsor={sponsor} />
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Our Sponsors | Team Maverick India</title>
        <meta
          name="description"
          content="Meet the sponsors of Team Maverick India, the premier UAV innovation team. Discover our platinum, gold, silver, and bronze sponsors who support our aerospace engineering journey."
        />
        <meta
          name="keywords"
          content="Team Maverick India sponsors, UAV sponsors, aerospace engineering sponsors, platinum sponsors, gold sponsors, silver sponsors, bronze sponsors, drone technology partners"
        />
        <meta name="author" content="Team Maverick India" />
        <meta property="og:title" content="Our Sponsors | Team Maverick India" />
        <meta
          property="og:description"
          content="Discover the sponsors supporting Team Maverick India's UAV innovation journey. Explore our platinum, gold, silver, and bronze sponsors."
        />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:url" content="https://www.team-maverick-india.com/sponsors" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Sponsors | Team Maverick India" />
        <meta
          name="twitter:description"
          content="Meet the sponsors of Team Maverick India, the premier UAV innovation team. Discover our platinum, gold, silver, and bronze sponsors."
        />
        <meta name="twitter:image" content="/images/logo.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Team Maverick India",
              "url": "https://www.team-maverick-india.com",
              "logo": "https://www.team-maverick-india.com/logo.png",
              "sponsor": {
                "@type": "Organization",
                "name": "Dassault Systemes",
                "url": "https://www.3ds.com/",
                "sponsorTier": "platinum"
              }
            }
          `}
        </script>
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />

      </Head>

    <div className="pt-24 pb-16">
      <StarryBackground />
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Sponsors</h1>
        {Object.entries(sponsorsByTier).map(([tier, sponsors]) =>
          renderSponsorTier(tier, sponsors)
        )}
      </div>
    </div>
    </>
  );
}

function SponsorContent({ sponsor }: { sponsor: Sponsor }) {
  return (
    <>
      <div className="aspect-video relative">
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-center">{sponsor.name}</h3>
      </div>
    </>
  );
}