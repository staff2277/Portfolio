"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

// How far the user has to scroll to traverse the full clip. Tunable --
// there's no authorial marker for this anymore (the old Hero
// Section/Transition markers were removed in Blender), so this is just a
// reasonable default for a single continuous dolly-and-rise move. Increase
// for a slower/more deliberate scrub, decrease for snappier.
const SCROLL_DISTANCE = "+=600vh";

/**
 * Single-phase scroll-driven camera sequence: a plain GSAP ScrollTrigger
 * scrub maps scroll progress (0..1) linearly onto the baked clip's frame
 * range (startFrame..endFrame), pinning heroSectionRef across that whole
 * distance. That's it -- no wheel-jack phase, no phase handoff, no
 * autoplay, no parallax. Deliberately simple after several rounds of
 * debugging a more complex two-phase version (see handoff.md) -- this
 * removes an entire class of handoff/momentum bugs by not having a
 * handoff at all.
 *
 * pinSpacing is left at its default (true) on purpose: GSAP needs to
 * reserve both the hero's own height *and* the scroll distance below it
 * automatically. Setting it false without fully compensating for the
 * hero's own height was the root cause of an erratic, non-monotonic
 * progress in the previous implementation.
 */
export function useCameraSequence({
  mixerRef,
  cameraObjectRef,
  fps,
  startFrame,
  endFrame,
  heroSectionRef,
  disabled = false,
}) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (disabled || !heroSectionRef?.current) return;

    const applyFrame = (frame) => {
      const mixer = mixerRef.current;
      if (!mixer) return;
      mixer.setTime(frame / fps);
    };

    applyFrame(startFrame);

    triggerRef.current = ScrollTrigger.create({
      trigger: heroSectionRef.current,
      start: "top top",
      end: SCROLL_DISTANCE,
      scrub: 0.3,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const frame = gsap.utils.mapRange(0, 1, startFrame, endFrame, self.progress);
        applyFrame(frame);
        debugLog("onUpdate", {
          progress: self.progress.toFixed(3),
          frame: frame.toFixed(1),
          mixer: !!mixerRef.current,
          camera: !!cameraObjectRef.current,
        });
      },
    });

    debugLog("ScrollTrigger created", {
      heroTop: heroSectionRef.current.getBoundingClientRect().top,
      scrollY: window.scrollY,
    });

    return () => {
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
}
