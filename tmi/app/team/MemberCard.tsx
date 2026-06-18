"use client";

import { useState } from "react";
import { Mail, Linkedin } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import ParticleImage from "@/components/particle-image";

export default function MemberCard({ member }: { member: any }) {
    const [assembled, setAssembled] = useState(false);

    return (
        <div className="w-[280px] h-[430px] flex-shrink-0">
            <TiltCard className={`bg-card/75 dark:bg-black/60 border border-[#DFBA73]/10 backdrop-blur-md relative flex flex-col h-full group ${assembled ? "overflow-hidden" : "overflow-visible"}`}>
                <div className={`relative h-[280px] w-full ${assembled ? "overflow-hidden" : "overflow-visible"}`}>
                    <ParticleImage
                        src={member.image}
                        alt={member.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        onAssembled={() => setAssembled(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                </div>
                
                <div className="p-5 flex flex-col justify-between flex-grow relative z-10">
                    <div>
                        <h3 className="font-bold text-lg text-foreground transition-colors duration-300 group-hover:text-[#DFBA73] tracking-wide font-montserrat truncate">
                            {member.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5 truncate">
                            {member.role}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                        {member.team !== "Secretary" ? (
                            <span className="text-xs text-muted-foreground/80 tracking-wider">
                                {member.year} Batch
                            </span>
                        ) : (
                            <span className="text-xs text-[#DFBA73]/70 font-semibold tracking-wider uppercase">
                                Advisory Board
                            </span>
                        )}
                        
                        <div className="flex space-x-3">
                            {member.email && (
                                <a
                                    href={`mailto:${member.email}`}
                                    className="text-muted-foreground hover:text-[#DFBA73] transition-colors p-1 rounded-md hover:bg-accent"
                                >
                                    <Mail className="w-4 h-4" />
                                </a>
                            )}
                            {member.linkedin && (
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-[#DFBA73] transition-colors p-1 rounded-md hover:bg-accent"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Glowing bottom edge */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DFBA73] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </TiltCard>
        </div>
    );
}
