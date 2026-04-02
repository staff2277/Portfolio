"use client";

import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

export default function About() {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <PageWrapper transitionType="scaleFade" className="pt-32 px-8 md:px-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h1 variants={textVariants} className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-12">
          Redefining<br />
          <span className="text-[var(--accent)]">Digital</span><br />
          Experiences
        </motion.h1>
      </motion.div>

      <div className="max-w-3xl ml-auto mt-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.p variants={textVariants} className="text-xl md:text-3xl font-light mb-8 leading-relaxed">
            I am a creative developer who bridges the gap between design and engineering. I specialize in crafting immersive, interactive, and highly performant web experiences using modern technologies.
          </motion.p>
          <motion.p variants={textVariants} className="text-lg md:text-xl font-light text-gray-400 leading-relaxed">
            From 3D webGL integration to complex GSAP and Framer Motion choreography, I believe that motion and interaction are what makes a website memorable. Let's create something extraordinary together.
          </motion.p>
        </motion.div>
      </div>

      <div className="h-[50vh]"></div> {/* Scroll padding */}
    </PageWrapper>
  );
}
