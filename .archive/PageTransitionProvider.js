"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const PageReadyContext = createContext({ ready: false, setReady: () => {}, revealed: false });

/**
 * Lets a page gate the initial reveal transition on its own readiness
 * (e.g. the home hero waits for the WebGPU renderer + glTF + textures to
 * finish loading before calling setReady(true)). Every other route has
 * nothing heavy to preload, so this provider resolves it to "ready"
 * automatically as soon as the pathname isn't "/".
 *
 * `revealed` is a separate, later signal than `ready`: `ready` means the
 * cover overlay has *started* wiping away, `revealed` means it has
 * *finished* and the page is actually visible. Anything that reacts to
 * user input as soon as the page looks interactive (e.g. the hero's
 * scroll-jack) should gate on `revealed`, not `ready` -- input arriving
 * while the overlay is still opaque would otherwise be consumed with
 * nothing visible on screen to show for it.
 */
export function usePageReady() {
  return useContext(PageReadyContext);
}

export default function PageTransitionProvider({ children }) {
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasRevealedRef = useRef(false);

  // Routes other than the home hero don't gate on any preloading.
  useEffect(() => {
    if (pathname !== "/") setReady(true);
  }, [pathname]);

  // Phase 0 hand-off: once ready, wipe the cover overlay away to reveal
  // whatever is parked underneath (for "/", that's the hero already parked
  // at Camera_Export frame 0).
  useEffect(() => {
    if (!ready || hasRevealedRef.current) return;
    hasRevealedRef.current = true;

    const overlay = overlayRef.current;
    if (!overlay) return;

    gsap.to(overlay, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 1.1,
      ease: "power4.inOut",
      delay: 0.15,
      onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0 });
        // Not visible until this point -- anything that reacts to scroll
        // (the hero's Phase A wheel/touch-jack in particular) should wait
        // for this rather than for `ready`, or scroll input arriving while
        // the overlay is still opaque gets silently consumed with nothing
        // on screen to show for it. See `revealed` below.
        setRevealed(true);
      },
    });
  }, [ready]);

  // Lightweight cross-fade on subsequent route changes, after the first
  // reveal has already happened once.
  useEffect(() => {
    if (!hasRevealedRef.current) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.fromTo(
      overlay,
      { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" },
      { autoAlpha: 0, duration: 0.5, ease: "power2.out" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <PageReadyContext.Provider value={{ ready, setReady, revealed }}>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[999] bg-black pointer-events-none"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
        aria-hidden="true"
      />
      <div className="page-transition-wrapper">{children}</div>
    </PageReadyContext.Provider>
  );
}
