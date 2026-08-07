"use client";

import { useRef, useState, useCallback } from "react";
import HeroCanvas from "../components/3d/HeroCanvas";
import HeroLoader from "../components/HeroLoader";

export default function Home() {
  // Lifted here (rather than inside HeroCanvas) because heroSectionRef is
  // the pin target the GSAP ScrollTrigger in useCameraScroll.js measures
  // and pins for the whole camera sequence.
  const heroSectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleProgress = useCallback((val) => {
    setProgress((prev) => Math.max(prev, val));
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <HeroLoader progress={progress} isLoaded={isLoaded} />
      <HeroCanvas
        heroSectionRef={heroSectionRef}
        onProgress={handleProgress}
        onLoaded={handleLoaded}
      />

      {/* relative z-10 here (rather than a negative z-index on the canvas)
          is what guarantees this content paints above the fixed 3D layer --
          see the comment in HeroCanvas.js for why. */}
      <div className="relative z-10 pointer-events-none">
        <section
          ref={heroSectionRef}
          className="relative h-screen w-full flex flex-col items-start justify-end px-8 pb-24 md:px-16 pointer-events-none"
        >
          <h1 className="text-4xl md:text-6xl font-bold max-w-2xl leading-tight">
            Creative Developer — Frontend, Real-Time 3D &amp; UI/UX
          </h1>
          <p className="mt-6 max-w-lg text-gray-400 leading-relaxed">
            Building expressive, high-craft interfaces where design and engineering meet.
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href="/work"
              className="pointer-events-auto glass px-6 py-3 text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              View Work
            </a>
            <a
              href="/contact"
              className="pointer-events-auto px-6 py-3 text-sm uppercase tracking-widest border border-white/20 hover:border-white/40 transition-colors"
            >
              Contact
            </a>
          </div>
        </section>

        {/* Scroll distance for the camera sequence (frames 0 -> 110) is
            reserved automatically by ScrollTrigger's own pinSpacing (see
            useCameraScroll.js, SCROLL_DISTANCE). No manual spacer div
            needed -- one would double the gap. */}

        <section className="min-h-screen flex flex-col items-center justify-center px-8 bg-black pointer-events-auto">
          <h2 className="text-3xl font-bold mb-4">Recent Works</h2>
          <p className="text-gray-400 max-w-xl text-center leading-relaxed">
            Selected projects, coming soon.
          </p>
        </section>
      </div>
    </>
  );
}
