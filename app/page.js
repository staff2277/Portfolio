"use client";

import { useRef } from "react";
import HeroCanvas from "../components/3d/HeroCanvas";

export default function Home() {
  // Lifted here (rather than inside HeroCanvas) because these are plain DOM
  // elements the GSAP ScrollTrigger in useCameraSequence needs to pin/measure
  // for Phase B -- heroSectionRef is the pinned target, spacerRef's height
  // defines the frames-42->110 scroll distance.
  const heroSectionRef = useRef(null);
  const spacerRef = useRef(null);

  return (
    <>
      <HeroCanvas heroSectionRef={heroSectionRef} spacerRef={spacerRef} />

      {/* relative z-10 here (rather than a negative z-index on the canvas)
          is what guarantees this content paints above the fixed 3D layer --
          see the comment in HeroCanvas.js for why. */}
      <div className="relative z-10">
        <section
          ref={heroSectionRef}
          className="relative h-screen w-full flex flex-col items-start justify-end px-8 pb-24 md:px-16"
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
              className="glass px-6 py-3 text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              View Work
            </a>
            <a
              href="/contact"
              className="px-6 py-3 text-sm uppercase tracking-widest border border-white/20 hover:border-white/40 transition-colors"
            >
              Contact
            </a>
          </div>
        </section>

        {/* Defines the Phase B (frames 42 -> 110) scroll distance; the hero
            section above is pinned across it by ScrollTrigger. */}
        <div ref={spacerRef} style={{ height: "250vh" }} aria-hidden="true" />

        <section className="min-h-screen flex flex-col items-center justify-center px-8 bg-black">
          <h2 className="text-3xl font-bold mb-4">Recent Works</h2>
          <p className="text-gray-400 max-w-xl text-center leading-relaxed">
            Selected projects, coming soon.
          </p>
        </section>
      </div>
    </>
  );
}
