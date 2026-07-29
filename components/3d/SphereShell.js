"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MeshStandardNodeMaterial } from "three/webgpu";
import {
  positionLocal,
  normalLocal,
  attribute,
  texture,
  normalMap as normalMapNode,
} from "three/tsl";

// Converted 1:1 from public/models/sphere_animation.js. Behavior preserved
// exactly: hover-reveal displacement, idle pulse, core light/color pulsing,
// wireframe fade. The only real change is wiring the baked textures into
// sphereShell's colorNode/normalNode/roughnessNode/metalnessNode (it was
// flat black in the source) without touching positionNode/opacityNode.
//
// NOTE: the source file's animate() loop referenced an undefined `mesh`
// variable in several places (raycasting, hover attribute writes) -- a
// leftover from before the `sphereShell` rename. Those are `sphereShell`
// here, which is clearly what was intended; coreMesh and wireframeMesh are
// untouched otherwise.

const CORE_COLOR = new THREE.Color(0xff0000);
const HIGHLIGHT_COLOR = new THREE.Color(0xd12626);
const HOVER_RADIUS = 0.4;

export default function SphereShell({ position, quaternion, scale, textures }) {
  const { camera } = useThree();

  const shellRef = useRef(null);
  const coreRef = useRef(null);
  const coreLightRef = useRef(null);

  const pointerRef = useRef(new THREE.Vector2(-100, -100));
  const hoverStrengthRef = useRef(0);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  // Non-indexed so faces separate (matches source exactly), flat-computed
  // normals, plus the per-vertex "hover" attribute the TSL nodes read from.
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(10, 64, 64).toNonIndexed();
    geo.computeVertexNormals();
    const hoverArray = new Float32Array(geo.attributes.position.count);
    geo.setAttribute("hover", new THREE.BufferAttribute(hoverArray, 1));
    return geo;
  }, []);

  const coreGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);

  const { shellMaterial, wireMaterial } = useMemo(() => {
    const hoverAttr = attribute("hover");
    const positionOffset = positionLocal.add(normalLocal.mul(hoverAttr));
    const wireframeMix = hoverAttr.sub(0.25).mul(10.0).clamp(0.0, 1.0);

    const colorMap = textures?.color ?? null;
    const normalTex = textures?.normal ?? null;
    const roughnessMap = textures?.roughness ?? null;
    const metallicMap = textures?.metallic ?? null;

    if (colorMap) colorMap.colorSpace = THREE.SRGBColorSpace;
    if (normalTex) normalTex.colorSpace = THREE.NoColorSpace;
    if (roughnessMap) roughnessMap.colorSpace = THREE.NoColorSpace;
    if (metallicMap) metallicMap.colorSpace = THREE.NoColorSpace;

    const shellMat = new MeshStandardNodeMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.4,
      metalness: 0,
    });
    // positionNode / opacityNode preserved exactly as in the source.
    shellMat.positionNode = positionOffset;
    shellMat.opacityNode = wireframeMix.oneMinus();
    // Baked textures replace the flat black color -- the only material
    // change requested for this mesh.
    if (colorMap) shellMat.colorNode = texture(colorMap);
    if (normalTex) shellMat.normalNode = normalMapNode(texture(normalTex));
    if (roughnessMap) shellMat.roughnessNode = texture(roughnessMap).r;
    if (metallicMap) shellMat.metalnessNode = texture(metallicMap).r;

    const wireMat = new MeshStandardNodeMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      wireframe: true,
      color: 0x000000,
      emissive: CORE_COLOR,
      emissiveIntensity: 5.0,
    });
    wireMat.positionNode = positionOffset;
    wireMat.opacityNode = wireframeMix;

    return { shellMaterial: shellMat, wireMaterial: wireMat };
  }, [textures]);

  const coreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CORE_COLOR.clone(),
        emissive: CORE_COLOR.clone(),
        emissiveIntensity: 50.0,
        roughness: 0.0,
        metalness: 0,
      }),
    [],
  );

  // Converted from the source's window "pointermove" listener.
  useEffect(() => {
    const onPointerMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  // Converted from the source's animate() body.
  useFrame(() => {
    const sphereShell = shellRef.current;
    const coreMesh = coreRef.current;
    const coreLight = coreLightRef.current;
    if (!sphereShell || !coreMesh || !coreLight) return;

    raycaster.setFromCamera(pointerRef.current, camera);
    const intersects = raycaster.intersectObject(sphereShell);
    const isHovered = intersects.length > 0;

    const localPoint = new THREE.Vector3();
    if (isHovered) {
      localPoint.copy(intersects[0].point);
      sphereShell.worldToLocal(localPoint);
    }

    hoverStrengthRef.current +=
      ((isHovered ? 1.0 : 0.0) - hoverStrengthRef.current) * 0.1;

    const timeNow = performance.now() / 1000.0;
    const beatTime = timeNow % 3.0;
    let pulse = 0.0;
    if (beatTime < 0.4) {
      pulse = Math.sin((beatTime / 0.4) * Math.PI);
    }

    const pulseScale = 1 + pulse * 0.3;
    coreMesh.scale.set(pulseScale, pulseScale, pulseScale);

    coreMaterial.color.copy(CORE_COLOR).lerp(HIGHLIGHT_COLOR, pulse * 0.6);
    coreMaterial.emissive.copy(CORE_COLOR).lerp(HIGHLIGHT_COLOR, pulse * 0.6);
    coreLight.intensity = 500 * (1.0 + pulse * 0.5);

    const hoverAttribute = sphereShell.geometry.attributes.hover;
    const positions = sphereShell.geometry.attributes.position.array;
    const radius = HOVER_RADIUS;

    for (let i = 0; i < hoverAttribute.count; i += 3) {
      const subtlePulse = pulse * 0.05;
      const subtleTilt = pulse * 0.02;
      let target0 = subtlePulse + Math.sin(i * 12.34) * subtleTilt;
      let target1 = subtlePulse + Math.sin(i * 12.34 + 2.0) * subtleTilt;
      let target2 = subtlePulse + Math.sin(i * 12.34 + 4.0) * subtleTilt;

      if (isHovered) {
        let target = 0.2 + pulse * 0.15;

        const cx =
          (positions[i * 3] + positions[(i + 1) * 3] + positions[(i + 2) * 3]) /
          3;
        const cy =
          (positions[i * 3 + 1] +
            positions[(i + 1) * 3 + 1] +
            positions[(i + 2) * 3 + 1]) /
          3;
        const cz =
          (positions[i * 3 + 2] +
            positions[(i + 1) * 3 + 2] +
            positions[(i + 2) * 3 + 2]) /
          3;

        const dist = Math.sqrt(
          (cx - localPoint.x) ** 2 +
            (cy - localPoint.y) ** 2 +
            (cz - localPoint.z) ** 2,
        );

        if (dist < radius) {
          const falloff = Math.cos((dist / radius) * (Math.PI / 2));
          target += 0.5 * falloff;
        }

        const tiltStrength = 0.08;
        target0 = target + Math.sin(i * 12.34) * tiltStrength;
        target1 = target + Math.sin(i * 12.34 + 2.0) * tiltStrength;
        target2 = target + Math.sin(i * 12.34 + 4.0) * tiltStrength;
      }

      hoverAttribute.array[i] += (target0 - hoverAttribute.array[i]) * 0.1;
      hoverAttribute.array[i + 1] +=
        (target1 - hoverAttribute.array[i + 1]) * 0.1;
      hoverAttribute.array[i + 2] +=
        (target2 - hoverAttribute.array[i + 2]) * 0.1;
    }
    hoverAttribute.needsUpdate = true;
  });

  return (
    <group position={position} quaternion={quaternion} scale={scale}>
      <mesh ref={shellRef} geometry={geometry} material={shellMaterial} />
      <mesh geometry={geometry} material={wireMaterial} />
      <mesh ref={coreRef} geometry={coreGeometry} material={coreMaterial} />
      <pointLight
        ref={coreLightRef}
        color={CORE_COLOR}
        intensity={1000}
        distance={100}
      />
      <ambientLight color={CORE_COLOR} intensity={0.5} />
    </group>
  );
}
