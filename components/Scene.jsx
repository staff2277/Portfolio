"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";

function Model() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#0ff0fc" />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 35 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Model />

          <Environment preset="city" />
          <ContactShadows 
            position={[0, -0.8, 0]} 
            opacity={0.42} 
            scale={10} 
            blur={2.5} 
            far={4} 
          />
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}
