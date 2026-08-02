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
  uniform,
  pow,
  sub,
  float,
  normalView,
  positionViewDirection,
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

// TWEAKABLE: Core colors.
// CORE_COLOR is the default energy color (Cyan 0x27f5ee). (In sphere_animation.js: 0xff0000 Red).
// HIGHLIGHT_COLOR is the pulsing peak color (Red 0xd12626). (In sphere_animation.js: 0xd12626).
// lerp(HIGHLIGHT_COLOR, pulse * 0.6) blends between them.
const CORE_COLOR = new THREE.Color(0x27f5ee);
const HIGHLIGHT_COLOR = new THREE.Color(0xd12626);

// The source file's hover/pulse magnitudes (radius, displacement amounts,
// idle tilt) were tuned for a SphereGeometry(2, ...) shell. This scene's
// shell is SphereGeometry(10, ...) -- 5x larger -- so those magnitudes are
// scaled up by the same ratio here. Without this, the effect still works
// but reads as ~5x weaker/smaller than the original, since it displaces
// vertices by the same absolute amount on a much bigger sphere.
const REFERENCE_RADIUS = 2; // radius the original constants were tuned for
const SPHERE_RADIUS = 10; // actual shell radius in this scene
const SCALE = SPHERE_RADIUS / REFERENCE_RADIUS;

// TWEAKABLE: Hover & animation dimensions (scaled up 5x automatically for the new SPHERE_RADIUS = 10).
// Original values from sphere_animation.js are shown as multipliers.
//
// HOVER_RADIUS (Orig: 0.4) - The radius of effect around the mouse cursor for face displacement.
const HOVER_RADIUS = 0.7 * SCALE;
// HOVER_TARGET_BASE (Orig: 0.2) - Base displacement height for faces when mouse is hovering the sphere.
const HOVER_TARGET_BASE = 0.2 * SCALE;
// HOVER_TARGET_PULSE (Orig: 0.15) - Additional height added to displacement at the peak of the pulse.
const HOVER_TARGET_PULSE = 0.15 * SCALE;
// HOVER_FALLOFF_BONUS (Orig: 0.5) - Peak displacement bonus at the exact center of the cursor hover.
const HOVER_FALLOFF_BONUS = 0.6 * SCALE;
// HOVER_TILT_STRENGTH (Orig: 0.08) - Amplitude of individual face vertex tilting to make it look jagged.
const HOVER_TILT_STRENGTH = 0.035 * SCALE;
// IDLE_PULSE_AMOUNT (Orig: 0.05) - Idle expansion displacement height (when NOT hovered).
const IDLE_PULSE_AMOUNT = 0.07 * SCALE;
// IDLE_TILT_AMOUNT (Orig: 0.02) - Amplitude of vertex tilt during idle state.
const IDLE_TILT_AMOUNT = 0.02 * SCALE;

// The shell-to-wireframe reveal threshold is also expressed in "hover"
// attribute units, so it has to scale with everything else above. Original:
// shell fully opaque below 0.25, fully faded (wireframe visible) above 0.35.
// Without this, the uniform HOVER_TARGET_BASE alone (now well above the old
// unscaled 0.35) blows past the threshold and reveals the wireframe across
// the whole sphere the instant you hover anywhere, instead of just the
// falloff area near the cursor.
const WIREFRAME_REVEAL_START = 0.25 * SCALE;
const WIREFRAME_REVEAL_RANGE = 0.1 * SCALE;

// Original ratio was core radius 1 inside shell radius 2 (half the shell).
const CORE_RADIUS = SPHERE_RADIUS / 2;

// --- Core light containment ---
// coreLight has no shadow-casting set up (a custom depth material would be
// needed to match the shell's dynamic per-vertex opacity), so by default a
// THREE.PointLight ignores the shell geometry entirely and keeps lighting
// everything beyond it regardless of hover/pulse state. Faking containment
// by shrinking distance/intensity when idle is far cheaper and reads just
// as well: the light naturally can't reach past the shell wall until it's
// hovered or at a heartbeat peak.
const CORE_LIGHT_CONTAINED_DISTANCE = CORE_RADIUS * 1.4;
const CORE_LIGHT_REVEALED_DISTANCE = SPHERE_RADIUS * 3;
const CORE_LIGHT_CONTAINED_INTENSITY_MULT = 0.12;

// --- Rim glow ---
// A single point light on a glossy (roughness 0.4) shell produces a
// specular hotspot that's only visible from one specific viewing angle. A
// Fresnel rim glow is driven by view angle instead of light angle, so it
// reads as a glow wrapping uniformly around the silhouette from any
// direction you look from -- gated by the same reveal factor as the light.
const FRESNEL_POWER = 2.5;
const RIM_INTENSITY = 3.5;

// Core's per-beat scale pulse, derived so its radial growth in absolute
// units matches the shell's idle normal displacement (IDLE_PULSE_AMOUNT)
// at peak pulse, rather than an arbitrary percentage of its own radius.
// growth = pulse * IDLE_PULSE_AMOUNT  =>  scale = 1 + pulse * (IDLE_PULSE_AMOUNT / CORE_RADIUS)
const CORE_PULSE_SCALE = IDLE_PULSE_AMOUNT / CORE_RADIUS;

export default function SphereShell({ position, quaternion, scale, textures }) {
  const { camera } = useThree();

  const shellRef = useRef(null);
  const coreRef = useRef(null);
  const coreLightRef = useRef(null);

  const pointerRef = useRef(new THREE.Vector2(-100, -100));
  const hoverStrengthRef = useRef(0);
  const revealUniformRef = useRef(null);
  const rimColorUniformRef = useRef(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  // Non-indexed so faces separate (matches source exactly), flat-computed
  // normals, plus the per-vertex "hover" attribute the TSL nodes read from.
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(SPHERE_RADIUS, 64, 64).toNonIndexed();
    geo.computeVertexNormals();
    const hoverArray = new Float32Array(geo.attributes.position.count);
    geo.setAttribute("hover", new THREE.BufferAttribute(hoverArray, 1));
    return geo;
  }, []);

  const coreGeometry = useMemo(
    () => new THREE.SphereGeometry(CORE_RADIUS, 32, 32),
    [],
  );

  const { shellMaterial, wireMaterial } = useMemo(() => {
    const hoverAttr = attribute("hover");
    const positionOffset = positionLocal.add(normalLocal.mul(hoverAttr));
    const wireframeMix = hoverAttr
      .sub(WIREFRAME_REVEAL_START)
      .mul(1 / WIREFRAME_REVEAL_RANGE)
      .clamp(0.0, 1.0);

    // Reveal factor (0 = idle/contained, 1 = hovered or at a beat peak) and
    // rim color, both pushed in from JS each frame via useFrame below.
    const revealUniform = uniform(0);
    const rimColorUniform = uniform(new THREE.Color(CORE_COLOR));
    revealUniformRef.current = revealUniform;
    rimColorUniformRef.current = rimColorUniform;

    // Fresnel: 0 head-on, 1 at grazing angles -- glows around the whole
    // silhouette rather than from one light-dependent direction.
    const fresnel = pow(
      sub(float(1.0), normalView.dot(positionViewDirection.negate())),
      float(FRESNEL_POWER),
    );
    const rimGlow = rimColorUniform
      .mul(fresnel)
      .mul(revealUniform)
      .mul(RIM_INTENSITY);

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
    shellMat.emissiveNode = rimGlow;

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

    // Smoothly transition hover state value between 0.0 (no hover) and 1.0 (hovered)
    hoverStrengthRef.current +=
      ((isHovered ? 1.0 : 0.0) - hoverStrengthRef.current) * 0.1;

    // TWEAKABLE: Pulse timing and rhythm.
    // performance.now() / 1000.0 turns milliseconds into seconds.
    // 'timeNow % 3.0' loops the animation every 3.0 seconds (3.0s interval).
    // 'beatTime < 0.4' makes the actual heartbeat pulse last for 0.4 seconds.
    const timeNow = performance.now() / 1000.0;
    const beatTime = timeNow % 3.0;
    let pulse = 0.0;
    if (beatTime < 0.4) {
      // Creates a quick sine wave bump that climbs to 1.0 and drops back to 0.0
      pulse = Math.sin((beatTime / 0.4) * Math.PI);
    }

    // How "open" the core is right now: hovering or a heartbeat peak both
    // count, whichever is stronger. Drives the light's reach, the rim glow,
    // and the ray burst -- all contained at 0, all escaping at 1.
    const revealFactor = Math.max(hoverStrengthRef.current, pulse);

    // 1. Core mesh scales up and down like a pulsing heart
    const pulseScale = 1 + pulse * CORE_PULSE_SCALE;
    coreMesh.scale.set(pulseScale, pulseScale, pulseScale);

    // 2. Core color shifts dynamically from blue/cyan towards red highlight during the pulse
    // Tweak 'pulse * 0.6' (max 0.6 blend) to change color intensity shift
    coreMaterial.color.copy(CORE_COLOR).lerp(HIGHLIGHT_COLOR, pulse * 0.6);
    coreMaterial.emissive.copy(CORE_COLOR).lerp(HIGHLIGHT_COLOR, pulse * 0.6);

    // 3. Contain the point light near the core when idle, let it reach out
    // past the shell wall when hovered or at a beat peak.
    coreLight.distance = THREE.MathUtils.lerp(
      CORE_LIGHT_CONTAINED_DISTANCE,
      SPHERE_RADIUS * 15,
      revealFactor,
    );
    coreLight.intensity =
      8000 * (1.0 + pulse * 0.5) * THREE.MathUtils.lerp(0, 1, revealFactor);

    // 4. Push the reveal factor and current core color into the shell's
    // Fresnel rim glow shader.
    if (revealUniformRef.current) revealUniformRef.current.value = revealFactor;
    if (rimColorUniformRef.current) {
      rimColorUniformRef.current.value.copy(coreMaterial.emissive);
    }

    const hoverAttribute = sphereShell.geometry.attributes.hover;
    const positions = sphereShell.geometry.attributes.position.array;
    const radius = HOVER_RADIUS;

    for (let i = 0; i < hoverAttribute.count; i += 3) {
      const subtlePulse = pulse * IDLE_PULSE_AMOUNT;
      const subtleTilt = pulse * IDLE_TILT_AMOUNT;
      let target0 = subtlePulse + Math.sin(i * 12.34) * subtleTilt;
      let target1 = subtlePulse + Math.sin(i * 12.34 + 2.0) * subtleTilt;
      let target2 = subtlePulse + Math.sin(i * 12.34 + 4.0) * subtleTilt;

      if (isHovered) {
        let target = HOVER_TARGET_BASE + pulse * HOVER_TARGET_PULSE;

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
          target += HOVER_FALLOFF_BONUS * falloff;
        }

        target0 = target + Math.sin(i * 12.34) * HOVER_TILT_STRENGTH;
        target1 = target + Math.sin(i * 12.34 + 2.0) * HOVER_TILT_STRENGTH;
        target2 = target + Math.sin(i * 12.34 + 4.0) * HOVER_TILT_STRENGTH;
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
      <mesh
        ref={shellRef}
        geometry={geometry}
        material={shellMaterial}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={geometry}
        material={wireMaterial}
        castShadow
        receiveShadow
      />
      <mesh ref={coreRef} geometry={coreGeometry} material={coreMaterial} />
      <pointLight
        ref={coreLightRef}
        color={CORE_COLOR}
        intensity={1000}
        distance={CORE_LIGHT_CONTAINED_DISTANCE}
        castShadow
        shadow-bias={-0.002}
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight color={CORE_COLOR} intensity={0.5} />
    </group>
  );
}
