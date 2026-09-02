"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Interlude                                                          */
/*                                                                      */
/*  Purely aesthetic breather section dropped between the site's main   */
/*  sections (Hero -> Work -> Contact). No nav, no interaction -- its    */
/*  only job is pacing: give the scroll a quiet beat before the next     */
/*  heavy section, while a short first-person line materializes word    */
/*  by word as it scrolls through view.                                 */
/*                                                                      */
/*  Word reveal is driven by a single continuous scroll-linked motion    */
/*  value (useScroll's scrollYProgress over this section's own viewport  */
/*  transit), same philosophy as WorkSection's crossfade math: a float   */
/*  scroll position feeding useTransform per word, not a discrete        */
/*  enter/exit state -- so scrubbing up and down never looks glitchy.    */
/* ------------------------------------------------------------------ */

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const blurAmount = useTransform(progress, range, [6, 0]);
  const filter = useTransform(blurAmount, (b) => `blur(${b}px)`);
  return (
    <motion.span style={{ opacity, filter }} className="inline-block will-change-[opacity,filter]">
      {children}
    </motion.span>
  );
}

function RevealText({ text, progress }) {
  const words = text.split(" ");
  const n = words.length;
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <Word progress={progress} range={[i / n, (i + 1) / n]}>
            {word}
          </Word>{" "}
        </span>
      ))}
    </>
  );
}

export default function Interlude({ id, eyebrow, text, align = "left", signature = "bar" }) {
  const sectionRef = useRef(null);
  // Reveal window: starts as the section's top crosses 85% down the
  // viewport (just entering) and completes once its top reaches 25% up
  // (comfortably read before it scrolls past). Bidirectional -- scrolling
  // back up dims the words again, matching the site's scrub-everything feel.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "start 0.25"],
  });

  const isRight = align === "right";

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative w-full min-h-[80vh] flex items-center px-8 md:px-16 lg:px-24 py-28 bg-[#050505] overflow-hidden pointer-events-auto ${
        isRight ? "justify-end" : "justify-start"
      }`}
    >
      {/* Ambient glow -- quieter and smaller than Contact's, single source */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-white/[0.025] blur-[130px] ${
            isRight ? "-right-40" : "-left-40"
          }`}
        />
      </div>

      {/* Signature element -- distinct per interlude so they read as two
          moments, not one template repeated. */}
      {signature === "bar" && (
        <motion.span
          aria-hidden="true"
          className="hidden md:block absolute left-16 top-1/2 w-[3px] h-16 -translate-y-1/2 rounded-full bg-[var(--accent)] origin-top"
          style={{ scaleY: scrollYProgress }}
        />
      )}

      {signature === "quote" && (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="hidden md:block absolute right-10 lg:right-24 top-1/2 -translate-y-1/2 w-48 h-48 lg:w-64 lg:h-64 text-white/[0.035] pointer-events-none"
        >
          <path d="M7.17 6.2A5.6 5.6 0 001.5 11.8V18h6.7v-6.2H4.9c0-2 1.6-3.6 3.6-3.6V6.2h-1.33zM17.5 6.2a5.6 5.6 0 00-5.67 5.6V18h6.7v-6.2h-3.3c0-2 1.6-3.6 3.6-3.6V6.2H17.5z" />
        </svg>
      )}

      <div className={`relative z-10 max-w-2xl ${isRight ? "text-right" : "text-left"}`}>
        <span className="block text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
          {eyebrow}
        </span>
        <p className="font-heading text-3xl md:text-5xl lg:text-6xl leading-[1.25] text-white/90">
          <RevealText text={text} progress={scrollYProgress} />
        </p>
      </div>
    </section>
  );
}
