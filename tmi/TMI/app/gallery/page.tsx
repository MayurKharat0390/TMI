"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Head from "next/head";

const galleries: Record<"2024" | "2023" | "2022", { id: number; src: string; alt: string }[]> = {
  "2024": Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    src: `/images/gallery/2024/image_${i + 1}.webp`,
    alt: `Aircraft ${i + 1} (2024)`
  })),
  "2023": Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    src: `/images/gallery/2023/image_${i + 1}.webp`,
    alt: `Aircraft ${i + 1} (2023)`
  })),
  "2022": Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    src: `/images/gallery/2022/image_${i + 1}.webp`,
    alt: `Aircraft ${i + 1} (2022)`
  }))
};

export default function GalleryPage() {
  const sortedYears = Object.keys(galleries).sort((a, b) => Number(b) - Number(a));

  const initialOpenState = sortedYears.reduce((acc, year, idx) => {
    acc[year as keyof typeof galleries] = idx === 0;
    return acc;
  }, {} as Record<"2024" | "2023" | "2022", boolean>);

  const [openSections, setOpenSections] = useState<Record<"2024" | "2023" | "2022", boolean>>(initialOpenState);

  const [selectedModalYear, setSelectedModalYear] = useState<"2024" | "2023" | "2022" | null>(null);
  const [selectedModalIndex, setSelectedModalIndex] = useState<number | null>(null);

  const handleImageClick = (year: "2024" | "2023" | "2022", index: number) => {
    setSelectedModalYear(year);
    setSelectedModalIndex(index);
  };

  const handlePrevious = () => {
    if (selectedModalYear === null || selectedModalIndex === null) return;
    const images = galleries[selectedModalYear];
    setSelectedModalIndex(current =>
      current === 0 ? images.length - 1 : current! - 1
    );
  };

  const handleNext = () => {
    if (selectedModalYear === null || selectedModalIndex === null) return;
    const images = galleries[selectedModalYear];
    setSelectedModalIndex(current =>
      current === images.length - 1 ? 0 : current! + 1
    );
  };

  return (
    <>
      <Head>
        <title>Gallery | Team Maverick India</title>
        <meta
          name="description"
          content="Explore the gallery of Team Maverick India, showcasing our UAV designs, competitions, and achievements from 2022 to 2024. Witness the evolution of our aerospace innovations."
        />
        <meta
          name="keywords"
          content="Team Maverick India gallery, UAV photos, aerospace engineering images, drone technology gallery, aircraft designs, competition photos"
        />
        <meta name="author" content="Team Maverick India" />
        <meta property="og:title" content="Gallery | Team Maverick India" />
        <meta
          property="og:description"
          content="Explore the gallery of Team Maverick India, showcasing our UAV designs, competitions, and achievements from 2022 to 2024. Witness the evolution of our aerospace innovations."
        />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:url" content="https://www.team-maverick-india.com/gallery" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gallery | Team Maverick India" />
        <meta
          name="twitter:description"
          content="Explore the gallery of Team Maverick India, showcasing our UAV designs, competitions, and achievements from 2022 to 2024. Witness the evolution of our aerospace innovations."
        />
        <meta name="twitter:image" content="/images/logo.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              "name": "Team Maverick India Gallery",
              "description": "A collection of images showcasing the UAV designs, competitions, and achievements of Team Maverick India from 2022 to 2024.",
              "image": [
                {
                  "@type": "ImageObject",
                  "contentUrl": "/images/gallery/2024/image_1.webp",
                  "description": "Aircraft 1 (2024)"
                },
                {
                  "@type": "ImageObject",
                  "contentUrl": "/images/gallery/2023/image_1.webp",
                  "description": "Aircraft 1 (2023)"
                },
                {
                  "@type": "ImageObject",
                  "contentUrl": "/images/gallery/2022/image_1.webp",
                  "description": "Aircraft 1 (2022)"
                }
              ]
            }
          `}
        </script>
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />

      </Head>

      {/* Page Content */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Gallery</h1>
          {sortedYears.map((year) => (
            <div key={year} className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{year}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, [year as keyof typeof galleries]: !prev[year as keyof typeof galleries] }))}>
                  {openSections[year as keyof typeof galleries] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
              {openSections[year as keyof typeof galleries] && (
                <>
                  {galleries[year as keyof typeof galleries].length > 0 ? (
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                      {galleries[year as keyof typeof galleries].map((image, index) => (
                        <div
                          key={image.id}
                          className="break-inside-avoid mb-4 relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleImageClick(year as keyof typeof galleries, index)}
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-auto"
                            loading="lazy"
                            draggable="false"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-500 text-2xl ">
                      Coming Soon
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <Dialog
            open={selectedModalYear !== null && selectedModalIndex !== null}
            onOpenChange={() => {
              setSelectedModalYear(null);
              setSelectedModalIndex(null);
            }}
          >
            <DialogContent className="max-w-4xl p-0">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 z-50"
                  onClick={() => {
                    setSelectedModalYear(null);
                    setSelectedModalIndex(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                {selectedModalYear !== null && selectedModalIndex !== null && (
                  <>
                    <img
                      src={galleries[selectedModalYear][selectedModalIndex].src}
                      alt={galleries[selectedModalYear][selectedModalIndex].alt}
                      className="w-full h-auto"
                      draggable="false"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
