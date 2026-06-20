import type { Metadata } from 'next';
import StarryBackground from "@/components/StarryBackground";
import Image from 'next/image';
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";

const SponsorsList = dynamic(() => import("./SponsorsList"), { ssr: true });

export const metadata: Metadata = {
  title: 'Our Sponsors | Team Maverick India',
  description: 'Meet the sponsors of Team Maverick India, the premier UAV innovation team. Discover our diamond, platinum, gold, and silver sponsors who support our aerospace engineering journey.',
  keywords: [
    'Team Maverick India sponsors',
    'UAV sponsors',
    'aerospace engineering sponsors',
    'diamond sponsors',
    'platinum sponsors',
    'gold sponsors',
    'silver sponsors',
    'drone technology partners'
  ],
  authors: [{ name: 'Team Maverick India' }],
  openGraph: {
    title: 'Our Sponsors | Team Maverick India',
    description: "Discover the sponsors supporting Team Maverick India's UAV innovation journey. Explore our diamond, platinum, gold, and silver sponsors.",
    images: [{ url: '/images/logo.png' }],
    url: 'https://www.team-maverick-india.com/sponsors',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Sponsors | Team Maverick India',
    description: 'Meet the sponsors of Team Maverick India, the premier UAV innovation team. Discover our diamond, platinum, gold, and silver sponsors.',
    images: ['/images/logo.png'],
  },
};

export default function SponsorsPage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Team Maverick India",
            "url": "https://www.team-maverick-india.com",
            "logo": "https://www.team-maverick-india.com/logo.png",
            "sponsor": {
              "@type": "Organization",
              "name": "Dassault Systemes",
              "url": "https://www.3ds.com/",
              "sponsorTier": "diamond"
            }
          })
        }}
      />

      <div className="pt-24 pb-16 min-h-screen relative">
        <div className="hidden dark:block">
          <StarryBackground />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          {/* Main Title Section */}
          <div className="text-center mb-16">
            <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.25em] font-sans">Our Partners</span>
            <h1 className="text-4xl md:text-5xl font-cormorant font-normal text-foreground mt-2 mb-6">
              Our <span className="italic font-light text-[#DFBA73]">Sponsors</span>
            </h1>
            <div className="w-16 h-[1px] bg-[#DFBA73]/50 mx-auto mb-6" />
            <p className="text-muted-foreground text-sm tracking-wide max-w-2xl mx-auto font-sans font-light">
              "Supporting innovation, engineering excellence, and the future of aerospace development."
            </p>
          </div>

          <SponsorsList />
        </div>
      </div>
    </>
  );
}
