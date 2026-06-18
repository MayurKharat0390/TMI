"use client";

import React, { useEffect, useState, useRef } from "react";
import { Terminal, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_LOGS = [
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
  const [commandInput, setCommandInput] = useState("");
  const [isOverloadActive, setIsOverloadActive] = useState(false);

  // Set initial logs once on mount to avoid hydration mismatch
  useEffect(() => {
    setLogs([
      "[BOOT] Loading flight dynamics library...",
      "[BOOT] Core systems online. Telemetry V3.89 ready.",
      "[SYS] Calibrating primary gyroscope...",
      "[INFO] Developer Mode Interface activated.",
      "[INFO] Type 'help' to list available command protocols."
    ]);
    setLogIndex(0);
    setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    
    return () => {
      document.documentElement.classList.remove("dev-override-mode");
    };
  }, []);

  useEffect(() => {
    if (!isOpen || logs.length === 0) return;

    const interval = setInterval(() => {
      // Don't auto-log if overload mode is active to keep input readable
      setLogs((prev) => {
        const nextLogs = [...prev, MOCK_LOGS[logIndex]];
        if (nextLogs.length > 50) nextLogs.shift();
        return nextLogs;
      });
      setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setLogIndex((prev) => (prev + 1) % MOCK_LOGS.length);
    }, 4500); // Slower log interval to prevent cluttering typed input

    return () => clearInterval(interval);
  }, [isOpen, logIndex, logs.length]);

  useEffect(() => {
    if (logEndRef.current && isOpen) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    setLogs((prev) => [...prev, `MAVERICK:~$ ${cmd}`]);
    setCommandInput("");

    const normalizedCmd = cmd.toLowerCase();

    if (normalizedCmd === "help") {
      setLogs((prev) => [
        ...prev,
        "Available command protocols:",
        " - help: Display this instruction manual",
        " - clear: Purge terminal console buffer",
        " - status: Query system health telemetry",
        " - override: Toggle dev override admin shell",
        " - git-log: Dump secret developer commits",
        " - stunt: Force pilot roll maneuver stunt"
      ]);
    } else if (normalizedCmd === "clear") {
      setLogs([]);
    } else if (normalizedCmd === "status") {
      setLogs((prev) => [
        ...prev,
        "SYS_STATUS: ACTIVE",
        `DEV_OVERRIDE: ${isOverloadActive ? "ACTIVE (UNSAFE)" : "OFF"}`,
        "SYS_TEMP: 32.4°C (STABLE)",
        "PILOT_AUTH: MAVERICK_DEV_BYPASS",
        "VOLTAGE: 22.8V (6S 100%)",
        "WIND_SPEED: 4.2 m/s"
      ]);
    } else if (normalizedCmd === "git-log") {
      setLogs((prev) => [
        ...prev,
        "[GIT] ce4dd36: Fix z-index (Mihir kept breaking it)",
        "[GIT] a820ef1: Emergency duct tape addition on wing ribs",
        "[GIT] f23081e: Disable self-destruct bypass in cafeteria",
        "[GIT] c81e9b2: Set gold accents so sun doesn't blind pilots",
        "[GIT] d40837b: Add support for tea dispenser on MOHAV-I",
        "[GIT] e92b3a1: Fixed autopilot taking us to the hostel canteen"
      ]);
    } else if (normalizedCmd === "stunt") {
      setLogs((prev) => [...prev, "[EXEC] Initiating roll stunt maneuver..."]);
      window.dispatchEvent(new CustomEvent("trigger-uav-stunt"));
    } else if (normalizedCmd === "override") {
      const nextOverload = !isOverloadActive;
      setIsOverloadActive(nextOverload);
      if (nextOverload) {
        document.documentElement.classList.add("dev-override-mode");
        window.dispatchEvent(new CustomEvent("trigger-uav-overload", { detail: { active: true } }));
        setLogs((prev) => [
          ...prev,
          "[WARNING] INITIALIZING DESTRUCTIVE DEV OVERRIDE...",
          "[WARNING] AUTH: MAVERICK_DEV_BYPASS_99",
          "[SYSTEM] OVERCLOCKING UAV ROTOR SPIN...",
          "[SYSTEM] HACKING HUE SPECTRUM CHANNELS...",
          "[SYSTEM] WIREFRAME GRAPHICS: ON"
        ]);
      } else {
        document.documentElement.classList.remove("dev-override-mode");
        window.dispatchEvent(new CustomEvent("trigger-uav-overload", { detail: { active: false } }));
        setLogs((prev) => [
          ...prev,
          "[SYSTEM] Restoring safety limiters...",
          "[SYSTEM] Rotation RPM reset to 100%",
          "[SYSTEM] Color hue alignment restored",
          "[SYSTEM] Mesh shading: SOLID"
        ]);
      }
    } else {
      setLogs((prev) => [...prev, `[ERR] Command '${cmd}' unrecognized. Type 'help'.`]);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-[280px] w-full px-4 sm:px-0 pointer-events-auto">
      <div className="bg-black/90 border border-[#DFBA73]/20 rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden text-[9px] font-mono text-emerald-400">
        
        {/* Header bar */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between bg-zinc-950 px-3 py-2 border-b border-[#DFBA73]/10 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-[#DFBA73] font-bold tracking-wider uppercase text-[10px]">
            <Terminal className="w-3.5 h-3.5" />
            <span>Telemetry Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <button className="text-[#DFBA73] hover:text-white transition-colors" aria-label="Toggle Terminal">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Console content */}
        {isOpen && (
          <div className="p-3">
            <div className="h-[110px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pr-1 space-y-1.5">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed opacity-90 break-words">
                  <span className="text-[#DFBA73]/70 mr-1.5">[{timestamp}]</span>
                  {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
            
            {/* Command line footer */}
            <form onSubmit={handleCommandSubmit} className="mt-2 pt-2 border-t border-[#DFBA73]/10 flex items-center gap-1">
              <span className="text-[#DFBA73] select-none">MAVERICK:~$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="type help..."
                className="bg-transparent border-none outline-none flex-grow text-emerald-400 font-mono text-[9px] placeholder:text-emerald-800/40 focus:ring-0 p-0 m-0"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
