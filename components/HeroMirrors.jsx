"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, useGLTF, MeshTransmissionMaterial, useTexture } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function GLTFScene(props) {
  const { nodes } = useGLTF('/hero1.glb');
  const groupRef = useRef();
  const { viewport } = useThree();
  
  // Use a beautifully abstract, colorful placeholder image to make the blur pop
  const texture = useTexture('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop');
  texture.colorSpace = THREE.SRGBColorSpace;
  
  // Dynamic floating and mouse parallax integration
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Smoothly tilt the entire scene based on the pointer position
    const targetX = (state.pointer.x * viewport.width) / 10;
    const targetY = (state.pointer.y * viewport.height) / 10;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY * 0.1, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX * 0.1, 0.05);
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <group name="Scene">
        {/* Plane with placeholder texture */}
        <mesh
          name="Plane"
          castShadow
          receiveShadow
          geometry={nodes.Plane.geometry}
          position={[0, -1.176, -1.215]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={3.14}
        >
          <meshBasicMaterial map={texture} />
        </mesh>

        {/* Light Blur Overlay */}
        <mesh
          name="Light_Blur"
          castShadow
          receiveShadow
          geometry={nodes.Light_Blur.geometry}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[7.846, 3.899, 4.369]}
        >
          <MeshTransmissionMaterial 
            backside={false}
            samples={4}
            thickness={0.5}
            roughness={0.15} // Light frosted glass
            transmission={1}
            ior={1.2}
            chromaticAberration={0.02}
            color="#ffffff"
          />
        </mesh>

        {/* Medium Blur Overlay */}
        <mesh
          name="Medium_Blur"
          castShadow
          receiveShadow
          geometry={nodes.Medium_Blur.geometry}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[7.846, 3.899, 4.369]}
        >
          <MeshTransmissionMaterial 
            backside={false}
            samples={6}
            thickness={1.5}
            roughness={0.35} // Medium frosted glass
            transmission={1}
            ior={1.3}
            chromaticAberration={0.05}
            color="#ffffff"
          />
        </mesh>

        {/* Heavy Blur Overlay */}
        <mesh
          name="Heavy_Blur"
          castShadow
          receiveShadow
          geometry={nodes.Heavy_Blur.geometry}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[7.846, 3.899, 4.369]}
        >
          <MeshTransmissionMaterial 
            backside={false}
            samples={8}
            thickness={3}
            roughness={0.65} // Heavy frosted glass
            transmission={1}
            ior={1.5}
            chromaticAberration={0.1}
            color="#ffffff"
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload('/hero1.glb');

export default function HeroMirrors() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={1} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <GLTFScene />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
