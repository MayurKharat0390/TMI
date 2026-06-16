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
  onAssembled?: () => void;
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

export default function ParticleImage({ src, alt, width, height, className, style, onAssembled }: ParticleImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAssembled, setIsAssembled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
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
      const displayWidth = containerRef.current?.clientWidth || width;
      const displayHeight = containerRef.current?.clientHeight || height;
      
      // Make canvas size larger than the bounding box to allow particles to fly outside (from the air)
      const paddingX = 500; // Horizontal space around card
      const paddingY = 600; // Vertical space around card (especially above)
      canvas.width = displayWidth + paddingX * 2;
      canvas.height = displayHeight + paddingY * 2;
      canvas.style.left = `-${paddingX}px`;
      canvas.style.top = `-${paddingY}px`;

      const sampleWidth = 70;
      const sampleHeight = Math.round((sampleWidth * displayHeight) / displayWidth);

      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = sampleWidth;
      offscreenCanvas.height = sampleHeight;
      const offscreenCtx = offscreenCanvas.getContext("2d");
      if (!offscreenCtx) return;

      offscreenCtx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
      const imgData = offscreenCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      const pixels = imgData.data;

      const particles: Particle[] = [];
      const scaleX = displayWidth / sampleWidth;
      const scaleY = displayHeight / sampleHeight;

      const winWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
      const winHeight = typeof window !== "undefined" ? window.innerHeight : 800;

      for (let y = 0; y < sampleHeight; y += 2) {
        for (let x = 0; x < sampleWidth; x += 2) {
          const idx = (y * sampleWidth + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const a = pixels[idx + 3];

          if (a < 20) continue;

          // Target position relative to the expanded canvas coordinate system
          const targetX = x * scaleX + paddingX;
          const targetY = y * scaleY + paddingY;

          // Particles scatter from the air/sky (top/sides of the canvas)
          // Ensure coordinates start strictly inside the canvas boundaries to avoid clipping
          const startX = Math.random() * (canvas.width - 20) + 10;
          const startY = Math.random() * (paddingY * 0.4); // Start in the top 40% of the padding (above the card)

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
            delay: Math.random() * 25,
          });
        }
      }

      let frameCount = 0;
      const stiffness = 0.045; // Spring coefficient
      const damping = 0.81;    // Speed damping

      const animate = () => {
        frameCount++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let closeCount = 0;
        const size = scaleX * 2.0;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (frameCount > p.delay) {
            const ax = (p.targetX - p.x) * stiffness;
            const ay = (p.targetY - p.y) * stiffness;

            p.vx = (p.vx + ax) * damping;
            p.vy = (p.vy + ay) * damping;

            p.x += p.vx;
            p.y += p.vy;
          }

          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 0.8) {
            closeCount++;
          }

          // Smoothly fade particles in over the first 40 frames to avoid popping artifacts
          let currentAlpha = p.a;
          if (frameCount < 40) {
            currentAlpha = p.a * (frameCount / 40);
          }
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${currentAlpha})`;
          ctx.fillRect(p.x, p.y, size, size);
        }

        if (particles.length > 0 && closeCount / particles.length > 0.94) {
          setIsAssembled(true);
          if (onAssembled) {
            onAssembled();
          }
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
    <div 
      ref={containerRef} 
      className={`relative ${isAssembled ? "overflow-hidden" : "overflow-visible"} ${className}`} 
      style={style}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover transition-opacity duration-1000 ease-out"
        style={{ 
          opacity: isAssembled ? 1 : 0,
          objectPosition: "top"
        }}
      />

      {!isAssembled && (
        <canvas
          ref={canvasRef}
          className="absolute pointer-events-none z-30"
          style={{
            maxWidth: "none",
            maxHeight: "none",
          }}
        />
      )}
    </div>
  );
}
