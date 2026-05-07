"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useControls } from "leva";
import { Model } from "@/components/Model";

function Scene({ camTarget, camRot, enableOrbit }) {
  return (
    <>
      {enableOrbit ? (
        <OrbitControls target={camTarget} makeDefault />
      ) : (
        <CameraHandler rotation={camRot} />
      )}
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
        {<Environment preset="sunset" resolution={256} />}
        <ContactShadows
          position={[0, -0.49, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4.5}
        />

        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom
            luminanceThreshold={0.2}
            intensity={1.2}
            radius={0.4}
            mipmapBlur={false}
          />
        </EffectComposer>
      </Suspense>
    </>
  );
}

function CameraHandler({ rotation }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.rotation.set(rotation[0], rotation[1], rotation[2]);
  });
  return null;
}

export default function Home() {
  const containerRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { camPos, camTarget, camRot, fov, enableOrbit } = useControls(
    "Camera",
    {
      camPos: { value: [0, 1.5, 5], step: 0.1 },
      camTarget: { value: [0, -11.4, -78.2], step: 0.1 },
      camRot: { value: [0, 0, 0], step: 0.01 },
      fov: { value: 45, min: 10, max: 120 },
      enableOrbit: true,
    },
  );

  return (
    <main
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        {mounted && (
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: camPos, fov: fov }}
            gl={{
              antialias: false,
              powerPreference: "high-performance",
            }}
          >
            <Scene
              camTarget={camTarget}
              camRot={camRot}
              enableOrbit={enableOrbit}
            />
          </Canvas>
        )}
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
