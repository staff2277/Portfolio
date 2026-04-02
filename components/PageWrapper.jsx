"use client";

import { motion } from "framer-motion";

const variants = {
  slide: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  scaleFade: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.05, opacity: 0 },
  },
  reveal: {
    initial: { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
    animate: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
    exit: { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
  },
  rotateFlip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  }
};

export default function PageWrapper({ children, transitionType = "slide", className = "" }) {
  const selectedVariant = variants[transitionType] || variants.slide;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariant}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
}
