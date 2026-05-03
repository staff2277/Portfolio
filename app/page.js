'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Model } from '@/components/Model';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Suspense fallback={null}>
        <Model position={[0, -0.5, 0]} scale={2} />
        <Environment preset="city" />
        <ContactShadows 
          position={[0, -0.5, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
          far={4.5} 
        />
      </Suspense>

      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        makeDefault
      />
    </>
  );
}

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
