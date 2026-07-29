"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "../SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

const PHASE_A_DURATION_SECONDS = 20; // one full uninterrupted 0->1 autoplay pass
const NUDGE_SCALE = 0.00045; // wheel/touch deltaY -> progress
const NUDGE_CLAMP = 0.035; // max progress change from a single scroll event
const IDLE_RESUME_MS = 2000; // time after last input before autoplay resumes
const PARALLAX_MAX_RAD = 0.09; // ~5 degrees of yaw/pitch at full mouse travel
const PARALLAX_DAMP = 6; // damping lambda for THREE.MathUtils.damp
const PARALLAX_FADE_RANGE = 0.15; // fraction of Phase B progress over which parallax fades out
const MAX_DELTA = 0.1; // clamp rAF delta so tab-switches don't cause a jump

/**
 * Drives Camera_Export across the whole hero sequence. Two genuinely
 * different systems, kept separate on purpose:
 *
 *  - Phase A (frames 0 -> holdFrame): a custom requestAnimationFrame-driven
 *    scroll-jack. Lenis + native scroll are intercepted; a constant-rate
 *    autoplay advances `progress`, nudged (not driven) by wheel/touch input.
 *
 *  - Phase B (frames holdFrame -> endFrame): a standard GSAP ScrollTrigger
 *    scrub against a spacer element, with the hero section pinned across it.
 *    Because the trigger's start point is the current scroll position (top
 *    of the pinned hero, "top top"), the "hold" at holdFrame isn't a
 *    separate state machine -- it's simply Phase B at progress 0, which is
 *    exactly where the user lands the instant Phase A hands off.
 *
 * `disabled` (used for the temporary OrbitControls debug view in
 * HeroScene.js): when true, this hook does nothing at all -- no Lenis
 * stop/start, no wheel/touch interception, no ScrollTrigger, no per-frame
 * camera writes -- so it doesn't fight OrbitControls for the camera
 * transform.
 */
export function useCameraSequence({
  mixerRef,
  cameraObjectRef,
  fps,
  holdFrame,
  endFrame,
  heroSectionRef,
  spacerRef,
  disabled = false,
}) {
  const lenis = useLenis();

  const phaseRef = useRef("phaseA");
  const progressRef = useRef(0); // 0..1 across frames 0..holdFrame
  const autoplayDirRef = useRef(1);
  const activelyScrollingRef = useRef(false);
  const idleTimerRef = useRef(null);
  const phaseBTriggerRef = useRef(null);

  const parallaxTargetRef = useRef({ yaw: 0, pitch: 0 });
  const parallaxCurrentRef = useRef({ yaw: 0, pitch: 0 });
  const parallaxFactorRef = useRef(1);
  const bakedQuatRef = useRef(new THREE.Quaternion()); // base quat from mixer, no parallax

  const applyFrame = (frame) => {
    const mixer = mixerRef.current;
    if (!mixer) return;
    mixer.setTime(frame / fps);
  };

  // ---- Phase A setup: scroll-jack + wheel/touch interception ----
  useEffect(() => {
    if (disabled || !lenis) return;

    phaseRef.current = "phaseA";
    lenis.stop();
    applyFrame(0);

    const clearIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };

    const scheduleResume = () => {
      clearIdleTimer();
      idleTimerRef.current = setTimeout(() => {
        activelyScrollingRef.current = false;
      }, IDLE_RESUME_MS);
    };

    const nudge = (deltaY) => {
      if (phaseRef.current !== "phaseA") return;

      const delta = THREE.MathUtils.clamp(deltaY * NUDGE_SCALE, -NUDGE_CLAMP, NUDGE_CLAMP);
      if (delta !== 0) {
        autoplayDirRef.current = Math.sign(delta);
      }
      progressRef.current = THREE.MathUtils.clamp(progressRef.current + delta, 0, 1);

      activelyScrollingRef.current = true;
      scheduleResume();

      if (progressRef.current >= 1) {
        endPhaseA();
      }
    };

    let lastTouchY = null;
    const onWheel = (e) => {
      e.preventDefault();
      nudge(e.deltaY);
    };
    const onTouchStart = (e) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e) => {
      if (lastTouchY == null) return;
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      nudge((lastTouchY - currentY) * 2.2); // touch drags feel slower than wheel ticks
      lastTouchY = currentY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    function removePhaseAListeners() {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      clearIdleTimer();
    }

    function endPhaseA() {
      removePhaseAListeners();
      phaseRef.current = "phaseB";
      lenis.start();
      setupPhaseB();
    }

    function setupPhaseB() {
      if (!heroSectionRef?.current || !spacerRef?.current) return;

      phaseBTriggerRef.current = ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: () => `+=${spacerRef.current.offsetHeight}`,
        scrub: 0.3,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const frame = THREE.MathUtils.lerp(holdFrame, endFrame, self.progress);
          applyFrame(frame);
          // Snapshot the baked quaternion so Phase B's per-frame parallax
          // can compose on top of it without drifting.
          if (cameraObjectRef.current) {
            bakedQuatRef.current.copy(cameraObjectRef.current.quaternion);
          }
          parallaxFactorRef.current = THREE.MathUtils.clamp(
            1 - self.progress / PARALLAX_FADE_RANGE,
            0,
            1
          );
        },
      });
    }

    return () => {
      removePhaseAListeners();
      phaseBTriggerRef.current?.kill();
      lenis.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis, disabled]);

  // ---- Mouse-parallax target tracking (live during the hold / faded into Phase B) ----
  useEffect(() => {
    if (disabled) return;
    const onPointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      parallaxTargetRef.current.yaw = -nx * PARALLAX_MAX_RAD;
      parallaxTargetRef.current.pitch = -ny * PARALLAX_MAX_RAD * 0.6;
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [disabled]);

  // ---- Per-frame driver ----
  useFrame((_, rawDelta) => {
    if (disabled) return;
    const cameraObject = cameraObjectRef.current;
    if (!cameraObject) return;
    const delta = Math.min(rawDelta, MAX_DELTA);

    if (phaseRef.current === "phaseA") {
      if (!activelyScrollingRef.current) {
        progressRef.current = THREE.MathUtils.clamp(
          progressRef.current + (autoplayDirRef.current * delta) / PHASE_A_DURATION_SECONDS,
          0,
          1
        );
      }
      applyFrame(progressRef.current * holdFrame);
      return;
    }

    // Phase B: mixer.setTime() for the baked pose already happened in the
    // ScrollTrigger onUpdate above (that's the "genuinely different system"
    // driving frames here). This just layers a damped mouse-parallax offset
    // on top of whatever baked pose is currently applied.
    const target = parallaxTargetRef.current;
    const current = parallaxCurrentRef.current;
    const factor = parallaxFactorRef.current;

    current.yaw = THREE.MathUtils.damp(current.yaw, target.yaw * factor, PARALLAX_DAMP, delta);
    current.pitch = THREE.MathUtils.damp(current.pitch, target.pitch * factor, PARALLAX_DAMP, delta);

    if (Math.abs(current.yaw) > 1e-4 || Math.abs(current.pitch) > 1e-4) {
      // Compose parallax euler on top of the baked base quaternion so
      // there is no per-frame drift (avoids the old rotateX/Y accumulation).
      const parallaxEuler = new THREE.Euler(current.pitch, current.yaw, 0, "YXZ");
      const parallaxQuat = new THREE.Quaternion().setFromEuler(parallaxEuler);
      cameraObject.quaternion.copy(bakedQuatRef.current).multiply(parallaxQuat);
    }
  });
}
