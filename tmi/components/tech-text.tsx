"use client";

import React, { useEffect, useState, useRef } from "react";

interface TechTextProps {
  text: string;
  className?: string;
  trigger?: "mount" | "hover" | "view";
}

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$%&#@*+=?[]<>";

export function TechText({ text, className = "", trigger = "view" }: TechTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isAnimating = useRef(false);
  const originalText = text;

  const runScramble = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        originalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return originalText[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= originalText.length) {
        clearInterval(interval);
        isAnimating.current = false;
        setDisplayText(originalText);
      }

      iteration += 1 / 2; // Decipher rate
    }, 25);
  };

  useEffect(() => {
    if (trigger === "mount") {
      runScramble();
    } else if (trigger === "view") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runScramble();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, [originalText, trigger]);

  const handleMouseEnter = () => {
    if (trigger === "hover" || trigger === "view") {
      runScramble();
    }
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      {displayText}
    </span>
  );
}
