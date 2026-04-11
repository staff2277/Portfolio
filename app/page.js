"use client";

import Scene from "@/components/Scene";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <PageWrapper transitionType="reveal">
      <Scene />

      <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 pointer-events-none z-10 relative mix-blend-difference">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-4"
        >
          Creative
          <br />
          Developer
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg md:text-xl font-light uppercase tracking-widest text-[#0ff0fc]"
        >
          Creative Developer & Designer
        </motion.p>
      </main>
    </PageWrapper>
  );
}
