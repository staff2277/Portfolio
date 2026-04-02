"use client";

import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <PageWrapper transitionType="rotateFlip" className="pt-32 px-8 md:px-24 min-h-screen flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold uppercase tracking-tighter mb-8"
          >
            Let's <br/>
            <span className="text-[var(--accent)]">Connect</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-xl text-gray-400 font-light mb-12 max-w-sm"
          >
            Available for freelance opportunities and exciting projects worldwide.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex flex-col gap-4 font-mono select-all"
          >
            <a href="mailto:hello@example.com" className="hover:text-[var(--accent)] transition-colors text-2xl">hello@example.com</a>
            <a href="tel:+1234567890" className="hover:text-[var(--accent)] transition-colors text-2xl">+1 (234) 567-890</a>
          </motion.div>
        </div>

        <motion.div
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="bg-zinc-900/50 p-8 rounded-3xl backdrop-blur-md border border-white/5"
        >
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <input type="text" id="name" required className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-[var(--accent)] transition-colors peer text-lg placeholder-transparent" placeholder="Name" />
              <label htmlFor="name" className="absolute left-0 top-4 text-gray-500 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-[var(--accent)] peer-valid:-top-3 peer-valid:text-xs text-lg uppercase tracking-widest pointer-events-none">Your Name</label>
            </div>
            
            <div className="relative">
              <input type="email" id="email" required className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-[var(--accent)] transition-colors peer text-lg placeholder-transparent" placeholder="Email" />
              <label htmlFor="email" className="absolute left-0 top-4 text-gray-500 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-[var(--accent)] peer-valid:-top-3 peer-valid:text-xs text-lg uppercase tracking-widest pointer-events-none">Your Email</label>
            </div>

            <div className="relative mb-4">
              <textarea id="message" required rows="4" className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-[var(--accent)] transition-colors peer text-lg placeholder-transparent resize-none" placeholder="Message"></textarea>
              <label htmlFor="message" className="absolute left-0 top-4 text-gray-500 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-[var(--accent)] peer-valid:-top-3 peer-valid:text-xs text-lg uppercase tracking-widest pointer-events-none">Your Message</label>
            </div>

            <button className="self-end bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[var(--accent)] transition-colors overflow-hidden relative group">
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-full inline-block">Send</span>
              <span className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-300 translate-y-full group-hover:translate-y-0 inline-block font-bold">Launch</span>
            </button>
          </form>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
