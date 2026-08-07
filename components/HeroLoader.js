"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroLoader({ progress = 0, isLoaded = false, onTransitionComplete }) {
  const [contentVisible, setContentVisible] = useState(true);
  const [gateOpen, setGateOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    // Step 1: Fade out loading text/progress UI
    const contentTimer = setTimeout(() => {
      setContentVisible(false);
    }, 200);

    // Step 2: Open the split gate (Left moves Left, Right moves Right)
    const gateTimer = setTimeout(() => {
      setGateOpen(true);
    }, 550);

    // Step 3: Complete transition and unmount loader
    const completeTimer = setTimeout(() => {
      setHidden(true);
      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
      onTransitionComplete?.();
    }, 1600);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(gateTimer);
      clearTimeout(completeTimer);
    };
  }, [isLoaded, onTransitionComplete]);

  if (hidden) return null;

  const displayProgress = Math.min(Math.max(Math.round(progress), 0), 100);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none">
      {/* Left Gate Panel */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-black/75 backdrop-blur-3xl border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          gateOpen ? "-translate-x-full" : "translate-x-0"
        } ${gateOpen ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        {/* Subtle illuminated edge glow along split line */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />
      </div>

      {/* Right Gate Panel */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-black/75 backdrop-blur-3xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          gateOpen ? "translate-x-full" : "translate-x-0"
        } ${gateOpen ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        {/* Subtle illuminated edge glow along split line */}
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />
      </div>

      {/* Center Loader Content */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] flex flex-col items-center justify-center text-center transition-all duration-400 ease-out ${
          contentVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        {/* Brand/Subtitle */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.35em] text-gray-400 font-medium">
            Entering Experience
          </span>
        </div>

        {/* Large Percentage Display */}
        <div className="text-6xl md:text-7xl font-bold font-mono tracking-tighter text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
          {displayProgress.toString().padStart(2, "0")}
          <span className="text-3xl md:text-4xl text-blue-500 font-light ml-1">%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden p-[1px] border border-white/15 shadow-inner mt-6">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-400 to-white transition-all duration-300 ease-out shadow-[0_0_12px_rgba(59,130,246,0.8)]"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Status text */}
        <p className="mt-4 text-xs text-gray-400 tracking-wider uppercase font-light">
          {displayProgress < 100 ? "Loading 3D Hero Tunnel..." : "Ready"}
        </p>
      </div>
    </div>
  );
}
