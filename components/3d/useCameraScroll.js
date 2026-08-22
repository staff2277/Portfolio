"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// TEMP DEBUG -- remove once the hero sequence is confirmed working.
const DEBUG = true;
let lastLogTime = 0;
function debugLog(...args) {
  if (!DEBUG) return;
  const now = performance.now();
  if (now - lastLogTime < 150) return; // throttle so scroll doesn't spam the console
  lastLogTime = now;
  console.log("[cameraScroll]", ...args);
}

// How far the user has to scroll to traverse the remaining clip (frame 45 -> 110).
const SCROLL_DISTANCE = "+=4900vh";

/**
 * Camera sequence hook with two phases:
 * Phase 1: Autoplay from frame 0 up to frame 45 over 5.0 seconds automatically
 *          once the loader completes.
 * Phase 2: From frame 45 up to frame 110, driven by user scroll via ScrollTrigger.
 */
export function useCameraSequence({
  mixerRef,
  cameraObjectRef,
  baseQuaternionRef,
  fps = 24,
  startFrame = 0,
  autoplayEndFrame = 50,
  endFrame = 110,
  heroSectionRef,
  isLoaderFinished = false,
  disabled = false,
}) {
  const triggerRef = useRef(null);
  const [autoplayDone, setAutoplayDone] = useState(false);

  const applyFrame = useCallback(
    (frame) => {
      const mixer = mixerRef.current;
      if (!mixer) return;
      mixer.setTime(frame / fps);

      if (cameraObjectRef?.current && baseQuaternionRef?.current) {
        baseQuaternionRef.current.copy(cameraObjectRef.current.quaternion);
      }
    },
    [mixerRef, fps, cameraObjectRef, baseQuaternionRef],
  );

  // Set camera to initial frame (0) on mount
  useEffect(() => {
    applyFrame(startFrame);
  }, [applyFrame, startFrame]);

  // Phase 1: Autoplay frame 0 -> 45 over 5 seconds after loader completes
  useEffect(() => {
    if (disabled || !isLoaderFinished || autoplayDone) return;

    debugLog("Starting 5s camera autoplay (0 -> 45)");

    // Lock body scroll during 5-second autoplay to ensure uninterrupted camera movement
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    const playhead = { frame: startFrame };
    const tween = gsap.to(playhead, {
      frame: autoplayEndFrame,
      duration: 5,
      ease: "power3.out",
      onUpdate: () => {
        applyFrame(playhead.frame);
        debugLog("autoplay frame", playhead.frame.toFixed(1));
      },
      onComplete: () => {
        debugLog("5s camera autoplay completed");
        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
        }
        setAutoplayDone(true);
      },
    });

    return () => {
      tween.kill();
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [
    disabled,
    isLoaderFinished,
    autoplayDone,
    startFrame,
    autoplayEndFrame,
    applyFrame,
  ]);

  // Phase 2: Scroll-driven animation frame 45 -> 110 once autoplay is done
  useEffect(() => {
    if (disabled || !autoplayDone || !heroSectionRef?.current) return;

    applyFrame(autoplayEndFrame);

    const playhead = { frame: autoplayEndFrame };
    const tween = gsap.to(playhead, {
      frame: endFrame,
      ease: "none",
      onUpdate: () => {
        applyFrame(playhead.frame);
        debugLog("scroll frame", playhead.frame.toFixed(1));
      },
    });

    triggerRef.current = ScrollTrigger.create({
      trigger: heroSectionRef.current,
      start: "top top",
      end: SCROLL_DISTANCE,
      animation: tween,
      scrub: 0.3,
      pin: true,
      refreshPriority: 1, // resolve before downstream triggers (e.g. Work section)
      invalidateOnRefresh: true,
    });

    ScrollTrigger.refresh();

    debugLog("ScrollTrigger created for frame 45 -> 110");

    return () => {
      triggerRef.current?.kill();
      triggerRef.current = null;
      tween.kill();
    };
  }, [
    disabled,
    autoplayDone,
    heroSectionRef,
    autoplayEndFrame,
    endFrame,
    applyFrame,
  ]);

  return { autoplayDone };
}
