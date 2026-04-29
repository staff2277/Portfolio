'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Home() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center p-24"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="z-10 text-center">
        <h1 
          ref={titleRef}
          className="text-7xl md:text-9xl font-bold gradient-text tracking-tighter"
        >
          FRESH<br />START
        </h1>
        <p className="mt-8 text-white/40 text-lg uppercase tracking-[0.3em] font-light">
          Dependencies Loaded & Ready
        </p>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 text-xs font-mono text-white/20">
        <span>NEXT.JS 15</span>
        <span>•</span>
        <span>GSAP</span>
        <span>•</span>
        <span>R3F</span>
      </div>
    </main>
  );
}
