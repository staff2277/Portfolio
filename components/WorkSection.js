"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useLenis } from "./SmoothScroll";

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
    <div className="hidden md:flex items-center gap-2">
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
/*  Continuous scroll-driven transition math                          */
/*                                                                     */
/*  Instead of animating an enter/exit each time `activeIndex` steps  */
/*  (which unmounts/remounts elements and can get visibly interrupted */
/*  by fast or reversed scrubbing), every title/mockup is permanently */
/*  mounted and its opacity/scale/blur is a pure function of the raw  */
/*  continuous scroll position `v` (a float, not an integer step).    */
/*  Nothing ever disappears then reappears — it's always mounted,     */
/*  always in sync with the scrollbar, and reversing direction just   */
/*  reverses the same curve.                                          */
/* ------------------------------------------------------------------ */
function computeTransitionStyle(v, index, offset, opts) {
  const { w, peakOpacity, inScale, outScale, blurPx } = opts;
  const target = index + offset;
  const d = v - target;

  if (d > -w && d < 0) {
    // easing into focus
    const p = (d + w) / w;
    return {
      opacity: p * peakOpacity,
      scale: inScale + (1 - inScale) * p,
      blur: blurPx * (1 - p),
    };
  }
  if (d >= 0 && d < 1 - w) {
    // settled / fully in focus for the rest of this project's dwell
    return { opacity: peakOpacity, scale: 1, blur: 0 };
  }
  if (d >= 1 - w && d < 1) {
    // easing out of focus
    const p = (d - (1 - w)) / w;
    return {
      opacity: (1 - p) * peakOpacity,
      scale: 1 + (outScale - 1) * p,
      blur: blurPx * p,
    };
  }
  return { opacity: 0, scale: outScale, blur: blurPx };
}

const CENTER_STYLE = { w: 0.35, peakOpacity: 1, inScale: 1.18, outScale: 0.84, blurPx: 18 };
const SIDE_STYLE = { w: 0.35, peakOpacity: 0.25, inScale: 0.82, outScale: 0.82, blurPx: 14 };
const MOCKUP_STYLE = { w: 0.35, peakOpacity: 1, inScale: 1.12, outScale: 0.9, blurPx: 28 };

/* Prev/next faded title (top or bottom zone). offset +1 = plays the role
   of "previous" (shown while project index+1 is centered); offset -1 =
   "next" (shown while project index-1 is centered). */
function SideTitle({ t, index, offset, title, onNavigate, className }) {
  const opacity = useTransform(t, (v) => computeTransitionStyle(v, index, offset, SIDE_STYLE).opacity);
  const scale = useTransform(t, (v) => computeTransitionStyle(v, index, offset, SIDE_STYLE).scale);
  const blur = useTransform(t, (v) => computeTransitionStyle(v, index, offset, SIDE_STYLE).blur);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.04 ? "auto" : "none"));

  return (
    <motion.h3
      style={{ opacity, scale, filter, pointerEvents }}
      onClick={() => onNavigate(index)}
      className={className}
    >
      {title}
    </motion.h3>
  );
}

/* Active/center title + CTA link. Rendered once per project, permanently
   mounted, crossfading via opacity/scale/blur as scroll position passes
   through this project's dwell window. */
function CenterBlock({ t, index, project, onNavigate, variant = "desktop" }) {
  const opacity = useTransform(t, (v) => computeTransitionStyle(v, index, 0, CENTER_STYLE).opacity);
  const scale = useTransform(t, (v) => computeTransitionStyle(v, index, 0, CENTER_STYLE).scale);
  const blur = useTransform(t, (v) => computeTransitionStyle(v, index, 0, CENTER_STYLE).blur);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  const titleClass =
    variant === "tablet"
      ? "font-heading text-3xl md:text-4xl font-bold tracking-tight text-white leading-none cursor-pointer"
      : "font-heading text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight text-white leading-none cursor-pointer";

  return (
    <motion.div style={{ opacity, scale, filter, pointerEvents }} className="absolute flex flex-col gap-4">
      <h2 onClick={() => onNavigate(index)} className={titleClass}>
        {project.title}
      </h2>

      <a
        href={project.url}
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </motion.div>
  );
}

/* Browser-window mockup, one per project, permanently mounted and
   crossfaded the same continuous way as the titles. */
function MockupCard({ t, index, project, imageIndex, variant = "desktop" }) {
  const opacity = useTransform(t, (v) => computeTransitionStyle(v, index, 0, MOCKUP_STYLE).opacity);
  const scale = useTransform(t, (v) => computeTransitionStyle(v, index, 0, MOCKUP_STYLE).scale);
  const blur = useTransform(t, (v) => computeTransitionStyle(v, index, 0, MOCKUP_STYLE).blur);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const zIndex = useTransform(opacity, (o) => (o > 0.5 ? 10 : 1));
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  const sizeClass = variant === "tablet" ? "w-[92%] max-w-md aspect-[4/3]" : "w-[85%] max-w-5xl aspect-[16/10] xl:aspect-video";

  return (
    <motion.div
      style={{ opacity, scale, filter, zIndex, pointerEvents }}
      className={`absolute flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/60 ${sizeClass}`}
    >
      {/* ---- Title bar ---- */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]"
        style={{ background: "rgba(28, 28, 30, 1)" }}
      >
        {/* Traffic light dots */}
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />

        {/* URL bar */}
        <div className="ml-4 flex-1 max-w-md">
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[11px] text-white/30 tracking-wide"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <svg className="w-3 h-3 text-white/20 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1.9-2 2-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            <span className="truncate">{project.url.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </div>

      {/* ---- Window body (screenshots) ---- */}
      <div className="flex-1 relative overflow-hidden min-h-0 bg-[#0a0a0a]">
        {/* Slideshow layers */}
        {project.images.map((imgSrc, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: imageIndex === idx ? 1 : 0,
              zIndex: imageIndex === idx ? 10 : 1,
            }}
          >
            {/* Static background image -- was a WaterWave (WebGL ripple
                shader canvas) per image; that meant up to 24 continuously-
                animating canvases mounted at once across the tablet/desktop
                layouts regardless of visibility. Replaced with a plain
                background-image div; hover overlay below is unchanged
                (it only ever depended on the parent's Tailwind `group`
                hover state, not on WaterWave itself). */}
            <div
              className="relative w-full h-full"
              style={{
                backgroundImage: `url(${imgSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 pointer-events-none">
                <span className="px-7 py-3.5 border border-white/30 bg-black/50 backdrop-blur-xl rounded-full font-heading text-base tracking-wider text-white flex items-center gap-2.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl">
                  View Live Site
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Slideshow dots — bottom-right inside window */}
        <div className="absolute bottom-4 right-4 z-40 pointer-events-none">
          <SlideshowDots total={project.images.length} active={imageIndex} />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function WorkSection() {
  const containerRef = useRef(null);
  const stRef = useRef(null);
  const lenis = useLenis();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  /* Continuous scroll position across all projects (e.g. 1.4 = 40% of the
     way through project 1's dwell). Drives every title/mockup transition
     directly — see computeTransitionStyle above. Not React state: updating
     it doesn't cause a re-render, it just pushes new values through the
     motion values already subscribed to it. */
  const t = useMotionValue(0);

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
        const continuous = progress * totalProjects;
        t.set(continuous);
        let index = Math.floor(continuous);
        if (index >= totalProjects) index = totalProjects - 1;
        setActiveIndex(index);
      },
    });

    stRef.current = st;

    // Recalculate after DOM settles (hero pin-spacing may not be ready yet)
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      st.kill();
    };
  }, [t]);

  const openProject = useCallback(() => {
    window.open(projects[activeIndex].url, "_blank");
  }, [activeIndex]);

  /* Click-to-navigate: jump the scroll position so the clicked project
     lands mid-dwell (fully settled/in-focus), using the app's Lenis
     instance so it matches the site's smooth-scroll feel everywhere else. */
  const goToProject = useCallback(
    (targetIndex) => {
      const st = stRef.current;
      if (!st) return;
      const totalProjects = projects.length;
      const desiredProgress = (targetIndex + 0.5) / totalProjects;
      const targetScroll = st.start + desiredProgress * (st.end - st.start);

      if (lenis) {
        lenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    },
    [lenis]
  );

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

      {/* ========== MOBILE ONLY  (< md) ========== */}
      {/* Full-screen centred title-only layout, no showcase mockup          */}
      <div className="flex md:hidden flex-col h-full w-full items-center justify-center relative px-6">
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
                onClick={() => goToProject(activeIndex - 1)}
                className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white whitespace-nowrap cursor-pointer"
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
                onClick={() => goToProject(activeIndex + 1)}
                className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white whitespace-nowrap cursor-pointer"
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

      {/* ========== TABLET  (md to lg) ========== */}
      {/* Same two-column idea as desktop, everything scaled down so it     */}
      {/* doesn't feel cramped between the mobile and desktop breakpoints.  */}
      <div className="hidden md:flex lg:hidden flex-row h-full w-full">
        {/* ---- Left Column ---- */}
        <div className="w-[42%] h-full flex flex-col relative border-r border-white/[0.06]">
          {/* Section label */}
          <div className="absolute top-6 left-8 flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/40">
              Selected Work
            </span>
            <span className="w-6 h-px bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          {/* Top Zone — previous project */}
          <div className="flex-1 flex items-end pl-8 pr-4 pb-4 overflow-hidden relative">
            {projects.map((p, i) => (
              <SideTitle
                key={`tablet-top-${p.id}`}
                t={t}
                index={i}
                offset={1}
                title={p.title}
                onNavigate={goToProject}
                className="absolute bottom-4 font-heading text-2xl font-bold tracking-tight text-white whitespace-nowrap cursor-pointer"
              />
            ))}
          </div>

          {/* Center Zone — active project */}
          <div className="flex-1 flex flex-col justify-center pl-8 pr-4 relative overflow-visible">
            {projects.map((p, i) => (
              <CenterBlock
                key={`tablet-center-${p.id}`}
                t={t}
                index={i}
                project={p}
                onNavigate={goToProject}
                variant="tablet"
              />
            ))}
          </div>

          {/* Bottom Zone — next project */}
          <div className="flex-1 flex items-start pl-8 pr-4 pt-4 overflow-hidden relative">
            {projects.map((p, i) => (
              <SideTitle
                key={`tablet-bottom-${p.id}`}
                t={t}
                index={i}
                offset={-1}
                title={p.title}
                onNavigate={goToProject}
                className="absolute top-4 font-heading text-2xl font-bold tracking-tight text-white whitespace-nowrap cursor-pointer"
              />
            ))}
          </div>

          {/* Progress dots bottom-left */}
          <div className="absolute bottom-6 left-8 flex items-center gap-2">
            {projects.map((_, i) => (
              <span
                key={i}
                className="block rounded-full transition-all duration-500 ease-out"
                style={{
                  width: activeIndex === i ? 20 : 5,
                  height: 5,
                  backgroundColor:
                    activeIndex === i ? "#fff" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ---- Right Column ---- */}
        <div
          className="w-[58%] h-full relative overflow-hidden cursor-pointer group flex items-center justify-center p-5"
          onClick={openProject}
        >
          {projects.map((p, i) => (
            <MockupCard
              key={`tablet-mockup-${p.id}`}
              t={t}
              index={i}
              project={p}
              imageIndex={imageIndex}
              variant="tablet"
            />
          ))}
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
            {projects.map((p, i) => (
              <SideTitle
                key={`top-${p.id}`}
                t={t}
                index={i}
                offset={1}
                title={p.title}
                onNavigate={goToProject}
                className="absolute bottom-6 font-heading text-4xl xl:text-5xl font-bold tracking-tight text-white whitespace-nowrap cursor-pointer"
              />
            ))}
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

            {projects.map((p, i) => (
              <CenterBlock key={`center-${p.id}`} t={t} index={i} project={p} onNavigate={goToProject} />
            ))}
          </div>

          {/* Bottom Zone — next project */}
          <div className="flex-1 flex items-start pl-16 pr-8 pt-6 overflow-hidden relative">
            {projects.map((p, i) => (
              <SideTitle
                key={`bottom-${p.id}`}
                t={t}
                index={i}
                offset={-1}
                title={p.title}
                onNavigate={goToProject}
                className="absolute top-6 font-heading text-4xl xl:text-5xl font-bold tracking-tight text-white whitespace-nowrap cursor-pointer"
              />
            ))}
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
          {projects.map((p, i) => (
            <MockupCard key={`mockup-${p.id}`} t={t} index={i} project={p} imageIndex={imageIndex} />
          ))}
        </div>
      </div>
    </section>
  );
}
