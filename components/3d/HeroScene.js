"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import SphereShell from "./SphereShell";
import { useCameraSequence } from "./useCameraSequence";

// Authorial frame markers baked into the Blender export (not literal glTF
// markers -- hardcoded here as the source of truth for the sequence).
export const HERO_START = 0;
export const HERO_HOLD = 42;
export const HERO_END = 110;
const FPS = 24;

// sphere_animation.js originally loaded /sunny.hdr, which was never actually
// present in this project's public/ folder. Using three.js's own hosted
// example HDRI here (MIT-licensed, same repo the library ships from) rather
// than vendoring a binary file -- the same pattern already used for the
// Draco decoder CDN path.
const HDRI_URL =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/venice_sunset_1k.hdr";

// --- TEMPORARY DEBUG SWITCH -------------------------------------------
// Flip to false once you can confirm geometry is actually visible and want
// the real scripted Camera_Export sequence driving the view again.
const DEBUG_FREE_CAMERA = true;
// ------------------------------------------------------------------------

export default function HeroScene({ gltf, textures, heroSectionRef, spacerRef }) {
  const set = useThree((state) => state.set);
  const size = useThree((state) => state.size);
  const threeScene = useThree((state) => state.scene);

  const mixerRef = useRef(null);
  const cameraObjRef = useRef(null);
  const [hdriTexture, setHdriTexture] = useState(null);

  const { scene, cameraObject, sphereTransform } = useMemo(() => {
    const sceneRoot = gltf.scene;

    const sphereNode = sceneRoot.getObjectByName("Sphere");
    let transform = null;
    if (sphereNode) {
      sphereNode.updateWorldMatrix(true, false);
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      sphereNode.matrixWorld.decompose(position, quaternion, scale);
      transform = { position, quaternion, scale };
      sphereNode.parent?.remove(sphereNode);
    }

    const camObject = sceneRoot.getObjectByName("Camera_Export");

    return { scene: sceneRoot, cameraObject: camObject, sphereTransform: transform };
  }, [gltf]);

  // Load the HDRI directly rather than via drei's <Environment>, whose PMREM
  // pre-processing step wasn't producing a visible result against a manually
  // constructed WebGPURenderer. This sets scene.background AND
  // scene.environment straight from the equirect texture -- less accurate
  // specular blur than a proper PMREM pass, but guaranteed to actually show
  // up, which is the immediate goal.
  useEffect(() => {
    let cancelled = false;
    new HDRLoader().load(HDRI_URL, (texture) => {
      if (cancelled) return;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      setHdriTexture(texture);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hdriTexture || !threeScene) return;
    threeScene.background = hdriTexture;
    threeScene.environment = hdriTexture;
    return () => {
      threeScene.background = null;
      threeScene.environment = null;
    };
  }, [hdriTexture, threeScene]);

  useEffect(() => {
    if (!cameraObject || !gltf.animations?.length) return;
    const clip = gltf.animations[0];
    const mixer = new THREE.AnimationMixer(scene);
    const action = mixer.clipAction(clip);
    action.play();
    action.paused = true;

    mixerRef.current = mixer;
    cameraObjRef.current = cameraObject;

    return () => {
      mixer.stopAllAction();
      mixer.uncacheClip(clip);
      mixerRef.current = null;
    };
  }, [scene, cameraObject, gltf.animations]);

  useEffect(() => {
    if (!cameraObject) return;
    set({ camera: cameraObject });
  }, [cameraObject, set]);

  useEffect(() => {
    if (!cameraObject?.isPerspectiveCamera) return;
    cameraObject.aspect = size.width / size.height;
    cameraObject.updateProjectionMatrix();
  }, [cameraObject, size.width, size.height]);

  useCameraSequence({
    mixerRef,
    cameraObjectRef: cameraObjRef,
    fps: FPS,
    holdFrame: HERO_HOLD,
    endFrame: HERO_END,
    heroSectionRef,
    spacerRef,
    disabled: DEBUG_FREE_CAMERA,
  });

  return (
    <>
      <hemisphereLight args={[0xffffff, 0x222222, 0.6]} />
      <directionalLight position={[20, 30, 10]} intensity={1.2} />

      <primitive object={scene} />

      {sphereTransform && (
        <SphereShell
          position={sphereTransform.position}
          quaternion={sphereTransform.quaternion}
          scale={sphereTransform.scale}
          textures={textures}
        />
      )}

      {DEBUG_FREE_CAMERA && <OrbitControls makeDefault />}
    </>
  );
}
