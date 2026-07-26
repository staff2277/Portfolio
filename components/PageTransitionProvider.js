"use client";

import React from "react";

export default function PageTransitionProvider({ children }) {
  // TODO: Add Framer Motion (AnimatePresence / motion.div) or GSAP
  // page transition logic here later.
  return (
    <div className="page-transition-wrapper">
      {children}
    </div>
  );
}
