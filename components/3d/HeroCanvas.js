"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import HeroScene from "./HeroScene";

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

export default function HeroCanvas({ heroSectionRef, onProgress, onLoaded, isLoaderFinished }) {
  const [gpuReady, setGpuReady] = useState(false);
  const [assets, setAssets] = useState(null); // { gltf, textures }

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

      let gltfProgress = 0;
      let loadedTexturesCount = 0;
      const totalTextures = Object.keys(TEXTURE_PATHS).length;

      const reportOverallProgress = () => {
        if (cancelled) return;
        // GLTF represents 70% of asset loading, textures represent 30%
        // Max asset progress before canvas render is capped at 90%
        const overall = Math.min(
          Math.round(gltfProgress * 70 + (loadedTexturesCount / totalTextures) * 30),
          90
        );
        onProgress?.(overall);
      };

      const gltfLoad = new Promise((resolve, reject) => {
        createGLTFLoader().load(
          GLTF_PATH,
          (gltf) => {
            gltfProgress = 1;
            reportOverallProgress();
            resolve(gltf);
          },
          (xhr) => {
            if (xhr.lengthComputable && xhr.total > 0) {
              gltfProgress = Math.min(xhr.loaded / xhr.total, 1);
            } else {
              gltfProgress = Math.min(gltfProgress + 0.1, 0.9);
            }
            reportOverallProgress();
          },
          reject
        );
      });

      const textureLoader = new THREE.TextureLoader();
      const texturesLoad = Promise.all(
        Object.entries(TEXTURE_PATHS).map(
          ([key, src]) =>
            new Promise((resolve, reject) => {
              textureLoader.load(
                src,
                (tex) => {
                  loadedTexturesCount++;
                  reportOverallProgress();
                  resolve([key, tex]);
                },
                undefined,
                reject
              );
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
  }, [onProgress]);

  const ready = gpuReady && Boolean(assets);

  return (
    <div className="fixed inset-0">
      {ready && (
        // R3F Canvas manages its own <canvas> element and measures its container
        // via useMeasure on the inner wrapper div it renders. By NOT passing a
        // pre-built renderer we let R3F wire the canvas correctly, so
        // computeInitialSize finds a real parentElement and size > 0.
        <Canvas
          gl={glFactory}
          shadows
          frameloop="always"
          dpr={[1, 2]}
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 2, 10], fov: 50 }}
          onCreated={(state) => {
            if (typeof window !== "undefined") window.__r3fState = state;

            // Wait 2 requestAnimationFrames so WebGPU completes initial frame rendering
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                onProgress?.(100);
                onLoaded?.();
              });
            });
          }}
        >
          <HeroScene
            gltf={assets.gltf}
            textures={assets.textures}
            heroSectionRef={heroSectionRef}
            isLoaderFinished={isLoaderFinished}
          />
        </Canvas>
      )}
    </div>
  );
}
