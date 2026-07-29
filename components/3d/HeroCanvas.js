"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import HeroScene from "./HeroScene";
import { usePageReady } from "../PageTransitionProvider";

const GLTF_PATH = "/models/showroom.glb";
const TEXTURE_PATHS = {
  color: "/images/textures/sphere/Sphere_Color_bake.png",
  normal: "/images/textures/sphere/Sphere_Normal_bake.png",
  roughness: "/images/textures/sphere/Sphere_Roughness_bake.png",
  metallic: "/images/textures/sphere/Sphere_Metallic_bake.png",
};

function createGLTFLoader() {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  return loader;
}

// Factory passed to R3F's gl prop so R3F wires the renderer to its own
// managed <canvas> element. This is the only way computeInitialSize can
// find a real parentElement and measure the container correctly.
async function createWebGPURenderer({ canvas, antialias }) {
  const renderer = new WebGPURenderer({ canvas, antialias: antialias ?? true });
  await renderer.init();

  if (typeof window !== "undefined") {
    window.__gpuRenderer = renderer;
  }

  return renderer;
}

export default function HeroCanvas({ heroSectionRef, spacerRef }) {
  const [gpuReady, setGpuReady] = useState(false);
  const [assets, setAssets] = useState(null); // { gltf, textures }
  const { setReady } = usePageReady();

  // Stable factory ref — R3F calls this once with { canvas, ... }
  // We use useCallback so the reference never changes between renders
  // (passing a new function object would trigger a re-mount of the canvas).
  const glFactory = useCallback(createWebGPURenderer, []);

  // Probe WebGPU availability before mounting Canvas.
  // If the factory throws (no WebGPU), we never mount and avoid a crash.
  useEffect(() => {
    // navigator.gpu is the WebGPU entry point; check synchronously first.
    if (typeof navigator === "undefined" || !navigator.gpu) {
      console.error("WebGPU not available in this browser.");
      return;
    }
    setGpuReady(true);
  }, []);

  // Preload GLTF + textures independently of GPU init
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const fontsReady =
        typeof document !== "undefined" && document.fonts
          ? document.fonts.ready
          : Promise.resolve();

      const gltfLoad = new Promise((resolve, reject) => {
        createGLTFLoader().load(GLTF_PATH, resolve, undefined, reject);
      });

      const textureLoader = new THREE.TextureLoader();
      const texturesLoad = Promise.all(
        Object.entries(TEXTURE_PATHS).map(
          ([key, src]) =>
            new Promise((resolve, reject) => {
              textureLoader.load(src, (tex) => resolve([key, tex]), undefined, reject);
            })
        )
      );

      try {
        const [gltf, textureEntries] = await Promise.all([gltfLoad, texturesLoad, fontsReady]);
        if (!cancelled) {
          setAssets({ gltf, textures: Object.fromEntries(textureEntries) });
        }
      } catch (err) {
        console.error("Hero asset preload failed:", err);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const ready = gpuReady && Boolean(assets);

  useEffect(() => {
    if (ready) setReady(true);
  }, [ready, setReady]);

  return (
    <div className="fixed inset-0">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">Loading</div>
        </div>
      )}
      {ready && (
        // R3F Canvas manages its own <canvas> element and measures its container
        // via useMeasure on the inner wrapper div it renders. By NOT passing a
        // pre-built renderer we let R3F wire the canvas correctly, so
        // computeInitialSize finds a real parentElement and size > 0.
        <Canvas
          gl={glFactory}
          frameloop="always"
          dpr={[1, 2]}
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 2, 10], fov: 50 }}
          onCreated={(state) => {
            if (typeof window !== "undefined") window.__r3fState = state;
          }}
        >
          <HeroScene
            gltf={assets.gltf}
            textures={assets.textures}
            heroSectionRef={heroSectionRef}
            spacerRef={spacerRef}
          />
        </Canvas>
      )}
    </div>
  );
}
