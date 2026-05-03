'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
export default function Home() {
  const containerRef = useRef(null);

  return (
    <main 
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [0, 1, 5], fov: 45 }}
          gl={{ antialias: true }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col items-center justify-between p-12">
        <div className="w-full flex justify-between items-start">
          <div className="text-white/20 text-xs font-mono uppercase tracking-widest">
            Portfolio / 2026
          </div>
          <div className="text-white/20 text-xs font-mono uppercase tracking-widest">
            Showroom_v1.0
          </div>
        </div>

        <div className="flex gap-8 text-[10px] font-mono text-white/10 uppercase tracking-widest">
          <span>Three.js</span>
          <span>•</span>
          <span>React Fiber</span>
          <span>•</span>
          <span>GSAP</span>
        </div>
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </main>
  );
}

