"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";

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

const rowVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, x: 80, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
};

const sortedYears = Object.keys(galleries).sort((a, b) => Number(b) - Number(a));

export default function GalleryGrid() {
    const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const [modalYear, setModalYear] = useState<string | null>(null);
    const [modalIndex, setModalIndex] = useState<number | null>(null);
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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

    const scrollRow = (year: string, direction: "left" | "right") => {
        const container = rowRefs.current[year];
        if (!container) return;
        const scrollAmount = container.clientWidth * 0.75;
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    // Autoplay slideshow effect for horizontal lanes
    useEffect(() => {
        const intervals = sortedYears.map((year) => {
            return setInterval(() => {
                // Do not auto-scroll if row is hovered, or if modal preview is active
                if (hoveredRow === year || modalYear !== null) return;

                const container = rowRefs.current[year];
                if (!container) return;

                const maxScroll = container.scrollWidth - container.clientWidth;
                if (container.scrollLeft >= maxScroll - 8) {
                    // Smooth wrap back to start
                    container.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    // Scroll by one card width + gap
                    const firstChild = container.firstElementChild as HTMLElement;
                    const cardWidth = firstChild?.clientWidth || 240;
                    container.scrollBy({ left: cardWidth + 16, behavior: "smooth" });
                }
            }, 4500); // Trigger scroll every 4.5 seconds
        });

        return () => {
            intervals.forEach((interval) => clearInterval(interval));
        };
    }, [hoveredRow, modalYear]);

    return (
        <>
            <div className="space-y-16">
                {sortedYears.map((year) => {
                    const images = galleries[year];
                    const hasImages = images.length > 0;

                    return (
                        <div 
                            key={year} 
                            onMouseEnter={() => setHoveredRow(year)}
                            onMouseLeave={() => setHoveredRow(null)}
                            className="relative group/row border-b border-[#D4A348]/10 pb-12 last:border-0"
                        >
                            {/* Section header */}
                            <div className="flex items-center gap-5 mb-8 text-left select-none">
                                <span
                                    className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${hasImages
                                        ? "text-foreground"
                                        : "text-muted-foreground/30"
                                        }`}
                                >
                                    {year}
                                </span>

                                {hasImages ? (
                                    <>
                                        <span className="text-muted-foreground/60 text-xs sm:text-sm font-mono uppercase tracking-wider">{images.length} frames loaded</span>
                                        <div className="flex-1 h-[1px] bg-border dark:bg-white/5" />
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4A348]/60 border border-[#D4A348]/20 rounded-full px-3 py-1">
                                            Coming Soon
                                        </span>
                                        <div className="flex-1 h-[1px] bg-border/40 dark:bg-white/5" />
                                    </>
                                )}
                            </div>

                            {/* Image Row Wrapper */}
                            {hasImages && (
                                <div className="relative w-full">
                                    {/* Left Arrow Button */}
                                    <button
                                        onClick={() => scrollRow(year, "left")}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/85 border border-[#D4A348]/30 text-foreground hover:text-[#D4A348] hover:bg-[#D4A348]/10 hover:border-[#D4A348] opacity-0 group-hover/row:opacity-100 transition-all duration-300 z-20 pointer-events-auto hidden md:flex shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                                        aria-label="Scroll Left"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {/* Right Arrow Button */}
                                    <button
                                        onClick={() => scrollRow(year, "right")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/85 border border-[#D4A348]/30 text-foreground hover:text-[#D4A348] hover:bg-[#D4A348]/10 hover:border-[#D4A348] opacity-0 group-hover/row:opacity-100 transition-all duration-300 z-20 pointer-events-auto hidden md:flex shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                                        aria-label="Scroll Right"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>

                                    {/* Scrollable Container */}
                                    <motion.div
                                        ref={(el) => { rowRefs.current[year] = el; }}
                                        variants={rowVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                                        className="flex overflow-x-auto gap-4 sm:gap-5 pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none pointer-events-auto"
                                    >
                                        {images.map((image, index) => (
                                            <motion.div
                                                key={image.id}
                                                variants={cardVariants}
                                                className="group relative aspect-video h-[180px] sm:h-[220px] shrink-0 rounded-xl bg-card border border-border/50 dark:border-white/5 hover:border-[#D4A348]/40 shadow-lg cursor-pointer overflow-hidden snap-start transition-colors duration-300 pointer-events-auto"
                                                onClick={() => { setModalYear(year); setModalIndex(index); }}
                                            >
                                                <Image
                                                    src={image.src}
                                                    alt={image.alt}
                                                    fill
                                                    quality={80}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 100vw, 300px"
                                                />
                                                
                                                {/* Tech HUD Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3 select-none pointer-events-none font-mono text-[8px] text-[#D4A348]">
                                                    {/* Top Panel */}
                                                    <div className="flex justify-between items-start">
                                                        <span>[SYS_PING: OK]</span>
                                                        <span>SEAS_{year}</span>
                                                    </div>
                                                    
                                                    {/* Center Reticle */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-[#D4A348]/20 rounded-full flex items-center justify-center opacity-60">
                                                        <div className="w-0.5 h-0.5 bg-[#D4A348] rounded-full" />
                                                        <div className="absolute top-0 w-[1px] h-1.5 bg-[#D4A348]/40" />
                                                        <div className="absolute bottom-0 w-[1px] h-1.5 bg-[#D4A348]/40" />
                                                        <div className="absolute left-0 w-1.5 h-[1px] bg-[#D4A348]/40" />
                                                        <div className="absolute right-0 w-1.5 h-[1px] bg-[#D4A348]/40" />
                                                    </div>

                                                    {/* Bottom Panel */}
                                                    <div className="flex justify-between items-end">
                                                        <span>FRAME_0{image.id}</span>
                                                        <span>ALTITUDE: {35 + image.id * 2}M</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Lightbox */}
            <Dialog open={modalYear !== null && modalIndex !== null} onOpenChange={closeModal}>
                <DialogContent className="max-w-5xl w-[95vw] md:w-[85vw] lg:w-[75vw] p-0 bg-background border border-border rounded-xl overflow-hidden shadow-2xl z-[99999]">
                    <DialogTitle className="sr-only">Image Preview</DialogTitle>

                    {/* Close */}
                    <button
                        className="absolute right-3 top-3 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-colors"
                        onClick={closeModal}
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {modalYear && modalIndex !== null && (
                        <div className="flex flex-col">
                            {/* Image */}
                            <div className="relative w-full aspect-video bg-black/95 dark:bg-black">
                                <Image
                                    src={galleries[modalYear][modalIndex].src}
                                    alt={galleries[modalYear][modalIndex].alt}
                                    fill
                                    quality={90}
                                    className="object-contain"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <button
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-background/70 hover:bg-[#D4A348]/20 border border-border text-foreground hover:text-[#D4A348] transition-all"
                                    onClick={goPrev}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-background/70 hover:bg-[#D4A348]/20 border border-border text-foreground hover:text-[#D4A348] transition-all"
                                    onClick={goNext}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Counter */}
                            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-card/60 font-mono text-xs">
                                <span className="text-muted-foreground">Season {modalYear} Flight logs</span>
                                <span className="text-muted-foreground">
                                    <span className="text-[#D4A348] font-bold">FRAME {modalIndex + 1}</span>
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
