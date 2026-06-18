"use client";

import React, { useEffect, useState, useRef } from "react";
import { Terminal, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_LOGS = [
  "[BOOT] Loading flight dynamics library...",
  "[BOOT] Core systems online. Telemetry V3.89 ready.",
  "[SYS] Calibrating primary gyroscope...",
  "[SYS] Gyro calibration successful. Offset: 0.02deg",
  "[GPS] Satellites acquired. Count: 18. Signal: Strong",
  "[GPS] Reference point locked: 18.6493° N, 73.8567° E",
  "[AERO] Calculating wing loading: W/S = 7.34 kg/m²",
  "[AERO] Airfoil lift coefficients loaded (Selig 1223)",
  "[AERO] Maximum Lift/Drag ratio optimized at 14.8",
  "[NAV] Waypoints synchronized with flight controller",
  "[NAV] Flight corridor width set to 15.0 meters",
  "[NAV] Safe Return-To-Launch altitude: 50.0m",
  "[PROP] ESC dynamic timing checks... OK",
  "[PROP] Arming pusher motor: T-Motor U8 Lite",
  "[PROP] Propulsion status: Standby. Thrust output: 0%",
  "[TELEMETRY] Pinging ground station... 12ms (Excellent)",
  "[TELEMETRY] Pushing status packets... RSSI: -98dBm",
  "[SYS] Voltage monitor: 22.8V (LiPo 6S status: 100%)",
  "[SYS] Current draw nominal: 1.4A on standby",
  "[AUTOPILOT] Mode set to: AUTO_LAUNCH_READY",
  "[WARN] Wind gusts detected: 4.2 m/s. Adjusting bank limits.",
];

export function HudLogsTerminal() {
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [timestamp, setTimestamp] = useState("");

  // Set initial logs once on mount to avoid hydration mismatch
  useEffect(() => {
    setLogs([
      "[BOOT] Loading flight dynamics library...",
      "[BOOT] Core systems online. Telemetry V3.89 ready.",
      "[SYS] Calibrating primary gyroscope...",
    ]);
    setLogIndex(3);
    setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, []);

  useEffect(() => {
    if (!isOpen || logs.length === 0) return;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLogs = [...prev, MOCK_LOGS[logIndex]];
        if (nextLogs.length > 25) nextLogs.shift();
        return nextLogs;
      });
      setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setLogIndex((prev) => (prev + 1) % MOCK_LOGS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen, logIndex, logs.length]);

  useEffect(() => {
    if (logEndRef.current && isOpen) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-[280px] w-full px-4 sm:px-0 pointer-events-auto">
      <div className="bg-black/90 border border-[#D4A348]/20 rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden text-[9px] font-mono text-emerald-400">
        
        {/* Header bar */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between bg-zinc-950 px-3 py-2 border-b border-[#D4A348]/10 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-[#D4A348] font-bold tracking-wider uppercase text-[10px]">
            <Terminal className="w-3.5 h-3.5" />
            <span>Telemetry Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <button className="text-[#D4A348] hover:text-white transition-colors" aria-label="Toggle Terminal">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Console content */}
        {isOpen && (
          <div className="p-3 select-none">
            <div className="h-[110px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pr-1 space-y-1.5">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed opacity-90 break-words">
                  <span className="text-[#D4A348]/70 mr-1.5">[{timestamp}]</span>
                  {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
            
            {/* Command line footer */}
            <div className="mt-2 pt-2 border-t border-[#D4A348]/10 flex items-center gap-1.5 text-[#D4A348]">
              <span>MAVERICK:~$</span>
              <span className="w-1.5 h-3 bg-emerald-400 animate-pulse inline-block" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
