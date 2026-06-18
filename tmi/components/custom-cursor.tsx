"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only enable on devices with a mouse/fine pointer
    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (!isDesktop) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("a, button, [role='button'], .interactive-hud, input, select, textarea");
      if (interactiveEl) {
        setHoveredType(interactiveEl.tagName.toLowerCase() === "a" ? "link" : "button");
        setHoveredRect(interactiveEl.getBoundingClientRect());
      } else {
        setHoveredType(null);
        setHoveredRect(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const isSnapped = hoveredType !== null && hoveredRect !== null;

  // If snapped, outer ring positions itself exactly around the hovered element
  const ringTargetX = isSnapped && hoveredRect
    ? hoveredRect.left + hoveredRect.width / 2
    : coords.x;
  const ringTargetY = isSnapped && hoveredRect
    ? hoveredRect.top + hoveredRect.height / 2
    : coords.y;

  // Update springs
  if (isSnapped) {
    ringX.set(ringTargetX);
    ringY.set(ringTargetY);
  }

  return (
    <>
      {/* Tiny inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#D4A348] rounded-full pointer-events-none z-[9999] shadow-[0_0_6px_#D4A348]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Lagging outer crosshair ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] flex items-center justify-center border border-[#D4A348]/40"
        animate={{
          width: isSnapped && hoveredRect ? hoveredRect.width + 12 : 36,
          height: isSnapped && hoveredRect ? hoveredRect.height + 12 : 36,
          borderRadius: isSnapped && hoveredRect ? "8px" : "50%",
          borderColor: isSnapped ? "rgba(212, 163, 72, 0.9)" : "rgba(212, 163, 72, 0.4)",
          backgroundColor: isSnapped ? "rgba(212, 163, 72, 0.05)" : "rgba(0, 0, 0, 0)",
          boxShadow: isSnapped ? "0 0 15px rgba(212, 163, 72, 0.2)" : "none",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {/* HUD Crosshairs (ticks) - only when not snapped */}
        {!isSnapped && (
          <>
            <div className="absolute top-0 w-[1px] h-1.5 bg-[#D4A348]/60" />
            <div className="absolute bottom-0 w-[1px] h-1.5 bg-[#D4A348]/60" />
            <div className="absolute left-0 w-1.5 h-[1px] bg-[#D4A348]/60" />
            <div className="absolute right-0 w-1.5 h-[1px] bg-[#D4A348]/60" />
          </>
        )}
      </motion.div>

      {/* Coordinate HUD Labels */}
      {!isSnapped && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997] font-mono text-[7px] text-[#D4A348]/50 tracking-widest leading-none select-none pl-6 pt-3"
          style={{
            x: cursorX,
            y: cursorY,
          }}
        >
          X:{Math.round(coords.x)} Y:{Math.round(coords.y)}
        </motion.div>
      )}

      {isSnapped && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997] font-mono text-[8px] text-[#D4A348] tracking-widest font-bold select-none pl-8"
          style={{
            x: cursorX,
            y: cursorY,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          [ {hoveredType === "link" ? "OPEN" : "EXECUTE"} ]
        </motion.div>
      )}
    </>
  );
}
