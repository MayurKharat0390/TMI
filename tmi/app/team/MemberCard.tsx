"use client";

import { Mail, Linkedin } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import ParticleImage from "@/components/particle-image";

export default function MemberCard({ member }: { member: any }) {
    return (
        <div className="w-[280px] h-[430px] flex-shrink-0">
            <TiltCard className="bg-black/60 border border-[#D4A348]/10 backdrop-blur-md overflow-hidden relative flex flex-col h-full group">
                <div className="relative h-[280px] w-full overflow-hidden">
                    <ParticleImage
                        src={member.image}
                        alt={member.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                </div>
                
                <div className="p-5 flex flex-col justify-between flex-grow relative z-10">
                    <div>
                        <h3 className="font-bold text-lg text-white transition-colors duration-300 group-hover:text-[#D4A348] tracking-wide font-montserrat truncate">
                            {member.name}
                        </h3>
                        <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mt-0.5 truncate">
                            {member.role}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        {member.team !== "Secretary" ? (
                            <span className="text-xs text-white/40 tracking-wider">
                                {member.year} Batch
                            </span>
                        ) : (
                            <span className="text-xs text-[#D4A348]/70 font-semibold tracking-wider uppercase">
                                Advisory Board
                            </span>
                        )}
                        
                        <div className="flex space-x-3">
                            {member.email && (
                                <a
                                    href={`mailto:${member.email}`}
                                    className="text-white/60 hover:text-[#D4A348] transition-colors p-1 rounded-md hover:bg-white/5"
                                >
                                    <Mail className="w-4 h-4" />
                                </a>
                            )}
                            {member.linkedin && (
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-[#D4A348] transition-colors p-1 rounded-md hover:bg-white/5"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Glowing bottom edge */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A348] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </TiltCard>
        </div>
    );
}
