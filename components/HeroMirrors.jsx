"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import MirrorShard from "./MirrorShard";

export default function HeroMirrors() {
  const NUM_SHARDS = 35;

  // Generate deterministic-ish random data with overlap detection
  const shardsData = useMemo(() => {
    const random = (seed) => {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    const shards = [];
    let seedIndex = 123; // Fixed start seed for consistency
    
    // Safety counter to prevent infinite loops if space is too tight
    let attempts = 0;
    while (shards.length < NUM_SHARDS && attempts < 1500) {
      attempts++;
      const scale = random(seedIndex++) * 0.6 + 0.3; // Slightly smaller to help fit 35
      const pos = [
        (random(seedIndex++) - 0.5) * 14,
        (random(seedIndex++) - 0.5) * 8.5,
        (random(seedIndex++) - 0.5) * 4
      ];
      
      // Radius check for overlapping shards (Sphere collision approximation)
      const isOverlapping = shards.some(s => {
        const dx = s.position[0] - pos[0];
        const dy = s.position[1] - pos[1];
        const dz = s.position[2] - pos[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Minimum distance is sum of their radii (shared scale is rough radius)
        return dist < (s.scale + scale) * 0.9; 
      });

      if (!isOverlapping) {
        shards.push({
          id: shards.length,
          position: pos,
          rotation: [
            random(seedIndex++) * Math.PI,
            random(seedIndex++) * Math.PI,
            random(seedIndex++) * Math.PI
          ],
          scale: scale
        });
      }
    }
    return shards;
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-auto">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color={"#0ff0fc"} />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color={"#ffffff"} />
        <spotLight position={[0, 0, 10]} intensity={2} color={"#0ff0fc"} penumbra={1} angle={0.3} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          {shardsData.map((data) => (
            <MirrorShard key={data.id} {...data} />
          ))}
          <ContactShadows resolution={512} position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} far={10} color="#0ff0fc" />
        </Suspense>
      </Canvas>
    </div>
  );
}
