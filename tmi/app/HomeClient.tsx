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

const heroDescriptions = [
  "Team Maverick India designs, simulates, and manufactures advanced autonomous Unmanned Aerial Vehicles (UAVs), pushing the boundaries of aerodynamics and robotic flight control.",
  "Representing India globally, we design and manufacture heavy-lift tactical fixed-wing aircraft and VTOLs, competing on podiums at international SAE Aero Design competitions in the USA.",
  "From structural carbon-fiber fabrication to custom hardware-in-the-loop autopilot simulations, our student engineers master every stage of advanced aeronautical development.",
  "Equipped with military-spec sensor turrets, triple-lens telemetry, and obstacle avoidance systems, our UAVs are engineered for automated reconnaissance and disaster management."
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [descIndex, setDescIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("aero");
  
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDescIndex((prev) => (prev + 1) % heroDescriptions.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      <HolographicUAV />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 overflow-hidden pt-16">
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#DFBA73]/5 via-background/50 to-background z-0 pointer-events-none" />

        <div className="relative z-30 max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center pointer-events-none pt-12">
          <div id="hero-data" className="flex flex-col items-center text-center max-w-xl pointer-events-auto mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mb-6"
            >
              <span className="px-4 py-1.5 rounded-full border border-border bg-card/50 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#C29F53]">
                P.C.C.O.E. Pune • Unmanned Aerial Systems Team
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7.5xl font-extrabold uppercase tracking-tight text-foreground mb-6 font-montserrat leading-[1.1]"
            >
              Engineering the Future of <span className="text-[#DFBA73]">Aviation</span>
            </motion.h1>
            {/* ROTATING DESCRIPTION PARAGRAPH */}
            <div className="w-full h-[96px] sm:h-[80px] md:h-[68px] relative mb-8 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.p
                  key={descIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="text-muted-foreground text-sm sm:text-base md:text-lg tracking-wide font-light leading-relaxed text-center absolute w-full max-w-xl mx-auto"
                >
                  {heroDescriptions[descIndex]}
                </motion.p>
              </AnimatePresence>
            </div>



            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="flex items-center justify-center gap-4 mb-8 pointer-events-auto w-full"
            >
              <Button asChild size="lg" className="rounded-full bg-[#DFBA73] hover:bg-[#DFBA73]/90 text-background font-semibold tracking-wide">
                <Link href="/planes">Explore Fleet</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-border hover:bg-muted text-foreground tracking-wide">
                <Link href="/contact">Contact Team</Link>
              </Button>
            </motion.div>
          </div>
          
          {/* Right Column: Empty spacer for fixed 3D Drone */}
          <div className="w-full h-[300px] lg:h-[500px] hidden lg:block pointer-events-none" />
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => scrollToSection(showcaseRef)}>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Explore UAV Fleet</span>
          <div className="w-[1.5px] h-8 bg-gradient-to-b from-[#DFBA73] to-transparent animate-pulse" />
        </div>
      </section>

      {/* --- INTERACTIVE 3D VEHICLE SHOWCASE --- */}
      <section id="showcase-section" ref={showcaseRef} className="py-24 max-w-6xl mx-auto px-6 relative z-10">
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
      <section id="hangar-section" className="py-24 bg-slate-100/40 dark:bg-black/30 border-y border-[#DFBA73]/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Holographic Workbench placeholder frame for the 3D Drone */}
            <div className="relative h-[350px] md:h-[450px] rounded-2xl border border-dashed border-[#DFBA73]/25 bg-gradient-to-br from-[#DFBA73]/5 to-transparent flex items-center justify-center p-4 overflow-hidden pointer-events-none order-2 md:order-1">
              <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute top-4 left-4 z-10 text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#DFBA73] bg-[#DFBA73]/15 px-2.5 py-1 rounded border border-[#DFBA73]/20">Holographic Workbench</span>
              </div>
            </div>

            {/* Right Column: Workshop Data & Info */}
            <div className="flex flex-col text-left order-1 md:order-2">
              <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.2em]">Wolves Workshop</span>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-foreground mt-2 mb-6 font-montserrat">
                VIRTUAL HANGAR CONSOLE
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed text-left">
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
