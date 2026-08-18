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
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);

  const handleProgress = useCallback((val) => {
    setProgress((prev) => Math.max(prev, val));
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setIsLoaderFinished(true);
  }, []);

  const handleTransitionStart = useCallback(() => {
    setIsLoaderFinished(true);
  }, []);

  return (
    <>
      <HeroLoader
        progress={progress}
        isLoaded={isLoaded}
        onTransitionStart={handleTransitionStart}
      />
      <HeroCanvas
        heroSectionRef={heroSectionRef}
        onProgress={handleProgress}
        onLoaded={handleLoaded}
        isLoaderFinished={isLoaderFinished}
      />

      {/* relative z-10 here (rather than a negative z-index on the canvas)
          is what guarantees this content paints above the fixed 3D layer --
          see the comment in HeroCanvas.js for why. */}
      <div className="relative z-10 pointer-events-none">
        <section
          id="home"
          ref={heroSectionRef}
          className="relative h-screen w-full p-8 md:p-12 pointer-events-none flex flex-col justify-between"
        >
          {/* Top Left Corner */}
          <div id="hero-scene" className="flex flex-col items-start space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-white/50">
              Portfolio / 2026
            </span>
            <h1 className="text-lg md:text-xl font-heading tracking-tight text-white/90">
              Creative Developer
            </h1>
          </div>

          {/* Top Right Corner */}
          <div className="absolute top-8 right-8 md:top-12 md:right-12 text-right">
            <span className="text-xs uppercase tracking-[0.25em] text-white/50 block">
              Specialization
            </span>
            <span className="text-xs md:text-sm text-white/80 font-light">
              Frontend, UI &amp; 3D design
            </span>
          </div>

          {/* Bottom Left & Bottom Right flex layout container */}
          <div className="flex justify-between items-end w-full">
            {/* Bottom Left Corner - Connect & Socials */}
            <div className="flex flex-col space-y-3 pointer-events-auto">
              <span className="text-xs uppercase tracking-[0.25em] text-white/50">
                Connect
              </span>
              <div className="flex items-center gap-3">
                {/* Contact Mail Icon */}
                <a
                  href="/contact"
                  title="Contact"
                  className="p-2.5 border border-white/20 hover:border-white/60 bg-black/40 backdrop-blur-md transition-all text-white/80 hover:text-white rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
                {/* X (formerly Twitter) Icon */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="X (Twitter)"
                  className="p-2.5 border border-white/20 hover:border-white/60 bg-black/40 backdrop-blur-md transition-all text-white/80 hover:text-white rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* LinkedIn Icon */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  className="p-2.5 border border-white/20 hover:border-white/60 bg-black/40 backdrop-blur-md transition-all text-white/80 hover:text-white rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Bottom Right Corner */}
            <div className="text-right flex flex-col items-end space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-white/50">
                Scroll
              </span>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
                <span>Explore Scene</span>
                <span className="animate-bounce">↓</span>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll distance for the camera sequence (frames 0 -> 110) is
            reserved automatically by ScrollTrigger's own pinSpacing (see
            useCameraScroll.js, SCROLL_DISTANCE). No manual spacer div
            needed -- one would double the gap. */}

        <section id="work" className="min-h-screen flex flex-col items-center justify-center px-8 bg-black pointer-events-auto">
          <div id="featured-projects" className="flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Work</h2>
            <p className="text-gray-400 max-w-xl text-center leading-relaxed">
              Selected projects and case studies, coming soon.
            </p>
          </div>
        </section>

        <section id="contact" className="min-h-screen flex flex-col items-center justify-center px-8 bg-zinc-950 pointer-events-auto border-t border-white/10">
          <h2 className="text-3xl font-bold mb-4 text-white">Contact</h2>
          <p className="text-gray-400 max-w-xl text-center leading-relaxed mb-6">
            Get in touch for collaborations or inquiries.
          </p>
          <a
            href="mailto:contact@example.com"
            className="px-6 py-3 border border-white/20 hover:border-white/60 bg-black/40 backdrop-blur-md text-white rounded-full transition-all text-sm uppercase tracking-wider font-medium"
          >
            Say Hello
          </a>
        </section>
      </div>
    </>
  );
}
