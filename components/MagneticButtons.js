"use client";

import { useEffect } from "react";
import gsap from "gsap";

/**
 * MagneticButtons — global, reusable magnetic-hover interaction.
 *
 * Mount ONCE near the root of the app (see app/layout.js). Any element
 * anywhere in the DOM tagged `data-magnetic` automatically gets a subtle
 * "pull toward the cursor" effect once the pointer comes within proximity
 * range, and elastically snaps back to its exact original position once
 * the pointer leaves that range. New elements added to the DOM later
 * (route changes, conditionally-rendered buttons, etc.) are picked up
 * automatically via a MutationObserver — no re-registration needed.
 *
 * Zero changes to a button's own markup or CSS are required beyond adding
 * the `data-magnetic` attribute. This only ever layers a
 * `transform: translate3d(...)` on top of whatever the element already
 * renders (via GSAP, which promotes x/y tweens to 3D transforms), so
 * typography, colors, padding, borders, shadows, and layout are completely
 * untouched — the element's own bounding box in the layout never changes,
 * only its rendered (post-transform) position.
 *
 * Optional per-element tuning via data attributes:
 *   data-magnetic-strength="0.4"  // pull sensitivity, default 0.35
 *   data-magnetic-max="20"        // max px displacement, default 20 (spec range 15-25)
 *   data-magnetic-radius="80"     // proximity range in px beyond the element's own
 *                                 // bounding box where the pull begins, default 80
 *
 * Optional multi-layer parallax polish: give exactly one descendant of a
 * `data-magnetic` element the attribute `data-magnetic-inner` and it will
 * be pulled 1.2x harder than the outer element, producing a subtle
 * layered/3D-depth feel (e.g. wrap just a button's icon or label in it).
 * This is purely opt-in — omit it and the whole button moves as one rigid
 * unit, which is the default/expected behavior for a plain button.
 *
 * Disabled entirely on touch or coarse-pointer devices/viewports via
 * `(hover: hover) and (pointer: fine)`, and re-evaluated live if that
 * media query's result changes (e.g. a device toggling between mouse and
 * touch input, or a responsive-mode resize in devtools).
 */

const DEFAULT_STRENGTH = 0.35;
const DEFAULT_MAX_OFFSET = 20; // px -- spec range is 15-25px
const DEFAULT_PROXIMITY = 80; // px beyond the element's own bounding box
const INNER_MULTIPLIER = 1.2;
const MOVE_DURATION = 0.5;
const MOVE_EASE = "power2.out";
const RETURN_DURATION = 0.8;
const RETURN_EASE = "elastic.out(1, 0.3)";

export default function MagneticButtons() {
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");

    let registry = new Map(); // el -> entry
    let observer = null;
    let rafId = null;
    let lastX = 0;
    let lastY = 0;
    let hasEvent = false;

    function makeQuickTo(target, prop) {
      // quickTo keeps repeated calls on one interpolating tween instead of
      // spawning a new tween per mousemove tick -- the standard GSAP
      // pattern for continuous, 60fps-safe pointer-following animation.
      return gsap.quickTo(target, prop, {
        duration: MOVE_DURATION,
        ease: MOVE_EASE,
        force3D: true,
      });
    }

    function bind(el) {
      if (registry.has(el)) return;
      const inner = el.querySelector("[data-magnetic-inner]");
      el.style.willChange = "transform";
      if (inner) inner.style.willChange = "transform";

      registry.set(el, {
        el,
        inner,
        quickX: makeQuickTo(el, "x"),
        quickY: makeQuickTo(el, "y"),
        innerQuickX: inner ? makeQuickTo(inner, "x") : null,
        innerQuickY: inner ? makeQuickTo(inner, "y") : null,
        active: false,
        strength: parseFloat(el.dataset.magneticStrength) || DEFAULT_STRENGTH,
        maxOffset: parseFloat(el.dataset.magneticMax) || DEFAULT_MAX_OFFSET,
        radius: parseFloat(el.dataset.magneticRadius) || DEFAULT_PROXIMITY,
      });
    }

    function unbind(el) {
      const entry = registry.get(el);
      if (!entry) return;
      gsap.killTweensOf(el);
      if (entry.inner) gsap.killTweensOf(entry.inner);
      el.style.willChange = "";
      if (entry.inner) entry.inner.style.willChange = "";
      registry.delete(el);
    }

    function scan() {
      const found = document.querySelectorAll("[data-magnetic]");
      const foundSet = new Set(found);
      registry.forEach((_, el) => {
        if (!el.isConnected || !foundSet.has(el)) unbind(el);
      });
      found.forEach((el) => bind(el));
    }

    function resetEntry(entry) {
      entry.active = false;
      gsap.to(entry.el, {
        x: 0,
        y: 0,
        duration: RETURN_DURATION,
        ease: RETURN_EASE,
      });
      if (entry.inner) {
        gsap.to(entry.inner, {
          x: 0,
          y: 0,
          duration: RETURN_DURATION,
          ease: RETURN_EASE,
        });
      }
    }

    function updateEntry(entry, clientX, clientY) {
      const rect = entry.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;

      // Distance from the cursor to the *nearest edge* of the button (0 if
      // the cursor is already inside it) -- this is what "close proximity"
      // is measured against, not just distance to the center.
      const clampedX = Math.max(-rect.width / 2, Math.min(rect.width / 2, dx));
      const clampedY = Math.max(-rect.height / 2, Math.min(rect.height / 2, dy));
      const edgeDist = Math.hypot(dx - clampedX, dy - clampedY);

      if (edgeDist > entry.radius) {
        if (entry.active) resetEntry(entry);
        return;
      }

      entry.active = true;
      // Falloff so the pull ramps in smoothly across the proximity ring
      // instead of snapping on the instant the cursor crosses it.
      const falloff = 1 - edgeDist / (entry.radius || 1);
      const offsetX = gsap.utils.clamp(
        -entry.maxOffset,
        entry.maxOffset,
        dx * entry.strength * falloff
      );
      const offsetY = gsap.utils.clamp(
        -entry.maxOffset,
        entry.maxOffset,
        dy * entry.strength * falloff
      );

      entry.quickX(offsetX);
      entry.quickY(offsetY);

      if (entry.innerQuickX && entry.innerQuickY) {
        const innerMax = entry.maxOffset * INNER_MULTIPLIER;
        entry.innerQuickX(
          gsap.utils.clamp(-innerMax, innerMax, offsetX * INNER_MULTIPLIER)
        );
        entry.innerQuickY(
          gsap.utils.clamp(-innerMax, innerMax, offsetY * INNER_MULTIPLIER)
        );
      }
    }

    function processFrame() {
      rafId = null;
      if (!hasEvent) return;
      registry.forEach((entry) => updateEntry(entry, lastX, lastY));
    }

    function handleMouseMove(e) {
      lastX = e.clientX;
      lastY = e.clientY;
      hasEvent = true;
      // Batch every mousemove tick into a single rAF-scheduled pass across
      // all registered buttons, rather than doing per-element work
      // synchronously inside the event handler -- keeps this cheap even
      // with many magnetic elements on a page and avoids layout thrashing.
      if (rafId === null) rafId = requestAnimationFrame(processFrame);
    }

    function handlePointerLeaveWindow() {
      hasEvent = false;
      registry.forEach((entry) => {
        if (entry.active) resetEntry(entry);
      });
    }

    function start() {
      scan();
      observer = new MutationObserver(scan);
      observer.observe(document.body, { childList: true, subtree: true });
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mouseleave", handlePointerLeaveWindow);
    }

    function stop() {
      if (observer) observer.disconnect();
      observer = null;
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handlePointerLeaveWindow);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      registry.forEach((_, el) => unbind(el));
      registry = new Map();
    }

    if (mq.matches) start();

    function handleMQChange(e) {
      if (e.matches) start();
      else stop();
    }
    // Modern addEventListener form; matchMedia's change event is broadly
    // supported without needing the deprecated addListener fallback given
    // this project's baseline (evergreen browsers only, per Next.js 16).
    mq.addEventListener("change", handleMQChange);

    return () => {
      mq.removeEventListener("change", handleMQChange);
      stop();
    };
  }, []);

  return null;
}
