"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WaterWave from "react-water-wave";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    id: "streamvibe",
    title: "StreamVibe",
    url: "https://streamvibe-backend-q0e9.onrender.com/",
    image: "/images/work/streamvibe_1.png",
  },
  {
    id: "geoplanarcs",
    title: "Geoplanarcs",
    url: "https://geoplanarcs.netlify.app/",
    image: "/images/work/geoplanarcs_1.png",
  },
  {
    id: "thermos",
    title: "Thermos",
    url: "https://thermostest.netlify.app/",
    image: "/images/work/thermos_1.png",
  },
];

// How much scroll distance (per project transition) the section stays
// pinned for. With N projects there are N-1 transitions.
const VH_PER_TRANSITION = 100;

/**
 * Preloads an image and reports whether it actually resolved. Used so a
 * missing/broken screenshot degrades to a plain placeholder instead of
 * handing react-water-wave (which reads the image into a WebGL texture) a
 * URL that 404s.
 */
function useImageStatus(url) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) setStatus("ok");
    };
    img.onerror = () => {
      if (!cancelled) setStatus("error");
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [url]);

  return status;
}

function ProjectScreenshot({ project }) {
  const status = useImageStatus(project.image);

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-4 md:inset-10 block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] cursor-pointer group"
    >
      {status === "ok" && (
        <WaterWave
          imageUrl={project.image}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
          dropRadius={35}
          perturbance={0.045}
          resolution={512}
        >
          {() => <div className="w-full h-full" />}
        </WaterWave>
      )}

      {status !== "ok" && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.06] to-black">
          <span className="font-heading font-bold text-2xl text-white/30 tracking-tight">
            {project.title}
          </span>
        </div>
      )}

      {/* Subtle affordance hinting the whole card is a link */}
      <div className="pointer-events-none absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs uppercase tracking-[0.2em] text-white/80">
          Visit
        </span>
        <svg
          className="w-3 h-3 text-white/80"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </motion.a>
  );
}

export default function WorkSection() {
  const sectionRef = useRef(null);
  const stRef = useRef(null);
  const [progress, setProgress] = useState(0); // continuous 0..(projects.length - 1)
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const scrollDistance = `+=${(projects.length - 1) * VH_PER_TRANSITION}vh`;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: scrollDistance,
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const raw = self.progress * (projects.length - 1);
        setProgress(raw);
        setActiveIndex(Math.round(raw));
      },
    });

    stRef.current = st;

    return () => {
      st.kill();
      if (stRef.current === st) stRef.current = null;
    };
  }, []);

  const jumpToProject = useCallback((index) => {
    const st = stRef.current;
    if (!st) return;
    const targetProgress = index / (projects.length - 1);
    const targetY = st.start + targetProgress * (st.end - st.start);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  const active = projects[activeIndex];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative h-screen w-full bg-black overflow-hidden flex flex-col md:flex-row pointer-events-auto"
    >
      {/* Left column (35%) - vertically stacked, scroll-scrubbed title carousel */}
      <div
        id="featured-projects"
        className="relative w-full md:w-[35%] h-1/2 md:h-full flex items-center overflow-hidden px-8 md:px-12"
      >
        {projects.map((project, i) => {
          const distance = i - progress;
          const opacity = Math.max(0.15, 1 - Math.abs(distance) * 0.6);

          return (
            <h3
              key={project.id}
              className="absolute left-8 md:left-12 top-1/2 font-heading font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl text-white whitespace-nowrap will-change-transform"
              style={{
                transform: `translateY(-50%) translateY(${distance * 34}vh)`,
                opacity,
              }}
            >
              {project.title}
            </h3>
          );
        })}

        {/* Progress nav - lets the user jump straight to a project,
            bypassing the normal scroll-through */}
        <div className="absolute bottom-8 md:bottom-10 left-8 md:left-12 flex gap-3 z-20">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => jumpToProject(i)}
              aria-label={`Go to ${p.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex
                  ? "w-8 bg-white"
                  : "w-3 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right column (65%) - active project screenshot */}
      <div className="relative w-full md:w-[65%] h-1/2 md:h-full">
        <AnimatePresence>
          <ProjectScreenshot key={active.id} project={active} />
        </AnimatePresence>
      </div>
    </section>
  );
}
