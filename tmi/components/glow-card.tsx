"use client";

import React, { useRef, useState } from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({ children, className = "", glowColor = "rgba(212, 163, 72, 0.1)" }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-xl p-[1px] overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background: isHovered
          ? `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(212, 163, 72, 0.4) 0%, rgba(212, 163, 72, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%)`
          : "rgba(212, 163, 72, 0.1)",
      }}
    >
      <div className="relative rounded-[11px] bg-card/95 dark:bg-black/90 w-full h-full overflow-hidden p-6 z-10">
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
          }}
        />
        <div className="relative z-20 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
