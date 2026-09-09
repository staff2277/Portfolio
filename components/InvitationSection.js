"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  InvitationSection ("What's Next")                                  */
/*                                                                      */
/*  Was previously an <Interlude id="invitation" ... align="right"       */
/*  signature="quote" /> using the shared word-blur reveal template.     */
/*  Pulled out into its own component to reuse the same left-to-right    */
/*  scroll stagger effect built for EthosSection.js ("How I Build"),     */
/*  without touching Interlude.js (now unused -- see note in page.js).   */
/*  Copy/alignment/quote-mark are unchanged from the original Interlude  */
/*  call; only the reveal mechanics changed.                             */
/*                                                                        */
/*  Effect mirrors EthosSection but with the x-direction inverted (per     */
/*  request): container drifts right -> left instead of left -> right,    */
/*  and each word slides in from the left instead of the right. Rest of   */
/*  the mechanics (full-viewport-transit scroll progress, per-word local   */
/*  slide + fade staggered over the first ~60% of the range) unchanged.    */
/* ------------------------------------------------------------------ */

function SlideWord({ children, progress, range, n, index }) {
  // Negative offset (vs. EthosSection's positive) -- word starts to the
  // left of its resting position and slides right into place, inverting
  // the direction of the cascade to mirror EthosSection's.
  const startOffset = -(28 + index * (10 / Math.max(n - 1, 1)));
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

export default function InvitationSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Inverted from EthosSection's ["-4vw", "18vw"] -- drifts right to left.
  const containerX = useTransform(scrollYProgress, [0, 1], ["4vw", "-18vw"]);

  const text =
    "If something above sparked an idea, that's usually the best time to say hello.";
  const words = text.split(" ");
  const n = words.length;
  const staggerEnd = 0.6;

  return (
    <section
      id="invitation"
      ref={sectionRef}
      className="relative w-full min-h-[80vh] flex items-center justify-end px-8 md:px-16 lg:px-24 py-28 bg-[#050505] overflow-hidden pointer-events-auto"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 -right-40 w-[420px] h-[420px] rounded-full bg-white/[0.025] blur-[130px]" />
      </div>

      {/* Quote-mark backdrop, carried over from Interlude's signature="quote". */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="hidden md:block absolute right-10 lg:right-24 top-1/2 -translate-y-1/2 w-48 h-48 lg:w-64 lg:h-64 text-white/[0.035] pointer-events-none"
      >
        <path d="M7.17 6.2A5.6 5.6 0 001.5 11.8V18h6.7v-6.2H4.9c0-2 1.6-3.6 3.6-3.6V6.2h-1.33zM17.5 6.2a5.6 5.6 0 00-5.67 5.6V18h6.7v-6.2h-3.3c0-2 1.6-3.6 3.6-3.6V6.2H17.5z" />
      </svg>

      <motion.div style={{ x: containerX }} className="relative z-10 max-w-2xl text-right">
        <span className="block text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
          What&apos;s Next
        </span>

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
