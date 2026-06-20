"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, Plane, Users, Award, ShieldAlert, Calendar, Trophy, Send, ChevronRight,
  Clock, Globe, Lightbulb, Cpu, Activity, Compass, Rocket, Target, Play, Wrench 
} from "lucide-react";
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
  { id: "members", count: "60+", label: "Team Members", icon: Users },
  { id: "platforms", count: "04", label: "UAV Platforms Built", icon: Plane },
  { id: "hours", count: "500+", label: "Flight Hours", icon: Clock },
  { id: "competitions", count: "12+", label: "Competitions Participated", icon: Globe },
  { id: "awards", count: "15+", label: "Awards Won", icon: Trophy }
];

const capabilities = [
  { label: "Innovate", icon: Lightbulb },
  { label: "Design", icon: Compass },
  { label: "Build", icon: Wrench },
  { label: "Test", icon: Activity },
  { label: "Fly", icon: Plane },
  { label: "Impact", icon: Rocket }
];

const featuredPlanes = [
  {
    name: "Maverick Alpha",
    tag: "Fixed Wing",
    sub: "Multi-Role UAV Platform",
    image: "/images/planes/daredevil.webp",
    endurance: "120 min",
    payload: "2.5 kg",
    range: "100 km"
  },
  {
    name: "Maverick Falcon",
    tag: "Surveillance",
    sub: "Reconnaissance & Surveillance UAV",
    image: "/images/planes/shourya.webp",
    endurance: "150 min",
    payload: "3.0 kg",
    range: "120 km"
  },
  {
    name: "Maverick X",
    tag: "VTOL",
    sub: "VTOL UAV Platform",
    image: "/images/planes/hexacopter.webp",
    endurance: "45 min",
    payload: "1.5 kg",
    range: "25 km"
  }
];

const heroDescriptions = [
  "We design, build and fly competition-grade UAVs that solve real-world problems through innovation, engineering and teamwork."
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

        <div className="relative z-30 max-w-6xl mx-auto px-6 w-full pointer-events-auto pt-16 flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Left Column: Heading, description & actions (col-span-7) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 flex flex-col text-left space-y-6 max-w-xl"
            >
              <div>
                <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#DFBA73]">
                  DESIGN &bull; BUILD &bull; FLY
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white font-sans leading-[1.05]">
                TEAM MAVERICK <span className="italic font-light text-[#DFBA73] font-cormorant font-normal">INDIA</span>
              </h1>

              <h2 className="text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#DFBA73] uppercase leading-relaxed max-w-lg">
                ENGINEERING AUTONOMOUS AERIAL SYSTEMS FOR A SMARTER TOMORROW
              </h2>

              <p className="text-gray-200 text-sm sm:text-base font-light tracking-wide leading-relaxed">
                We design, build and fly competition-grade UAVs that solve real-world problems through innovation, engineering and teamwork.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button asChild size="lg" className="rounded-full bg-[#DFBA73] hover:bg-[#DFBA73]/90 text-background font-sans font-semibold tracking-wider px-8 uppercase text-[11px]">
                  <Link href="/planes">Explore Our Aircraft</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-sans font-semibold tracking-wider px-8 uppercase text-[11px] backdrop-blur-sm">
                  <a href="https://youtube.com/@teammaverickindia" target="_blank" rel="noopener noreferrer">
                    Watch Video <Play className="w-3 h-3 ml-1.5 inline-block text-[#DFBA73] fill-[#DFBA73]" />
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Right Column: Radar (col-span-5) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:col-span-5 flex items-center justify-center lg:justify-end"
            >
              {/* SVG Radar Graphic */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Spinning Radar Sweeper */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute inset-0 w-full h-full rounded-full border border-[#DFBA73]/10"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 50%, rgba(223, 186, 115, 0.15) 100%)",
                  }}
                />

                {/* Concentric Grid Circles */}
                <div className="absolute inset-2 rounded-full border border-[#DFBA73]/15" />
                <div className="absolute inset-8 rounded-full border border-[#DFBA73]/15" />
                <div className="absolute inset-16 rounded-full border border-[#DFBA73]/15" />
                <div className="absolute inset-[72px] rounded-full border border-[#DFBA73]/20 border-dashed" />

                {/* Radar Grid Crosshairs */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#DFBA73]/15 -translate-x-1/2" />
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#DFBA73]/15 -translate-y-1/2" />

                {/* Telemetry Dots/Blips */}
                <motion.div
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute top-10 left-12 w-1.5 h-1.5 rounded-full bg-[#DFBA73] shadow-[0_0_8px_#DFBA73]"
                />
                <motion.div
                  animate={{ opacity: [1, 0.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-12 right-10 w-1.5 h-1.5 rounded-full bg-[#DFBA73] shadow-[0_0_8px_#DFBA73]"
                />

                {/* Target box */}
                <div className="absolute top-[35%] right-[30%] w-4 h-4 border border-[#DFBA73]/40 flex items-center justify-center animate-pulse">
                  <div className="w-1 h-1 bg-[#DFBA73]" />
                </div>

                {/* HUD Text overlay */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-sans font-medium uppercase tracking-[0.2em] text-[#DFBA73] bg-black/60 dark:bg-black/85 backdrop-blur-sm px-2 py-0.5 rounded border border-[#DFBA73]/30 whitespace-nowrap text-center font-bold">
                  MISSION READY // SYSTEMS CHECK: 100%
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity z-20" onClick={() => scrollToSection(showcaseRef)}>
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-muted-foreground dark:text-gray-300">Scroll to Explore</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#DFBA73] to-transparent" />
        </div>
      </section>

      {/* --- HORIZONTAL STATS CONSOLE --- */}
      <section className="relative z-30 max-w-6xl mx-auto px-6 w-full mt-12 mb-12 pointer-events-auto">
        <div className="bg-black/50 dark:bg-black/35 backdrop-blur-md border border-white/10 dark:border-[#DFBA73]/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#DFBA73]/60 dark:border-[#DFBA73]/50" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#DFBA73]/60 dark:border-[#DFBA73]/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#DFBA73]/60 dark:border-[#DFBA73]/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#DFBA73]/60 dark:border-[#DFBA73]/50" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.id} 
                  className={cn(
                    "flex flex-col items-center justify-center px-4 py-2",
                    idx > 0 && "md:border-l border-white/10 dark:border-[#DFBA73]/15"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 text-[#DFBA73] opacity-80" />
                    <span className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight">
                      <TechText text={stat.count} trigger="view" />
                    </span>
                  </div>
                  <span className="text-[9px] text-[#DFBA73] font-sans font-medium uppercase tracking-[0.18em] text-center">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- SPLIT GRID SECTION (ABOUT US & OUR AIRCRAFT) --- */}
      <section id="showcase-section" ref={showcaseRef} className="py-24 max-w-6xl mx-auto px-6 relative z-10 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Who We Are & Capabilities (col-span-5) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col text-left">
            <div>
              <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.2em] font-sans block">About Maverick</span>
              <h2 className="text-3xl md:text-5xl font-cormorant font-normal text-foreground mt-2 mb-4">
                Who We Are
              </h2>
              <div className="w-16 h-[1px] bg-[#DFBA73]/50 mb-6" />
              <p className="text-muted-foreground text-sm leading-relaxed font-sans font-light mb-6">
                Team Maverick India is the official UAV team of P.C.C.O.E. Pune. We are a group of passionate engineers building innovative aerial systems to compete at national and international UAV competitions.
              </p>
            </div>

            {/* Capabilities Icon Grid */}
            <div className="grid grid-cols-3 gap-4">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div key={cap.label} className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card/10 hover:border-[#DFBA73]/30 hover:bg-[#DFBA73]/5 transition-all duration-300 group">
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-[#DFBA73] transition-colors mb-2" />
                    <span className="text-[9px] text-muted-foreground group-hover:text-foreground font-sans font-medium uppercase tracking-[0.15em] text-center">{cap.label}</span>
                  </div>
                );
              })}
            </div>

            <Button asChild size="lg" className="rounded-full bg-[#DFBA73] hover:bg-[#DFBA73]/90 text-background font-sans font-semibold tracking-wider px-8 uppercase text-[11px] w-fit shadow-md">
              <Link href="/team" className="flex items-center gap-1">
                Know More About Us <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          {/* Right Column: Our Aircraft (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl sm:text-3xl font-cormorant font-normal text-foreground">Our Aircraft Fleet</h3>
              <Link href="/planes" className="text-[10px] text-[#DFBA73] hover:underline font-sans font-medium uppercase tracking-wider flex items-center gap-1">
                View All Aircraft <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPlanes.map((plane) => (
                <div key={plane.name} className="group rounded-xl border border-border bg-card/15 backdrop-blur-sm overflow-hidden hover:border-[#DFBA73]/30 transition-all duration-300 flex flex-col h-full shadow-lg">
                  {/* Image */}
                  <div className="relative h-40 w-full overflow-hidden image-subtle-overlay bg-muted/10">
                    <Image
                      src={plane.image}
                      alt={plane.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
                    />
                    <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm border border-[#DFBA73]/20 rounded px-1.5 py-0.5 text-[8px] text-[#DFBA73] font-sans font-medium uppercase tracking-widest z-10">
                      {plane.tag}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-cormorant font-normal text-foreground mb-1 group-hover:text-[#DFBA73] transition-colors">{plane.name}</h4>
                      <p className="text-[9px] text-muted-foreground font-sans font-medium uppercase tracking-widest mb-3">{plane.sub}</p>
                    </div>

                    {/* Mini Spec list */}
                    <div className="border-t border-border/40 pt-2.5 mt-2">
                      <div className="grid grid-cols-3 gap-1 text-center">
                        <div>
                          <span className="text-[7px] text-[#DFBA73] font-sans font-medium uppercase tracking-wider block">Endurance</span>
                          <span className="text-[9px] font-sans font-semibold text-foreground">{plane.endurance}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-[#DFBA73] font-sans font-medium uppercase tracking-wider block">Payload</span>
                          <span className="text-[9px] font-sans font-semibold text-foreground">{plane.payload}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-[#DFBA73] font-sans font-medium uppercase tracking-wider block">Range</span>
                          <span className="text-[9px] font-sans font-semibold text-foreground">{plane.range}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
