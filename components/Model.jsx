import React, { useRef, useMemo } from 'react'
import { useGLTF, MeshReflectorMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'

// Initialize RectAreaLight to enable reflections in PBR materials
RectAreaLightUniformsLib.init()

export function Model(props) {
  const { nodes, materials } = useGLTF('/models/showroom.glb')

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
    floorBaseColor
  } = useControls('Showroom Lighting', {
    windowEmissive: { value: 3.3, min: 0, max: 10, step: 0.1 },
    floorEmissive: { value: 1.1, min: 0, max: 10, step: 0.1 },
    windowLightIntensity: { value: 2, min: 0, max: 100, step: 1 },
    floorLightIntensity: { value: 0, min: 0, max: 100, step: 1 },
    windowEmissiveColor: '#ffffff',
    windowLightColor: '#79bff2',
    floorEmissiveColor: '#ffffff',
    floorLightColor: '#656565',
    floorBaseColor: '#000000',
  })

  // 2. Head Tracking Setup
  // We target the head bone specifically for mouse tracking
  const headBone = useMemo(() => {
    return nodes['DEF-head'] || nodes['WGT-rig_head'] || nodes['head'] || null
  }, [nodes])

  useFrame((state) => {
    if (headBone) {
      const mouse = state.mouse
      
      // Target rotation (clamped for safety)
      const targetRotationX = mouse.y * 0.4
      const targetRotationY = mouse.x * 0.6
      
      // Smooth lerp to look at mouse
      // Note: We add/subtract from base rotation if needed
      headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, targetRotationX + 1.777, 0.1)
      headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetRotationY, 0.1)
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
            material={materials.Walls}
          />
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
          <primitive object={nodes.root} />
          <primitive object={nodes['MCH-torsoparent']} />
          <primitive object={nodes['MCH-hand_ikparentL']} />
          <primitive object={nodes['MCH-upper_arm_ik_targetparentL']} />
          <primitive object={nodes['MCH-hand_ikparentR']} />
          <primitive object={nodes['MCH-upper_arm_ik_targetparentR']} />
          <primitive object={nodes['MCH-foot_ikparentL']} />
          <primitive object={nodes['MCH-thigh_ik_targetparentL']} />
          <primitive object={nodes['MCH-foot_ikparentR']} />
          <primitive object={nodes['MCH-thigh_ik_targetparentR']} />
        </group>
        <group
          name="WGT-rig_spine_fk"
          position={[0, 0.578, -0.009]}
          rotation={[1.823, 0, 0]}
          scale={0.076}
        />
        <group
          name="WGT-rig_spine_fk001"
          position={[0, 0.642, -0.008]}
          rotation={[1.582, 0, 0]}
          scale={0.065}
        />
        <group
          name="WGT-rig_spine_fk002"
          position={[0, 0.642, -0.008]}
          rotation={[1.551, 0, 0]}
          scale={0.089}
        />
        <group
          name="WGT-rig_spine_fk003"
          position={[0, 0.731, -0.01]}
          rotation={[1.522, -0.022, -0.003]}
          scale={0.071}
        />
        <group
          name="WGT-rig_tweak_spine"
          position={[0, 0.504, -0.028]}
          rotation={[1.823, 0, 0]}
          scale={0.038}
        />
        <group
          name="WGT-rig_tweak_spine001"
          position={[0, 0.578, -0.009]}
          rotation={[1.582, 0, 0]}
          scale={0.032}
        />
        <group
          name="WGT-rig_tweak_spine002"
          position={[0, 0.642, -0.008]}
          rotation={[1.551, 0, 0]}
          scale={0.045}
        />
        <group
          name="WGT-rig_tweak_spine003"
          position={[0, 0.731, -0.01]}
          rotation={[1.522, -0.022, -0.003]}
          scale={0.035}
        />
        <group
          name="WGT-rig_tweak_spine004"
          position={[0.002, 0.802, -0.013]}
          rotation={[1.572, 0.039, -0.031]}
          scale={0.02}
        />
        <group name="WGT-rig_torso" position={[0, 0.541, -0.018]} scale={0.18} />
        <group
          name="WGT-rig_hips"
          position={[0, 0.504, -0.028]}
          rotation={[1.823, 0, 0]}
          scale={0.075}
        />
        <group
          name="WGT-rig_chest"
          position={[0, 0.731, -0.01]}
          rotation={[1.522, -0.022, -0.003]}
          scale={0.1}
        />
        <group
          name="WGT-rig_breastL"
          position={[0.061, 0.77, -0.024]}
          rotation={[Math.PI, 0, -3.138]}
          scale={0.069}
        />
        <group
          name="WGT-rig_breastR"
          position={[-0.061, 0.77, -0.024]}
          rotation={[0, 0, 3.138]}
          scale={-0.069}
        />
        <group
          name="WGT-rig_shoulderL"
          position={[0.002, 0.802, -0.013]}
          rotation={[-2.792, -1.542, -2.78]}
          scale={0.106}
        />
        <group
          name="WGT-rig_upper_arm_parentL"
          position={[0.124, 0.791, -0.013]}
          rotation={[-0.054, -1.332, -1.566]}
          scale={0.033}
        />
        <group
          name="WGT-rig_upper_arm_fkL"
          position={[0.124, 0.791, -0.013]}
          rotation={[-0.054, -1.332, -1.566]}
          scale={0.131}
        />
        <group
          name="WGT-rig_forearm_fkL"
          position={[0.251, 0.789, -0.044]}
          rotation={[3.077, -1.411, 1.564]}
          scale={0.124}
        />
        <group
          name="WGT-rig_hand_fkL"
          position={[0.373, 0.79, -0.025]}
          rotation={[-2.724, -1.501, 2.046]}
          scale={0.063}
        />
        <group
          name="WGT-rig_upper_arm_ikL"
          position={[0.124, 0.791, -0.013]}
          rotation={[-0.054, -1.332, -1.566]}
          scale={0.131}
        />
        <group
          name="WGT-rig_upper_arm_ik_targetL"
          position={[0.239, 0.775, -0.293]}
          rotation={[3.083, -0.045, 1.313]}
          scale={0.031}
        />
        <group
          name="WGT-rig_hand_ikL"
          position={[0.373, 0.79, -0.025]}
          rotation={[-2.724, -1.501, 2.046]}
          scale={0.063}
        />
        <group
          name="WGT-rig_VIS_upper_arm_ik_poleL"
          position={[0.251, 0.789, -0.044]}
          rotation={[Math.PI / 2, 0, -1.501]}
          scale={0.249}
        />
        <group
          name="WGT-rig_upper_arm_tweakL"
          position={[0.124, 0.791, -0.013]}
          rotation={[-0.054, -1.332, -1.566]}
          scale={0.033}
        />
        <group
          name="WGT-rig_upper_arm_tweakL001"
          position={[0.187, 0.79, -0.029]}
          rotation={[-0.054, -1.332, -1.566]}
          scale={0.033}
        />
        <group
          name="WGT-rig_forearm_tweakL"
          position={[0.251, 0.789, -0.044]}
          rotation={[3.077, -1.411, 1.564]}
          scale={0.031}
        />
        <group
          name="WGT-rig_forearm_tweakL001"
          position={[0.312, 0.79, -0.034]}
          rotation={[3.077, -1.411, 1.564]}
          scale={0.031}
        />
        <group
          name="WGT-rig_hand_tweakL"
          position={[0.373, 0.79, -0.025]}
          rotation={[-2.724, -1.501, 2.046]}
          scale={0.016}
        />
        <group
          name="WGT-rig_shoulderR"
          position={[0.002, 0.802, -0.013]}
          rotation={[0.35, -1.543, -2.78]}
          scale={-0.109}
        />
        <group
          name="WGT-rig_upper_arm_parentR"
          position={[-0.124, 0.791, -0.013]}
          rotation={[3.087, -1.332, -1.566]}
          scale={-0.033}
        />
        <group
          name="WGT-rig_upper_arm_fkR"
          position={[-0.124, 0.791, -0.013]}
          rotation={[3.087, -1.332, -1.566]}
          scale={-0.131}
        />
        <group
          name="WGT-rig_forearm_fkR"
          position={[-0.251, 0.789, -0.044]}
          rotation={[-0.065, -1.411, 1.564]}
          scale={-0.124}
        />
        <group
          name="WGT-rig_hand_fkR"
          position={[-0.373, 0.79, -0.025]}
          rotation={[0.418, -1.501, 2.046]}
          scale={-0.063}
        />
        <group
          name="WGT-rig_upper_arm_ikR"
          position={[-0.124, 0.791, -0.013]}
          rotation={[3.087, -1.332, -1.566]}
          scale={-0.131}
        />
        <group
          name="WGT-rig_upper_arm_ik_targetR"
          position={[-0.239, 0.775, -0.293]}
          rotation={[-0.059, -0.045, 1.313]}
          scale={-0.031}
        />
        <group
          name="WGT-rig_hand_ikR"
          position={[-0.373, 0.79, -0.025]}
          rotation={[0.418, -1.501, 2.046]}
          scale={-0.063}
        />
        <group
          name="WGT-rig_VIS_upper_arm_ik_poleR"
          position={[-0.251, 0.789, -0.044]}
          rotation={[-Math.PI / 2, 0, -1.501]}
          scale={-0.249}
        />
        <group
          name="WGT-rig_upper_arm_tweakR"
          position={[-0.124, 0.791, -0.013]}
          rotation={[3.087, -1.332, -1.566]}
          scale={-0.033}
        />
        <group
          name="WGT-rig_upper_arm_tweakR001"
          position={[-0.187, 0.79, -0.029]}
          rotation={[3.087, -1.332, -1.566]}
          scale={-0.033}
        />
        <group
          name="WGT-rig_forearm_tweakR"
          position={[-0.251, 0.789, -0.044]}
          rotation={[-0.065, -1.411, 1.564]}
          scale={-0.031}
        />
        <group
          name="WGT-rig_forearm_tweakR001"
          position={[-0.312, 0.79, -0.034]}
          rotation={[-0.065, -1.411, 1.564]}
          scale={-0.031}
        />
        <group
          name="WGT-rig_hand_tweakR"
          position={[-0.373, 0.79, -0.025]}
          rotation={[0.418, -1.501, 2.046]}
          scale={-0.016}
        />
        <group
          name="WGT-rig_neck"
          position={[0.002, 0.802, -0.013]}
          rotation={[1.594, 0.021, -0.014]}
          scale={0.073}
        />
        <group
          name="WGT-rig_head"
          position={[0, 0.875, -0.011]}
          rotation={[1.777, 0, 0]}
          scale={0.116}
        />
        <group
          name="WGT-rig_tweak_spine005"
          position={[0, 0.842, -0.013]}
          rotation={[1.622, 0, 0]}
          scale={0.017}
        />
        <group
          name="WGT-rig_thigh_parentL"
          position={[0.078, 0.543, -0.006]}
          rotation={[-1.536, -0.044, 1.406]}
          scale={0.067}
        />
        <group
          name="WGT-rig_thigh_fkL"
          position={[0.078, 0.543, -0.006]}
          rotation={[-1.536, -0.044, 1.406]}
          scale={0.266}
        />
        <group
          name="WGT-rig_shin_fkL"
          position={[0.09, 0.277, -0.015]}
          rotation={[-1.527, 0.009, 1.406]}
          scale={0.225}
        />
        <group
          name="WGT-rig_foot_fkL"
          position={[0.088, 0.052, -0.025]}
          rotation={[-2.639, 0, 0]}
          scale={0.081}
        />
        <group
          name="WGT-rig_toe_fkL"
          position={[0.088, 0.013, 0.046]}
          rotation={[-3.114, -0.192, 3.142]}
          scale={0.035}
        />
        <group
          name="WGT-rig_thigh_ikL"
          position={[0.078, 0.543, -0.006]}
          rotation={[-1.536, -0.044, 1.406]}
          scale={0.266}
        />
        <group
          name="WGT-rig_thigh_ik_targetL"
          position={[0.574, 0.283, 0.065]}
          rotation={[-0.077, 1.405, 0.065]}
          scale={0.061}
        />
        <group name="WGT-rig_foot_ikL" position={[0.088, 0.052, -0.025]} scale={0.081} />
        <group
          name="WGT-rig_VIS_thigh_ik_poleL"
          position={[0.09, 0.277, -0.015]}
          rotation={[Math.PI / 2, 0, 1.397]}
          scale={0.491}
        />
        <group
          name="WGT-rig_thigh_tweakL"
          position={[0.078, 0.543, -0.006]}
          rotation={[-1.536, -0.044, 1.406]}
          scale={0.067}
        />
        <group
          name="WGT-rig_thigh_tweakL001"
          position={[0.084, 0.41, -0.011]}
          rotation={[-1.536, -0.044, 1.406]}
          scale={0.067}
        />
        <group
          name="WGT-rig_shin_tweakL"
          position={[0.09, 0.277, -0.015]}
          rotation={[-1.527, 0.009, 1.406]}
          scale={0.056}
        />
        <group
          name="WGT-rig_shin_tweakL001"
          position={[0.089, 0.165, -0.02]}
          rotation={[-1.527, 0.009, 1.406]}
          scale={0.056}
        />
        <group
          name="WGT-rig_foot_tweakL"
          position={[0.088, 0.052, -0.025]}
          rotation={[-2.639, 0, 0]}
          scale={0.02}
        />
        <group name="WGT-rig_foot_spin_ikL" position={[0.088, 0.013, 0.046]} scale={0.04} />
        <group name="WGT-rig_foot_heel_ikL" position={[0.088, 0.052, -0.025]} scale={0.04} />
        <group
          name="WGT-rig_toe_ikL"
          position={[0.088, 0.013, 0.046]}
          rotation={[-3.114, -0.192, 3.142]}
          scale={0.035}
        />
        <group
          name="WGT-rig_thigh_parentR"
          position={[-0.078, 0.543, -0.006]}
          rotation={[1.606, -0.044, 1.406]}
          scale={-0.067}
        />
        <group
          name="WGT-rig_thigh_fkR"
          position={[-0.078, 0.543, -0.006]}
          rotation={[1.606, -0.044, 1.406]}
          scale={-0.266}
        />
        <group
          name="WGT-rig_shin_fkR"
          position={[-0.09, 0.277, -0.015]}
          rotation={[1.614, 0.009, 1.406]}
          scale={-0.225}
        />
        <group
          name="WGT-rig_foot_fkR"
          position={[-0.088, 0.052, -0.025]}
          rotation={[0.502, 0, 0]}
          scale={-0.081}
        />
        <group
          name="WGT-rig_toe_fkR"
          position={[-0.088, 0.013, 0.046]}
          rotation={[0.028, -0.192, 3.142]}
          scale={-0.035}
        />
        <group
          name="WGT-rig_thigh_ikR"
          position={[-0.078, 0.543, -0.006]}
          rotation={[1.606, -0.044, 1.406]}
          scale={-0.266}
        />
        <group
          name="WGT-rig_thigh_ik_targetR"
          position={[-0.574, 0.283, 0.065]}
          rotation={[3.065, 1.405, 0.065]}
          scale={-0.061}
        />
        <group
          name="WGT-rig_foot_ikR"
          position={[-0.088, 0.052, -0.025]}
          rotation={[-Math.PI, 0, 0]}
          scale={-0.081}
        />
        <group
          name="WGT-rig_VIS_thigh_ik_poleR"
          position={[-0.09, 0.277, -0.015]}
          rotation={[-Math.PI / 2, 0, 1.397]}
          scale={-0.491}
        />
        <group
          name="WGT-rig_thigh_tweakR"
          position={[-0.078, 0.543, -0.006]}
          rotation={[1.606, -0.044, 1.406]}
          scale={-0.067}
        />
        <group
          name="WGT-rig_thigh_tweakR001"
          position={[-0.084, 0.41, -0.011]}
          rotation={[1.606, -0.044, 1.406]}
          scale={-0.067}
        />
        <group
          name="WGT-rig_shin_tweakR"
          position={[-0.09, 0.277, -0.015]}
          rotation={[1.614, 0.009, 1.406]}
          scale={-0.056}
        />
        <group
          name="WGT-rig_shin_tweakR001"
          position={[-0.089, 0.165, -0.02]}
          rotation={[1.614, 0.009, 1.406]}
          scale={-0.056}
        />
        <group
          name="WGT-rig_foot_tweakR"
          position={[-0.088, 0.052, -0.025]}
          rotation={[0.502, 0, 0]}
          scale={-0.02}
        />
        <group
          name="WGT-rig_foot_spin_ikR"
          position={[-0.088, 0.013, 0.046]}
          rotation={[-Math.PI, 0, 0]}
          scale={-0.04}
        />
        <group
          name="WGT-rig_foot_heel_ikR"
          position={[-0.088, 0.052, -0.025]}
          rotation={[-Math.PI, 0, 0]}
          scale={-0.04}
        />
        <group
          name="WGT-rig_toe_ikR"
          position={[-0.088, 0.013, 0.046]}
          rotation={[0.028, -0.192, 3.142]}
          scale={-0.035}
        />
        <group name="WGT-rig_root" scale={0.497} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/showroom.glb')
