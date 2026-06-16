"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface ParticleImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  r: number;
  g: number;
  b: number;
  a: number;
  vx: number;
  vy: number;
  delay: number;
}

export default function ParticleImage({ src, alt, width, height, className, style }: ParticleImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAssembled, setIsAssembled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  // Intersection Observer to run the canvas animation only when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      // Set canvas size matching the component size
      const displayWidth = containerRef.current?.clientWidth || width;
      const displayHeight = containerRef.current?.clientHeight || height;
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      // Scale down image to create a lightweight grid of particles
      const sampleWidth = 70;
      const sampleHeight = Math.round((sampleWidth * displayHeight) / displayWidth);

      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = sampleWidth;
      offscreenCanvas.height = sampleHeight;
      const offscreenCtx = offscreenCanvas.getContext("2d");
      if (!offscreenCtx) return;

      // Draw and scale down the image
      offscreenCtx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
      const imgData = offscreenCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      const pixels = imgData.data;

      // Create particles from non-transparent pixels
      const particles: Particle[] = [];
      const scaleX = displayWidth / sampleWidth;
      const scaleY = displayHeight / sampleHeight;

      // Sample every 2nd pixel to optimize performance (~1200 particles max)
      for (let y = 0; y < sampleHeight; y += 2) {
        for (let x = 0; x < sampleWidth; x += 2) {
          const idx = (y * sampleWidth + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const a = pixels[idx + 3];

          // Skip completely transparent background pixels
          if (a < 20) continue;

          const targetX = x * scaleX;
          const targetY = y * scaleY;

          // Particles scatter starting from the air (falling from above and spread out)
          const startX = targetX + (Math.random() - 0.5) * displayWidth * 1.5;
          const startY = targetY - displayHeight * 0.8 - Math.random() * 150;

          particles.push({
            x: startX,
            y: startY,
            targetX,
            targetY,
            r,
            g,
            b,
            a: a / 255,
            vx: 0,
            vy: 0,
            delay: Math.random() * 20, // staggered start delays (in frames)
          });
        }
      }

      let frameCount = 0;
      const stiffness = 0.05; // Spring strength
      const damping = 0.82;   // Velocity friction

      const animate = () => {
        frameCount++;
        ctx.clearRect(0, 0, displayWidth, displayHeight);

        let closeCount = 0;
        const size = scaleX * 1.95; // Slightly larger particles to fill gaps

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (frameCount > p.delay) {
            // Spring force calculation toward target
            const ax = (p.targetX - p.x) * stiffness;
            const ay = (p.targetY - p.y) * stiffness;

            p.vx = (p.vx + ax) * damping;
            p.vy = (p.vy + ay) * damping;

            p.x += p.vx;
            p.y += p.vy;
          }

          // Check if particle is close to target
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 0.6) {
            closeCount++;
          }

          // Draw particle
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a})`;
          ctx.fillRect(p.x, p.y, size, size);
        }

        // If 95% of the particles have arrived, fade in the high-res image
        if (particles.length > 0 && closeCount / particles.length > 0.94) {
          setIsAssembled(true);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          return;
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [src, isVisible]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={style}>
      {/* High-res actual Next.js Image fades in once assembly completes */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-1000 ease-out`}
        style={{ 
          opacity: isAssembled ? 1 : 0,
          objectPosition: "top"
        }}
      />

      {/* Hologram canvas assembly running on top */}
      {!isAssembled && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}
    </div>
  );
}
