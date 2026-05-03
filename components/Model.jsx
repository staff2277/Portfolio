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

  const { 
    headIntensity, 
    bodyIntensity, 
    shoulderIntensity,
    lerpSpeed
  } = useControls('Robot Movement', {
    headIntensity: { value: 1.0, min: 0, max: 2, step: 0.1 },
    bodyIntensity: { value: 1.0, min: 0, max: 2, step: 0.1 },
    shoulderIntensity: { value: 1.0, min: 0, max: 2, step: 0.1 },
    lerpSpeed: { value: 0.08, min: 0.01, max: 0.3, step: 0.01 },
  })

  // 2. Head Tracking Setup
  // With deform-only export, DEF- bones are the actual deforming bones.
  // DEF-spine.006 = head, DEF-spine.005 = neck
  // These are children within the DEF-spine hierarchy.
  const { headBone, neckBone, chestBone, spineBone, shoulderL, shoulderR, armL, armR } = useMemo(() => {
    const result = { 
      headBone: null, 
      neckBone: null, 
      chestBone: null, 
      spineBone: null, 
      shoulderL: null, 
      shoulderR: null,
      armL: null,
      armR: null
    }
    
    // Helper to find bone in nodes or hierarchy
    const findBone = (name) => {
      if (nodes[name]) return nodes[name]
      let found = null
      nodes['DEF-spine']?.traverse((child) => {
        if (child.name === name) found = child
      })
      return found
    }

    result.headBone = findBone('DEF-spine006')
    result.neckBone = findBone('DEF-spine005')
    result.chestBone = findBone('DEF-spine003')
    result.spineBone = findBone('DEF-spine001')
    result.shoulderL = findBone('DEF-shoulderL')
    result.shoulderR = findBone('DEF-shoulderR')
    result.armL = findBone('DEF-upper_armL')
    result.armR = findBone('DEF-upper_armR')
    
    const allFound = Object.entries(result).map(([k, v]) => `${k}: ${!!v}`)
    console.log('[HeadTrack] Bones mapping:', allFound)
    
    // Store base rotations
    Object.values(result).forEach(bone => {
      if (bone) bone.userData.baseRotation = bone.rotation.clone()
    })
    
    return result
  }, [nodes])

  // Set a more natural "Relaxed" pose on mount (Arms down, slight slouch)
  useEffect(() => {
    if (armL) armL.rotation.z = -Math.PI / 2.5
    if (armR) armR.rotation.z = Math.PI / 2.5
    if (shoulderL) shoulderL.rotation.z = -0.1
    if (shoulderR) shoulderR.rotation.z = 0.1
    if (spineBone) spineBone.rotation.x = 0.05
    
    // Update base rotations to include this natural pose
    const bones = [armL, armR, shoulderL, shoulderR, spineBone]
    bones.forEach(b => {
      if (b) b.userData.baseRotation = b.rotation.clone()
    })
  }, [armL, armR, shoulderL, shoulderR, spineBone])

  useFrame(() => {
    const mouse = mouseRef.current // -1 to 1 range from DOM listener
    
    // 1. Spine & Chest: subtle lean
    if (spineBone && spineBone.userData.baseRotation) {
      const base = spineBone.userData.baseRotation
      spineBone.rotation.y = THREE.MathUtils.lerp(spineBone.rotation.y, base.y + mouse.x * 0.1 * bodyIntensity, lerpSpeed)
      spineBone.rotation.x = THREE.MathUtils.lerp(spineBone.rotation.x, base.x + mouse.y * -0.05 * bodyIntensity, lerpSpeed)
    }
    if (chestBone && chestBone.userData.baseRotation) {
      const base = chestBone.userData.baseRotation
      chestBone.rotation.y = THREE.MathUtils.lerp(chestBone.rotation.y, base.y + mouse.x * 0.15 * bodyIntensity, lerpSpeed)
      chestBone.rotation.x = THREE.MathUtils.lerp(chestBone.rotation.x, base.x + mouse.y * -0.1 * bodyIntensity, lerpSpeed)
    }

    // 2. Shoulders: reactive shrug
    if (shoulderL && shoulderL.userData.baseRotation) {
      const base = shoulderL.userData.baseRotation
      shoulderL.rotation.x = THREE.MathUtils.lerp(shoulderL.rotation.x, base.x + mouse.y * 0.1 * shoulderIntensity, lerpSpeed)
      shoulderL.rotation.z = THREE.MathUtils.lerp(shoulderL.rotation.z, base.z + mouse.y * 0.05 * shoulderIntensity, lerpSpeed)
    }
    if (shoulderR && shoulderR.userData.baseRotation) {
      const base = shoulderR.userData.baseRotation
      shoulderR.rotation.x = THREE.MathUtils.lerp(shoulderR.rotation.x, base.x + mouse.y * 0.1 * shoulderIntensity, lerpSpeed)
      shoulderR.rotation.z = THREE.MathUtils.lerp(shoulderR.rotation.z, base.z + mouse.y * -0.05 * shoulderIntensity, lerpSpeed)
    }

    // 3. Neck: subtle follow
    if (neckBone && neckBone.userData.baseRotation) {
      const base = neckBone.userData.baseRotation
      const targetY = base.y + mouse.x * 0.25 * headIntensity
      const targetX = base.x + mouse.y * -0.15 * headIntensity
      neckBone.rotation.x = THREE.MathUtils.lerp(neckBone.rotation.x, targetX, lerpSpeed * 1.5)
      neckBone.rotation.y = THREE.MathUtils.lerp(neckBone.rotation.y, targetY, lerpSpeed * 1.5)
    }
    
    // 4. Head: stronger follow, with extra upward tilt range
    if (headBone && headBone.userData.baseRotation) {
      const base = headBone.userData.baseRotation
      const targetY = base.y + mouse.x * 0.5 * headIntensity
      const targetX = base.x + mouse.y * -0.55 * headIntensity
      headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, targetX, lerpSpeed * 2)
      headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetY, lerpSpeed * 2)
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
