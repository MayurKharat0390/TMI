"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse coordinates relative to the card's center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const rotateXSpring = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    damping: 20,
    stiffness: 150,
  });
  const rotateYSpring = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
    damping: 20,
    stiffness: 150,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (normalized between -0.5 and 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="w-full h-full"
    >
      <motion.div
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: "preserve-3d",
        }}
        className={`w-full h-full transition-shadow duration-300 hover:shadow-[0_0_35px_rgba(212,163,72,0.2)] rounded-xl border border-white/5 hover:border-[#DFBA73]/20 bg-card ${className}`}
      >
        {/* Helper layout to support nested 3D elements */}
        <div style={{ transform: "translateZ(30px)" }} className="w-full h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
