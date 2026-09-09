"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  EthosSection ("How I Build")                                       */
/*                                                                      */
/*  Was previously just an <Interlude id="ethos" ... /> sharing the      */
/*  same word-by-word-blur template as the Work->Contact interlude.      */
/*  Split out into its own component so this section could get a        */
/*  distinct treatment without touching Interlude.js or the "invitation" */
/*  interlude that still uses it.                                        */
/*                                                                        */
/*  Effect: as the section transits the viewport (top hits bottom of     */
/*  screen -> bottom hits top of screen, i.e. the full scroll-through,   */
/*  not just the entry like Interlude's quicker reveal window), the      */
/*  whole heading drifts left -> right via a container-level x offset,   */
/*  while each word staggers in on its own narrower slice of that same   */
/*  scroll range with a smaller local slide + fade. Net feel: the text   */
/*  cascades in word by word from the left, then keeps drifting          */
/*  rightward as you keep scrolling past it. A thin accent underline     */
/*  extends left -> right beneath the eyebrow on the same scroll         */
/*  progress, echoing the same left-to-right motion at a smaller scale.  */
/* ------------------------------------------------------------------ */

function SlideWord({ children, progress, range, n, index }) {
  // Local slide-in: starts offset to the left and fades up to full
  // opacity within this word's own slice of the scroll range. Later
  // words get a slightly larger starting offset so the cascade reads
  // left-to-right rather than every word arriving at once.
  const startOffset = 28 + index * (10 / Math.max(n - 1, 1));
  const x = useTransform(progress, range, [startOffset, 0]);
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <motion.span
      style={{ x, opacity }}
      className="inline-block will-change-[transform,opacity]"
    >
      {children}
    </motion.span>
  );
}

export default function EthosSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Whole block drift, spanning the section's full time on screen.
  const containerX = useTransform(scrollYProgress, [0, 1], ["-4vw", "18vw"]);
  const underlineScale = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);

  const text = "First the user experience, then the logic, then the imersion ";
  const words = text.split(" ");
  const n = words.length;
  // Word-level stagger only needs the earlier part of the scroll range --
  // by ~60% through, every word should already be fully in.
  const staggerEnd = 0.6;

  return (
    <section
      id="ethos"
      ref={sectionRef}
      className="relative w-full h-[100vh] flex items-center px-8 md:px-16 lg:px-24 py-28 bg-[#050505] overflow-hidden pointer-events-auto justify-start"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 -left-40 w-[420px] h-[420px] rounded-full bg-white/[0.025] blur-[130px]" />
      </div>

      <motion.div style={{ x: containerX }} className="relative z-10 max-w-2xl">
        <span className="block text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
          How I Build
        </span>

        {/* Accent underline -- grows left to right beneath the eyebrow,
            a smaller echo of the heading's own left-to-right drift. */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: underlineScale }}
          className="accent2-underline block h-[2px] w-16 origin-left mb-8"
        />

        <p className="font-heading text-3xl md:text-5xl lg:text-6xl leading-[1.25] text-white/90">
          {words.map((word, i) => {
            const rangeStart = (i / n) * staggerEnd;
            const rangeEnd = rangeStart + staggerEnd / n + 0.06;
            return (
              <span key={i}>
                <SlideWord
                  progress={scrollYProgress}
                  range={[rangeStart, Math.min(rangeEnd, staggerEnd)]}
                  n={n}
                  index={i}
                >
                  {word}
                </SlideWord>{" "}
              </span>
            );
          })}
        </p>
      </motion.div>
    </section>
  );
}
