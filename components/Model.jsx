"use client";

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Model(props) {
  const { nodes, materials } = useGLTF('/models/meBubble2.glb')
  
  // The Head bone and Eye meshes
  // nodes.EyeL, nodes.EyeR (Meshes)

  useFrame((state) => {
    if (!nodes.head) return

    // Mouse coordinates from -1 to 1
    const { x, y } = state.mouse

    // --- Head Rotation Logic ---
    // Clamping to ensure head doesn't turn too far (approx +/- 34 degrees)
    const targetHeadRotationY = THREE.MathUtils.clamp(x * 0.6, -0.6, 0.6)
    const targetHeadRotationX = THREE.MathUtils.clamp(-y * 0.4, -0.4, 0.4)

    // Springy, delayed motion for the head (damping 0.1)
    nodes.head.rotation.y = THREE.MathUtils.lerp(
      nodes.head.rotation.y,
      targetHeadRotationY,
      0.1
    )
    nodes.head.rotation.x = THREE.MathUtils.lerp(
      nodes.head.rotation.x,
      targetHeadRotationX,
      0.1
    )

    // --- Eye Tracking Logic ---
    if (nodes.EyeL && nodes.EyeR) {
      // Eyes track the cursor more precisely and snappily (damping 0.2)
      // To track "more precisely," the eyes should compensate for the head's lag.
      // We calculate the target rotation relative to the current head rotation.
      const targetEyeRotationY = THREE.MathUtils.clamp(x * 0.8, -0.8, 0.8)
      const targetEyeRotationX = THREE.MathUtils.clamp(-y * 0.6, -0.6, 0.6)

      // Eye local rotation = Eye target - Head current rotation
      // This ensures eyes stay locked on cursor even while the head is catching up.
      const localEyeTargetY = targetEyeRotationY - nodes.head.rotation.y
      const localEyeTargetX = targetEyeRotationX - nodes.head.rotation.x

      // Apply snappier lerp (0.2) to eye meshes
      nodes.EyeL.rotation.y = THREE.MathUtils.lerp(
        nodes.EyeL.rotation.y,
        THREE.MathUtils.clamp(localEyeTargetY, -0.3, 0.3), // Clamp relative to head to prevent clipping
        0.2
      )
      nodes.EyeL.rotation.x = THREE.MathUtils.lerp(
        nodes.EyeL.rotation.x,
        THREE.MathUtils.clamp(localEyeTargetX, -0.3, 0.3),
        0.2
      )

      nodes.EyeR.rotation.y = THREE.MathUtils.lerp(
        nodes.EyeR.rotation.y,
        THREE.MathUtils.clamp(localEyeTargetY, -0.3, 0.3),
        0.2
      )
      nodes.EyeR.rotation.x = THREE.MathUtils.lerp(
        nodes.EyeR.rotation.x,
        THREE.MathUtils.clamp(localEyeTargetX, -0.3, 0.3),
        0.2
      )
    }
  })

  return (
    <group {...props} dispose={null}>
      <group position={[0, 0.136, 0]} scale={2.016}>
        <skinnedMesh
          geometry={nodes.Spring.geometry}
          material={materials.Spring}
          skeleton={nodes.Spring.skeleton}
        />
        <primitive object={nodes['DEF-spine']} />
        <primitive object={nodes['DEF-pelvisL']} />
        <primitive object={nodes['DEF-pelvisR']} />
        <primitive object={nodes['DEF-thighL']} />
        <primitive object={nodes['DEF-thighR']} />
        <primitive object={nodes.head} />
        <primitive object={nodes['DEF-shoulderL']} />
        <primitive object={nodes['DEF-upper_armL']} />
        <primitive object={nodes['DEF-shoulderR']} />
        <primitive object={nodes['DEF-upper_armR']} />
        <primitive object={nodes['DEF-breastL']} />
        <primitive object={nodes['DEF-breastR']} />
        
        {/* Primitives for eyes to ensure they are manually animated if they aren't descendants of bones */}
        {nodes.EyeL && <primitive object={nodes.EyeL} />}
        {nodes.EyeR && <primitive object={nodes.EyeR} />}
      </group>
      <mesh castShadow receiveShadow geometry={nodes.input002.geometry} material={materials.Body} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.input002_1.geometry}
        material={materials.Spring}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.input002_2.geometry}
        material={materials['Material.003']}
      />
    </group>
  )
}

useGLTF.preload('/models/meBubble2.glb')
