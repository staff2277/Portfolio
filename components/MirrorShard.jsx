"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MirrorShard({ position, rotation, scale }) {
  const meshRef = useRef();
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  
  const geometry = useMemo(() => {
    // Generate a jagged shape representing a broken mirror shard
    const geo = new THREE.TetrahedronGeometry(scale, 0);
    const posAttribute = geo.getAttribute('position');
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = posAttribute.getZ(i);
        posAttribute.setXYZ(
            i, 
            x + (Math.random() - 0.5) * scale * 0.8,
            y + (Math.random() - 0.5) * scale * 0.8,
            z + (Math.random() - 0.5) * scale * 0.3
        );
    }
    geo.computeVertexNormals();
    return geo;
  }, [scale]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Gentle constant rotation
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;

    // Calculate pointer in 3D space at z=0 equivalent
    const pointer = new THREE.Vector3(
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
      0
    );
    
    // Project mouse relative to camera depth
    const distance = pointer.distanceTo(meshRef.current.position);
    const interactionRadius = 3.0;

    if (distance < interactionRadius) {
      // Shard reacts by getting repelled or tilted
      const dir = new THREE.Vector3().subVectors(meshRef.current.position, pointer).normalize();
      const intensity = (interactionRadius - distance) / interactionRadius;
      
      meshRef.current.position.add(dir.multiplyScalar(intensity * delta * 5));
      meshRef.current.rotation.x += dir.y * intensity * delta * 2;
      meshRef.current.rotation.y -= dir.x * intensity * delta * 2;
    } else {
      // Float back to initial position using spring-like lerp
      meshRef.current.position.lerp(initialPos, delta * 0.8);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <primitive object={geometry} />
      <meshPhysicalMaterial 
        color="#e0ffff"
        transmission={0.8}
        opacity={1}
        metalness={0.9}
        roughness={0.05}
        ior={2.5}
        thickness={2}
        clearcoat={1}
        envMapIntensity={2}
      />
    </mesh>
  );
}
