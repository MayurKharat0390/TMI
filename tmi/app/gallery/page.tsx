import type { Metadata } from 'next';
import StarryBackground from "@/components/StarryBackground";
import dynamic from "next/dynamic";

const GalleryGrid = dynamic(() => import("./GalleryGrid"), { ssr: true });

export const metadata: Metadata = {
  title: 'Gallery | Flight Tests & Competition History',
  description: 'Browse the visual history of Team Maverick India. Discover images and videos of our UAV flights, design reviews, manufacturing processes, and international competition seasons.',
  keywords: [
    'Team Maverick India gallery',
    'UAV flight test videos',
    'aerospace competition images',
    'PCCOE Pune drone flight',
    'SAE Aero Design photos'
  ],
};

export default function GalleryPage() {

  return (
    <>
      <div className="relative min-h-screen pt-24 pb-20">
        <div className="hidden dark:block">
          <StarryBackground />
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-10">

          {/* Header */}
          <div className="text-center mb-20">
            <p className="text-[#DFBA73] text-xs font-semibold tracking-[0.25em] uppercase mb-4">Our Journey</p>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4">Gallery</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Moments from our competition seasons
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#DFBA73]/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#DFBA73]" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#DFBA73]/50" />
            </div>
          </div>

          {/* Year Sections */}
          <GalleryGrid />
        </div>
      </div>
    </>
  );
}
