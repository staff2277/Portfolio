"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import MirrorShard from "./MirrorShard";

export default function HeroMirrors() {
  const NUM_SHARDS = 35;

  // Generate deterministic-ish random data to avoid hydration mismatches
  const shardsData = useMemo(() => {
    // Basic pseudo-random to keep SSR and Client perfectly aligned on first render
    const random = (seed) => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
    
    return Array.from({ length: NUM_SHARDS }).map((_, i) => ({
      id: i,
      position: [
        (random(i * 1.1) - 0.5) * 12,
        (random(i * 2.2) - 0.5) * 8,
        (random(i * 3.3) - 0.5) * 4
      ],
      rotation: [
        random(i * 4.4) * Math.PI,
        random(i * 5.5) * Math.PI,
        random(i * 6.6) * Math.PI
      ],
      scale: random(i * 7.7) * 0.8 + 0.3
    }));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color={"#0ff0fc"} />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color={"#ffffff"} />
        <spotLight position={[0, 0, 10]} intensity={2} color={"#0ff0fc"} penumbra={1} angle={0.3} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
            {shardsData.map((data) => (
              <MirrorShard key={data.id} {...data} />
            ))}
          </Float>
          <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} far={10} color="#0ff0fc" />
        </Suspense>
      </Canvas>
    </div>
  );
}
