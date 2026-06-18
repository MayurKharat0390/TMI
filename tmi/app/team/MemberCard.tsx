"use client";

import { useState } from "react";
import { Mail, Linkedin } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MemberCard({ member, index = 0 }: { member: any; index?: number }) {
  const [isHovered, setIsHovered] = useState(false);

  // Stagger delays based on grid position (cap delay at 0.5s to keep it snappy)
  const staggerDelay = Math.min(index * 0.05, 0.5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: staggerDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-[280px] h-[430px] flex-shrink-0"
    >
      <TiltCard className="bg-card/75 dark:bg-black/60 border border-[#DFBA73]/10 backdrop-blur-md relative flex flex-col h-full group overflow-hidden">
        
        {/* Holographic scanning line */}
        <motion.div
          initial={{ top: "-5%" }}
          whileInView={{ top: "105%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: staggerDelay + 0.3 }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DFBA73] to-transparent shadow-[0_0_8px_#DFBA73] z-20 pointer-events-none"
        />

        {/* Photo Container */}
        <div className="relative h-[280px] w-full overflow-hidden bg-muted/10">
          <motion.div
            initial={{ filter: "blur(8px) grayscale(100%)", opacity: 0, scale: 1.05 }}
            whileInView={{ filter: "blur(0px) grayscale(0%)", opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: "easeOut", delay: staggerDelay + 0.4 }}
            className="w-full h-full relative"
          >
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="280px"
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </motion.div>
          
          {/* Cybernetic telemetry corners on image */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#DFBA73]/30 pointer-events-none" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#DFBA73]/30 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#DFBA73]/30 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#DFBA73]/30 pointer-events-none" />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80 pointer-events-none" />
        </div>
        
        {/* Card Info Body */}
        <div className="p-5 flex flex-col justify-between flex-grow relative z-10">
          <div>
            <h3 className="font-bold text-base text-foreground transition-colors duration-300 group-hover:text-[#DFBA73] tracking-wide font-montserrat truncate">
              {member.name}
            </h3>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1 truncate">
              {member.role}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
            {member.team !== "Secretary" ? (
              <span className="text-[11px] text-muted-foreground/80 tracking-wider">
                {member.year} Batch
              </span>
            ) : (
              <span className="text-[11px] text-[#DFBA73]/80 font-bold tracking-wider uppercase">
                Advisory Board
              </span>
            )}
            
            <div className="flex space-x-2">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  title="Send Email"
                  className="text-muted-foreground hover:text-[#DFBA73] hover:bg-[#DFBA73]/10 transition-all p-1.5 rounded-lg border border-transparent hover:border-[#DFBA73]/20"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn Profile"
                  className="text-muted-foreground hover:text-[#DFBA73] hover:bg-[#DFBA73]/10 transition-all p-1.5 rounded-lg border border-transparent hover:border-[#DFBA73]/20"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Glowing bottom edge with scanning animation */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/20 overflow-hidden">
          <motion.div
            animate={{
              x: isHovered ? ["-100%", "200%"] : "-100%"
            }}
            transition={{
              duration: 1.5,
              ease: "linear",
              repeat: isHovered ? Infinity : 0
            }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#DFBA73] to-transparent"
          />
        </div>
      </TiltCard>
    </motion.div>
  );
}
