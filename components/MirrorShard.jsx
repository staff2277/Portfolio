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
  const initialRot = useMemo(() => new THREE.Euler(...rotation), [rotation]);
  const smoothedPointer = useRef(new THREE.Vector2(0, 0));
  const offset = useRef(new THREE.Vector3(0, 0, 0));
  const timeOffset = useMemo(() => Math.random() * 10, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Smooth the pointer
    smoothedPointer.current.lerp(state.pointer, delta * 15);
    
    // 1. Calculate Individual Floating Motion
    const t = state.clock.getElapsedTime() + timeOffset;
    const floatX = Math.sin(t * 0.5) * 0.2;
    const floatY = Math.cos(t * 0.6) * 0.2;
    const floatZ = Math.sin(t * 0.7) * 0.1;
    
    // 2. Calculate Interactive Repulsion
    const pointer = new THREE.Vector3(
      (smoothedPointer.current.x * state.viewport.width) / 2,
      (smoothedPointer.current.y * state.viewport.height) / 2,
      0
    );
    
    const distance = pointer.distanceTo(meshRef.current.position);
    const interactionRadius = 5.0;
    
    const targetOffset = new THREE.Vector3(0, 0, 0);
    const tiltTarget = new THREE.Euler().copy(initialRot);

    if (distance < interactionRadius) {
      const dir = new THREE.Vector3().subVectors(meshRef.current.position, pointer).normalize();
      const intensity = Math.pow((interactionRadius - distance) / interactionRadius, 1.5);
      
      // Repel from mouse - we add to the target offset
      targetOffset.add(dir.multiplyScalar(intensity * 3));
      
      // Tilt towards mouse direction
      tiltTarget.x += dir.y * intensity * 1.5;
      tiltTarget.y -= dir.x * intensity * 1.5;
    }

    // Combine floating and interaction offsets
    const finalTargetPos = new THREE.Vector3().addVectors(initialPos, targetOffset);
    finalTargetPos.x += floatX;
    finalTargetPos.y += floatY;
    finalTargetPos.z += floatZ;

    // Smooth transition for position and rotation
    const lerpSpeed = 1 - Math.exp(-delta * 3.5);
    meshRef.current.position.lerp(finalTargetPos, lerpSpeed);
    
    // Smoothly rotate
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, tiltTarget.x + t * 0.1, lerpSpeed);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, tiltTarget.y + t * 0.15, lerpSpeed);
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <primitive object={geometry} />
      <meshPhysicalMaterial 
        color="#e0ffff"
        transmission={0.4} // Reduced transmission for better performance
        opacity={1}
        metalness={0.9}
        roughness={0.02}
        ior={1.8}
        thickness={1.5}
        clearcoat={0.8}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}
