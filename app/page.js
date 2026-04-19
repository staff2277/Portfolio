"use client";

import Scene from "@/components/Scene";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Scene />
      
      <PageWrapper transitionType="fade" className="flex flex-col items-center justify-center min-h-screen pt-20">
        <div className="container mx-auto px-6 text-center z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mix-blend-difference mb-4">
              Bobble <span className="text-[var(--accent)]">Head</span>
            </h1>
            <p className="text-xl md:text-2xl font-light uppercase tracking-[0.5em] text-gray-400 mix-blend-difference">
              Interactive 3D Experience
            </p>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-white/50"
        >
          Move mouse to interact
        </motion.div>
      </PageWrapper>

      <div className="h-[20vh]"></div>
    </main>
  );
}
