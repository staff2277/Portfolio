"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

/**
 * Access the app-wide Lenis instance. Returns null until it's mounted
 * (client-side only). CameraSequence uses lenis.stop()/lenis.start() to
 * scroll-jack Phase A of the hero and hand control back for Phase B.
 */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Wraps the app in a single Lenis smooth-scroll instance and wires it into
 * GSAP's ticker + ScrollTrigger, so every GSAP ScrollTrigger in the app
 * (including the hero's Phase B scrub) stays in sync with Lenis' scroll
 * position instead of the raw native scroll event.
 */
export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    });

    instance.on("scroll", ScrollTrigger.update);

    const tickerFn = (time) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(tickerFn);
      instance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
