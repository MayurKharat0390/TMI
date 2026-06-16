"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Years with no images yet will show "Coming Soon"
const galleries: Record<string, { id: number; src: string; alt: string }[]> = {
    "2026": Array.from({ length: 14 }, (_, i) => ({
        id: i + 1,
        src: `/images/gallery/2026/image_${i + 1}.webp`,
        alt: `Image ${i + 1}`,
    })),
    "2025": Array.from({ length: 17 }, (_, i) => ({
        id: i + 1,
        src: `/images/gallery/2025/image_${i + 1}.webp`,
        alt: `Image ${i + 1}`,
    })),
    "2024": Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        src: `/images/gallery/2024/image_${i + 1}.webp`,
        alt: `Image ${i + 1}`,
    })),
    "2023": Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        src: `/images/gallery/2023/image_${i + 1}.webp`,
        alt: `Image ${i + 1}`,
    })),
    "2022": Array.from({ length: 22 }, (_, i) => ({
        id: i + 1,
        src: `/images/gallery/2022/image_${i + 1}.webp`,
        alt: `Image ${i + 1}`,
    })),
};

export default function GalleryGrid() {
    const sortedYears = Object.keys(galleries).sort((a, b) => Number(b) - Number(a));

    // Only open the first year that has images
    const firstActiveYear = sortedYears.find((y) => galleries[y].length > 0) ?? sortedYears[0];
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        sortedYears.reduce((acc, year) => {
            acc[year] = year === firstActiveYear;
            return acc;
        }, {} as Record<string, boolean>)
    );

    const [modalYear, setModalYear] = useState<string | null>(null);
    const [modalIndex, setModalIndex] = useState<number | null>(null);

    const closeModal = () => { setModalYear(null); setModalIndex(null); };
    const goPrev = () => {
        if (!modalYear || modalIndex === null) return;
        const len = galleries[modalYear].length;
        setModalIndex((i) => (i === 0 ? len - 1 : i! - 1));
    };
    const goNext = () => {
        if (!modalYear || modalIndex === null) return;
        const len = galleries[modalYear].length;
        setModalIndex((i) => (i === len - 1 ? 0 : i! + 1));
    };

    return (
        <>
            <div className="space-y-14">
                {sortedYears.map((year) => {
                    const images = galleries[year];
                    const hasImages = images.length > 0;
                    const isOpen = openSections[year];

                    return (
                        <div key={year}>
                            {/* Section header */}
                            <button
                                className="w-full flex items-center gap-5 mb-8 text-left group focus:outline-none"
                                onClick={() =>
                                    hasImages &&
                                    setOpenSections((prev) => ({ ...prev, [year]: !prev[year] }))
                                }
                                disabled={!hasImages}
                            >
                                <span
                                    className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight transition-colors duration-200 ${hasImages
                                        ? "text-white group-hover:text-[#D4A348]"
                                        : "text-white/25"
                                        }`}
                                >
                                    {year}
                                </span>

                                {hasImages ? (
                                    <>
                                        <span className="text-white/35 text-sm sm:text-base font-medium">{images.length} photos</span>
                                        <div className="flex-1 h-[1.5px] bg-white/8 group-hover:bg-[#D4A348]/25 transition-colors duration-200" />
                                        <span className="text-white/30 text-sm">{isOpen ? "▲" : "▼"}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xs font-semibold tracking-widest uppercase text-[#D4A348]/60 border border-[#D4A348]/20 rounded-full px-3 py-1">
                                            Coming Soon
                                        </span>
                                        <div className="flex-1 h-[1.5px] bg-white/5" />
                                    </>
                                )}
                            </button>

                            {/* Image grid */}
                            {hasImages && isOpen && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                                    {images.map((image, index) => (
                                        <div
                                            key={image.id}
                                            className="group relative aspect-video overflow-hidden rounded-xl bg-white/5 cursor-pointer border border-white/5 hover:border-[#D4A348]/30 transition-colors duration-300 [transform:translateZ(0)] [backface-visibility:hidden]"
                                            onClick={() => { setModalYear(year); setModalIndex(index); }}
                                        >
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
                                                fill
                                                quality={85}
                                                loading="lazy"
                                                decoding="async"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105 [backface-visibility:hidden]"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                style={{ imageRendering: "auto", WebkitFontSmoothing: "antialiased" }}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Lightbox */}
            <Dialog open={modalYear !== null && modalIndex !== null} onOpenChange={closeModal}>
                <DialogContent className="max-w-5xl w-[95vw] md:w-[85vw] lg:w-[75vw] p-0 bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    <DialogTitle className="sr-only">Image Preview</DialogTitle>

                    {/* Close */}
                    <button
                        className="absolute right-3 top-3 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        onClick={closeModal}
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {modalYear && modalIndex !== null && (
                        <div className="flex flex-col">
                            {/* Image */}
                            <div className="relative w-full aspect-video bg-black">
                                <Image
                                    src={galleries[modalYear][modalIndex].src}
                                    alt={galleries[modalYear][modalIndex].alt}
                                    fill
                                    quality={85}
                                    className="object-contain"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <button
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-[#D4A348]/20 border border-white/15 hover:border-[#D4A348]/40 text-white hover:text-[#D4A348] transition-all"
                                    onClick={goPrev}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-[#D4A348]/20 border border-white/15 hover:border-[#D4A348]/40 text-white hover:text-[#D4A348] transition-all"
                                    onClick={goNext}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Counter */}
                            <div className="flex items-center justify-between px-5 py-3 border-t border-white/8 bg-[#0a0a0a]">
                                <span className="text-white/40 text-sm">{modalYear} Season</span>
                                <span className="text-white/50 text-sm">
                                    <span className="text-[#D4A348] font-bold">{modalIndex + 1}</span>
                                    {" / "}
                                    {galleries[modalYear].length}
                                </span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
