"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function StarryBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        particles: {
          number: {
            value: 150,
            density: { enable: true, area: 800 },
          },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: {
            value: 1,
            random: true,
            animation: { enable: true, speed: 1, minimumValue: 0.5, sync: false },
          },
          size: {
            value: { min: 0.5, max: 1.5 },
            random: true,
            animation: { enable: true, speed: 2, minimumValue: 0.3, sync: false },
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: false },
            onClick: { enable: false },
          },
        },
        detectRetina: true,
      }}
    />
  );
}