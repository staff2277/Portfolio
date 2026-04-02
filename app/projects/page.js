"use client";

import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

const projects = [
  { id: 1, title: "Neon Cyberus", category: "Web3 Experience", color: "from-cyan-500 to-blue-500" },
  { id: 2, title: "Aether Dynamics", category: "E-Commerce", color: "from-purple-500 to-pink-500" },
  { id: 3, title: "Onyx Frame", category: "Portfolio Agency", color: "from-rose-500 to-orange-500" },
  { id: 4, title: "Vanguard", category: "SaaS Dashboard", color: "from-emerald-500 to-teal-500" },
];

export default function Projects() {
  return (
    <PageWrapper transitionType="slide" className="pt-32 px-8 md:px-24">
      <motion.h1 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-20"
      >
        Selected <span className="text-[var(--accent)]">Work</span>
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group cursor-pointer"
          >
            {/* Placeholder Image using CSS Gradients */}
            <div className={`w-full aspect-video rounded-xl mb-6 overflow-hidden relative`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80 group-hover:scale-110 transition-transform duration-700 ease-in-out`}></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white/20 tracking-widest uppercase">
                {project.id.toString().padStart(2, '0')}
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-3xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{project.title}</h3>
                <p className="text-gray-400 font-light uppercase tracking-widest text-sm">{project.category}</p>
              </div>
              <div className="overflow-hidden">
                <p className="translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-bold uppercase text-sm">
                  View Case
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="h-[20vh]"></div>
    </PageWrapper>
  );
}
