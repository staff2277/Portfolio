import React, { useRef, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'

// Initialize RectAreaLight to enable reflections in PBR materials
RectAreaLightUniformsLib.init()

export function Model(props) {
  const { nodes, materials } = useGLTF('/models/showroom.glb')

  // Track mouse position via direct DOM listener (bypasses OrbitControls event interception)
  const mouseRef = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMouseMove = (e) => {
      // Normalize to -1 to 1 range (same as R3F pointer)
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // 1. Dynamic Lighting Controls
  const { 
    windowEmissive, 
    floorEmissive, 
    windowLightIntensity, 
    floorLightIntensity, 
    windowEmissiveColor,
    windowLightColor,
    floorEmissiveColor,
    floorLightColor,
    floorBaseColor,
    wallColor
  } = useControls('Showroom Lighting', {
    windowEmissive: { value: 3.3, min: 0, max: 10, step: 0.1 },
    floorEmissive: { value: 1.1, min: 0, max: 10, step: 0.1 },
    windowLightIntensity: { value: 2, min: 0, max: 100, step: 1 },
    floorLightIntensity: { value: 0, min: 0, max: 100, step: 1 },
    windowEmissiveColor: '#6bbbff',
    windowLightColor: '#79bff2',
    floorEmissiveColor: '#b1d3eb',
    floorLightColor: '#656565',
    floorBaseColor: '#000000',
    wallColor: '#95ceff',
  })

  // 2. Head Tracking Setup
  // With deform-only export, DEF- bones are the actual deforming bones.
  // DEF-spine.006 = head, DEF-spine.005 = neck
  // These are children within the DEF-spine hierarchy.
  const { headBone, neckBone } = useMemo(() => {
    const result = { headBone: null, neckBone: null }
    
    // Log all available node names for debugging
    const nodeNames = Object.keys(nodes)
    console.log('[HeadTrack] All node names:', nodeNames)
    
    // Try direct node access first (deform-only export uses names without dots)
    if (nodes['DEF-spine006']) {
      result.headBone = nodes['DEF-spine006']
      console.log('[HeadTrack] Found head via nodes["DEF-spine006"]')
    }
    if (nodes['DEF-spine005']) {
      result.neckBone = nodes['DEF-spine005']
      console.log('[HeadTrack] Found neck via nodes["DEF-spine005"]')
    }
    
    // Fallback: search through skeleton bones array
    if (!result.headBone || !result.neckBone) {
      const skeleton = nodes.input001?.skeleton || nodes.input001_2?.skeleton
      if (skeleton) {
        console.log('[HeadTrack] Skeleton bones:', skeleton.bones.map(b => b.name))
        for (const bone of skeleton.bones) {
          if (!result.headBone && bone.name === 'DEF-spine006') result.headBone = bone
          if (!result.neckBone && bone.name === 'DEF-spine005') result.neckBone = bone
        }
      } else {
        console.warn('[HeadTrack] No skeleton found on skinned meshes!')
      }
    }
    
    // Fallback 2: walk the DEF-spine bone tree manually
    if (!result.headBone || !result.neckBone) {
      const rootSpine = nodes['DEF-spine']
      if (rootSpine) {
        console.log('[HeadTrack] Walking DEF-spine tree...')
        rootSpine.traverse((child) => {
          console.log('[HeadTrack]   bone:', child.name, 'isBone:', child.isBone)
          if (!result.headBone && child.name === 'DEF-spine006') result.headBone = child
          if (!result.neckBone && child.name === 'DEF-spine005') result.neckBone = child
        })
      }
    }
    
    console.log('[HeadTrack] Head bone:', result.headBone?.name || 'NONE', 'isBone:', result.headBone?.isBone)
    console.log('[HeadTrack] Neck bone:', result.neckBone?.name || 'NONE', 'isBone:', result.neckBone?.isBone)
    
    // Store base rotations so we offset from the rest pose
    if (result.headBone) {
      result.headBone.userData.baseRotation = result.headBone.rotation.clone()
      const { x, y, z } = result.headBone.rotation
      console.log('[HeadTrack] Head base rot:', x.toFixed(3), y.toFixed(3), z.toFixed(3))
    }
    if (result.neckBone) {
      result.neckBone.userData.baseRotation = result.neckBone.rotation.clone()
      const { x, y, z } = result.neckBone.rotation
      console.log('[HeadTrack] Neck base rot:', x.toFixed(3), y.toFixed(3), z.toFixed(3))
    }
    
    return result
  }, [nodes])

  useFrame(() => {
    const mouse = mouseRef.current // -1 to 1 range from DOM listener
    
    // Neck: subtle follow
    if (neckBone && neckBone.userData.baseRotation) {
      const base = neckBone.userData.baseRotation
      const targetY = base.y + mouse.x * 0.25
      const targetX = base.x + mouse.y * -0.15
      neckBone.rotation.x = THREE.MathUtils.lerp(neckBone.rotation.x, targetX, 0.12)
      neckBone.rotation.y = THREE.MathUtils.lerp(neckBone.rotation.y, targetY, 0.12)
    }
    
    // Head: stronger follow, with extra upward tilt range
    if (headBone && headBone.userData.baseRotation) {
      const base = headBone.userData.baseRotation
      const targetY = base.y + mouse.x * 0.5
      const targetX = base.x + mouse.y * -0.55
      headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, targetX, 0.15)
      headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetY, 0.15)
    }
  })

  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        <group name="Circle">
          <mesh
            name="Circle_1"
            castShadow
            receiveShadow
            geometry={nodes.Circle_1.geometry}
          >
            <meshStandardMaterial color={wallColor} />
          </mesh>
          <mesh
            name="Circle_2"
            castShadow
            receiveShadow
            geometry={nodes.Circle_2.geometry}
          >
            <meshStandardMaterial 
              color={windowEmissiveColor}
              emissive={windowEmissiveColor}
              emissiveIntensity={windowEmissive}
              toneMapped={false}
            />
            {/* RectAreaLight provides both diffuse illumination and physical reflections on the robot */}
            <rectAreaLight
              width={10}
              height={5}
              color={windowLightColor}
              intensity={windowLightIntensity}
              position={[0, 2, -5]}
              rotation={[0, Math.PI, 0]}
            />
          </mesh>
          <mesh
            name="Circle_3"
            castShadow
            receiveShadow
            geometry={nodes.Circle_3.geometry}
          >
            <meshStandardMaterial 
              color={floorBaseColor}
              roughness={0.1}
              metalness={0.5}
            />
          </mesh>
          <mesh
            name="Circle_4"
            castShadow
            receiveShadow
            geometry={nodes.Circle_4.geometry}
          >
            <meshStandardMaterial 
              color={floorEmissiveColor}
              emissive={floorEmissiveColor}
              emissiveIntensity={floorEmissive}
              toneMapped={false}
            />
            {/* Added for floor light illumination and reflection */}
            <rectAreaLight
              width={5}
              height={5}
              color={floorLightColor}
              intensity={floorLightIntensity}
              position={[0, 0.1, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
          </mesh>
          <mesh
            name="Circle_5"
            castShadow
            receiveShadow
            geometry={nodes.Circle_5.geometry}
            material={materials['Material.002']}
          />
        </group>
        <group name="rig">
          <group name="robot">
            <skinnedMesh
              name="input001"
              geometry={nodes.input001.geometry}
              material={materials['Bones.001']}
              skeleton={nodes.input001.skeleton}
            />
            <skinnedMesh
              name="input001_1"
              geometry={nodes.input001_1.geometry}
              material={materials['Body.001']}
              skeleton={nodes.input001_1.skeleton}
            />
            <skinnedMesh
              name="input001_2"
              geometry={nodes.input001_2.geometry}
              material={materials['Head.001']}
              skeleton={nodes.input001_2.skeleton}
            />
            <skinnedMesh
              name="input001_3"
              geometry={nodes.input001_3.geometry}
              material={materials['Material.008']}
              skeleton={nodes.input001_3.skeleton}
            />
          </group>
          <primitive object={nodes['DEF-spine']} />
          <primitive object={nodes['DEF-pelvisL']} />
          <primitive object={nodes['DEF-pelvisR']} />
          <primitive object={nodes['DEF-thighL']} />
          <primitive object={nodes['DEF-thighR']} />
          <primitive object={nodes['DEF-shoulderL']} />
          <primitive object={nodes['DEF-upper_armL']} />
          <primitive object={nodes['DEF-shoulderR']} />
          <primitive object={nodes['DEF-upper_armR']} />
          <primitive object={nodes['DEF-breastL']} />
          <primitive object={nodes['DEF-breastR']} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/showroom.glb')
