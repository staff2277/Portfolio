"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "../SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

// TEMP DEBUG -- remove once the hero sequence is confirmed working.
const DEBUG = true;
let lastLogTime = 0;
function debugLog(...args) {
  if (!DEBUG) return;
  const now = performance.now();
  if (now - lastLogTime < 150) return; // throttle so scroll doesn't spam the console
  lastLogTime = now;
  console.log("[cameraSequence]", ...args);
}

const NUDGE_SCALE = 0.0016; // wheel/touch deltaY -> progress
const NUDGE_CLAMP = 0.12; // max progress change from a single scroll event
const MAX_DELTA = 0.1; // clamp rAF delta so tab-switches don't cause a jump

/**
 * Drives Camera_Export across the whole hero sequence. Two genuinely
 * different systems, kept separate on purpose -- both driven entirely by
 * user input, no autoplay:
 *
 *  - Phase A (frames 0 -> holdFrame): a custom wheel/touch-driven scroll-jack.
 *    Lenis + native scroll are intercepted; `progress` only ever changes in
 *    response to an actual wheel or touch event.
 *
 *  - Phase B (frames holdFrame -> endFrame): a standard GSAP ScrollTrigger
 *    scrub against a spacer element, with the hero section pinned across it.
 *    Because the trigger's start point is the current scroll position (top
 *    of the pinned hero, "top top"), the "hold" at holdFrame isn't a
 *    separate state machine -- it's simply Phase B at progress 0, which is
 *    exactly where the user lands the instant Phase A hands off.
 *
 * `disabled`: when true, this hook does nothing at all -- no Lenis
 * stop/start, no wheel/touch interception, no ScrollTrigger, no per-frame
 * camera writes. HeroScene.js currently drives this from `!revealed`, so
 * Phase A only goes live once the intro cover overlay has fully wiped away
 * (see PageTransitionProvider.js) -- wheel/touch input arriving while the
 * overlay is still opaque would otherwise be consumed with nothing visible
 * on screen to show for it. Previously this was also used for a temporary
 * OrbitControls debug view; that's gone, but the same disable-everything
 * behavior is what makes it safe to reuse for the reveal gate (nothing
 * fights over the camera transform either way).
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
  const phaseBTriggerRef = useRef(null);
  const handoffTimerRef = useRef(null); // swallows leftover wheel/touch momentum before Lenis takes over

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
    debugLog("Phase A init", { mixer: !!mixerRef.current, camera: !!cameraObjectRef.current });

    const nudge = (deltaY) => {
      if (phaseRef.current !== "phaseA") return;

      const delta = THREE.MathUtils.clamp(deltaY * NUDGE_SCALE, -NUDGE_CLAMP, NUDGE_CLAMP);
      progressRef.current = THREE.MathUtils.clamp(progressRef.current + delta, 0, 1);
      debugLog("nudge", { deltaY, delta, progress: progressRef.current.toFixed(3) });

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
    }

    function endPhaseA() {
      if (phaseRef.current !== "phaseA") return; // already handed off
      phaseRef.current = "phaseB";
      debugLog("endPhaseA -- handing off to ScrollTrigger in 350ms");

      // Don't rip out the wheel/touch listeners or resume Lenis yet.
      // Trackpads keep emitting synthetic "wheel" events for their inertial
      // coast well after the fingers lift -- with nudge() now a no-op
      // (phaseRef is already "phaseB"), those events still hit onWheel and
      // get preventDefault'd, so they're swallowed instead of flowing
      // straight into the freshly-started Lenis + ScrollTrigger as one big
      // uncontrolled scroll. That leftover-momentum burst, arriving right as
      // Phase B's parallax factor is still ~1, is what produced the
      // disorienting "spin" right at the handoff.
      clearTimeout(handoffTimerRef.current);
      handoffTimerRef.current = setTimeout(() => {
        removePhaseAListeners();
        lenis.start();
      }, 350);

      setupPhaseB();
    }

    function setupPhaseB() {
      if (!heroSectionRef?.current) {
        debugLog("setupPhaseB aborted -- heroSectionRef.current is null");
        return;
      }
      debugLog("setupPhaseB creating ScrollTrigger", {
        heroTop: heroSectionRef.current.getBoundingClientRect().top,
        scrollY: window.scrollY,
      });

      // pinSpacing left at its default (true) so GSAP reserves the hero's
      // own height *plus* the scroll distance below automatically. With it
      // set to false, pinning removed the hero from flow with nothing
      // compensating for its own height, which threw off start/end on
      // invalidateOnRefresh and made progress (and therefore the baked
      // camera scrub) jump around instead of sweeping smoothly.
      phaseBTriggerRef.current = ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: "+=250vh",
        scrub: 0.3,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const frame = THREE.MathUtils.lerp(holdFrame, endFrame, self.progress);
          applyFrame(frame);
          debugLog("phaseB onUpdate", {
            progress: self.progress.toFixed(3),
            frame: frame.toFixed(1),
          });
        },
      });
    }

    return () => {
      clearTimeout(handoffTimerRef.current);
      removePhaseAListeners();
      phaseBTriggerRef.current?.kill();
      lenis.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis, disabled]);

  // ---- Per-frame driver ----
  // Phase B needs no per-frame work of its own -- ScrollTrigger's onUpdate
  // above already calls mixer.setTime() directly on scroll. This loop only
  // has to keep pushing frames during Phase A, where progress advances
  // purely from wheel/touch input rather than a scroll position.
  useFrame(() => {
    if (disabled) return;
    if (!cameraObjectRef.current) return;
    if (phaseRef.current === "phaseA") {
      applyFrame(progressRef.current * holdFrame);
    }
  });
}
