"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plane, Users, Award, ShieldAlert, Calendar, Trophy, Send, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TechText } from "@/components/tech-text";
import { GlowCard } from "@/components/glow-card";

const HolographicUAV = dynamic(() => import("@/components/holographic-uav"), { ssr: false });
const UAVHotspots = dynamic(() => import("@/components/uav-hotspots"), { ssr: false });
const InfiniteMarquee = dynamic(() => import("@/components/marquee"), { ssr: false });
const StarryBackground = dynamic(() => import("@/components/StarryBackground"), { ssr: false });

const testimonials = [
  {
    text: "Founding Team Maverick India was more than just starting a team—it was about building a legacy of passion, innovation, and resilience. From winning a national championship to securing a global top 10 rank, our journey has proven that no dream is too big when backed by determination and teamwork. This website stands as a testament to our unwavering spirit and the limitless potential of those who dare to dream. From Pune to Los Angeles, Team Maverick has been and will be a family. A family of honour, respect and love. To every future Maverick: cherish the journey, honor the struggles, and remember—dreams take flight when hearts beat as one.",
    author: "Mr. Mihir Zambare",
    role: "Founder & Ex-Managing Director",
    image: "/images/team/mihir.webp"
  },
  {
    text: `Being part of this team was an incredible journey that shaped me in countless ways. I loved spending hours at work in college with my team family—because "members" just don’t cut it! This wasn’t just about learning aerodynamics, teamwork, or leadership; it was about life and rising stronger after every fall. From crashes and failures to successful flights and victories, this team has been truly a Maverick experience like no other. I’ll forever be grateful for how it shaped me personally, and I’d happily relive those Maverick days anytime.`,
    author: "Ms. Rifa Ansari",
    role: "Ex-Managing Director 24'",
    image: "/images/team/rifa.webp"
  }
];

const stats = [
  { id: "members", count: "40+", label: "Active Engineers", icon: Users },
  { id: "competitions", count: "8+", label: "Competitions Entered", icon: Plane },
  { id: "awards", count: "12+", label: "Awards & Podiums", icon: Trophy },
  { id: "experience", count: "5+", label: "Years of Excellence", icon: Award }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("aero");
  
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden scanlines grid-pattern">
      <div className="hidden dark:block">
        <StarryBackground />
      </div>
      <HolographicUAV />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 overflow-hidden pt-16">
        
        {/* Soft radial overlay behind text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-background/60 to-background z-0 pointer-events-none" />

        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 w-full flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -120, skewX: -10 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
              className="mb-4"
            >
              <span className="px-3 py-1 rounded-full border border-[#DFBA73]/30 bg-[#DFBA73]/5 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBA73] shadow-[0_0_15px_rgba(212,163,72,0.1)]">
                <TechText text="Official Flight Hangar" trigger="mount" />
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -160, skewX: -15 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-7xl font-extrabold uppercase tracking-tight text-foreground mb-6 font-montserrat"
            >
              ENGINEERING THE FUTURE OF <span className="text-[#DFBA73] text-gold-glow"><TechText text="FLIGHT" trigger="mount" /></span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -120, skewX: -8 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              transition={{ duration: 1.1, delay: 0.8, ease: "easeOut" }}
              className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 tracking-wide font-light leading-relaxed animate-pulse-subtle"
            >
              Team Maverick India: Wolves of the Sky. Developing cutting-edge autonomous fixed-wing UAVs pushing the boundaries of aerodynamic design.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -80, skewX: -5 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              transition={{ duration: 1.0, delay: 1.0, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center w-full max-w-md"
            >
              <Button
                onClick={() => scrollToSection(showcaseRef)}
                className="w-full sm:w-auto bg-[#DFBA73] text-black hover:bg-yellow-400 font-semibold tracking-wider uppercase px-8 py-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(212,163,72,0.3)] active:scale-95"
              >
                Explore Vehicle Systems
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto border-[#DFBA73]/30 text-foreground hover:bg-[#DFBA73]/10 font-semibold tracking-wider uppercase px-8 py-6 rounded-lg transition-all duration-300 active:scale-95"
              >
                <Link href="/team">Meet The Wolves</Link>
              </Button>
            </motion.div>
          </div>

          {/* Space slot for the WebGL canvas drone positioning on the right */}
          <div className="w-full lg:w-1/2 h-[300px] lg:h-[500px] pointer-events-none lg:block hidden" />
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => scrollToSection(showcaseRef)}>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Scroll Hangar</span>
          <div className="w-[1.5px] h-8 bg-gradient-to-b from-[#DFBA73] to-transparent animate-pulse" />
        </div>
      </section>

      {/* --- INTERACTIVE 3D VEHICLE SHOWCASE --- */}
      <section ref={showcaseRef} className="py-24 max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.25em]">Telemetry & Specs</span>
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-foreground mt-2 mb-4 font-montserrat">
            INTERACTIVE VEHICLE SHOWCASE
          </h2>
          <div className="w-24 h-1 bg-[#DFBA73] mx-auto rounded-full" />
        </div>

        <UAVHotspots />
      </section>

      {/* --- VIRTUAL WORKSHOP / HANGAR CONSOLE --- */}
      <section className="py-24 bg-slate-100/40 dark:bg-black/30 border-y border-[#DFBA73]/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.2em]">Wolves Workshop</span>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-foreground mt-2 mb-6 font-montserrat">
                VIRTUAL HANGAR CONSOLE
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Step inside our fabrication lab. From composite layup and mechanical milling to avionics programming and test flight data analysis, every wing surface is designed for peak efficiency.
              </p>
              
              {/* Virtual console nav links */}
              <div className="space-y-4">
                <Link href="/planes" className="flex items-center justify-between p-4 rounded-lg bg-card/65 dark:bg-black/60 border border-[#DFBA73]/10 hover:border-[#DFBA73]/40 hover:bg-[#DFBA73]/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <Plane className="w-5 h-5 text-[#DFBA73]" />
                    <span className="font-semibold text-foreground tracking-wide">Aircraft Fleet Directory</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#DFBA73] transition-colors" />
                </Link>
                <Link href="/gallery" className="flex items-center justify-between p-4 rounded-lg bg-card/65 dark:bg-black/60 border border-[#DFBA73]/10 hover:border-[#DFBA73]/40 hover:bg-[#DFBA73]/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#DFBA73]" />
                    <span className="font-semibold text-foreground tracking-wide">Gallery & Test Flights</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#DFBA73] transition-colors" />
                </Link>
                <Link href="/sponsors" className="flex items-center justify-between p-4 rounded-lg bg-card/65 dark:bg-black/60 border border-[#DFBA73]/10 hover:border-[#DFBA73]/40 hover:bg-[#DFBA73]/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-[#DFBA73]" />
                    <span className="font-semibold text-foreground tracking-wide">Sponsors Showcase Wall</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#DFBA73] transition-colors" />
                </Link>
              </div>
            </div>
            
            <div className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden border border-[#DFBA73]/20 bg-card dark:bg-black/50 shadow-2xl flex items-center justify-center p-4">
              <Image
                src="/images/home/newabout.png"
                alt="Maverick Aircraft Fleet"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-75 hover:opacity-100 transition-opacity duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 z-10 text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#DFBA73] bg-[#DFBA73]/10 px-2 py-0.5 rounded border border-[#DFBA73]/20">MOHAV-II</span>
                <h4 className="text-xl font-bold text-white mt-1 tracking-wide">International Competitor</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATISTICS SECTION --- */}
      <section className="py-20 max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <GlowCard key={stat.id} className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-[#DFBA73]/10 mb-4 border border-[#DFBA73]/10 w-fit">
                  <Icon className="w-6 h-6 text-[#DFBA73]" />
                </div>
                <span className="text-3xl md:text-4xl font-extrabold text-foreground mb-1 font-montserrat">
                  <TechText text={stat.count} trigger="view" />
                </span>
                <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase block mt-1">{stat.label}</span>
              </GlowCard>
            );
          })}
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-24 bg-black/20 border-t border-[#DFBA73]/10 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.25em]">Voices from Hangar</span>
          <h2 className="text-3xl font-extrabold uppercase text-foreground mt-2 mb-12 font-montserrat">
            MAVERICK FAMILY TESTIMONIALS
          </h2>
          
          <div className="relative min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="glass-panel p-8 md:p-12 rounded-2xl relative border border-[#DFBA73]/20 text-justify"
              >
                <p className="text-foreground/80 italic text-base md:text-lg mb-8 leading-relaxed text-center">
                  "{testimonials[currentIndex].text}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-[#DFBA73]/30 flex-shrink-0">
                    <Image
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].author}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground tracking-wide">{testimonials[currentIndex].author}</p>
                    <p className="text-xs text-[#DFBA73] font-medium tracking-wide uppercase mt-0.5">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  currentIndex === index ? "bg-[#DFBA73] scale-125 shadow-[0_0_8px_#DFBA73]" : "bg-gray-600 hover:bg-gray-500"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- SPONSORS INFINITE MARQUEE --- */}
      <section className="py-16 bg-black/40 relative z-10">
        <div className="text-center mb-8">
          <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.2em]">Partner Network</span>
          <h3 className="text-sm font-semibold tracking-[0.3em] uppercase text-muted-foreground mt-1">Our Sponsors & Partners</h3>
        </div>
        <InfiniteMarquee />
      </section>
    </div>
  );
}
