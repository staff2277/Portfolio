"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const WaterWave = dynamic(() => import("react-water-wave"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "streamvibe",
    title: "StreamVibe",
    url: "https://streamvibe-backend-q0e9.onrender.com/",
    accentColor: "rgba(220, 38, 38, 0.15)", // red
    images: [
      "/images/work/streamvibe_1.png",
      "/images/work/streamvibe_2.png",
      "/images/work/streamvibe_3.png",
      "/images/work/streamvibe_4.png",
    ],
  },
  {
    id: "geoplanarcs",
    title: "Geoplanarcs",
    url: "https://geoplanarcs.netlify.app/",
    accentColor: "rgba(250, 254, 255, 0.12)", // #FAFEFF
    images: [
      "/images/work/geoplanarcs_1.png",
      "/images/work/geoplanarcs_2.png",
      "/images/work/geoplanarcs_3.png",
      "/images/work/geoplanarcs_4.png",
    ],
  },
  {
    id: "thermos",
    title: "Thermos",
    url: "https://thermostest.netlify.app/",
    accentColor: "rgba(34, 197, 94, 0.15)", // #22C55E
    images: [
      "/images/work/thermos_1.png",
      "/images/work/thermos_2.png",
      "/images/work/thermos_3.png",
      "/images/work/thermos_4.png",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Slideshow dot indicator                                           */
/* ------------------------------------------------------------------ */
function SlideshowDots({ total, active }) {
  return (
    <div className="hidden lg:flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="block rounded-full transition-all duration-500"
          style={{
            width: active === i ? 24 : 6,
            height: 6,
            backgroundColor: active === i ? "#fff" : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function WorkSection() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  /* --- slideshow timer (2 s) --- */
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  /* reset slideshow when active project changes */
  useEffect(() => {
    setImageIndex(0);
  }, [activeIndex]);

  /* --- GSAP scroll-pin --- */
  useEffect(() => {
    const totalProjects = projects.length;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${80 * totalProjects}%`, // Reduced from 150 to 80 for much faster project transitions
      pin: true,
      scrub: true,
      refreshPriority: -1, // resolve after the hero trigger (priority 1)
      onUpdate: (self) => {
        const progress = self.progress;
        let index = Math.floor(progress * totalProjects);
        if (index >= totalProjects) index = totalProjects - 1;
        setActiveIndex(index);
      },
    });

    // Recalculate after DOM settles (hero pin-spacing may not be ready yet)
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      st.kill();
    };
  }, []);

  const openProject = useCallback(() => {
    window.open(projects[activeIndex].url, "_blank");
  }, [activeIndex]);

  const activeProject = projects[activeIndex];

  return (
    <section
      id="work"
      ref={containerRef}
      className="h-dvh w-full bg-black text-white overflow-hidden pointer-events-auto relative z-20"
    >
      {/* Dynamic Gradient Backgrounds */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {projects.map((proj, idx) => (
          <div
            key={`bg-${proj.id}`}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: activeIndex === idx ? 1 : 0,
              background: `linear-gradient(to bottom, ${proj.accentColor} 0%, transparent 25%, transparent 75%, ${proj.accentColor} 100%)`,
            }}
          />
        ))}
      </div>

      {/* ========== MOBILE / TABLET  (< lg) ========== */}
      {/* Full-screen centred title-only layout                        */}
      <div className="flex lg:hidden flex-col h-full w-full items-center justify-center relative px-6">
        {/* Section label */}
        <span className="absolute top-8 left-6 text-[10px] uppercase tracking-[0.3em] text-white/40">
          Selected Work
        </span>

        {/* Counter */}
        <span className="absolute top-8 right-6 text-[10px] uppercase tracking-[0.3em] text-white/40 tabular-nums">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </span>

        {/* Prev title (faded) */}
        <div className="h-16 flex items-end justify-center w-full overflow-hidden mb-4">
          <AnimatePresence mode="popLayout">
            {activeIndex > 0 && (
              <motion.span
                key={`m-prev-${activeIndex - 1}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 0.2, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45 }}
                className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white whitespace-nowrap"
              >
                {projects[activeIndex - 1].title}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Active title */}
        <div className="relative flex items-center justify-center w-full overflow-visible min-h-[56px]">
          <AnimatePresence mode="popLayout">
            <motion.a
              key={`m-active-${activeIndex}`}
              href={activeProject.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute font-heading text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-lg whitespace-nowrap"
            >
              {activeProject.title}
            </motion.a>
          </AnimatePresence>
        </div>

        {/* Next title (faded) */}
        <div className="h-16 flex items-start justify-center w-full overflow-hidden mt-4">
          <AnimatePresence mode="popLayout">
            {activeIndex < projects.length - 1 && (
              <motion.span
                key={`m-next-${activeIndex + 1}`}
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 0.2, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.45 }}
                className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white whitespace-nowrap"
              >
                {projects[activeIndex + 1].title}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
            Scroll
          </span>
          <span className="animate-bounce text-white/30 text-xs">↓</span>
        </div>
      </div>

      {/* ========== DESKTOP  (≥ lg) ========== */}
      <div className="hidden lg:flex flex-row h-full w-full">
        {/* ---- Left Column (40%) ---- */}
        <div className="w-[40%] h-full flex flex-col relative border-r border-white/[0.06]">
          {/* Section label */}
          <div className="absolute top-10 left-16 flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Selected Work
            </span>
            <span className="w-8 h-px bg-white/20" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          {/* Top Zone — previous project */}
          <div className="flex-1 flex items-end pl-16 pr-8 pb-6 overflow-hidden relative">
            <AnimatePresence mode="popLayout">
              {activeIndex > 0 && (
                <motion.div
                  key={`top-${activeIndex - 1}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 0.25, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-6"
                >
                  <h3 className="font-heading text-4xl xl:text-5xl font-bold tracking-tight text-white whitespace-nowrap">
                    {projects[activeIndex - 1].title}
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center Zone — active project */}
          <div className="flex-1 flex flex-col justify-center pl-16 pr-8 relative overflow-visible">
            {/* Accent line */}
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full bg-white"
              initial={{ height: 0 }}
              animate={{ height: 56 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              key={`bar-${activeIndex}`}
            />

            <AnimatePresence mode="popLayout">
              <motion.div
                key={`center-${activeIndex}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute flex flex-col gap-4"
              >
                <h2 className="font-heading text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight text-white leading-none">
                  {activeProject.title}
                </h2>

                {/* CTA link */}
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300 w-fit group/link relative z-50 pointer-events-auto cursor-pointer"
                >
                  <span>View Project</span>
                  <svg
                    className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Zone — next project */}
          <div className="flex-1 flex items-start pl-16 pr-8 pt-6 overflow-hidden relative">
            <AnimatePresence mode="popLayout">
              {activeIndex < projects.length - 1 && (
                <motion.div
                  key={`bottom-${activeIndex + 1}`}
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 0.25, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-6"
                >
                  <h3 className="font-heading text-4xl xl:text-5xl font-bold tracking-tight text-white whitespace-nowrap">
                    {projects[activeIndex + 1].title}
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress dots bottom-left */}
          <div className="absolute bottom-10 left-16 flex items-center gap-3">
            {projects.map((_, i) => (
              <span
                key={i}
                className="block rounded-full transition-all duration-500 ease-out"
                style={{
                  width: activeIndex === i ? 28 : 6,
                  height: 6,
                  backgroundColor:
                    activeIndex === i ? "#fff" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ---- Right Column (60%) ---- */}
        <div
          className="w-[60%] h-full relative overflow-hidden cursor-pointer group flex items-center justify-center p-10"
          onClick={openProject}
        >
          {/* Browser window mockup */}
          <AnimatePresence initial={false}>
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/60 w-[85%] max-w-5xl aspect-[16/10] xl:aspect-video"
              style={{ background: "rgba(20, 20, 22, 1)" }}
            >
              {/* ---- Title bar ---- */}
              <div className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]"
                style={{ background: "rgba(28, 28, 30, 1)" }}
              >
                {/* Traffic light dots */}
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />

                {/* URL bar */}
                <div className="ml-4 flex-1 max-w-md">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[11px] text-white/30 tracking-wide"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <svg className="w-3 h-3 text-white/20 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1.9-2 2-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    <span className="truncate">{activeProject.url.replace(/^https?:\/\//, "")}</span>
                  </div>
                </div>
              </div>

              {/* ---- Window body (screenshots) ---- */}
              <div className="flex-1 relative overflow-hidden min-h-0 bg-[#0a0a0a]">
                {/* Slideshow layers */}
                {activeProject.images.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{
                      opacity: imageIndex === idx ? 1 : 0,
                      zIndex: imageIndex === idx ? 10 : 1,
                    }}
                  >
                    <div style={{ width: "100%", height: "100%" }}>
                      <WaterWave
                        imageUrl={imgSrc}
                        dropRadius={25}
                        perturbance={0.03}
                        resolution={512}
                        interactive={true}
                        crossOrigin="anonymous"
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {() => (
                          <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 pointer-events-none">
                            <span className="px-7 py-3.5 border border-white/30 bg-black/50 backdrop-blur-xl rounded-full font-heading text-base tracking-wider text-white flex items-center gap-2.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl">
                              View Live Site
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </span>
                          </div>
                        )}
                      </WaterWave>
                    </div>
                  </div>
                ))}

                {/* Slideshow dots — bottom-right inside window */}
                <div className="absolute bottom-4 right-4 z-40 pointer-events-none">
                  <SlideshowDots
                    total={activeProject.images.length}
                    active={imageIndex}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
