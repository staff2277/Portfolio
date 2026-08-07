"use client";

import { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import SphereShell from "./SphereShell";
import { useCameraSequence } from "./useCameraScroll";

// Authorial frame markers baked into the Blender export. HERO_HOLD/the old
// markers were removed in Blender (see handoff.md) -- this is now a single
// continuous scroll-driven move across the whole clip, no hold/handoff.
export const HERO_START = 0;
export const HERO_END = 110;
const FPS = 24;

// The glb re-export (see handoff.md) now contains three animation clips
// (Camera.001Action, EmptyAction, Camera_ExportAction, in that order) --
// gltf.animations[0] is no longer reliably the camera clip. Find it by name.
const CAMERA_CLIP_NAME = "Camera_ExportAction";

// How much higher than the sphere the spotlight sits, along the scene's
// actual vertical axis. Blender's Z-up gets converted to glTF/Three.js
// Y-up on export (export_yup=True) -- the sphere's Blender Z position of
// ~14.3 became its Y position in this loaded scene, so "up" here means the
// Y component, not Z.
const SPOTLIGHT_HEIGHT_OFFSET = 20;

// Hardcoded sphere position (Blender: 0, 0, 14.31 -> this loaded Y-up
// scene: 0, 14.31, 0), used only for the spotlight below. Hardcoded on
// purpose, not read from sphereTransform -- the spotlight's placement
// shouldn't move if the sphere's transform ever changes; SphereShell
// itself still uses the live sphereTransform.position as before.
const SPHERE_POSITION = new THREE.Vector3(0, 14.31, 0);

export default function HeroScene({ gltf, textures, heroSectionRef, isLoaderFinished }) {
  const set = useThree((state) => state.set);
  const size = useThree((state) => state.size);

  const mixerRef = useRef(null);
  const cameraObjRef = useRef(null);
  const baseQuaternionRef = useRef(new THREE.Quaternion());
  const mouseXTarget = useRef(0);
  const currentMouseX = useRef(0);

  // Target the spotlight aims at -- hardcoded straight down at
  // SPHERE_POSITION rather than tracked live, same reasoning as the
  // position above. Must still be part of the scene graph (rendered via
  // <primitive>) for SpotLight.target's matrixWorld to update.
  const spotlightTarget = useMemo(() => new THREE.Object3D(), []);

  const { scene, cameraObject, sphereTransform } = useMemo(() => {
    const sceneRoot = gltf.scene;

    sceneRoot.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

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

    return {
      scene: sceneRoot,
      cameraObject: camObject,
      sphereTransform: transform,
    };
  }, [gltf]);

  // Bind the AnimationMixer to Camera_Export's baked clip -- useCameraSequence
  // (below) drives mixer.setTime() from scroll. Deliberately NOT setting
  // action.paused = true: a paused AnimationAction's setTime() always
  // evaluates to clip time 0 regardless of the value passed in (see
  // handoff.md, 2026-08-01 (4) for why) -- leaving it unpaused is safe since
  // nothing here calls mixer.update() in a continuous loop.
  useEffect(() => {
    if (!cameraObject || !gltf.animations?.length) return;
    const clip =
      gltf.animations.find((a) => a.name === CAMERA_CLIP_NAME) ??
      gltf.animations[0];
    const mixer = new THREE.AnimationMixer(scene);
    const action = mixer.clipAction(clip);
    action.play();
    mixer.setTime(0);

    mixerRef.current = mixer;
    cameraObjRef.current = cameraObject;

    if (typeof window !== "undefined") {
      window.__mixerRef = mixerRef;
      window.__cameraObjRef = cameraObjRef;
      window.__animLen = gltf.animations?.length;
      window.__clipDuration = clip.duration;
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheClip(clip);
      mixerRef.current = null;
    };
  }, [scene, cameraObject, gltf.animations]);

  const { autoplayDone } = useCameraSequence({
    mixerRef,
    cameraObjectRef: cameraObjRef,
    baseQuaternionRef,
    fps: FPS,
    startFrame: HERO_START,
    autoplayEndFrame: 45,
    endFrame: HERO_END,
    heroSectionRef,
    isLoaderFinished,
  });

  // Track mouse X position once autoplay finishes
  useEffect(() => {
    if (!autoplayDone) return;

    const handleMouseMove = (e) => {
      // clientX range 0..width mapped to -1.0 (left half) .. +1.0 (right half)
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseXTarget.current = normX;
    };

    window.addEventListener("pointermove", handleMouseMove);
    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
    };
  }, [autoplayDone]);

  // Apply smooth mouse tilt onto camera after autoplay completes
  useFrame((state, delta) => {
    if (!autoplayDone || !cameraObjRef.current) return;

    // Interpolate mouse X position smoothly
    currentMouseX.current = THREE.MathUtils.damp(
      currentMouseX.current,
      mouseXTarget.current,
      5,
      delta
    );

    const camera = cameraObjRef.current;

    // Ensure baseQuaternion has been captured from animation clip frame
    if (baseQuaternionRef.current.lengthSq() === 0) {
      baseQuaternionRef.current.copy(camera.quaternion);
    }

    // Y-axis tilt: turn camera left when mouse is on left half (-X), right when on right half (+X)
    // Z-axis tilt: subtle roll for added dynamic perspective
    const tiltEuler = new THREE.Euler(
      0,
      -currentMouseX.current * 0.07,
      -currentMouseX.current * 0.02,
      "YXZ"
    );
    const tiltQuat = new THREE.Quaternion().setFromEuler(tiltEuler);

    camera.quaternion.copy(baseQuaternionRef.current).multiply(tiltQuat);
  });

  // Camera_Export is the camera for the whole sequence -- make it R3F's
  // active render camera instead of the default.
  useEffect(() => {
    if (!cameraObject) return;
    if (cameraObject.isPerspectiveCamera) {
      cameraObject.fov = 50;
      cameraObject.updateProjectionMatrix();
    }
    set({ camera: cameraObject });
  }, [cameraObject, set]);

  useEffect(() => {
    if (!cameraObject?.isPerspectiveCamera) return;
    cameraObject.fov = 50;
    cameraObject.aspect = size.width / size.height;
    cameraObject.updateProjectionMatrix();
  }, [cameraObject, size.width, size.height]);

  return (
    <>
      <hemisphereLight args={[0xffffff, 0x222222, 0.6]} />
      <directionalLight position={[20, 30, 10]} intensity={5} />
      <primitive object={scene} />

      <primitive object={spotlightTarget} position={SPHERE_POSITION} />
      <spotLight
        castShadow
        position={[24.8, 34.3, -3.8]}
        target={spotlightTarget}
        angle={1.22}
        penumbra={1.0}
        intensity={13550}
        distance={96}
        decay={2.1}
        color="#ffffff"
      />

      {sphereTransform && (
        <SphereShell
          position={sphereTransform.position}
          quaternion={sphereTransform.quaternion}
          scale={sphereTransform.scale}
          textures={textures}
        />
      )}
      <OrbitControls
        target={[SPHERE_POSITION.x, SPHERE_POSITION.y, SPHERE_POSITION.z]}
        enableDamping
      />
    </>
  );
}
