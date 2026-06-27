"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PageTransition() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathname = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip on the very first render (initial page load stays clean)
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }
    // Skip if navigating back to home
    if (pathname === "/") {
      prevPathname.current = pathname;
      return;
    }
    // Only show if navigating to a different page
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setProgress(0);
      setShow(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            return 100;
          }
          return prev + 5;
        });
      }, 40);
    }
  }, [pathname]);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={pathname}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-[#060608]/97 backdrop-blur-2xl z-[9999] flex flex-col items-center justify-center select-none pointer-events-auto"
        >
          <div className="relative flex flex-col items-center max-w-xs px-6 text-center">
            <div
              className="absolute -top-12 w-44 h-44 rounded-full border border-[#DFBA73]/20 border-t-[#DFBA73] animate-spin"
              style={{ animationDuration: "2s" }}
            />
            <div className="absolute -top-8 w-36 h-36 rounded-full border border-dashed border-[#DFBA73]/10" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-20 h-20 relative mb-10 rounded-full flex items-center justify-center bg-black/30 border border-[#DFBA73]/15 shadow-[0_0_25px_rgba(223,186,115,0.12)]"
            >
              <Image
                src="/images/logo.png"
                alt="Team Maverick India"
                width={60}
                height={60}
                className="object-contain"
              />
            </motion.div>
            <h2 className="text-[10px] font-sans font-bold text-[#DFBA73] tracking-[0.3em] uppercase mb-1">
              TEAM MAVERICK INDIA
            </h2>
            <p className="text-[7px] font-mono text-gray-500 tracking-[0.15em] uppercase mb-6">
              ROUTING // {progress}%
            </p>
            <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#DFBA73] shadow-[0_0_6px_#DFBA73]"
                style={{ width: `${progress}%`, transition: "width 0.04s linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
