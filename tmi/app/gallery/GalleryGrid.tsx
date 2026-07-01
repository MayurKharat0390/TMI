"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

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

export default function GalleryGrid() {
    const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [galleries, setGalleries] = useState<Record<string, ImageItem[]>>({});
    const [loading, setLoading] = useState(true);

    const [modalYear, setModalYear] = useState<string | null>(null);
    const [modalIndex, setModalIndex] = useState<number | null>(null);
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    const fetchGallery = async () => {
        try {
            const res = await fetch("/api/gallery");
            if (res.ok) {
                const data = await res.json();
                setGalleries(data);
            }
        } catch (e) {
            console.error("Failed to load gallery catalog", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const sortedYears = Object.keys(galleries).sort((a, b) => Number(b) - Number(a));

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
        if (sortedYears.length === 0 || modalYear !== null) return;

        const intervals = sortedYears.map((year) => {
            return setInterval(() => {
                // Do not auto-scroll if row is hovered, or if modal preview is active
                if (hoveredRow === year || modalYear !== null) return;

                const container = rowRefs.current[year];
                if (!container) return;

                const maxScrollLeft = container.scrollWidth - container.clientWidth;
                
                // If reached the end, snap back to start
                if (container.scrollLeft >= maxScrollLeft - 10) {
                    container.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    container.scrollBy({ left: 240, behavior: "smooth" });
                }
            }, 4500); // Scroll every 4.5 seconds
        });

        return () => {
            intervals.forEach((interval) => clearInterval(interval));
        };
    }, [galleries, hoveredRow, modalYear]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-3 py-16">
                <div className="w-8 h-8 rounded-full border-2 border-[#DFBA73] border-t-transparent animate-spin" />
                <p className="text-xs uppercase tracking-widest text-[#DFBA73]">Loading Gallery Catalog...</p>
            </div>
        );
    }

    return (
        <div className="space-y-16">
            {sortedYears.length > 0 ? (
                sortedYears.map((year) => (
                    <div 
                        key={year} 
                        className="space-y-4"
                        onMouseEnter={() => setHoveredRow(year)}
                        onMouseLeave={() => setHoveredRow(null)}
                    >
                        {/* Section Header with Left/Right Buttons */}
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-[#DFBA73]">{year} Season</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => scrollRow(year, "left")}
                                    className="p-1.5 rounded-lg border border-border/80 text-muted-foreground hover:text-[#DFBA73] hover:border-[#DFBA73] transition-all bg-card/10 hover:bg-[#DFBA73]/5"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => scrollRow(year, "right")}
                                    className="p-1.5 rounded-lg border border-border/80 text-muted-foreground hover:text-[#DFBA73] hover:border-[#DFBA73] transition-all bg-card/10 hover:bg-[#DFBA73]/5"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Horizontal Image Scroll Containers */}
                        <div 
                            ref={(el) => { rowRefs.current[year] = el; }}
                            className="flex overflow-x-auto gap-6 scrollbar-hide py-2 scroll-smooth select-none"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            <motion.div 
                                variants={rowVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-40px" }}
                                className="flex gap-6 flex-shrink-0"
                            >
                                {galleries[year].map((img, idx) => (
                                    <motion.div
                                        key={img.id}
                                        variants={cardVariants}
                                        onClick={() => { setModalYear(year); setModalIndex(idx); }}
                                        className="relative w-[320px] h-[220px] rounded-xl overflow-hidden border border-border bg-card/20 shadow-md cursor-pointer hover:border-[#DFBA73]/40 transition-all hover:shadow-[#DFBA73]/5 hover:-translate-y-0.5"
                                    >
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            fill
                                            sizes="320px"
                                            className="object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="rounded-2xl border border-dashed border-border p-16 text-center space-y-3">
                    <ShieldAlert className="w-10 h-10 text-[#DFBA73]/60 mx-auto" />
                    <h4 className="text-lg font-bold text-foreground uppercase tracking-widest">
                        No Images Found
                    </h4>
                    <p className="text-muted-foreground text-xs max-w-sm mx-auto leading-relaxed">
                        Wait for admin updates.
                    </p>
                </div>
            )}

            {/* Modal Slideshow Dialog */}
            <Dialog open={modalYear !== null} onOpenChange={(open) => { if (!open) closeModal(); }}>
                <DialogContent className="max-w-5xl bg-black/95 border-none p-0 flex items-center justify-center h-[80vh] overflow-hidden select-none">
                    <DialogTitle className="sr-only">Image Gallery Slideshow</DialogTitle>
                    {modalYear && modalIndex !== null && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-white/70 hover:text-white transition-all bg-black/40 hover:bg-black/60 p-2 rounded-full z-50 border border-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Image View */}
                            <div className="relative w-[90%] h-[85%]">
                                <Image
                                    src={galleries[modalYear][modalIndex].src}
                                    alt={galleries[modalYear][modalIndex].alt}
                                    fill
                                    sizes="100vw"
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Navigation Left */}
                            <button
                                onClick={goPrev}
                                className="absolute left-4 p-2 rounded-full border border-white/10 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 transition-all z-40"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            {/* Navigation Right */}
                            <button
                                onClick={goNext}
                                className="absolute right-4 p-2 rounded-full border border-white/10 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 transition-all z-40"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
