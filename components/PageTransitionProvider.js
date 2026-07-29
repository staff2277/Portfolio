"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const PageReadyContext = createContext({ ready: false, setReady: () => {} });

/**
 * Lets a page gate the initial reveal transition on its own readiness
 * (e.g. the home hero waits for the WebGPU renderer + glTF + textures to
 * finish loading before calling setReady(true)). Every other route has
 * nothing heavy to preload, so this provider resolves it to "ready"
 * automatically as soon as the pathname isn't "/".
 */
export function usePageReady() {
  return useContext(PageReadyContext);
}

export default function PageTransitionProvider({ children }) {
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const [ready, setReady] = useState(false);
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
      onComplete: () => gsap.set(overlay, { autoAlpha: 0 }),
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
    <PageReadyContext.Provider value={{ ready, setReady }}>
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
