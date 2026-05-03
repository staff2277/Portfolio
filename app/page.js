"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useControls } from "leva";
import { Model } from "@/components/Model";

function Scene() {
  return (
    <>
      {/* <ambientLight intensity={0.2} /> */}
      <spotLight
        position={[0, 2, 5]}
        angle={0.3}
        penumbra={1}
        intensity={80}
        castShadow
      />

      <Suspense fallback={null}>
        <Model position={[0, -0.5, 0]} scale={2} />
        {<Environment preset="night" />}
        <ContactShadows
          position={[0, -0.49, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4.5}
        />

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.2}
            mipmapBlur
            intensity={1.2}
            radius={0.4}
          />
        </EffectComposer>
      </Suspense>

    </>
  );
}

export default function Home() {
  const containerRef = useRef(null);

  const { camPos, fov } = useControls("Camera", {
    camPos: { value: [0, 1, 5], step: 0.1 },
    fov: { value: 45, min: 10, max: 120 },
  });

  return (
    <main
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: camPos, fov: fov }}
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
