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

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 overflow-hidden pt-16">
        
        {/* Full-bleed Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
          <video
            src="/images/home/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover grayscale brightness-[0.35] transition-all duration-1000"
          />
          {/* Subtle dark gradient overlay to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/60 z-10" />
        </div>

        <div className="relative z-30 max-w-6xl mx-auto px-6 w-full pointer-events-none pt-12 flex items-center justify-center">
          <div id="hero-data" className="flex flex-col items-center text-center max-w-3xl pointer-events-auto mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mb-6"
            >
              <span className="px-4 py-1.5 rounded-full border border-[#DFBA73]/30 bg-black/55 backdrop-blur-sm text-[10px] sm:text-xs font-sans font-medium uppercase tracking-[0.2em] text-[#DFBA73]">
                P.C.C.O.E. Pune • Unmanned Aerial Systems Team
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-[72px] font-cormorant font-normal text-white mb-6 leading-[1.1]"
            >
              Engineering the Future of <span className="italic font-light text-[#DFBA73]">Aviation</span>
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
                  className="text-gray-200 text-sm sm:text-base md:text-lg tracking-wide font-sans font-light leading-relaxed text-center absolute w-full max-w-xl mx-auto"
                >
                  {heroDescriptions[descIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="flex items-center justify-center gap-4 mb-10 pointer-events-auto w-full"
            >
              <Button asChild size="lg" className="rounded-full bg-[#DFBA73] hover:bg-[#DFBA73]/90 text-background font-sans font-semibold tracking-wider px-8 uppercase text-[11px]">
                <Link href="/planes">Explore Fleet</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-sans font-semibold tracking-wider px-8 uppercase text-[11px] backdrop-blur-sm">
                <Link href="/contact">Contact Team</Link>
              </Button>
            </motion.div>

            {/* Inline Stats Deck */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 1.0 }}
              className="flex flex-wrap gap-8 justify-center border-t border-white/10 pt-6 w-full max-w-xl pointer-events-auto"
            >
              <div className="text-center px-4">
                <span className="text-[10px] text-[#DFBA73] font-sans font-medium uppercase tracking-[0.18em] block mb-1">World Rank</span>
                <span className="text-xl font-sans font-semibold text-white">06</span>
              </div>
              <div className="border-l border-white/10 px-8 text-center">
                <span className="text-[10px] text-[#DFBA73] font-sans font-medium uppercase tracking-[0.18em] block mb-1">National Rank</span>
                <span className="text-xl font-sans font-semibold text-white">02</span>
              </div>
              <div className="border-l border-white/10 px-8 text-center">
                <span className="text-[10px] text-[#DFBA73] font-sans font-medium uppercase tracking-[0.18em] block mb-1">Podium Finishes</span>
                <span className="text-xl font-sans font-semibold text-white">12+</span>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity z-20" onClick={() => scrollToSection(showcaseRef)}>
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-gray-300">Explore UAV Fleet</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#DFBA73] to-transparent" />
        </div>
      </section>

      {/* --- PREMIUM VEHICLE SHOWCASE / FEATURES GRID --- */}
      <section id="showcase-section" ref={showcaseRef} className="py-24 max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.25em] font-sans">Engineering Specs</span>
          <h2 className="text-3xl md:text-5xl font-cormorant font-normal text-foreground mt-2 mb-4">
            Aeronautical Excellence
          </h2>
          <div className="w-16 h-[1px] bg-[#DFBA73]/50 mx-auto mb-6" />
          <p className="text-muted-foreground text-sm tracking-wide max-w-xl mx-auto leading-relaxed font-sans font-light">
            Pushing the boundaries of student-led aerospace engineering with advanced autonomous systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Aerodynamics */}
          <div className="group rounded-2xl border border-border bg-card/10 backdrop-blur-sm overflow-hidden hover:border-[#DFBA73]/30 transition-all duration-300 flex flex-col justify-between shadow-lg">
            <div className="p-8">
              <span className="text-xs text-[#DFBA73] font-sans font-medium uppercase tracking-widest block mb-3">01 / Design</span>
              <h3 className="text-2xl font-cormorant font-normal text-foreground mb-4">Aerodynamic Optimization</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-sans font-light">
                Utilizing ANSYS Fluent for high-fidelity computational fluid dynamics (CFD) simulation to maximize lift-to-drag ratios.
              </p>
            </div>
            <div className="relative h-48 w-full overflow-hidden image-subtle-overlay">
              <Image
                src="/images/planes/daredevil.webp"
                alt="Aerodynamics Design"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Card 2: Autopilot */}
          <div className="group rounded-2xl border border-border bg-card/10 backdrop-blur-sm overflow-hidden hover:border-[#DFBA73]/30 transition-all duration-300 flex flex-col justify-between shadow-lg">
            <div className="p-8">
              <span className="text-xs text-[#DFBA73] font-sans font-medium uppercase tracking-widest block mb-3">02 / Systems</span>
              <h3 className="text-2xl font-cormorant font-normal text-foreground mb-4">Autonomous Navigation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-sans font-light">
                Equipped with Pixhawk autopilots and ArduPilot firmware for waypoint navigation, auto-takeoff, and automated landing sequences.
              </p>
            </div>
            <div className="relative h-48 w-full overflow-hidden image-subtle-overlay">
              <Image
                src="/images/planes/shourya.webp"
                alt="Autonomous Flight"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Card 3: Fabrication */}
          <div className="group rounded-2xl border border-border bg-card/10 backdrop-blur-sm overflow-hidden hover:border-[#DFBA73]/30 transition-all duration-300 flex flex-col justify-between shadow-lg">
            <div className="p-8">
              <span className="text-xs text-[#DFBA73] font-sans font-medium uppercase tracking-widest block mb-3">03 / Structures</span>
              <h3 className="text-2xl font-cormorant font-normal text-foreground mb-4">Composite Fabrication</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-sans font-light">
                Employing carbon fiber layup, vacuum bagging, and high-strength balsa ribs for optimal structural rigidity at minimum empty weight.
              </p>
            </div>
            <div className="relative h-48 w-full overflow-hidden image-subtle-overlay">
              <Image
                src="/images/planes/mohav.webp"
                alt="Carbon Fiber Structures"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- VIRTUAL WORKSHOP / HANGAR CONSOLE --- */}
      <section id="hangar-section" className="py-24 bg-slate-100/30 dark:bg-card/10 border-y border-border relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Workshop Hangar Image with subtle hover and overlay */}
            <div className="relative h-[350px] md:h-[450px] rounded-2xl border border-border bg-card/10 overflow-hidden order-2 md:order-1 shadow-xl group">
              <Image
                src="/images/home/newabout.png"
                alt="Maverick Fabrication Hangar"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 z-10 text-left pointer-events-none">
                <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-[#DFBA73] bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded border border-[#DFBA73]/20">Maverick Hangar</span>
              </div>
            </div>

            {/* Right Column: Workshop Data & Info */}
            <div className="flex flex-col text-left order-1 md:order-2">
              <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.2em] font-sans">Wolves Workshop</span>
              <h2 className="text-3xl md:text-4xl font-cormorant font-normal text-foreground mt-2 mb-6">
                Virtual Hangar Console
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed text-left font-sans font-light text-sm sm:text-base">
                Step inside our fabrication lab. From composite layup and mechanical milling to avionics programming and test flight data analysis, every wing surface is designed for peak efficiency.
              </p>
              
              {/* Virtual console nav links */}
              <div className="space-y-4">
                <Link href="/planes" className="flex items-center justify-between p-4 rounded-xl bg-card/40 dark:bg-card/20 backdrop-blur-sm border border-border hover:border-[#DFBA73]/30 hover:bg-[#DFBA73]/5 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-[#DFBA73]/8 border border-[#DFBA73]/20">
                      <Plane className="w-5 h-5 text-[#DFBA73]" />
                    </div>
                    <span className="font-sans font-medium text-foreground tracking-wide text-sm sm:text-base">Aircraft Fleet Directory</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#DFBA73] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link href="/gallery" className="flex items-center justify-between p-4 rounded-xl bg-card/40 dark:bg-card/20 backdrop-blur-sm border border-border hover:border-[#DFBA73]/30 hover:bg-[#DFBA73]/5 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-[#DFBA73]/8 border border-[#DFBA73]/20">
                      <Users className="w-5 h-5 text-[#DFBA73]" />
                    </div>
                    <span className="font-sans font-medium text-foreground tracking-wide text-sm sm:text-base">Gallery & Test Flights</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#DFBA73] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link href="/sponsors" className="flex items-center justify-between p-4 rounded-xl bg-card/40 dark:bg-card/20 backdrop-blur-sm border border-border hover:border-[#DFBA73]/30 hover:bg-[#DFBA73]/5 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-[#DFBA73]/8 border border-[#DFBA73]/20">
                      <Award className="w-5 h-5 text-[#DFBA73]" />
                    </div>
                    <span className="font-sans font-medium text-foreground tracking-wide text-sm sm:text-base">Sponsors Showcase Wall</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#DFBA73] group-hover:translate-x-1 transition-all" />
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
                <span className="text-4xl md:text-5xl font-sans font-semibold text-foreground mb-1 tracking-tight">
                  <TechText text={stat.count} trigger="view" />
                </span>
                <span className="text-[10px] sm:text-xs text-[#DFBA73] font-sans font-medium tracking-widest uppercase block mt-2">{stat.label}</span>
              </GlowCard>
            );
          })}
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-24 bg-card/10 border-t border-border relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.25em] font-sans">Voices from the Hangar</span>
          <h2 className="text-3xl md:text-4xl font-cormorant font-normal text-foreground mt-2 mb-12">
            Maverick Family Testimonials
          </h2>
          
          <div className="relative min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="glass-panel p-8 md:p-12 rounded-2xl relative border border-border text-justify"
              >
                <p className="text-foreground/80 italic text-base md:text-lg mb-8 leading-relaxed text-center font-cormorant">
                  "{testimonials[currentIndex].text}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-[#DFBA73]/20 flex-shrink-0">
                    <Image
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].author}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-left font-sans">
                    <p className="font-semibold text-foreground tracking-wide">{testimonials[currentIndex].author}</p>
                    <p className="text-[10px] text-[#DFBA73] font-medium tracking-widest uppercase mt-0.5">{testimonials[currentIndex].role}</p>
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
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentIndex === index ? "bg-[#DFBA73] scale-125" : "bg-gray-400 dark:bg-gray-600 hover:bg-[#DFBA73]/40"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- SPONSORS INFINITE MARQUEE --- */}
      <section className="py-16 bg-card/25 relative z-10 border-t border-border">
        <div className="text-center mb-8">
          <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.2em] font-sans">Partner Network</span>
          <h3 className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mt-1">Our Sponsors & Partners</h3>
        </div>
        <div className="opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          <InfiniteMarquee />
        </div>
      </section>
    </div>
  );
}
